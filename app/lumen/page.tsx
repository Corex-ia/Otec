'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/stores/auth-store';
import {
  getUserEnrollments,
  getCourseById,
  getUserCertificates,
  getProfile,
  EnrollmentDoc,
  CourseDoc,
  CertificateDoc,
} from '@/lib/supabase/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Award, Zap } from 'lucide-react';
import Image from 'next/image';

interface EnrollmentWithCourse extends EnrollmentDoc {
  course: CourseDoc | null;
}

interface CertificateWithTitle extends CertificateDoc {
  courseTitle: string;
}

export default function LumenDashboard() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const [enrollments, setEnrollments] = useState<EnrollmentWithCourse[]>([]);
  const [certificates, setCertificates] = useState<CertificateWithTitle[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/auth/login?redirect=/lumen');
      return;
    }

    const loadData = async () => {
      const [userEnrollments, userCertificates, userProfile] = await Promise.all([
        getUserEnrollments(user.id),
        getUserCertificates(user.id),
        getProfile(user.id),
      ]);

      setTotalPoints(userProfile?.total_points ?? 0);

      const enrollmentsWithCourses = await Promise.all(
        userEnrollments.map(async (enrollment) => {
          const course = await getCourseById(enrollment.course_id);
          return { ...enrollment, course };
        })
      );

      const sortedEnrollments = enrollmentsWithCourses.sort(
        (a, b) => new Date(b.enrolled_at).getTime() - new Date(a.enrolled_at).getTime()
      );

      const certTitles = await Promise.all(
        userCertificates.map(async (cert) => {
          const course = await getCourseById(cert.course_id);
          return { ...cert, courseTitle: course?.title || 'Curso desconocido' };
        })
      );

      setEnrollments(sortedEnrollments);
      setCertificates(certTitles);
      setDataLoading(false);
    };

    loadData();
  }, [user, loading, router]);

  if (loading || dataLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/2"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Mi Aprendizaje</h1>
          <p className="text-muted-foreground">Continúa donde lo dejaste</p>
        </div>
        <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 self-start">
          <Zap className="h-5 w-5 fill-yellow-400 text-yellow-500" />
          <div>
            <p className="text-xs text-yellow-600 font-medium">Mis Puntos</p>
            <p className="text-2xl font-bold text-yellow-800 leading-none">{totalPoints.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Mis Cursos
          </h2>

          {enrollments.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enrollment) => (
                <Card key={enrollment.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {enrollment.course?.image_url && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={enrollment.course.image_url}
                        alt={enrollment.course.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{enrollment.course?.title}</CardTitle>
                    <CardDescription>
                      Progreso: {Math.round(enrollment.progress)}%
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${enrollment.progress || 0}%` }}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link href={`/lumen/cursos/${enrollment.course_id}`}>
                        {enrollment.progress === 0 ? 'Comenzar' : 'Continuar'}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div
              className="rounded-2xl border overflow-hidden"
              style={{ borderColor: '#C8D3EE' }}
            >
              <div
                className="px-8 py-14 flex flex-col items-center text-center"
                style={{ background: 'linear-gradient(135deg, #F8F7FF 0%, #EBF0FF 100%)' }}
              >
                <div
                  className="h-20 w-20 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: 'linear-gradient(135deg, #1E2E8C, #2A3FA8)', boxShadow: '0 8px 24px rgba(93,63,211,0.25)' }}
                >
                  <BookOpen className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#0D1A4A' }}>
                  Comienza tu capacitación
                </h3>
                <p className="text-sm leading-relaxed max-w-sm mb-6" style={{ color: '#3A4A7A' }}>
                  Aún no estás inscrito en ningún curso. Explora nuestro catálogo con más de 70 cursos
                  certificados SENCE y comienza hoy.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    asChild
                    className="font-semibold text-white px-6"
                    style={{ background: '#1E2E8C', boxShadow: '0 4px 12px rgba(93,63,211,0.3)' }}
                  >
                    <Link href="/cursos">Ver catálogo de cursos</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="font-semibold px-6"
                    style={{ borderColor: '#C8D3EE', color: '#1E2E8C' }}
                  >
                    <Link href="/contacto">Hablar con un asesor</Link>
                  </Button>
                </div>
                <div className="mt-8 flex items-center gap-6">
                  {[
                    { label: '+70 cursos', sub: 'certificados SENCE' },
                    { label: '3 modalidades', sub: 'Online · Presencial · Híbrido' },
                    { label: 'Certificado', sub: 'al completar el curso' },
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <p className="text-sm font-bold" style={{ color: '#0D1A4A' }}>{item.label}</p>
                      <p className="text-xs" style={{ color: '#7A8AB0' }}>{item.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {certificates.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Award className="h-6 w-6" />
              Mis Certificados
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((certificate) => (
                <Card key={certificate.id}>
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{certificate.courseTitle}</CardTitle>
                    <CardDescription>
                      Emitido el {new Date(certificate.issued_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="outline" asChild className="w-full">
                      <a href={certificate.certificate_url} target="_blank" rel="noopener noreferrer">
                        Descargar certificado
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
