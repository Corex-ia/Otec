// @ts-nocheck
'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/stores/auth-store';
import { CourseBuilder } from '@/components/crm/course-builder';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function InstructorCourseBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const loading = useAuthStore((s) => s.loading);

  useEffect(() => {
    console.log('[InstructorCourseBuilderPage] courseId:', courseId, 'user:', user?.uid, 'role:', profile?.role);
    if (loading) return;
    if (!user) {
      router.push('/auth/login?redirect=/dashboard/instructor');
      return;
    }
    if (profile && !['admin', 'instructor'].includes(profile.role)) {
      router.push('/');
      return;
    }
  }, [user, profile, loading, router, courseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-10 max-w-4xl">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-slate-200 rounded w-32" />
            <div className="h-96 bg-slate-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" asChild className="gap-1.5 text-slate-500 hover:text-slate-800">
            <Link href={`/dashboard/instructor/cursos/${courseId}`}>
              <ArrowLeft className="h-4 w-4" />
              Volver al curso
            </Link>
          </Button>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Editor de Contenido</h1>
          <p className="text-sm text-slate-500 mt-1">Crea y organiza los módulos y lecciones del curso</p>
        </div>

        <CourseBuilder
          instructorId={profile?.role === 'admin' ? undefined : user?.uid}
          preselectedCourseId={courseId}
        />
      </div>
    </div>
  );
}
