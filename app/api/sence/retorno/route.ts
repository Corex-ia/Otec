// Recibe el retorno de SENCE después de que el alumno autentica con ClaveÚnica.
//
// GET /api/sence/retorno
//   Params que envía SENCE:
//     IdSesionAlumno  — nuestro CodigoCurso (UUID)
//     IdSesionSence   — ID de sesión generado por SENCE (guardar para CerrarSesion)
//     RunAlumno       — RUT validado por SENCE (formato xxxxxxxx-x)
//     FechaHora       — timestamp de inicio (yyyy-mm-dd hh:mm:ss)
//     ZonaHoraria     — timezone
//
// Al procesar, redirige al alumno de vuelta a la clase.

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;

  const idSesionAlumno = searchParams.get('IdSesionAlumno');
  const idSesionSence  = searchParams.get('IdSesionSence');
  const runAlumno      = searchParams.get('RunAlumno');
  const fechaHora      = searchParams.get('FechaHora');
  const zonaHoraria    = searchParams.get('ZonaHoraria');
  const errorCode      = searchParams.get('CodError') ?? searchParams.get('Codigo');

  if (!idSesionAlumno) {
    return NextResponse.redirect(`${origin}/lumen?sence_error=missing_session`);
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Buscar sesión por IdSesionAlumno
  const { data: session, error: fetchError } = await supabase
    .from('sence_sessions')
    .select('*')
    .eq('id_sesion_alumno', idSesionAlumno)
    .single();

  if (fetchError || !session) {
    console.error('[sence/retorno] Sesión no encontrada:', idSesionAlumno);
    return NextResponse.redirect(`${origin}/lumen?sence_error=session_not_found`);
  }

  // Si SENCE devolvió error
  if (errorCode && !idSesionSence) {
    await supabase
      .from('sence_sessions')
      .update({ status: 'error', error_code: errorCode })
      .eq('id_sesion_alumno', idSesionAlumno);

    return NextResponse.redirect(
      `${origin}/lumen/cursos/${session.course_id}?sence_error=${errorCode}`
    );
  }

  // Actualizar sesión con datos de SENCE
  await supabase
    .from('sence_sessions')
    .update({
      id_sesion_sence:   idSesionSence,
      run_alumno:        runAlumno,
      fecha_hora_inicio: fechaHora ? new Date(fechaHora).toISOString() : new Date().toISOString(),
      zona_horaria:      zonaHoraria,
      status:            'active',
    })
    .eq('id_sesion_alumno', idSesionAlumno);

  // Redirigir al curso con la sesión activa para que auto-ingrese a la clase
  const retornoUrl = new URL(`${origin}/lumen/cursos/${session.course_id}`);
  retornoUrl.searchParams.set('sence_session', session.id);
  retornoUrl.searchParams.set('lesson_id', session.lesson_id);

  return NextResponse.redirect(retornoUrl.toString());
}
