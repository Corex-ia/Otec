'use client';

import { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import {
  getInstructorCourses,
  getCourseModules,
  getModuleLessons,
  CourseDoc,
  ModuleDoc,
  LessonDoc,
  updateEnrollmentApproval,
  getCourseEnrollments,
  EnrollmentDoc,
  getProfile,
} from '@/lib/firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Video, Users, CircleCheck as CheckCircle, Circle as XCircle, ChevronDown, ChevronUp, Info } from 'lucide-react';


interface EnrollmentWithProfile extends EnrollmentDoc {
  full_name: string;
  email: string;
}

export function LessonMeetForm() {
  const [courses, setCourses] = useState<CourseDoc[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [modules, setModules] = useState<ModuleDoc[]>([]);
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [lessons, setLessons] = useState<LessonDoc[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<LessonDoc | null>(null);
  const [sessionDatetime, setSessionDatetime] = useState('');
  const [saving, setSaving] = useState(false);
  const [enrollments, setEnrollments] = useState<EnrollmentWithProfile[]>([]);
  const [showEnrollments, setShowEnrollments] = useState(false);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);

  useEffect(() => {
    getInstructorCourses().then(setCourses);
  }, []);

  useEffect(() => {
    if (!selectedCourse) { setModules([]); setSelectedModule(''); return; }
    getCourseModules(selectedCourse).then(setModules);
  }, [selectedCourse]);

  useEffect(() => {
    if (!selectedModule) { setLessons([]); setSelectedLesson(null); return; }
    getModuleLessons(selectedModule).then(setLessons);
  }, [selectedModule]);

  const handleSelectLesson = (lessonId: string) => {
    const lesson = lessons.find((l) => l.id === lessonId) || null;
    setSelectedLesson(lesson);
    setSessionDatetime(lesson?.session_datetime ? lesson.session_datetime.slice(0, 16) : '');
  };

  const handleSave = async () => {
    if (!selectedLesson) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'lessons', selectedLesson.id), {
        type: 'sincronica',
        session_datetime: sessionDatetime ? new Date(sessionDatetime).toISOString() : null,
        updated_at: new Date().toISOString(),
      });
      toast.success('Sesión guardada correctamente');
      const updated = await getModuleLessons(selectedModule);
      setLessons(updated);
      const upd = updated.find((l) => l.id === selectedLesson.id) || null;
      setSelectedLesson(upd);
    } catch {
      toast.error('Error al guardar la sesión');
    } finally {
      setSaving(false);
    }
  };

  const loadEnrollments = async () => {
    if (!selectedCourse) return;
    setLoadingEnrollments(true);
    try {
      const raw = await getCourseEnrollments(selectedCourse);
      const withProfiles = await Promise.all(
        raw.map(async (e) => {
          const profile = await getProfile(e.user_id);
          return {
            ...e,
            full_name: profile?.full_name || 'Usuario desconocido',
            email: profile?.email || '',
          };
        })
      );
      setEnrollments(withProfiles);
      setShowEnrollments(true);
    } finally {
      setLoadingEnrollments(false);
    }
  };

  const toggleApproval = async (enrollment: EnrollmentWithProfile) => {
    try {
      await updateEnrollmentApproval(enrollment.id, !enrollment.is_approved);
      setEnrollments((prev) =>
        prev.map((e) => e.id === enrollment.id ? { ...e, is_approved: !e.is_approved } : e)
      );
      toast.success(enrollment.is_approved ? 'Alumno desaprobado' : 'Alumno aprobado');
    } catch {
      toast.error('Error al actualizar estado');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 bg-blue-50/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Video className="h-4 w-4 text-blue-600" />
            <CardTitle className="text-base">Gestionar Sesiones Sincrónicas</CardTitle>
          </div>
          <CardDescription>
            Configura la fecha y hora de las sesiones del Aula Virtual (Jitsi)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Curso</Label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un curso" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Módulo</Label>
              <Select value={selectedModule} onValueChange={setSelectedModule} disabled={!selectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un módulo" />
                </SelectTrigger>
                <SelectContent>
                  {modules.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Lección</Label>
            <Select
              value={selectedLesson?.id || ''}
              onValueChange={handleSelectLesson}
              disabled={!selectedModule}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una lección" />
              </SelectTrigger>
              <SelectContent>
                {lessons.map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    <span className="flex items-center gap-2">
                      {l.title}
                      {l.type === 'sincronica' && (
                        <Badge variant="secondary" className="text-[10px] py-0 px-1">Aula Virtual</Badge>
                      )}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedLesson && (
            <div className="rounded-lg border bg-white p-4 space-y-4">
              <div className="text-sm font-medium text-slate-700">Configuración de Aula Virtual (Jitsi)</div>
              <div className="flex items-start gap-2 rounded-md bg-blue-50 border border-blue-200 px-3 py-2.5">
                <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                <p className="text-xs text-blue-700">
                  La sala virtual se generará automáticamente de forma privada.
                </p>
              </div>
              <div className="space-y-1.5">
                <Label>Fecha y hora de la sesión</Label>
                <Input
                  type="datetime-local"
                  value={sessionDatetime}
                  onChange={(e) => setSessionDatetime(e.target.value)}
                />
              </div>
              <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving ? 'Guardando...' : 'Guardar sesión'}
              </Button>
            </div>
          )}

          {selectedCourse && (
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={showEnrollments ? () => setShowEnrollments(false) : loadEnrollments}
                disabled={loadingEnrollments}
              >
                <Users className="h-4 w-4 mr-2" />
                {showEnrollments ? 'Ocultar inscripciones' : 'Ver inscripciones y aprobar alumnos'}
                {showEnrollments ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
              </Button>

              {showEnrollments && (
                <div className="rounded-lg border bg-white divide-y">
                  {enrollments.length === 0 ? (
                    <p className="text-sm text-muted-foreground p-4 text-center">
                      No hay alumnos inscritos en este curso
                    </p>
                  ) : (
                    enrollments.map((e) => (
                      <div key={e.id} className="flex items-center justify-between p-3">
                        <div>
                          <p className="text-sm font-medium">{e.full_name}</p>
                          <p className="text-xs text-muted-foreground">{e.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={e.is_approved ? 'default' : 'secondary'}
                            className={e.is_approved ? 'bg-green-100 text-green-800 border-green-200' : ''}
                          >
                            {e.is_approved ? 'Aprobado' : 'Pendiente'}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleApproval(e)}
                            className="h-8 w-8 p-0"
                          >
                            {e.is_approved ? (
                              <XCircle className="h-4 w-4 text-red-500" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
