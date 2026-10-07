'use client';

import { useState, useEffect } from 'react';
import {
  getCourseModules,
  getModuleLessons,
  getLessonSubmissions,
  getLessonGrades,
  upsertGrade,
  SubmissionDoc,
  ModuleDoc,
  LessonDoc,
  GradeDoc,
} from '@/lib/firebase/firestore';
import { useAuthStore } from '@/lib/stores/auth-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraduationCap, FileText, CircleCheck as CheckCircle2, ExternalLink, Star } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  courseId: string;
  courseTitle: string;
}

export function GradingCenter({ courseId, courseTitle }: Props) {
  const user = useAuthStore((state) => state.user);
  const [modules, setModules] = useState<ModuleDoc[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<string>('none');
  const [allLessons, setAllLessons] = useState<(LessonDoc & { moduleTitle: string })[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionDoc[]>([]);
  const [existingGrades, setExistingGrades] = useState<GradeDoc[]>([]);
  const [grades, setGrades] = useState<Record<string, { grade: string; feedback: string }>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    getCourseModules(courseId).then(async (mods) => {
      setModules(mods);
      const lessonsByModule = await Promise.all(
        mods.map(async (mod) => {
          const lessons = await getModuleLessons(mod.id);
          return lessons.map((l) => ({ ...l, moduleTitle: mod.title }));
        })
      );
      setAllLessons(lessonsByModule.flat());
    });
  }, [courseId]);

  useEffect(() => {
    if (!selectedLesson || selectedLesson === 'none') {
      setSubmissions([]);
      return;
    }
    setLoading(true);
    Promise.all([
      getLessonSubmissions(selectedLesson),
      getLessonGrades(selectedLesson),
    ]).then(([subs, gradeData]) => {
      setSubmissions(subs);
      setExistingGrades(gradeData);
      const initial: Record<string, { grade: string; feedback: string }> = {};
      subs.forEach((s) => {
        const existing = gradeData.find((g) => g.user_id === s.user_id);
        initial[s.user_id] = {
          grade: existing?.grade != null ? String(existing.grade) : '',
          feedback: existing?.feedback ?? '',
        };
      });
      setGrades(initial);
      setLoading(false);
    }).catch((err) => {
      console.error('[GradingCenter] Error cargando datos:', err);
      setLoading(false);
    });
  }, [selectedLesson]);

  const handleSaveGrade = async (submission: SubmissionDoc) => {
    if (!user) return;
    const entry = grades[submission.user_id];
    if (!entry) return;
    setSaving(submission.user_id);
    try {
      const existing = existingGrades.find((g) => g.user_id === submission.user_id);
      await upsertGrade(
        selectedLesson,
        submission.user_id,
        user.id,
        entry.grade ? Number(entry.grade) : null,
        entry.feedback || null,
        existing?.id ?? null
      );
      if (!existing) {
        setExistingGrades((prev) => [
          ...prev,
          {
            id: '',
            lesson_id: selectedLesson,
            user_id: submission.user_id,
            instructor_id: user.id,
            grade: entry.grade ? Number(entry.grade) : null,
            feedback: entry.feedback || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);
      }
      toast.success('Calificacion guardada');
    } catch {
      toast.error('Error al guardar la calificacion');
    } finally {
      setSaving(null);
    }
  };

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-slate-600" />
          <CardTitle className="text-base">Centro de Calificaciones</CardTitle>
        </div>
        <CardDescription className="truncate">{courseTitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-slate-500">Seleccionar leccion</Label>
          <Select value={selectedLesson} onValueChange={setSelectedLesson}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Elige una leccion para revisar entregas..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Seleccionar leccion...</SelectItem>
              {modules.map((mod) => {
                const lessons = allLessons.filter((l) => l.module_id === mod.id);
                if (lessons.length === 0) return null;
                return (
                  <div key={mod.id}>
                    <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                      {mod.title}
                    </div>
                    {lessons.map((l) => (
                      <SelectItem key={l.id} value={l.id}>
                        {l.title}
                      </SelectItem>
                    ))}
                  </div>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {selectedLesson && selectedLesson !== 'none' && (
          <div>
            {loading ? (
              <div className="space-y-3 animate-pulse">
                {[1, 2].map((i) => <div key={i} className="h-24 bg-slate-100 rounded-lg" />)}
              </div>
            ) : submissions.length === 0 ? (
              <div className="py-10 text-center rounded-xl border border-dashed border-slate-200">
                <FileText className="h-8 w-8 mx-auto text-slate-200 mb-2" />
                <p className="text-slate-400 text-sm">No hay entregas para esta leccion aun</p>
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.map((sub) => {
                  const entry = grades[sub.user_id] ?? { grade: '', feedback: '' };
                  const isGraded = existingGrades.some((g) => g.user_id === sub.user_id && g.grade != null);
                  return (
                    <div key={sub.id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm text-slate-800">{sub.user_name}</p>
                          <p className="text-xs text-slate-400">
                            {new Date(sub.submitted_at).toLocaleDateString('es-CL', {
                              day: 'numeric', month: 'short', year: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {isGraded && (
                            <Badge className="bg-emerald-100 text-emerald-700 border-0 gap-1 text-xs">
                              <Star className="h-3 w-3" />
                              Calificado
                            </Badge>
                          )}
                          <Button asChild size="sm" variant="outline" className="h-7 text-xs gap-1.5">
                            <a href={sub.file_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3.5 w-3.5" />
                              Ver entrega
                            </a>
                          </Button>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs text-slate-500">Nota (0 - 100)</Label>
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            value={entry.grade}
                            onChange={(e) =>
                              setGrades((prev) => ({
                                ...prev,
                                [sub.user_id]: { ...prev[sub.user_id], grade: e.target.value },
                              }))
                            }
                            className="h-8 text-sm"
                            placeholder="0 - 100"
                          />
                        </div>
                        <div className="sm:col-span-2 space-y-1">
                          <Label className="text-xs text-slate-500">Retroalimentacion</Label>
                          <Textarea
                            value={entry.feedback}
                            onChange={(e) =>
                              setGrades((prev) => ({
                                ...prev,
                                [sub.user_id]: { ...prev[sub.user_id], feedback: e.target.value },
                              }))
                            }
                            className="text-sm min-h-0 h-8 resize-none"
                            placeholder="Escribe comentarios para el alumno..."
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          className="h-8 text-xs gap-1.5 bg-slate-800 hover:bg-slate-700"
                          onClick={() => handleSaveGrade(sub)}
                          disabled={saving === sub.user_id}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {saving === sub.user_id ? 'Guardando...' : 'Guardar calificacion'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
