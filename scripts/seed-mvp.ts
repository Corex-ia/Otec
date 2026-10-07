import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import crypto from 'crypto';

function required(name: string): string {
    const value = process.env[name];
    if (!value) throw new Error(`Falta variable de entorno: ${name}`);
    return value;
}

if (!getApps().length) {
    initializeApp({
        credential: cert({
            projectId: required('FIREBASE_ADMIN_PROJECT_ID'),
            clientEmail: required('FIREBASE_ADMIN_CLIENT_EMAIL'),
            privateKey: required('FIREBASE_ADMIN_PRIVATE_KEY').replace(/\\n/g, '\n'),
        }),
    });
}

const auth = getAuth();
const db = getFirestore();

type Role = 'admin' | 'instructor' | 'student';

async function upsertAuthUser(params: {
    email: string;
    password: string;
    displayName: string;
    role: Role;
}) {
    const { email, password, displayName, role } = params;

    try {
        const existing = await auth.getUserByEmail(email);

        await auth.updateUser(existing.uid, {
            email,
            password,
            displayName,
        });

        await auth.setCustomUserClaims(existing.uid, { role });

        return existing.uid;
    } catch {
        const created = await auth.createUser({
            email,
            password,
            displayName,
        });

        await auth.setCustomUserClaims(created.uid, { role });

        return created.uid;
    }
}

async function upsertProfile(uid: string, data: Record<string, any>) {
    await db.collection('profiles').doc(uid).set(
        {
            id: uid,
            updated_at: new Date().toISOString(),
            ...data,
        },
        { merge: true }
    );
}

function slugify(input: string) {
    return input
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function randomRoom(prefix: string) {
    return `${prefix}-${crypto.randomBytes(6).toString('hex')}`;
}

async function setDoc(collection: string, id: string, data: Record<string, any>) {
    await db.collection(collection).doc(id).set(
        {
            id,
            ...data,
        },
        { merge: true }
    );
}

async function createCourseBundle(params: {
    courseId: string;
    title: string;
    description: string;
    instructorId: string;
    modality: 'e-learning sincrónica' | 'e-learning asincrónica' | 'presencial' | 'híbrida';
    published?: boolean;
    completedForStudent?: boolean;
    studentId: string;
}) {
    const {
        courseId,
        title,
        description,
        instructorId,
        modality,
        published = true,
        completedForStudent = false,
        studentId,
    } = params;

    const now = new Date().toISOString();
    const slug = slugify(title);

    await setDoc('courses', courseId, {
        title,
        slug,
        description,
        short_description: description,
        is_published: published,
        modality,
        instructor_id: instructorId,
        image_url: null,
        price: 0,
        category: 'Demo',
        duration_hours: 16,
        created_at: now,
        updated_at: now,
    });

    const module1Id = `${courseId}_mod_01`;
    const module2Id = `${courseId}_mod_02`;

    await setDoc('modules', module1Id, {
        course_id: courseId,
        title: 'Módulo 1 · Fundamentos',
        description: 'Base conceptual del curso',
        order_index: 1,
        created_at: now,
        updated_at: now,
    });

    await setDoc('modules', module2Id, {
        course_id: courseId,
        title: 'Módulo 2 · Aplicación práctica',
        description: 'Aplicación práctica y cierre',
        order_index: 2,
        created_at: now,
        updated_at: now,
    });

    const lessons = [
        {
            id: `${courseId}_les_01`,
            module_id: module1Id,
            title: 'Bienvenida e introducción',
            type: 'video',
            content: 'Contenido introductorio',
            order_index: 1,
            points_reward: 10,
            estimated_minutes: 15,
        },
        {
            id: `${courseId}_les_02`,
            module_id: module1Id,
            title: 'Clase sincrónica inicial',
            type: 'sincronica',
            content: 'Sesión en vivo de inicio',
            meeting_room: randomRoom(`OTEC-${slug}`),
            order_index: 2,
            points_reward: 20,
            estimated_minutes: 60,
            scheduled_at: new Date(Date.now() + 86400000).toISOString(),
        },
        {
            id: `${courseId}_les_03`,
            module_id: module2Id,
            title: 'Actividad de aplicación',
            type: 'text',
            content: 'Actividad práctica guiada',
            order_index: 3,
            points_reward: 15,
            estimated_minutes: 20,
        },
        {
            id: `${courseId}_les_04`,
            module_id: module2Id,
            title: 'Evaluación final',
            type: 'examen',
            content: 'Evaluación de cierre',
            order_index: 4,
            points_reward: 25,
            estimated_minutes: 25,
            passing_score: 70,
        },
    ];

    for (const lesson of lessons) {
        await setDoc('lessons', lesson.id, {
            course_id: courseId,
            ...lesson,
            created_at: now,
            updated_at: now,
            is_published: true,
        });
    }

    const enrollmentId = `${studentId}_${courseId}`;

    await setDoc('enrollments', enrollmentId, {
        user_id: studentId,
        course_id: courseId,
        progress_percent: completedForStudent ? 100 : 40,
        status: completedForStudent ? 'completed' : 'active',
        enrolled_at: now,
        completed_at: completedForStudent ? now : null,
        created_at: now,
        updated_at: now,
    });

    const lessonProgressSeed = completedForStudent
        ? [
            { lesson_id: `${courseId}_les_01`, completed: true, progress_percent: 100 },
            { lesson_id: `${courseId}_les_02`, completed: true, progress_percent: 100 },
            { lesson_id: `${courseId}_les_03`, completed: true, progress_percent: 100 },
            { lesson_id: `${courseId}_les_04`, completed: true, progress_percent: 100 },
        ]
        : [
            { lesson_id: `${courseId}_les_01`, completed: true, progress_percent: 100 },
            { lesson_id: `${courseId}_les_02`, completed: false, progress_percent: 20 },
        ];

    for (const lp of lessonProgressSeed) {
        const progressId = `${studentId}_${lp.lesson_id}`;

        await setDoc('lesson_progress', progressId, {
            user_id: studentId,
            course_id: courseId,
            lesson_id: lp.lesson_id,
            completed: lp.completed,
            progress_percent: lp.progress_percent,
            last_position: lp.completed ? 100 : 20,
            time_spent_seconds: lp.completed ? 900 : 180,
            updated_at: now,
            completed_at: lp.completed ? now : null,
            created_at: now,
        });
    }

    if (completedForStudent) {
        await setDoc('exam_results', `${studentId}_${courseId}_final`, {
            user_id: studentId,
            course_id: courseId,
            lesson_id: `${courseId}_les_04`,
            score: 92,
            passed: true,
            submitted_at: now,
            created_at: now,
            updated_at: now,
        });
    }
}

async function main() {
    const instructorEmail = 'instructor.demo@otec.local';
    const studentEmail = 'alumno.demo@otec.local';
    const defaultPassword = 'Demo123456!';

    console.log('Creando/actualizando usuarios en Firebase Auth...');

    const instructorId = await upsertAuthUser({
        email: instructorEmail,
        password: defaultPassword,
        displayName: 'Instructor Demo OTEC',
        role: 'instructor',
    });

    const studentId = await upsertAuthUser({
        email: studentEmail,
        password: defaultPassword,
        displayName: 'Alumno Demo OTEC',
        role: 'student',
    });

    console.log('Creando/actualizando profiles...');

    await upsertProfile(instructorId, {
        email: instructorEmail,
        full_name: 'Instructor Demo OTEC',
        role: 'instructor',
        avatar_url: null,
        phone: null,
        company_id: null,
        total_points: 0,
        is_active: true,
        created_at: new Date().toISOString(),
    });

    await upsertProfile(studentId, {
        email: studentEmail,
        full_name: 'Alumno Demo OTEC',
        role: 'student',
        avatar_url: null,
        phone: null,
        company_id: null,
        total_points: 70,
        is_active: true,
        created_at: new Date().toISOString(),
    });

    console.log('Creando cursos demo...');

    await createCourseBundle({
        courseId: 'demo_curso_001',
        title: 'Curso de Introducción a LUMEN',
        description: 'Curso demo para mostrar la experiencia completa del LMS.',
        instructorId,
        modality: 'e-learning sincrónica',
        studentId,
        completedForStudent: true,
    });

    await createCourseBundle({
        courseId: 'demo_curso_002',
        title: 'Comunicación Efectiva en Entornos Laborales',
        description: 'Curso demo parcialmente avanzado para mostrar progreso en curso.',
        instructorId,
        modality: 'e-learning asincrónica',
        studentId,
        completedForStudent: false,
    });

    console.log('');
    console.log('✅ Seed MVP completado');
    console.log('');
    console.log('Credenciales de prueba:');
    console.log(`Instructor: ${instructorEmail} / ${defaultPassword}`);
    console.log(`Alumno:     ${studentEmail} / ${defaultPassword}`);
    console.log('');
}

main().catch((error) => {
    console.error('❌ Error ejecutando seed:', error);
    process.exit(1);
});