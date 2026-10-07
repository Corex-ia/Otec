// @ts-nocheck
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';
import {
  getInstructorCourses,
  getCoursesByInstructorId,
  getCourseEnrollments,
  getCourseModules,
  getModuleLessons,
  LessonDoc,
  CourseDoc,
  EnrollmentDoc,
  ModuleDoc,
} from '@/lib/supabase/data';
import { InstructorCoursesGrid } from '@/components/instructor/instructor-courses-grid';
import { MeetCenter } from '@/components/instructor/meet-center';
import { EnrollmentApproval } from '@/components/instructor/enrollment-approval';
import { GradingCenter } from '@/components/instructor/grading-center';
import { InstructorProfileForm } from '@/components/instructor/instructor-profile-form';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, CalendarClock, Users, GraduationCap, CircleUser as UserCircle, TrendingUp } from 'lucide-react';

interface CourseWithEnrollments extends CourseDoc {
  enrollmentCount: number;
  approvedCount: number;
}

interface SessionWithCourse extends LessonDoc {
  courseTitle: string;
  moduleTitle: string;
}

export default function InstructorDashboard() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const loading = useAuthStore((state) => state.loading);

  const [courses, setCourses] = useState<CourseWithEnrollments[]>([]);
  const [sessions, setSessions] = useState<SessionWithCourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses');

  const isAdmin = profile?.role === 'admin';

  const load = useCallback(async () => {
    if (!user) return;

    let allCourses: CourseDoc[];
    if (isAdmin) {
      allCourses = await getInstructorCourses();
    } else {
      allCourses = await getCoursesByInstructorId(user.id);
    }

    const coursesWithEnrollments = await Promise.all(
      allCourses.map(async (course) => {
        const enrollments = await getCourseEnrollments(course.id);
        return {
          ...course,
          enrollmentCount: enrollments.length,
          approvedCount: enrollments.filter((e) => e.is_approved).length,
        };
      })
    );

    setCourses(coursesWithEnrollments);
    if (coursesWithEnrollments.length > 0 && !selectedCourseId) {
      setSelectedCourseId(coursesWithEnrollments[0].id);
    }

    const allModules: ModuleDoc[] = [];
    const courseMap: Record<string, string> = {};
    allCourses.forEach((c) => { courseMap[c.id] = c.title; });

    for (const course of allCourses) {
      const mods = await getCourseModules(course.id);
      allModules.push(...mods);
    }

    const moduleMap: Record<string, string> = {};
    const courseByModuleId: Record<string, string> = {};
    for (const mod of allModules) {
      moduleMap[mod.id] = mod.title;
      courseByModuleId[mod.id] = mod.course_id;
    }

    const now = new Date().toISOString();
    const allSessions: SessionWithCourse[] = [];
    for (const mod of allModules) {
      const lessons = await getModuleLessons(mod.id);
      const syncLessons = lessons.filter((l) => l.type === 'sincronica' && l.session_datetime);
      for (const lesson of syncLessons) {
        allSessions.push({
          ...lesson,
          courseTitle: courseMap[courseByModuleId[mod.id]] ?? 'Curso desconocido',
          moduleTitle: mod.title,
          courseId: courseByModuleId[mod.id] ?? mod.id,
        });
      }
    }

    const upcoming = allSessions
      .filter((l) => l.session_datetime! >= now)
      .sort((a, b) => (a.session_datetime! > b.session_datetime! ? 1 : -1));

    setSessions(upcoming);
    setDataLoading(false);
  }, [user, isAdmin]);

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

  const handleSessionUpdated = (lessonId: string, newUrl: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === lessonId ? { ...s, meet_url: newUrl } : s))
    );
  };

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-10">
          <div className="animate-pulse space-y-5">
            <div className="h-8 bg-slate-200 rounded w-1/3" />
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-slate-200 rounded-xl" />)}
            </div>
            <div className="h-64 bg-slate-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  const totalStudents = courses.reduce((sum, c) => sum + c.enrollmentCount, 0);
  const totalApproved = courses.reduce((sum, c) => sum + c.approvedCount, 0);
  const activeCourses = courses.filter((c) => c.is_published).length;
  const sessionsToday = sessions.filter((s) => {
    const d = new Date(s.session_datetime!);
    return d.toDateString() === new Date().toDateString();
  }).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-bold text-slate-900">Panel de Relator</h1>
                {isAdmin && (
                  <Badge variant="outline" className="text-xs text-slate-500">
                    Vista Admin
                  </Badge>
                )}
              </div>
              <p className="text-slate-500">
                Bienvenido, <span className="font-medium text-slate-700">{profile?.full_name}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-slate-100 bg-white">
            <CardHeader className="pb-1 pt-4 px-4">
              <CardTitle className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Cursos activos
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-slate-900">{activeCourses}</span>
                <BookOpen className="h-5 w-5 text-slate-300 mb-0.5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-100 bg-white">
            <CardHeader className="pb-1 pt-4 px-4">
              <CardTitle className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Total alumnos
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-slate-900">{totalStudents}</span>
                <Users className="h-5 w-5 text-slate-300 mb-0.5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-100 bg-white">
            <CardHeader className="pb-1 pt-4 px-4">
              <CardTitle className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Aprobados
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-emerald-600">{totalApproved}</span>
                <TrendingUp className="h-5 w-5 text-emerald-200 mb-0.5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-100 bg-white">
            <CardHeader className="pb-1 pt-4 px-4">
              <CardTitle className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Sesiones hoy
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="flex items-end gap-2">
                <span className={`text-3xl font-bold ${sessionsToday > 0 ? 'text-blue-600' : 'text-slate-900'}`}>
                  {sessionsToday}
                </span>
                <CalendarClock className="h-5 w-5 text-slate-300 mb-0.5" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="bg-white border border-slate-100 rounded-xl p-1 inline-flex">
            <TabsList className="bg-transparent gap-0.5 h-auto p-0">
              <TabsTrigger
                value="courses"
                className="text-sm data-[state=active]:bg-slate-900 data-[state=active]:text-white rounded-lg px-4 py-2 gap-1.5"
              >
                <BookOpen className="h-4 w-4" />
                Mis Cursos
              </TabsTrigger>
              <TabsTrigger
                value="meet"
                className="text-sm data-[state=active]:bg-slate-900 data-[state=active]:text-white rounded-lg px-4 py-2 gap-1.5"
              >
                <CalendarClock className="h-4 w-4" />
                Aula en Vivo
                {sessionsToday > 0 && (
                  <span className="ml-1 rounded-full bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 font-semibold">
                    {sessionsToday} hoy
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="students"
                className="text-sm data-[state=active]:bg-slate-900 data-[state=active]:text-white rounded-lg px-4 py-2 gap-1.5"
              >
                <Users className="h-4 w-4" />
                Alumnos
              </TabsTrigger>
              <TabsTrigger
                value="grades"
                className="text-sm data-[state=active]:bg-slate-900 data-[state=active]:text-white rounded-lg px-4 py-2 gap-1.5"
              >
                <GraduationCap className="h-4 w-4" />
                Calificaciones
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="text-sm data-[state=active]:bg-slate-900 data-[state=active]:text-white rounded-lg px-4 py-2 gap-1.5"
              >
                <UserCircle className="h-4 w-4" />
                Mi Perfil
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="courses" className="space-y-0 mt-0">
            <InstructorCoursesGrid
              courses={courses}
              onSelectCourse={(id) => {
                setSelectedCourseId(id);
              }}
              selectedCourseId={selectedCourseId}
            />
          </TabsContent>

          <TabsContent value="meet" className="mt-0">
            <MeetCenter sessions={sessions} onSessionUpdated={handleSessionUpdated} />
          </TabsContent>

          <TabsContent value="students" className="mt-0">
            {selectedCourse ? (
              <div className="space-y-4">
                {courses.length > 1 && (
                  <div className="flex flex-wrap gap-2">
                    {courses.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCourseId(c.id)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                          selectedCourseId === c.id
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        {c.title}
                      </button>
                    ))}
                  </div>
                )}
                <EnrollmentApproval
                  courseId={selectedCourse.id}
                  courseTitle={selectedCourse.title}
                />
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400">
                <Users className="h-10 w-10 mx-auto mb-3 text-slate-200" />
                <p>No tienes cursos asignados</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="grades" className="mt-0">
            {selectedCourse ? (
              <div className="space-y-4">
                {courses.length > 1 && (
                  <div className="flex flex-wrap gap-2">
                    {courses.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCourseId(c.id)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                          selectedCourseId === c.id
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        {c.title}
                      </button>
                    ))}
                  </div>
                )}
                <GradingCenter
                  courseId={selectedCourse.id}
                  courseTitle={selectedCourse.title}
                />
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400">
                <GraduationCap className="h-10 w-10 mx-auto mb-3 text-slate-200" />
                <p>No tienes cursos asignados</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile" className="mt-0">
            {profile && <InstructorProfileForm profile={profile as any} />}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
