'use client';
// @ts-nocheck

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  getCourseBySlug,
  getCourseModules,
  getModuleLessons,
  getEnrollment,
} from '@/lib/supabase/data';
import { useCartStore } from '@/lib/stores/cart-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { Course, ModuleWithLessons } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ShoppingCart, Clock, DollarSign, BookOpen, Award } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<ModuleWithLessons[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);

  const addCourse = useCartStore((state) => state.addCourse);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchCourse = async () => {
      const courseData = await getCourseBySlug(params.slug as string);

      if (courseData) {
        setCourse(courseData as any);

        const mods = await getCourseModules(courseData.id);
        const modulesWithLessons = await Promise.all(
          mods.map(async (mod) => {
            const lessons = await getModuleLessons(mod.id);
            return { ...mod, lessons };
          })
        );
        setModules(modulesWithLessons as any);

        if (user) {
          const enrollment = await getEnrollment(user.id, courseData.id);
          setEnrolled(!!enrollment);
        }
      }

      setLoading(false);
    };

    fetchCourse();
  }, [params.slug, user]);

  const handleAddToCart = () => {
    if (!course) return;

    addCourse({
      id: course.id,
      title: course.title,
      price: course.price,
      image_url: course.image_url,
    });

    toast.success('Curso agregado al carrito');
  };

  const handleStartCourse = () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    router.push(`/lumen/cursos/${course?.id}`);
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

  const totalLessons = modules.reduce((acc, module) => acc + module.lessons.length, 0);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {course.image_url && (
            <div className="relative h-96 w-full rounded-lg overflow-hidden">
              <Image
                src={course.image_url}
                alt={course.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 mb-4">
              {course.is_sence && <Badge variant="secondary">SENCE</Badge>}
              <Badge variant="outline">{course.modality}</Badge>
              {course.area && <Badge variant="outline">{course.area}</Badge>}
            </div>
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            {course.description && (
              <p className="text-lg text-muted-foreground">{course.description}</p>
            )}
          </div>

          {course.instructor_name && (
            <Card>
              <CardHeader>
                <CardTitle>Instructor</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                {course.instructor_avatar && (
                  <div className="relative h-16 w-16 rounded-full overflow-hidden">
                    <Image
                      src={course.instructor_avatar}
                      alt={course.instructor_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="font-semibold">{course.instructor_name}</p>
                  {course.instructor_bio && (
                    <p className="text-sm text-muted-foreground">{course.instructor_bio}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {modules.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Contenido del curso</CardTitle>
                <CardDescription>
                  {modules.length} módulos • {totalLessons} lecciones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {modules.map((module, index) => (
                    <AccordionItem key={module.id} value={`module-${index}`}>
                      <AccordionTrigger>
                        {module.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        {module.description && (
                          <p className="text-sm text-muted-foreground mb-4">
                            {module.description}
                          </p>
                        )}
                        <ul className="space-y-2">
                          {module.lessons.map((lesson) => (
                            <li key={lesson.id} className="flex items-center gap-2 text-sm">
                              <BookOpen className="h-4 w-4" />
                              <span>{lesson.title}</span>
                              {lesson.is_free && (
                                <Badge variant="outline" className="ml-auto">Gratis</Badge>
                              )}
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">
                {course.price > 0 ? `$${course.price.toLocaleString()}` : 'Gratis'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>{course.duration_hours} horas de contenido</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-muted-foreground" />
                  <span>Certificado al finalizar</span>
                </div>
              </div>

              {enrolled ? (
                <Button className="w-full" size="lg" onClick={handleStartCourse}>
                  Continuar curso
                </Button>
              ) : (
                <>
                  {course.price > 0 ? (
                    <Button className="w-full" size="lg" onClick={handleAddToCart}>
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Agregar al carrito
                    </Button>
                  ) : (
                    <Button className="w-full" size="lg" onClick={handleStartCourse}>
                      Comenzar ahora
                    </Button>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
