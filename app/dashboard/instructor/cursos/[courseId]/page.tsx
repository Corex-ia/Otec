// @ts-nocheck
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/stores/auth-store';
import {
  getCourseById,
  getCourseEnrollments,
  getCourseEnrollmentsWithProfiles,
  getCourseModules,
  getModuleLessons,
  CourseDoc,
  EnrollmentDoc,
  ModuleDoc,
  LessonDoc,
} from '@/lib/supabase/data';
import { EnrollmentApproval } from '@/components/instructor/enrollment-approval';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, BookOpen, Users, CalendarClock, Wrench, TrendingUp, Clock, Video, Type, Code as Code2 } from 'lucide-react';
import Image from 'next/image';

interface SessionLesson extends LessonDoc {
  moduleTitle: string;
}

const LESSON_TYPE_LABEL: Record<string, string> = {
  video: 'Video',
  text: 'Texto',
  sincronica: 'Sincrónica',
  interactive: 'Interactiva',
  h5p: 'H5P',
  quiz: 'Quiz',
};

const LESSON_TYPE_ICON: Record<string, React.ReactNode> = {
  video: <Video className="h-3.5 w-3.5 text-blue-500" />,
  text: <Type className="h-3.5 w-3.5 text-slate-400" />,
  interactive: <Code2 className="h-3.5 w-3.5 text-amber-500" />,
  h5p: <Code2 className="h-3.5 w-3.5 text-amber-500" />,
};

export default function CourseManagePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const loading = useAuthStore((s) => s.loading);

  const [course, setCourse] = useState<CourseDoc | null>(null);
  const [enrollmentCount, setEnrollmentCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [modules, setModules] = useState<ModuleDoc[]>([]);
  const [sessions, setSessions] = useState<SessionLesson[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const load = useCallback(async () => {
    if (!courseId) return;
    console.log('[CourseManagePage] Loading course:', courseId);
    try {
      const [courseData, enrollments, mods] = await Promise.all([
        getCourseById(courseId),
        getCourseEnrollments(courseId),
        getCourseModules(courseId),
      ]);

      console.log('[CourseManagePage] Course:', courseData?.title, '| Enrollments:', enrollments.length);

      setCourse(courseData);
      setEnrollmentCount(enrollments.length);
      setApprovedCount(enrollments.filter((e) => e.is_approved).length);
      setModules(mods);

      const allSessions: SessionLesson[] = [];
      for (const mod of mods) {
        const lessons = await getModuleLessons(mod.id);
        const sync = lessons.filter((l) => l.type === 'sincronica');
        sync.forEach((l) => allSessions.push({ ...l, moduleTitle: mod.title }));
      }
      setSessions(allSessions.sort((a, b) => (a.session_datetime ?? '').localeCompare(b.session_datetime ?? '')));
    } catch (err) {
      console.error('[CourseManagePage] Error loading:', err);
    } finally {
      setDataLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/auth/login?redirect=/dashboard/instructor');
      return;
    }
    if (profile && !['admin', 'instructor'].includes(profile.role)) {
      router.push('/');
      return;
    }
    load();
  }, [user, profile, loading, router, load]);

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-10 max-w-5xl">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-slate-200 rounded w-32" />
            <div className="h-48 bg-slate-200 rounded-xl" />
            <div className="h-64 bg-slate-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Curso no encontrado</p>
          <Button asChild variant="outline">
            <Link href="/dashboard/instructor">Volver al Panel</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" asChild className="gap-1.5 text-slate-500 hover:text-slate-800">
            <Link href="/dashboard/instructor">
              <ArrowLeft className="h-4 w-4" />
              Panel de Relator
            </Link>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-8">
          {course.image_url && (
            <div className="relative h-24 w-40 rounded-xl overflow-hidden flex-shrink-0">
              <Image src={course.image_url} alt={course.title} fill className="object-cover" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-900">{course.title}</h1>
              <Badge className={course.is_published ? 'bg-emerald-500 hover:bg-emerald-500' : 'bg-amber-500 hover:bg-amber-500'}>
                {course.is_published ? 'Activo' : 'Borrador'}
              </Badge>
            </div>
            {course.description && (
              <p className="text-sm text-slate-500 line-clamp-2">{course.description}</p>
            )}
            <div className="flex items-center gap-4 mt-2">
              <Button asChild size="sm" className="gap-1.5 bg-slate-800 hover:bg-slate-700">
                <Link href={`/dashboard/instructor/contenido/${courseId}`}>
                  <Wrench className="h-3.5 w-3.5" />
                  Editar Contenido
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="border-slate-100 bg-white">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">Inscritos</p>
                  <p className="text-2xl font-bold text-slate-900">{enrollmentCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-100 bg-white">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">Aprobados</p>
                  <p className="text-2xl font-bold text-emerald-600">{approvedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-100 bg-white">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <CalendarClock className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">Sesiones</p>
                  <p className="text-2xl font-bold text-slate-900">{sessions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="students" className="space-y-6">
          <div className="bg-white border border-slate-100 rounded-xl p-1 inline-flex">
            <TabsList className="bg-transparent gap-0.5 h-auto p-0">
              <TabsTrigger
                value="students"
                className="text-sm data-[state=active]:bg-slate-900 data-[state=active]:text-white rounded-lg px-4 py-2 gap-1.5"
              >
                <Users className="h-4 w-4" />
                Alumnos
              </TabsTrigger>
              <TabsTrigger
                value="sessions"
                className="text-sm data-[state=active]:bg-slate-900 data-[state=active]:text-white rounded-lg px-4 py-2 gap-1.5"
              >
                <CalendarClock className="h-4 w-4" />
                Sesiones Sincrónicas
              </TabsTrigger>
              <TabsTrigger
                value="structure"
                className="text-sm data-[state=active]:bg-slate-900 data-[state=active]:text-white rounded-lg px-4 py-2 gap-1.5"
              >
                <BookOpen className="h-4 w-4" />
                Estructura
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="students" className="mt-0">
            <EnrollmentApproval courseId={courseId} courseTitle={course.title} />
          </TabsContent>

          <TabsContent value="sessions" className="mt-0">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CalendarClock className="h-5 w-5 text-slate-500" />
                  Sesiones Sincrónicas
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sessions.length === 0 ? (
                  <div className="text-center py-10 text-slate-400">
                    <CalendarClock className="h-8 w-8 mx-auto mb-2 text-slate-200" />
                    <p className="text-sm">No hay sesiones sincrónicas en este curso</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {sessions.map((session) => {
                      const dt = session.session_datetime ? new Date(session.session_datetime) : null;
                      const isPast = dt ? dt < new Date() : false;
                      return (
                        <div key={session.id} className="flex items-center gap-3 p-3 rounded-xl border bg-white">
                          <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isPast ? 'bg-slate-100' : 'bg-blue-50'}`}>
                            <CalendarClock className={`h-5 w-5 ${isPast ? 'text-slate-400' : 'text-blue-500'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800 truncate">{session.title}</p>
                            <p className="text-xs text-slate-400">{session.moduleTitle}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {dt && (
                              <div className="text-right">
                                <p className="text-xs font-medium text-slate-700">
                                  {dt.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}
                                </p>
                                <p className="text-[11px] text-slate-400">
                                  {dt.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            )}
                            {session.meet_url ? (
                              <a
                                href={session.meet_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs bg-[#00832D] text-white px-3 py-1.5 rounded-lg hover:bg-[#006d25] transition-colors"
                              >
                                Unirse
                              </a>
                            ) : (
                              <Badge variant="outline" className="text-xs text-slate-400">Sin enlace</Badge>
                            )}
                            {isPast && (
                              <Badge variant="secondary" className="text-[10px]">Pasada</Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="structure" className="mt-0">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-slate-500" />
                  Estructura del Curso
                </CardTitle>
              </CardHeader>
              <CardContent>
                {modules.length === 0 ? (
                  <div className="text-center py-10 text-slate-400">
                    <BookOpen className="h-8 w-8 mx-auto mb-2 text-slate-200" />
                    <p className="text-sm">Este curso no tiene módulos</p>
                    <Button asChild size="sm" className="mt-4 gap-1.5" variant="outline">
                      <Link href={`/dashboard/instructor/contenido/${courseId}`}>
                        <Wrench className="h-3.5 w-3.5" />
                        Crear contenido
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {modules.map((mod, idx) => (
                      <div key={mod.id} className="rounded-xl border bg-slate-50 p-3">
                        <p className="text-xs text-slate-400 font-medium mb-1">Módulo {idx + 1}</p>
                        <p className="text-sm font-semibold text-slate-800">{mod.title}</p>
                        {mod.description && (
                          <p className="text-xs text-slate-500 mt-0.5">{mod.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
