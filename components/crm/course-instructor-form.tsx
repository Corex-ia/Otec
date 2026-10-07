'use client';

import { useEffect, useState } from 'react';
import {
  getInstructorCourses,
  getInstructorProfiles,
  updateCourse,
  CourseDoc,
  ProfileDoc,
} from '@/lib/firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { UserCheck, BookOpen, Save, UserPlus } from 'lucide-react';
import { EnrollStudentModal } from './enroll-student-modal';

interface AssignmentRow {
  courseId: string;
  courseTitle: string;
  isPublished: boolean;
  currentInstructorId: string | null;
  selectedInstructorId: string;
  saving: boolean;
}

export function CourseInstructorForm() {
  const [courses, setCourses] = useState<CourseDoc[]>([]);
  const [instructors, setInstructors] = useState<ProfileDoc[]>([]);
  const [rows, setRows] = useState<AssignmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollModalCourse, setEnrollModalCourse] = useState<CourseDoc | null>(null);

  useEffect(() => {
    Promise.all([getInstructorCourses(), getInstructorProfiles()]).then(([c, i]) => {
      const validInstructors = i.filter((inst) => inst.id && typeof inst.id === 'string' && inst.id.trim() !== '');
      setCourses(c);
      setInstructors(validInstructors);
      setRows(
        c.map((course) => ({
          courseId: course.id,
          courseTitle: course.title,
          isPublished: course.is_published,
          currentInstructorId: course.instructor_id ?? null,
          selectedInstructorId: course.instructor_id && course.instructor_id.trim() !== '' ? course.instructor_id : 'none',
          saving: false,
        }))
      );
      setLoading(false);
    });
  }, []);

  const handleSelectInstructor = (courseId: string, value: string) => {
    setRows((prev) =>
      prev.map((r) => (r.courseId === courseId ? { ...r, selectedInstructorId: value } : r))
    );
  };

  const handleSave = async (row: AssignmentRow) => {
    setRows((prev) => prev.map((r) => (r.courseId === row.courseId ? { ...r, saving: true } : r)));
    try {
      const resolvedId = row.selectedInstructorId === 'none' ? null : row.selectedInstructorId;
      const instructor = resolvedId ? instructors.find((i) => i.id === resolvedId) : null;
      await updateCourse(row.courseId, {
        instructor_id: resolvedId,
        instructor_name: instructor?.full_name ?? null,
        instructor_avatar: instructor?.avatar_url ?? null,
      });
      setRows((prev) =>
        prev.map((r) =>
          r.courseId === row.courseId
            ? { ...r, currentInstructorId: resolvedId, saving: false }
            : r
        )
      );
      toast.success('Instructor asignado correctamente');
    } catch {
      toast.error('Error al asignar instructor');
      setRows((prev) => prev.map((r) => (r.courseId === row.courseId ? { ...r, saving: false } : r)));
    }
  };

  const getInstructorInitials = (name: string) =>
    name
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase();

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="space-y-3 animate-pulse">
            <div className="h-10 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <div className="flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-slate-600" />
          <CardTitle className="text-base">Asignación de Instructores</CardTitle>
        </div>
        <CardDescription>
          Asigna un instructor a cada curso. Solo se listan usuarios con rol de instructor.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {instructors.length === 0 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50/40 px-4 py-3 text-sm text-amber-800">
            No hay usuarios con rol de instructor en el sistema aún.
          </div>
        )}

        {rows.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">No hay cursos creados.</p>
        )}

        <div className="space-y-2">
          {rows.map((row) => {
            const assignedInstructor = instructors.find((i) => i.id === row.currentInstructorId);
            const currentVal = row.currentInstructorId ?? 'none';
            const isDirty = row.selectedInstructorId !== currentVal;

            return (
              <div
                key={row.courseId}
                className="rounded-xl border bg-white p-3 flex flex-col sm:flex-row sm:items-center gap-3"
              >
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  <BookOpen className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-slate-800 truncate">{row.courseTitle}</p>
                      <Badge
                        variant={row.isPublished ? 'default' : 'secondary'}
                        className="text-[10px] py-0 px-1.5 flex-shrink-0"
                      >
                        {row.isPublished ? 'Publicado' : 'Borrador'}
                      </Badge>
                    </div>
                    {assignedInstructor && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <Avatar className="h-4 w-4">
                          <AvatarImage src={assignedInstructor.avatar_url ?? undefined} />
                          <AvatarFallback className="text-[8px]">
                            {getInstructorInitials(assignedInstructor.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-[11px] text-muted-foreground">{assignedInstructor.full_name}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto flex-wrap">
                  <Select
                    value={row.selectedInstructorId}
                    onValueChange={(v) => handleSelectInstructor(row.courseId, v)}
                    disabled={row.saving}
                  >
                    <SelectTrigger className="h-8 text-xs w-full sm:w-52">
                      <SelectValue placeholder="Sin asignar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin instructor asignado</SelectItem>
                      {instructors.map((inst) => (
                        <SelectItem key={inst.id} value={inst.id}>
                          <span className="flex items-center gap-2">
                            <Avatar className="h-5 w-5 flex-shrink-0">
                              <AvatarImage src={inst.avatar_url ?? undefined} />
                              <AvatarFallback className="text-[9px]">
                                {getInstructorInitials(inst.full_name)}
                              </AvatarFallback>
                            </Avatar>
                            {inst.full_name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    className="h-8 text-xs px-3 flex-shrink-0 gap-1.5"
                    onClick={() => handleSave(row)}
                    disabled={row.saving || !isDirty}
                    variant={isDirty ? 'default' : 'outline'}
                  >
                    <Save className="h-3.5 w-3.5" />
                    {row.saving ? 'Guardando...' : 'Guardar'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs px-3 flex-shrink-0 gap-1.5 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    onClick={() => {
                      const course = courses.find((c) => c.id === row.courseId);
                      if (course) setEnrollModalCourse(course);
                    }}
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    Inscribir alumno
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>

      {enrollModalCourse && (
        <EnrollStudentModal
          course={enrollModalCourse}
          open={!!enrollModalCourse}
          onClose={() => setEnrollModalCourse(null)}
          onEnrolled={() => setEnrollModalCourse(null)}
        />
      )}
    </Card>
  );
}
