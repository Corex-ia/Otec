// @ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  getEnrollment,
  getCourseById,
  getCourseModules,
  getModuleLessons,
  getUserLessonProgress,
  upsertLessonProgress,
  addPointsToProfile,
  EnrollmentDoc,
} from '@/lib/supabase/data';
import {
  createAttendanceRecord,
  getSenceSurvey,
  writeAuditLog,
  getExamResult,
  ExamResultDoc,
} from '@/lib/firebase/firestore';
import { COURSE_THUMBNAIL_FALLBACK } from '@/lib/firebase/storage';
import { useAuthStore } from '@/lib/stores/auth-store';
import { CourseWithModules, LessonDoc } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CircleCheck as CheckCircle2,
  Circle,
  CirclePlay as PlayCircle,
  Lock,
  CalendarClock,
  Zap,
  Code as Code2,
  Trophy,
  User,
  Download,
  ClipboardList,
  Award,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DownloadableResources } from '@/components/lms/downloadable-resources';
import { JitsiClassroom, generateRoomName } from '@/components/lms/jitsi-classroom';
import { SenceSessionGuard } from '@/components/lms/sence-session-guard';
import { SenceSurvey } from '@/components/lms/sence-survey';
import { ExamPlayer } from '@/components/lms/exam-player';
import { CertificateGenerator } from '@/components/lms/certificate-generator';
import Link from 'next/link';
import { toast } from 'sonner';

function InteractiveLessonBlock({
  lesson,
  isCompleted,
  onComplete,
}: {
  lesson: LessonDoc;
  isCompleted: boolean;
  onComplete: () => void;
}) {
  const [marked, setMarked] = useState(isCompleted);

  const handleComplete = async () => {
    setMarked(true);
    onComplete();
  };

  if (!lesson.embed_code) {
    return (
      <div className="p-4 rounded-xl border bg-amber-50 text-sm text-amber-700">
        Esta lección interactiva no tiene contenido embebido configurado aún.
      </div>
    );
  }

  return (
    <div className="rounded-xl border overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border-b">
        <Code2 className="h-4 w-4 text-amber-600" />
        <span className="text-sm font-medium text-amber-800">{lesson.title}</span>
        {lesson.points != null && lesson.points > 0 && (
          <span className="ml-auto flex items-center gap-1 text-xs text-yellow-700 font-semibold">
            <Zap className="h-3.5 w-3.5 fill-yellow-400 text-yellow-500" />
            {lesson.points} pts
          </span>
        )}
      </div>

      {lesson.description && (
        <p className="px-4 pt-3 text-sm text-muted-foreground">{lesson.description}</p>
      )}

      <div className="relative w-full px-4 pb-4 pt-3" style={{ minHeight: '400px' }}>
        <div
          className="w-full [&_iframe]:w-full [&_iframe]:rounded-lg [&_iframe]:border-0 [&_iframe]:min-h-[400px]"
          dangerouslySetInnerHTML={{ __html: lesson.embed_code }}
        />
      </div>

      {!marked ? (
        <div className="px-4 pb-4">
          <Button size="sm" onClick={handleComplete} className="gap-2 w-full sm:w-auto">
            <CheckCircle2 className="h-4 w-4" />
            Marcar como completada
            {lesson.points != null && lesson.points > 0 && (
              <span className="bg-yellow-400/20 text-yellow-900 rounded px-1.5 py-0.5 text-[10px] font-bold">
                +{lesson.points} pts
              </span>
            )}
          </Button>
        </div>
      ) : (
        <div className="px-4 pb-4 flex items-center gap-2 text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4" />
          Lección completada
          {lesson.points != null && lesson.points > 0 && (
            <span className="flex items-center gap-1 font-semibold">
              <Zap className="h-3.5 w-3.5 fill-yellow-400 text-yellow-500" />
              +{lesson.points} pts ganados
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default function CourseViewPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [course, setCourse] = useState<CourseWithModules | null>(null);
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [enrollment, setEnrollment] = useState<EnrollmentDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeMeet, setActiveMeet] = useState<{ lesson: LessonDoc } | null>(null);
  const [activeSenceSessionId, setActiveSenceSessionId] = useState<string | null>(null);
  const [pendingDeclaration, setPendingDeclaration] = useState<{ lesson: LessonDoc } | null>(null);
  const [showSurvey, setShowSurvey] = useState(false);
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [examResults, setExamResults] = useState<Record<string, ExamResultDoc | null>>({});
  const [courseCompleted, setCourseCompleted] = useState(false);
  const [examPassed, setExamPassed] = useState(false);
  const profile = useAuthStore((state) => state.profile);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!user) {
        router.push('/auth/login');
        return;
      }

      const enrollmentData = await getEnrollment(user.id, params.courseId as string);

      if (!enrollmentData) {
        router.push('/lumen');
        return;
      }

      setEnrollment(enrollmentData);

      const courseData = await getCourseById(params.courseId as string);

      if (courseData) {
        const modules = await getCourseModules(courseData.id);
        const modulesWithLessons = await Promise.all(
          modules.map(async (mod) => {
            const lessons = await getModuleLessons(mod.id);
            return { ...mod, lessons };
          })
        );

        const courseObj = { ...courseData, modules: modulesWithLessons };
        setCourse(courseObj as any);

        const progressData = await getUserLessonProgress(user.id);
        const progressMap: Record<string, boolean> = {};
        progressData.forEach((p) => {
          progressMap[p.lesson_id] = p.completed;
        });
        setProgress(progressMap);

        const existingSurvey = await getSenceSurvey(user.id, courseData.id);
        if (existingSurvey) setSurveyCompleted(true);

        const allLessons = modulesWithLessons.flatMap((m) => m.lessons);
        const examLessons = allLessons.filter((l) => l.type === 'examen');
        if (examLessons.length > 0) {
          const results: Record<string, ExamResultDoc | null> = {};
          await Promise.all(
            examLessons.map(async (l) => {
              const r = await getExamResult(user.id, l.id);
              results[l.id] = r;
            })
          );
          setExamResults(results);

          const anyPassed = examLessons.some((l) => results[l.id]?.passed);
          setExamPassed(anyPassed);
        } else {
          setExamPassed(true);
        }

        const nonExamLessons = allLessons.filter((l) => l.type !== 'examen');
        const completedCount = nonExamLessons.filter((l) => progressMap[l.id]).length;
        if (nonExamLessons.length > 0 && completedCount >= nonExamLessons.length) {
          setCourseCompleted(true);
        }
      }

      setLoading(false);

      // Auto-join tras retorno de SENCE (retorno URL añade ?sence_session=X&lesson_id=Y)
      const senceSession = searchParams.get('sence_session');
      const returnLessonId = searchParams.get('lesson_id');
      if (senceSession && returnLessonId && courseData) {
        setActiveSenceSessionId(senceSession);
        const allLessonsFlat = modulesWithLessons.flatMap((m) => m.lessons);
        const targetLesson = allLessonsFlat.find((l) => l.id === returnLessonId);
        if (targetLesson) {
          setTimeout(() => handleJoinMeet(targetLesson), 300);
        }
        // Limpiar params de URL sin recargar
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, '', cleanUrl);
      }
    };

    fetchCourse();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.courseId, user, router]);

  const allLessonsFlat = course?.modules.flatMap((m) => m.lessons) ?? [];

  const isLessonUnlocked = (lessonId: string): boolean => {
    if (!course) return false;
    const allLessons = course.modules.flatMap((m) => m.lessons);
    const idx = allLessons.findIndex((l) => l.id === lessonId);
    if (idx === 0) return true;
    const prev = allLessons[idx - 1];
    return progress[prev.id] === true;
  };

  const isExamUnlocked = (): boolean => {
    if (!course) return false;
    const allLessons = course.modules.flatMap((m) => m.lessons);
    const nonExam = allLessons.filter((l) => l.type !== 'examen');
    return nonExam.every((l) => progress[l.id] === true);
  };

  const handleRequestJoinMeet = (lesson: LessonDoc) => {
    const isInstructor = profile?.role === 'instructor' || profile?.role === 'admin';
    if (isInstructor) {
      handleJoinMeet(lesson);
      return;
    }
    setPendingDeclaration({ lesson });
  };

  const handleDeclarationAccepted = async () => {
    if (!pendingDeclaration) return;
    const lesson = pendingDeclaration.lesson;
    setPendingDeclaration(null);
    await handleJoinMeet(lesson);
  };

  const handleJoinMeet = async (lesson: LessonDoc) => {
    if (!user || !course) return;
    try {
      await createAttendanceRecord(user.id, course.id, lesson.id);
    } catch {}
    setActiveMeet({ lesson });
  };

  const handleMeetExit = async (durationSeconds?: number) => {
    setActiveMeet(null);

    // Cerrar sesión SENCE si había una activa
    if (activeSenceSessionId) {
      fetch('/api/sence/cerrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senceSessionId: activeSenceSessionId }),
      }).catch(() => {});
      setActiveSenceSessionId(null);
    }

    if (!user || !course) return;

    if (activeMeet) {
      try {
        await upsertLessonProgress(user.id, activeMeet.lesson.id, {
          completed: true,
          completed_at: new Date().toISOString(),
        });
        const newProgress = { ...progress, [activeMeet.lesson.id]: true };
        setProgress(newProgress);

        if (activeMeet.lesson.points != null && activeMeet.lesson.points > 0) {
          await addPointsToProfile(user.id, activeMeet.lesson.points);
          toast.success(`+${activeMeet.lesson.points} puntos ganados por asistir a clase`);
        }

        checkCourseCompletion(newProgress);
      } catch {}
    }
  };

  const checkCourseCompletion = (currentProgress: Record<string, boolean>) => {
    if (!course) return;
    const allLessons = course.modules.flatMap((m) => m.lessons);
    const nonExam = allLessons.filter((l) => l.type !== 'examen');
    const allDone = nonExam.every((l) => currentProgress[l.id] === true);
    if (allDone) {
      setCourseCompleted(true);
      if (!surveyCompleted) setShowSurvey(true);
    }
  };

  const handleInteractiveComplete = async (lesson: LessonDoc) => {
    if (!user || progress[lesson.id]) return;
    try {
      await upsertLessonProgress(user.id, lesson.id, {
        completed: true,
        completed_at: new Date().toISOString(),
      });
      const newProgress = { ...progress, [lesson.id]: true };
      setProgress(newProgress);

      if (lesson.points != null && lesson.points > 0) {
        await addPointsToProfile(user.id, lesson.points);
        toast.success(`+${lesson.points} puntos ganados!`, {
          description: 'Los puntos se han sumado a tu perfil.',
        });
      }
      checkCourseCompletion(newProgress);
    } catch {
      toast.error('Error al guardar el progreso');
    }
  };

  const handleExamPassed = async (lesson: LessonDoc) => {
    if (!user) return;
    try {
      await upsertLessonProgress(user.id, lesson.id, {
        completed: true,
        completed_at: new Date().toISOString(),
      });
      const newProgress = { ...progress, [lesson.id]: true };
      setProgress(newProgress);
      setExamPassed(true);
      if (lesson.points != null && lesson.points > 0) {
        await addPointsToProfile(user.id, lesson.points);
        toast.success(`+${lesson.points} puntos ganados por aprobar el examen!`);
      }
    } catch {}
  };

  const handleDownloadClick = (fileName: string, fileUrl: string) => {
    if (!user || !course) return;
    writeAuditLog({
      user_id: user.id,
      user_name: profile?.full_name || user.user_metadata?.full_name || '',
      user_email: profile?.email || user.email || '',
      action: 'download',
      course_id: course.id,
      lesson_id: null,
      duration_seconds: null,
      ip_address: null,
      metadata: { fileName, fileUrl },
    }).catch(() => {});
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/2"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center text-muted-foreground">Curso no encontrado</p>
      </div>
    );
  }

  const thumbnail = course.image_url || COURSE_THUMBNAIL_FALLBACK;
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const nonExamLessons = allLessons.filter((l) => l.type !== 'examen');
  const totalLessons = nonExamLessons.length;
  const completedLessons = nonExamLessons.filter((l) => progress[l.id]).length;
  const progressPercent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  const isApproved = enrollment?.is_approved === true;
  const isInstructor = profile?.role === 'instructor' || profile?.role === 'admin';
  const canDownloadCert = courseCompleted && examPassed && surveyCompleted;

  const allAttachments = course.modules.flatMap((m) =>
    m.lessons.flatMap((l) => l.attachments ?? [])
  );

  const totalPoints = course.modules
    .flatMap((m) => m.lessons)
    .filter((l) => progress[l.id] && l.points != null)
    .reduce((sum, l) => sum + (l.points ?? 0), 0);

  const availablePoints = course.modules
    .flatMap((m) => m.lessons)
    .filter((l) => l.points != null && l.points > 0)
    .reduce((sum, l) => sum + (l.points ?? 0), 0);

  const formatSessionDate = (iso: string) => {
    const d = new Date(iso);
    return (
      d.toLocaleDateString('es-CL', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      }) +
      ' ' +
      d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
    );
  };

  if (pendingDeclaration) {
    return (
      <SenceSessionGuard
        lessonTitle={pendingDeclaration.lesson.title}
        courseTitle={course.title}
        courseId={course.id}
        lessonId={pendingDeclaration.lesson.id}
        codSence={(course as any).cod_sence ?? null}
        sessionDatetime={pendingDeclaration.lesson.session_datetime}
        onAccept={handleDeclarationAccepted}
        onCancel={() => setPendingDeclaration(null)}
      />
    );
  }

  if (activeMeet && course) {
    const lessonAttachments = course.modules
      .flatMap((m) => m.lessons)
      .find((l) => l.id === activeMeet.lesson.id)
      ?.attachments ?? [];

    const roomName = generateRoomName(course.id, activeMeet.lesson.id);

    return (
      <JitsiClassroom
        roomName={roomName}
        lessonTitle={activeMeet.lesson.title}
        courseTitle={course.title}
        displayName={profile?.full_name || user?.displayName || 'Alumno'}
        email={profile?.email || user?.email || undefined}
        isModerator={isInstructor}
        attachments={lessonAttachments}
        userId={user?.uid}
        courseId={course.id}
        lessonId={activeMeet.lesson.id}
        onExit={handleMeetExit}
      />
    );
  }

  return (
    <>
      {showSurvey && user && (
        <SenceSurvey
          userId={user.id}
          courseId={course.id}
          courseTitle={course.title}
          mandatory={true}
          onCompleted={() => {
            setShowSurvey(false);
            setSurveyCompleted(true);
            toast.success('Encuesta completada. Tu certificado esta disponible.');
          }}
        />
      )}

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="relative w-full aspect-[3/1] rounded-xl overflow-hidden mb-6 bg-muted">
            <img src={thumbnail} alt={course.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <h1 className="text-3xl font-bold text-white mb-1">{course.title}</h1>
              {course.instructor_name && (
                <p className="text-sm text-white/80">{course.instructor_name}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-sm text-muted-foreground">
                  Progreso: {Math.round(progressPercent)}%
                </span>
                <span className="text-sm text-muted-foreground">
                  ({completedLessons}/{totalLessons} lecciones)
                </span>
                {courseCompleted && !surveyCompleted && (
                  <Badge className="bg-amber-500 text-white text-[10px] animate-pulse">
                    Encuesta pendiente
                  </Badge>
                )}
                {courseCompleted && surveyCompleted && !examPassed && (
                  <Badge className="bg-blue-600 text-white text-[10px]">
                    Examen pendiente
                  </Badge>
                )}
                {canDownloadCert && (
                  <Badge className="bg-emerald-600 text-white text-[10px]">
                    Certificado disponible
                  </Badge>
                )}
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {availablePoints > 0 && (
              <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                <Trophy className="h-4 w-4 text-yellow-600" />
                <div className="text-sm">
                  <span className="font-bold text-yellow-800">{totalPoints}</span>
                  <span className="text-yellow-600">/{availablePoints} pts</span>
                </div>
              </div>
            )}

            {courseCompleted && !surveyCompleted && (
              <Button
                size="sm"
                className="bg-amber-500 hover:bg-amber-600 text-white gap-2"
                onClick={() => setShowSurvey(true)}
              >
                Completar encuesta SENCE
              </Button>
            )}

            {canDownloadCert && user && profile && (
              <CertificateGenerator
                studentName={profile.full_name}
                courseTitle={course.title}
                completedAt={new Date().toISOString()}
                durationHours={course.duration_hours ?? 0}
                instructorName={course.instructor_name}
                courseId={course.id}
                userId={user.id}
              />
            )}
          </div>

          {!isApproved && (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-3">
              <Lock className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                Tu instructor aun no ha aprobado tu acceso a las sesiones sincronicas de este curso.
              </p>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {course.modules.map((module, moduleIndex) => {
              const moduleLessons = module.lessons;
              const moduleCompleted = moduleLessons.filter((l) => l.type !== 'examen' && progress[l.id]).length;
              const moduleTotal = moduleLessons.filter((l) => l.type !== 'examen').length;

              return (
                <Card key={module.id}>
                  <CardHeader>
                    <CardTitle>
                      Modulo {moduleIndex + 1}: {module.title}
                    </CardTitle>
                    {module.description && (
                      <CardDescription>{module.description}</CardDescription>
                    )}
                    <CardDescription>
                      {moduleCompleted}/{moduleTotal} lecciones completadas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {moduleLessons.map((lesson, lessonIdx) => {
                        const isCompleted = progress[lesson.id];
                        const hasPdfs = (lesson.attachments ?? []).some((a) => a.type === 'pdf');
                        const isSincronica = lesson.type === 'sincronica';
                        const isInteractive = lesson.type === 'interactive';
                        const isExamen = lesson.type === 'examen';
                        const unlocked = isInstructor || isLessonUnlocked(lesson.id);
                        const examUnlocked = isInstructor || isExamUnlocked();
                        const prevLesson = lessonIdx > 0 ? moduleLessons[lessonIdx - 1] : null;

                        if (isExamen) {
                          if (!examUnlocked) {
                            return (
                              <div
                                key={lesson.id}
                                className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50"
                              >
                                <Lock className="h-5 w-5 text-slate-400 flex-shrink-0" />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium text-slate-500">{lesson.title}</p>
                                    <Badge variant="secondary" className="text-[10px] bg-slate-100 text-slate-500">
                                      Examen Final
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-slate-400 mt-0.5">
                                    Completa todas las lecciones anteriores para desbloquear el examen
                                  </p>
                                </div>
                              </div>
                            );
                          }

                          const examResult = examResults[lesson.id];

                          return (
                            <div key={lesson.id} className="space-y-2">
                              <div className="flex items-center gap-2 px-1">
                                <ClipboardList className="h-4 w-4 text-slate-700" />
                                <span className="text-sm font-semibold text-slate-700">Examen Final</span>
                                {isCompleted && (
                                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px]">
                                    Aprobado
                                  </Badge>
                                )}
                                {lesson.points != null && lesson.points > 0 && (
                                  <span className="flex items-center gap-0.5 text-[10px] text-yellow-700 font-semibold ml-auto">
                                    <Zap className="h-3 w-3 fill-yellow-400 text-yellow-500" />
                                    {lesson.points} pts
                                  </span>
                                )}
                              </div>
                              <ExamPlayer
                                lesson={lesson}
                                courseId={course.id}
                                userId={user?.uid ?? ''}
                                existingResult={examResult}
                                onPassed={() => handleExamPassed(lesson)}
                              />
                            </div>
                          );
                        }

                        if (isInteractive) {
                          if (!unlocked) {
                            return (
                              <div
                                key={lesson.id}
                                className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200 opacity-60"
                              >
                                <Lock className="h-5 w-5 text-slate-400 flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="font-medium text-slate-500">{lesson.title}</p>
                                  <p className="text-xs text-slate-400 mt-0.5">
                                    Completa &quot;{prevLesson?.title}&quot; para desbloquear
                                  </p>
                                </div>
                              </div>
                            );
                          }
                          return (
                            <InteractiveLessonBlock
                              key={lesson.id}
                              lesson={lesson}
                              isCompleted={!!isCompleted}
                              onComplete={() => handleInteractiveComplete(lesson)}
                            />
                          );
                        }

                        if (isSincronica) {
                          return (
                            <div
                              key={lesson.id}
                              className="flex flex-col gap-3 p-4 rounded-xl border bg-slate-50"
                            >
                              <div className="flex items-start gap-3">
                                <div className="mt-0.5">
                                  <div className="w-6 h-6 rounded bg-blue-600/10 flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-blue-600" fill="currentColor">
                                      <path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z"/>
                                    </svg>
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className="font-medium">{lesson.title}</p>
                                    <Badge variant="secondary" className="text-[10px] py-0 px-1.5 bg-blue-100 text-blue-700 border-blue-200">
                                      Clase en vivo
                                    </Badge>
                                    {isCompleted && (
                                      <Badge className="text-[10px] py-0 px-1.5 bg-emerald-100 text-emerald-700 border-emerald-200">
                                        Asistida
                                      </Badge>
                                    )}
                                    {lesson.points != null && lesson.points > 0 && (
                                      <span className="flex items-center gap-0.5 text-[10px] text-yellow-700 font-semibold">
                                        <Zap className="h-3 w-3 fill-yellow-400 text-yellow-500" />
                                        {lesson.points} pts
                                      </span>
                                    )}
                                  </div>
                                  {lesson.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                                      {lesson.description}
                                    </p>
                                  )}
                                  {lesson.session_datetime && (
                                    <div className="flex items-center gap-1.5 mt-1.5 text-sm text-slate-600">
                                      <CalendarClock className="h-3.5 w-3.5" />
                                      <span>{formatSessionDate(lesson.session_datetime)}</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {isApproved || isInstructor ? (
                                <Button
                                  size="sm"
                                  className="w-full gap-2 bg-blue-700 hover:bg-blue-800 text-white"
                                  onClick={() => handleRequestJoinMeet(lesson)}
                                >
                                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 flex-shrink-0" fill="currentColor">
                                    <path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z"/>
                                  </svg>
                                  Unirse al Aula Virtual
                                </Button>
                              ) : (
                                <Button size="sm" className="w-full gap-2" disabled variant="outline">
                                  <Lock className="h-3.5 w-3.5" />
                                  Esperando aprobacion del instructor
                                </Button>
                              )}
                            </div>
                          );
                        }

                        if (!unlocked) {
                          return (
                            <div
                              key={lesson.id}
                              className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200 opacity-60"
                            >
                              <Lock className="h-5 w-5 text-slate-400 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="font-medium text-slate-500">{lesson.title}</p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                  Completa &quot;{prevLesson?.title}&quot; para desbloquear
                                </p>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <Link
                            key={lesson.id}
                            href={`/lumen/cursos/${course.id}/lecciones/${lesson.id}`}
                          >
                            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                              {isCompleted ? (
                                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                              ) : (
                                <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                              )}
                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="font-medium">{lesson.title}</p>
                                  {lesson.points != null && lesson.points > 0 && (
                                    <span className="flex items-center gap-0.5 text-[10px] text-yellow-700 font-semibold">
                                      <Zap className="h-3 w-3 fill-yellow-400 text-yellow-500" />
                                      {lesson.points} pts
                                    </span>
                                  )}
                                </div>
                                {lesson.description && (
                                  <p className="text-sm text-muted-foreground line-clamp-1">
                                    {lesson.description}
                                  </p>
                                )}
                                {hasPdfs && (
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    Incluye recursos descargables
                                  </p>
                                )}
                              </div>
                              <PlayCircle className="h-5 w-5 text-muted-foreground" />
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="space-y-4">
            {(course.instructor_name || course.instructor_id) && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-500" />
                    Tu Instructor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 flex-shrink-0">
                      <AvatarImage src={course.instructor_avatar ?? undefined} />
                      <AvatarFallback className="text-sm font-semibold bg-slate-100 text-slate-700">
                        {course.instructor_name
                          ? course.instructor_name
                              .split(' ')
                              .slice(0, 2)
                              .map((n: string) => n[0])
                              .join('')
                              .toUpperCase()
                          : 'IN'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-slate-800">
                        {course.instructor_name || 'Instructor'}
                      </p>
                      {course.instructor_bio && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {course.instructor_bio}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {canDownloadCert && user && profile && (
              <Card className="border-emerald-200 bg-emerald-50/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2 text-emerald-800">
                    <Award className="h-4 w-4 text-emerald-600" />
                    Certificado Disponible
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-emerald-700 mb-3">
                    Felicitaciones! Has completado el curso y aprobado el examen. Tu certificado esta listo.
                  </p>
                  <CertificateGenerator
                    studentName={profile.full_name}
                    courseTitle={course.title}
                    completedAt={new Date().toISOString()}
                    durationHours={course.duration_hours ?? 0}
                    instructorName={course.instructor_name}
                    courseId={course.id}
                    userId={user.id}
                  />
                </CardContent>
              </Card>
            )}

            {allAttachments.filter((a) => a.type === 'pdf').length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Download className="h-4 w-4 text-slate-500" />
                    Recursos del Curso
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {allAttachments
                      .filter((a) => a.type === 'pdf')
                      .map((att) => (
                        <li key={att.id ?? att.url}>
                          <a
                            href={att.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => handleDownloadClick(att.name, att.url)}
                            className="flex items-center gap-2 text-sm text-blue-700 hover:underline"
                          >
                            <Download className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="truncate">{att.name}</span>
                          </a>
                        </li>
                      ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
