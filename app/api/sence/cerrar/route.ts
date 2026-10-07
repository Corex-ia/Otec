// Cierra la sesión SENCE al salir del aula virtual.
//
// POST /api/sence/cerrar
//   Body: { senceSessionId: string }  ← nuestro ID de sence_sessions
//
// Notifica a SENCE el fin de sesión (para acreditar asistencia en franquicia).

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cerrarSesionSence, isPending } from '@/lib/sence/client';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const { senceSessionId } = await request.json() as { senceSessionId?: string };

  if (!senceSessionId) {
    return NextResponse.json({ error: 'senceSessionId es requerido' }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: session, error: fetchError } = await supabase
    .from('sence_sessions')
    .select('*')
    .eq('id', senceSessionId)
    .single();

  if (fetchError || !session) {
    return NextResponse.json({ error: 'Sesión SENCE no encontrada' }, { status: 404 });
  }

  if (session.status === 'closed') {
    return NextResponse.json({ ok: true, alreadyClosed: true });
  }

  // Si aún son credenciales placeholder o sesión dev, cerrar solo localmente
  const isDevSession = session.id_sesion_sence === 'DEV_SIMULADO';
  if (!isPending() && !isDevSession && session.id_sesion_sence) {
    const result = await cerrarSesionSence({
      codSence:      session.cod_sence,
      idSesionSence: session.id_sesion_sence,
    });

    if (!result.ok) {
      console.error('[sence/cerrar] Error al cerrar sesión en SENCE:', result.error);
      // No bloqueamos al usuario — guardamos igual con error
      await supabase
        .from('sence_sessions')
        .update({
          status:            'error',
          error_code:        result.error ?? 'cerrar_failed',
          fecha_hora_cierre: new Date().toISOString(),
        })
        .eq('id', senceSessionId);

      return NextResponse.json({ ok: false, error: result.error });
    }
  }

  await supabase
    .from('sence_sessions')
    .update({
      status:            'closed',
      fecha_hora_cierre: new Date().toISOString(),
    })
    .eq('id', senceSessionId);

  return NextResponse.json({ ok: true });
}
