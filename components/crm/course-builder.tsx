'use client';

import { useState, useEffect } from 'react';
import {
  getInstructorCourses,
  getCoursesByInstructorId,
  getCourseModules,
  getModuleLessons,
  createModule,
  updateModule,
  deleteModule,
  deleteLesson,
  CourseDoc,
  ModuleDoc,
  LessonDoc,
} from '@/lib/firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { LessonForm } from './lesson-form';
import { toast } from 'sonner';
import { BookOpen, Plus, Pencil, Trash2, ChevronDown, ChevronRight, Video, Type, CalendarClock, GripVertical, Save, X, Zap, Code as Code2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const LESSON_TYPE_ICON: Record<string, React.ReactNode> = {
  video: <Video className="h-3.5 w-3.5 text-blue-500" />,
  text: <Type className="h-3.5 w-3.5 text-slate-500" />,
  sincronica: <Video className="h-3.5 w-3.5 text-blue-600" />,
  interactive: <Code2 className="h-3.5 w-3.5 text-amber-500" />,
  h5p: <Code2 className="h-3.5 w-3.5 text-amber-500" />,
  quiz: <Type className="h-3.5 w-3.5 text-orange-500" />,
};

const LESSON_TYPE_LABEL: Record<string, string> = {
  video: 'Video',
  text: 'Texto',
  sincronica: 'Aula Virtual Pro',
  interactive: 'Interactiva',
  h5p: 'H5P',
  quiz: 'Quiz',
};

interface ModuleWithLessons extends ModuleDoc {
  lessons: LessonDoc[];
}

interface ModuleEditorProps {
  module: ModuleDoc;
  onUpdated: (m: ModuleDoc) => void;
  onDeleted: () => void;
}

function ModuleEditor({ module, onUpdated, onDeleted }: ModuleEditorProps) {
  const [title, setTitle] = useState(module.title);
  const [description, setDescription] = useState(module.description ?? '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) { toast.error('El título es obligatorio'); return; }
    setSaving(true);
    try {
      await updateModule(module.id, { title: title.trim(), description: description.trim() || null });
      onUpdated({ ...module, title: title.trim(), description: description.trim() || null });
      toast.success('Módulo actualizado');
    } catch {
      toast.error('Error al actualizar módulo');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-2 bg-white rounded-lg border p-3">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="h-8 text-sm font-medium"
        placeholder="Título del módulo"
      />
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="text-sm min-h-[50px] resize-none"
        placeholder="Descripción del módulo (opcional)"
      />
      <div className="flex gap-2">
        <Button size="sm" onClick={handleSave} disabled={saving} className="h-7 text-xs">
          <Save className="h-3 w-3 mr-1" />
          {saving ? 'Guardando...' : 'Guardar'}
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={onDeleted}
          className="h-7 text-xs"
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Eliminar módulo
        </Button>
      </div>
    </div>
  );
}

interface CourseBuilderProps {
  instructorId?: string;
  preselectedCourseId?: string;
}

export function CourseBuilder({ instructorId, preselectedCourseId }: CourseBuilderProps = {}) {
  const [courses, setCourses] = useState<CourseDoc[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [modules, setModules] = useState<ModuleWithLessons[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [addingModuleTitle, setAddingModuleTitle] = useState('');
  const [addingModuleDesc, setAddingModuleDesc] = useState('');
  const [showAddModule, setShowAddModule] = useState(false);
  const [creatingModuleLoading, setCreatingModuleLoading] = useState(false);
  const [addingLessonToModule, setAddingLessonToModule] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<{ moduleId: string; lesson: LessonDoc } | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      let fetched: CourseDoc[];
      if (instructorId) {
        fetched = await getCoursesByInstructorId(instructorId);
      } else {
        fetched = await getInstructorCourses();
      }
      setCourses(fetched);
      if (preselectedCourseId && fetched.find((c) => c.id === preselectedCourseId)) {
        setSelectedCourseId(preselectedCourseId);
        setEditingModuleId(null);
        setAddingLessonToModule(null);
        setEditingLesson(null);
        setShowAddModule(false);
        setLoading(true);
        setExpandedModules(new Set());
        try {
          const mods = await getCourseModules(preselectedCourseId);
          const withLessons = await Promise.all(
            mods.map(async (m) => {
              const lessons = await getModuleLessons(m.id);
              return { ...m, lessons };
            })
          );
          setModules(withLessons);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchCourses();
  }, [instructorId, preselectedCourseId]);

  const loadCourse = async (courseId: string) => {
    setLoading(true);
    setExpandedModules(new Set());
    try {
      const mods = await getCourseModules(courseId);
      const withLessons = await Promise.all(
        mods.map(async (m) => {
          const lessons = await getModuleLessons(m.id);
          return { ...m, lessons };
        })
      );
      setModules(withLessons);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = (cid: string) => {
    setSelectedCourseId(cid);
    setEditingModuleId(null);
    setAddingLessonToModule(null);
    setEditingLesson(null);
    setShowAddModule(false);
    loadCourse(cid);
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      next.has(moduleId) ? next.delete(moduleId) : next.add(moduleId);
      return next;
    });
  };

  const handleCreateModule = async () => {
    if (!addingModuleTitle.trim()) { toast.error('El título es obligatorio'); return; }
    setCreatingModuleLoading(true);
    try {
      const id = await createModule({
        course_id: selectedCourseId,
        title: addingModuleTitle.trim(),
        description: addingModuleDesc.trim() || null,
        order_index: modules.length,
      });
      const newMod: ModuleWithLessons = {
        id,
        course_id: selectedCourseId,
        title: addingModuleTitle.trim(),
        description: addingModuleDesc.trim() || null,
        order_index: modules.length,
        lessons: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setModules((prev) => [...prev, newMod]);
      setExpandedModules((prev) => new Set([...prev, id]));
      setAddingModuleTitle('');
      setAddingModuleDesc('');
      setShowAddModule(false);
      toast.success('Módulo creado');
    } catch {
      toast.error('Error al crear módulo');
    } finally {
      setCreatingModuleLoading(false);
    }
  };

  const handleModuleUpdated = (updated: ModuleDoc) => {
    setModules((prev) => prev.map((m) => m.id === updated.id ? { ...m, ...updated } : m));
    setEditingModuleId(null);
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('¿Eliminar este módulo y todas sus lecciones?')) return;
    try {
      await deleteModule(moduleId);
      setModules((prev) => prev.filter((m) => m.id !== moduleId));
      toast.success('Módulo eliminado');
    } catch {
      toast.error('Error al eliminar módulo');
    }
  };

  const handleLessonSaved = (moduleId: string, lesson: LessonDoc) => {
    setModules((prev) =>
      prev.map((m) => {
        if (m.id !== moduleId) return m;
        const exists = m.lessons.find((l) => l.id === lesson.id);
        const updatedLessons = exists
          ? m.lessons.map((l) => l.id === lesson.id ? lesson : l)
          : [...m.lessons, lesson];
        return { ...m, lessons: updatedLessons.sort((a, b) => a.order_index - b.order_index) };
      })
    );
    setAddingLessonToModule(null);
    setEditingLesson(null);
  };

  const handleDeleteLesson = async (moduleId: string, lessonId: string) => {
    if (!confirm('¿Eliminar esta lección?')) return;
    try {
      await deleteLesson(lessonId);
      setModules((prev) =>
        prev.map((m) =>
          m.id === moduleId ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) } : m
        )
      );
      toast.success('Lección eliminada');
    } catch {
      toast.error('Error al eliminar lección');
    }
  };

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-slate-600" />
          <CardTitle className="text-base">Constructor de Contenido</CardTitle>
        </div>
        <CardDescription>
          Crea y organiza módulos y lecciones para tus cursos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label>Selecciona un curso para editar</Label>
          <Select value={selectedCourseId} onValueChange={handleCourseSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Elige un curso..." />
            </SelectTrigger>
            <SelectContent>
              {courses.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  <span className="flex items-center gap-2">
                    {c.title}
                    {c.is_published && (
                      <Badge variant="default" className="text-[10px] py-0 px-1">Publicado</Badge>
                    )}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedCourseId && (
          <div className="space-y-3">
            {loading ? (
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <div key={i} className="h-14 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {modules.length} módulo{modules.length !== 1 ? 's' : ''}
                    {' · '}
                    {modules.reduce((s, m) => s + m.lessons.length, 0)} lección{modules.reduce((s, m) => s + m.lessons.length, 0) !== 1 ? 'es' : ''}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowAddModule(!showAddModule)}
                    className="h-8 text-xs gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Agregar módulo
                  </Button>
                </div>

                {showAddModule && (
                  <div className="rounded-lg border bg-blue-50/40 border-blue-200 p-3 space-y-2">
                    <Label className="text-xs font-semibold text-blue-700">Nuevo módulo</Label>
                    <Input
                      placeholder="Título del módulo *"
                      value={addingModuleTitle}
                      onChange={(e) => setAddingModuleTitle(e.target.value)}
                      className="h-8 text-sm"
                    />
                    <Textarea
                      placeholder="Descripción (opcional)"
                      value={addingModuleDesc}
                      onChange={(e) => setAddingModuleDesc(e.target.value)}
                      className="text-sm min-h-[50px] resize-none"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleCreateModule}
                        disabled={creatingModuleLoading}
                        className="h-7 text-xs"
                      >
                        {creatingModuleLoading ? 'Creando...' : 'Crear módulo'}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => { setShowAddModule(false); setAddingModuleTitle(''); setAddingModuleDesc(''); }}
                        className="h-7 text-xs"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {modules.map((module, moduleIdx) => {
                    const isExpanded = expandedModules.has(module.id);
                    const isEditing = editingModuleId === module.id;

                    return (
                      <div key={module.id} className="rounded-xl border bg-white overflow-hidden">
                        <div
                          className="flex items-center gap-2 px-3 py-2.5 hover:bg-slate-50 cursor-pointer"
                          onClick={() => !isEditing && toggleModule(module.id)}
                        >
                          <GripVertical className="h-4 w-4 text-muted-foreground/40 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-muted-foreground">
                                Módulo {moduleIdx + 1}
                              </span>
                              {module.lessons.length > 0 && (
                                <Badge variant="secondary" className="text-[10px] py-0 px-1.5">
                                  {module.lessons.length} lección{module.lessons.length !== 1 ? 'es' : ''}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm font-semibold text-slate-800 truncate">{module.title}</p>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => setEditingModuleId(isEditing ? null : module.id)}
                              title="Editar módulo"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => handleDeleteModule(module.id)}
                              title="Eliminar módulo"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                          <div onClick={() => toggleModule(module.id)}>
                            {isExpanded
                              ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              : <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            }
                          </div>
                        </div>

                        {isEditing && (
                          <div className="px-3 pb-3">
                            <ModuleEditor
                              module={module}
                              onUpdated={handleModuleUpdated}
                              onDeleted={() => handleDeleteModule(module.id)}
                            />
                          </div>
                        )}

                        {isExpanded && !isEditing && (
                          <div className="border-t bg-slate-50/50 px-3 py-3 space-y-2">
                            {module.lessons.length === 0 && addingLessonToModule !== module.id && (
                              <p className="text-xs text-muted-foreground text-center py-2">
                                Este módulo no tiene lecciones aún
                              </p>
                            )}

                            {module.lessons.map((lesson, lessonIdx) => {
                              const isEditingThis = editingLesson?.lesson.id === lesson.id;
                              if (isEditingThis) {
                                return (
                                  <LessonForm
                                    key={lesson.id}
                                    moduleId={module.id}
                                    courseId={selectedCourseId}
                                    nextOrderIndex={lessonIdx}
                                    lesson={lesson}
                                    onSaved={(l) => handleLessonSaved(module.id, l)}
                                    onCancel={() => setEditingLesson(null)}
                                  />
                                );
                              }

                              return (
                                <div
                                  key={lesson.id}
                                  className="flex items-center gap-2.5 rounded-lg bg-white border px-3 py-2 text-sm"
                                >
                                  <GripVertical className="h-3.5 w-3.5 text-muted-foreground/30 flex-shrink-0" />
                                  <span className="text-xs text-muted-foreground w-5 flex-shrink-0">
                                    {lessonIdx + 1}
                                  </span>
                                  <div className="flex-shrink-0">
                                    {LESSON_TYPE_ICON[lesson.type] ?? <Type className="h-3.5 w-3.5" />}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{lesson.title}</p>
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] text-muted-foreground">
                                        {LESSON_TYPE_LABEL[lesson.type] ?? lesson.type}
                                      </span>
                                      {lesson.type === 'sincronica' && lesson.session_datetime && (
                                        <span className="text-[10px] text-green-600 flex items-center gap-0.5">
                                          <CalendarClock className="h-2.5 w-2.5" />
                                          {new Date(lesson.session_datetime).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}
                                        </span>
                                      )}
                                      {lesson.attachments?.length > 0 && (
                                        <span className="text-[10px] text-muted-foreground">
                                          {lesson.attachments.length} PDF{lesson.attachments.length !== 1 ? 's' : ''}
                                        </span>
                                      )}
                                      {lesson.is_free && (
                                        <Badge variant="outline" className="text-[9px] py-0 px-1 h-3.5">Gratis</Badge>
                                      )}
                                      {lesson.points != null && lesson.points > 0 && (
                                        <span className="text-[10px] text-yellow-600 flex items-center gap-0.5 font-medium">
                                          <Zap className="h-2.5 w-2.5 fill-yellow-400 text-yellow-500" />
                                          {lesson.points} pts
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex gap-1 flex-shrink-0">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={() => {
                                        setEditingLesson({ moduleId: module.id, lesson });
                                        setAddingLessonToModule(null);
                                      }}
                                    >
                                      <Pencil className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50"
                                      onClick={() => handleDeleteLesson(module.id, lesson.id)}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}

                            {addingLessonToModule === module.id ? (
                              <LessonForm
                                moduleId={module.id}
                                courseId={selectedCourseId}
                                nextOrderIndex={module.lessons.length}
                                onSaved={(l) => handleLessonSaved(module.id, l)}
                                onCancel={() => setAddingLessonToModule(null)}
                              />
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full h-8 text-xs gap-1.5 border-dashed"
                                onClick={() => {
                                  setAddingLessonToModule(module.id);
                                  setEditingLesson(null);
                                }}
                              >
                                <Plus className="h-3.5 w-3.5" />
                                Nueva lección
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {modules.length === 0 && !showAddModule && (
                  <div className="text-center py-8 border-2 border-dashed rounded-xl">
                    <BookOpen className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
                    <p className="text-sm text-muted-foreground mb-3">
                      Este curso no tiene módulos aún
                    </p>
                    <Button
                      size="sm"
                      onClick={() => setShowAddModule(true)}
                      className="gap-1.5"
                    >
                      <Plus className="h-4 w-4" />
                      Crear primer módulo
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {!selectedCourseId && (
          <div className="text-center py-8 border-2 border-dashed rounded-xl">
            <BookOpen className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">
              Selecciona un curso para comenzar a construir su contenido
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
