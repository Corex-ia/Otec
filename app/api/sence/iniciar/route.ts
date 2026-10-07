// Inicia una sesión SENCE para una clase sincrónica.
//
// GET /api/sence/iniciar?courseId=X&lessonId=Y
//
// Crea el registro en sence_sessions, luego devuelve un HTML con formulario
// auto-submit que redirige al portal SENCE (ClaveÚnica).
// El RetornoURL está configurado en SENCE por curso; no se pasa como parámetro.

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { buildIniciarForm, buildAutoSubmitHtml, isPending } from '@/lib/sence/client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const courseId = searchParams.get('courseId');
  const lessonId = searchParams.get('lessonId');

  if (!courseId || !lessonId) {
    return NextResponse.json({ error: 'courseId y lessonId son requeridos' }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Autenticar al usuario desde la cookie de Supabase
  const authHeader = request.headers.get('authorization') ?? '';
  const accessToken = authHeader.replace('Bearer ', '').trim();

  const { data: { user }, error: authError } = accessToken
    ? await supabase.auth.getUser(accessToken)
    : await supabase.auth.getUser();

  if (authError || !user) {
    const origin = request.nextUrl.origin;
    return NextResponse.redirect(`${origin}/auth/login`);
  }

  // Obtener cod_sence del curso
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('id, title, cod_sence, linea_capacitacion')
    .eq('id', courseId)
    .single();

  if (courseError || !course) {
    return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
  }

  if (!course.cod_sence) {
    return NextResponse.json(
      { error: 'Este curso no tiene código SENCE configurado' },
      { status: 422 }
    );
  }

  // Generar ID de sesión único (CodigoCurso) — min 7 chars, SENCE lo devolverá como IdSesionAlumno
  const idSesionAlumno = crypto.randomUUID();

  // Crear registro en sence_sessions
  const { error: insertError } = await supabase.from('sence_sessions').insert({
    id_sesion_alumno: idSesionAlumno,
    user_id:          user.id,
    course_id:        courseId,
    lesson_id:        lessonId,
    cod_sence:        course.cod_sence,
    status:           'initiated',
  });

  if (insertError) {
    console.error('[sence/iniciar] Error creando sesión:', insertError);
    return NextResponse.json({ error: 'Error interno al crear sesión' }, { status: 500 });
  }

  // Si las credenciales SENCE aún son placeholder, simular retorno directo (modo dev)
  if (isPending()) {
    const origin = request.nextUrl.origin;
    const devRetorno = `${origin}/api/sence/retorno?IdSesionAlumno=${idSesionAlumno}&IdSesionSence=DEV_SIMULADO&RunAlumno=00000000-0&FechaHora=${encodeURIComponent(new Date().toISOString())}&ZonaHoraria=America%2FSantiago&dev=1`;
    return NextResponse.redirect(devRetorno);
  }

  // Construir formulario auto-submit hacia SENCE
  const { url, fields } = buildIniciarForm({
    codSence:    course.cod_sence,
    codigoCurso: idSesionAlumno,
  });

  const html = buildAutoSubmitHtml(url, fields);

  return new NextResponse(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
