'use client';

import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { useAuthStore } from '@/lib/stores/auth-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { DatabaseZap, CircleCheck as CheckCircle2, Circle, Loader as Loader2 } from 'lucide-react';

const TEST_USERS = [
  {
    email: 'admin@corexia.com',
    password: 'Admin123!',
    full_name: 'Administrador Corex-ia',
    role: 'admin' as const,
    label: 'Administrador',
    redirect: '/crm',
  },
  {
    email: 'profesor@corexia.com',
    password: 'Profesor123!',
    full_name: 'Profesor Demo',
    role: 'instructor' as const,
    label: 'Instructor / Relator',
    redirect: '/dashboard/instructor',
  },
  {
    email: 'alumno@corexia.com',
    password: 'Alumno123!',
    full_name: 'Alumno de Prueba',
    role: 'student' as const,
    label: 'Alumno',
    redirect: '/lumen',
  },
];

const SEED_COURSE = {
  title: 'Curso de Introducción Corex-ia',
  slug: 'introduccion-corexia',
  description:
    'Curso de prueba para explorar todas las funcionalidades de la plataforma Corex-ia. Incluye módulos de introducción, navegación del LMS y descarga de recursos.',
  short_description: 'Curso de prueba oficial de la plataforma Corex-ia.',
  image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
  price: 0,
  duration_hours: 4,
  modality: 'online' as const,
  area: 'Tecnología',
  sence_code: null,
  is_sence: false,
  is_published: true,
  instructor_name: 'Equipo Corex-ia',
  instructor_bio: null,
  instructor_avatar: null,
};

const SEED_MODULES = [
  {
    title: 'Bienvenida a la Plataforma',
    description: 'Introducción y orientación general del LMS.',
    order_index: 0,
    lessons: [
      { title: 'Introducción al curso', description: 'Conoce la estructura del programa.', type: 'text', order_index: 0, duration_seconds: 300 },
      { title: 'Cómo navegar el LMS', description: 'Aprende a usar la interfaz del alumno.', type: 'video', order_index: 1, duration_seconds: 600 },
    ],
  },
  {
    title: 'Recursos y Materiales',
    description: 'Acceso a documentos y recursos descargables.',
    order_index: 1,
    lessons: [
      { title: 'Manual del estudiante', description: 'Descarga el manual oficial.', type: 'text', order_index: 0, duration_seconds: 120 },
      { title: 'Evaluación final', description: 'Demuestra lo aprendido.', type: 'quiz', order_index: 1, duration_seconds: 900 },
    ],
  },
];

type SeedStatus = 'idle' | 'running' | 'done' | 'error';

interface StepState {
  label: string;
  status: 'pending' | 'running' | 'done' | 'error';
}

export function SeedPanel() {
  const currentUser = useAuthStore((state) => state.user);
  const [seedStatus, setSeedStatus] = useState<SeedStatus>('idle');
  const [steps, setSteps] = useState<StepState[]>([]);

  const updateStep = (index: number, status: StepState['status']) => {
    setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, status } : s)));
  };

  const initSteps = (labels: string[]) => {
    setSteps(labels.map((label) => ({ label, status: 'pending' })));
  };

  const handleSeed = async () => {
    setSeedStatus('running');

    const stepLabels = [
      'Creando usuario Admin',
      'Creando usuario Instructor',
      'Creando usuario Alumno',
      'Creando curso de prueba',
      'Creando módulos y lecciones',
      'Inscribiendo alumno al curso',
      'Restaurando sesión admin',
    ];
    initSteps(stepLabels);

    try {
      const adminEmail = currentUser?.email;
      const adminSnapshot: { uid: string; email: string | null } | null = currentUser
        ? { uid: currentUser.uid, email: currentUser.email }
        : null;

      const createdUids: Record<string, string> = {};

      for (let i = 0; i < TEST_USERS.length; i++) {
        const u = TEST_USERS[i];
        updateStep(i, 'running');

        try {
          const existing = await getDocs(
            query(collection(db, 'profiles'), where('email', '==', u.email))
          );

          if (!existing.empty) {
            createdUids[u.email] = existing.docs[0].id;
            updateStep(i, 'done');
            continue;
          }

          const cred = await createUserWithEmailAndPassword(auth, u.email, u.password);
          createdUids[u.email] = cred.user.uid;

          const now = new Date().toISOString();
          await setDoc(doc(db, 'profiles', cred.user.uid), {
            email: u.email,
            full_name: u.full_name,
            role: u.role,
            avatar_url: null,
            phone: null,
            company_id: null,
            created_at: now,
            updated_at: now,
          });

          await signOut(auth);
          updateStep(i, 'done');
        } catch (err: any) {
          if (err.code === 'auth/email-already-in-use') {
            const existing = await getDocs(
              query(collection(db, 'profiles'), where('email', '==', u.email))
            );
            if (!existing.empty) {
              createdUids[u.email] = existing.docs[0].id;
            }
            updateStep(i, 'done');
          } else {
            updateStep(i, 'error');
            throw err;
          }
        }
      }

      updateStep(3, 'running');
      let courseId: string | null = null;

      const existingCourse = await getDocs(
        query(collection(db, 'courses'), where('slug', '==', SEED_COURSE.slug))
      );

      if (!existingCourse.empty) {
        courseId = existingCourse.docs[0].id;
        updateStep(3, 'done');
      } else {
        const now = new Date().toISOString();
        const courseRef = doc(collection(db, 'courses'));
        courseId = courseRef.id;
        await setDoc(courseRef, { ...SEED_COURSE, created_at: now, updated_at: now });
        updateStep(3, 'done');
      }

      updateStep(4, 'running');
      const now = new Date().toISOString();

      for (const mod of SEED_MODULES) {
        const existingMod = await getDocs(
          query(collection(db, 'modules'), where('course_id', '==', courseId), where('order_index', '==', mod.order_index))
        );

        let moduleId: string;
        if (!existingMod.empty) {
          moduleId = existingMod.docs[0].id;
        } else {
          const moduleRef = doc(collection(db, 'modules'));
          moduleId = moduleRef.id;
          await setDoc(moduleRef, {
            course_id: courseId,
            title: mod.title,
            description: mod.description,
            order_index: mod.order_index,
            created_at: now,
            updated_at: now,
          });
        }

        for (const lesson of mod.lessons) {
          const existingLesson = await getDocs(
            query(collection(db, 'lessons'), where('module_id', '==', moduleId), where('order_index', '==', lesson.order_index))
          );

          if (!existingLesson.empty) continue;

          const lessonRef = doc(collection(db, 'lessons'));
          await setDoc(lessonRef, {
            module_id: moduleId,
            title: lesson.title,
            description: lesson.description,
            type: lesson.type,
            order_index: lesson.order_index,
            video_url: null,
            duration_seconds: lesson.duration_seconds,
            h5p_content_url: null,
            text_content: null,
            is_free: lesson.order_index === 0,
            attachments: [],
            created_at: now,
            updated_at: now,
          });
        }
      }
      updateStep(4, 'done');

      updateStep(5, 'running');
      const alumnoUid = createdUids['alumno@corexia.com'];

      if (alumnoUid && courseId) {
        const existingEnrollment = await getDocs(
          query(
            collection(db, 'enrollments'),
            where('user_id', '==', alumnoUid),
            where('course_id', '==', courseId)
          )
        );

        if (existingEnrollment.empty) {
          const enrollRef = doc(collection(db, 'enrollments'));
          await setDoc(enrollRef, {
            user_id: alumnoUid,
            course_id: courseId,
            enrolled_at: now,
            completed_at: null,
            progress: 0,
          });
        }
      }
      updateStep(5, 'done');

      updateStep(6, 'running');
      if (adminSnapshot) {
        await signInWithEmailAndPassword(auth, 'admin@corexia.com', 'Admin123!');
      }
      updateStep(6, 'done');

      setSeedStatus('done');
      toast.success('Datos de prueba creados correctamente');
    } catch (err: any) {
      setSeedStatus('error');
      toast.error(err.message || 'Error al crear datos de prueba');
    }
  };

  const stepIcon = (status: StepState['status']) => {
    if (status === 'done') return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    if (status === 'running') return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
    if (status === 'error') return <Circle className="h-4 w-4 text-red-500" />;
    return <Circle className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <Card className="border-dashed border-amber-300 bg-amber-50/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <DatabaseZap className="h-5 w-5 text-amber-600" />
            Datos de Prueba
          </CardTitle>
          <Badge variant="outline" className="text-amber-700 border-amber-300 bg-amber-50">
            Solo desarrollo
          </Badge>
        </div>
        <CardDescription>
          Crea los 3 usuarios de prueba, el curso demo y la inscripción del alumno en Firestore y Firebase Auth.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2 text-xs">
          {TEST_USERS.map((u) => (
            <div key={u.email} className="rounded-md border bg-white p-2.5 space-y-1">
              <p className="font-semibold text-slate-700">{u.label}</p>
              <p className="text-muted-foreground font-mono break-all">{u.email}</p>
              <p className="text-muted-foreground font-mono">{u.password}</p>
              <p className="text-[10px] text-slate-400">Redirige a: {u.redirect}</p>
            </div>
          ))}
        </div>

        {steps.length > 0 && (
          <div className="rounded-md border bg-white p-3 space-y-1.5">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                {stepIcon(step.status)}
                <span className={step.status === 'done' ? 'text-slate-500 line-through' : 'text-slate-700'}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        )}

        <Button
          onClick={handleSeed}
          disabled={seedStatus === 'running'}
          className="w-full"
          variant={seedStatus === 'done' ? 'outline' : 'default'}
        >
          {seedStatus === 'running' && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {seedStatus === 'idle' && 'Crear datos de prueba'}
          {seedStatus === 'running' && 'Creando...'}
          {seedStatus === 'done' && 'Datos creados (ejecutar de nuevo es seguro)'}
          {seedStatus === 'error' && 'Error — Intentar de nuevo'}
        </Button>
      </CardContent>
    </Card>
  );
}
