'use client';

import { useRouter } from 'next/navigation';
import { CourseDoc, EnrollmentDoc } from '@/lib/firebase/firestore';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, Clock, Wrench, Eye } from 'lucide-react';
import Image from 'next/image';

interface CourseWithEnrollments extends CourseDoc {
  enrollmentCount: number;
  approvedCount: number;
}

interface Props {
  courses: CourseWithEnrollments[];
  onSelectCourse: (courseId: string) => void;
  selectedCourseId: string | null;
}

export function InstructorCoursesGrid({ courses, onSelectCourse, selectedCourseId }: Props) {
  const router = useRouter();

  if (courses.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-16 text-center">
        <BookOpen className="h-10 w-10 mx-auto text-slate-300 mb-3" />
        <p className="text-slate-500 font-medium">No tienes cursos asignados aún</p>
        <p className="text-sm text-slate-400 mt-1">Contacta al administrador para que te asigne como instructor</p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {courses.map((course) => {
        const isSelected = selectedCourseId === course.id;
        return (
          <Card
            key={course.id}
            className={`overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer border-2 ${
              isSelected ? 'border-slate-800 shadow-md' : 'border-transparent'
            }`}
            onClick={() => onSelectCourse(course.id)}
          >
            {course.image_url ? (
              <div className="relative h-40 w-full overflow-hidden">
                <Image
                  src={course.image_url}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-2 left-3">
                  <Badge
                    className={`text-[10px] font-semibold ${
                      course.is_published
                        ? 'bg-emerald-500 hover:bg-emerald-500'
                        : 'bg-amber-500 hover:bg-amber-500'
                    }`}
                  >
                    {course.is_published ? 'Activo' : 'Borrador'}
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="h-40 w-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <BookOpen className="h-10 w-10 text-slate-300" />
                <div className="absolute bottom-2 left-3">
                  <Badge
                    className={`text-[10px] font-semibold ${
                      course.is_published
                        ? 'bg-emerald-500 hover:bg-emerald-500'
                        : 'bg-amber-500 hover:bg-amber-500'
                    }`}
                  >
                    {course.is_published ? 'Activo' : 'Borrador'}
                  </Badge>
                </div>
              </div>
            )}

            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug">
                {course.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="pb-3">
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {course.enrollmentCount} inscritos
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {course.duration_hours}h
                </span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-all"
                  style={{
                    width: `${course.enrollmentCount > 0 ? Math.min((course.approvedCount / course.enrollmentCount) * 100, 100) : 0}%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {course.approvedCount} aprobados de {course.enrollmentCount}
              </p>
            </CardContent>

            <CardFooter className="pt-0 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs h-8 gap-1.5"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('[InstructorCoursesGrid] Gestionar clicked, courseId:', course.id);
                  router.push(`/dashboard/instructor/cursos/${course.id}`);
                }}
              >
                <Eye className="h-3.5 w-3.5" />
                Gestionar
              </Button>
              <Button
                size="sm"
                className="flex-1 text-xs h-8 gap-1.5 bg-slate-800 hover:bg-slate-700"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('[InstructorCoursesGrid] Contenido clicked, courseId:', course.id);
                  router.push(`/dashboard/instructor/contenido/${course.id}`);
                }}
              >
                <Wrench className="h-3.5 w-3.5" />
                Contenido
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
