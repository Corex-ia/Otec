import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  DocumentData,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './config';
import { UserRole, CourseModality } from '@/types/firebase';

if (typeof window !== 'undefined') {
  const _originalConsoleError = console.error.bind(console);
  console.error = (...args: unknown[]) => {
    const msg = args.join(' ');
    if (msg.includes('permission-denied') || msg.includes('Missing or insufficient permissions')) {
      console.warn('[Firebase] PERMISSION DENIED — revisa las Firestore Security Rules para esta coleccion. Args:', args);
    } else if (msg.includes('failed-precondition') || msg.includes('requires an index')) {
      console.warn('[Firebase] INDEX REQUERIDO — necesitas crear un indice compuesto en la consola de Firebase. Args:', args);
    }
    _originalConsoleError(...args);
  };
}

export interface ProfileDoc {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url: string | null;
  phone: string | null;
  company_id: string | null;
  total_points: number;
  created_at: string;
  updated_at: string;
}

export interface CourseDoc {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  image_url: string | null;
  price: number;
  duration_hours: number;
  modality: CourseModality;
  area: string | null;
  sence_code: string | null;
  is_sence: boolean;
  is_published: boolean;
  instructor_name: string | null;
  instructor_bio: string | null;
  instructor_avatar: string | null;
  instructor_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface EnrollmentDoc {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  completed_at: string | null;
  progress: number;
  is_approved: boolean;
}

export interface ModuleDoc {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface LessonAttachment {
  id: string;
  name: string;
  url: string;
  type: 'pdf' | 'image' | 'video';
  size: number;
  createdAt: string;
}

export interface ExamQuestion {
  id: string;
  text: string;
  options: string[];
  correct_index: number;
}

export interface LessonDoc {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  type: 'video' | 'h5p' | 'quiz' | 'text' | 'sincronica' | 'interactive' | 'examen';
  order_index: number;
  video_url: string | null;
  duration_seconds: number;
  h5p_content_url: string | null;
  text_content: string | null;
  embed_code: string | null;
  is_free: boolean;
  attachments: LessonAttachment[];
  meet_url: string | null;
  session_datetime: string | null;
  points: number | null;
  exam_questions: ExamQuestion[] | null;
  exam_passing_score: number | null;
  exam_allow_retry: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface LessonProgressDoc {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  last_position_seconds: number;
  completed_at: string | null;
  updated_at: string;
}

export interface CertificateDoc {
  id: string;
  user_id: string;
  course_id: string;
  certificate_url: string;
  issued_at: string;
}

function mapDoc<T>(snap: DocumentData): T {
  return { id: snap.id, ...snap.data() } as T;
}

export const profilesCollection = collection(db, 'profiles');
export const coursesCollection = collection(db, 'courses');
export const enrollmentsCollection = collection(db, 'enrollments');
export const modulesCollection = collection(db, 'modules');
export const lessonsCollection = collection(db, 'lessons');
export const lessonProgressCollection = collection(db, 'lesson_progress');
export const certificatesCollection = collection(db, 'certificates');

export async function getProfile(uid: string): Promise<ProfileDoc | null> {
  const snap = await getDoc(doc(db, 'profiles', uid));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as ProfileDoc;
}

export async function createProfile(uid: string, data: Omit<ProfileDoc, 'id' | 'created_at' | 'updated_at'>): Promise<void> {
  const now = new Date().toISOString();
  await setDoc(doc(db, 'profiles', uid), {
    ...data,
    created_at: now,
    updated_at: now,
  });
}

export async function updateProfile(uid: string, data: Partial<Omit<ProfileDoc, 'id'>>): Promise<void> {
  await updateDoc(doc(db, 'profiles', uid), {
    ...data,
    updated_at: new Date().toISOString(),
  });
}

export async function addPointsToProfile(uid: string, points: number): Promise<void> {
  const profileRef = doc(db, 'profiles', uid);
  const snap = await getDoc(profileRef);
  if (!snap.exists()) return;
  const current = (snap.data().total_points as number) ?? 0;
  await updateDoc(profileRef, {
    total_points: current + points,
    updated_at: new Date().toISOString(),
  });
}

export async function getPublishedCourses(): Promise<CourseDoc[]> {
  const q = query(coursesCollection, where('is_published', '==', true));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CourseDoc));
}

export async function getCourseBySlug(slug: string): Promise<CourseDoc | null> {
  const q = query(coursesCollection, where('slug', '==', slug), where('is_published', '==', true));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as CourseDoc;
}

export async function getCourseById(courseId: string): Promise<CourseDoc | null> {
  const snap = await getDoc(doc(db, 'courses', courseId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as CourseDoc;
}

export async function createCourse(data: Omit<CourseDoc, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
  const now = new Date().toISOString();
  const ref = doc(coursesCollection);
  await setDoc(ref, { ...data, created_at: now, updated_at: now });
  return ref.id;
}

export async function updateCourse(courseId: string, data: Partial<Omit<CourseDoc, 'id'>>): Promise<void> {
  await updateDoc(doc(db, 'courses', courseId), {
    ...data,
    updated_at: new Date().toISOString(),
  });
}

export async function getUserEnrollments(userId: string): Promise<EnrollmentDoc[]> {
  const q = query(enrollmentsCollection, where('user_id', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as EnrollmentDoc));
}

export async function getEnrollment(userId: string, courseId: string): Promise<EnrollmentDoc | null> {
  const q = query(
    enrollmentsCollection,
    where('user_id', '==', userId),
    where('course_id', '==', courseId)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as EnrollmentDoc;
}

export async function createEnrollment(data: Omit<EnrollmentDoc, 'id' | 'enrolled_at' | 'progress' | 'completed_at'>): Promise<string> {
  const ref = doc(enrollmentsCollection);
  await setDoc(ref, {
    ...data,
    enrolled_at: new Date().toISOString(),
    completed_at: null,
    progress: 0,
  });
  return ref.id;
}

export async function updateEnrollmentProgress(enrollmentId: string, progress: number): Promise<void> {
  await updateDoc(doc(db, 'enrollments', enrollmentId), { progress });
}

export async function updateEnrollmentApproval(enrollmentId: string, is_approved: boolean): Promise<void> {
  await updateDoc(doc(db, 'enrollments', enrollmentId), { is_approved });
}

export async function getCourseEnrollments(courseId: string): Promise<EnrollmentDoc[]> {
  const q = query(enrollmentsCollection, where('course_id', '==', courseId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as EnrollmentDoc));
}

export async function getUpcomingMeetSessions(instructorCourseIds: string[]): Promise<LessonDoc[]> {
  if (instructorCourseIds.length === 0) return [];
  const now = new Date().toISOString();
  const q = query(
    lessonsCollection,
    where('type', '==', 'sincronica'),
  );
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data(), attachments: d.data().attachments ?? [] } as LessonDoc))
    .filter((l) => l.session_datetime && l.session_datetime >= now)
    .sort((a, b) => (a.session_datetime! > b.session_datetime! ? 1 : -1));
}

export async function getInstructorCourses(): Promise<CourseDoc[]> {
  const snap = await getDocs(coursesCollection);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CourseDoc));
}

export async function getCoursesByInstructorId(instructorId: string): Promise<CourseDoc[]> {
  const q = query(coursesCollection, where('instructor_id', '==', instructorId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CourseDoc));
}

export async function getInstructorProfiles(): Promise<ProfileDoc[]> {
  const q = query(profilesCollection, where('role', '==', 'instructor'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ProfileDoc));
}

export async function createModule(data: Omit<ModuleDoc, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
  const now = new Date().toISOString();
  const ref = doc(modulesCollection);
  await setDoc(ref, { ...data, created_at: now, updated_at: now });
  return ref.id;
}

export async function updateModule(moduleId: string, data: Partial<Omit<ModuleDoc, 'id'>>): Promise<void> {
  await updateDoc(doc(db, 'modules', moduleId), { ...data, updated_at: new Date().toISOString() });
}

export async function deleteModule(moduleId: string): Promise<void> {
  await deleteDoc(doc(db, 'modules', moduleId));
}

export async function createLesson(data: Omit<LessonDoc, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
  const now = new Date().toISOString();
  const ref = doc(lessonsCollection);
  await setDoc(ref, { ...data, created_at: now, updated_at: now });
  return ref.id;
}

export async function updateLesson(lessonId: string, data: Partial<Omit<LessonDoc, 'id'>>): Promise<void> {
  await updateDoc(doc(db, 'lessons', lessonId), { ...data, updated_at: new Date().toISOString() });
}

export async function deleteLesson(lessonId: string): Promise<void> {
  await deleteDoc(doc(db, 'lessons', lessonId));
}

export async function getCourseModules(courseId: string): Promise<ModuleDoc[]> {
  const q = query(modulesCollection, where('course_id', '==', courseId));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as ModuleDoc))
    .sort((a, b) => a.order_index - b.order_index);
}

export async function getModuleLessons(moduleId: string): Promise<LessonDoc[]> {
  const q = query(lessonsCollection, where('module_id', '==', moduleId));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => {
      const data = d.data();
      return { id: d.id, ...data, attachments: data.attachments ?? [] } as LessonDoc;
    })
    .sort((a, b) => a.order_index - b.order_index);
}

export async function addLessonAttachment(lessonId: string, attachment: LessonAttachment): Promise<void> {
  const lessonRef = doc(db, 'lessons', lessonId);
  const snap = await getDoc(lessonRef);
  if (!snap.exists()) throw new Error('Lesson not found');
  const current: LessonAttachment[] = snap.data().attachments ?? [];
  await updateDoc(lessonRef, {
    attachments: [...current, attachment],
    updated_at: new Date().toISOString(),
  });
}

export async function getUserLessonProgress(userId: string): Promise<LessonProgressDoc[]> {
  const q = query(lessonProgressCollection, where('user_id', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as LessonProgressDoc));
}

export async function upsertLessonProgress(
  userId: string,
  lessonId: string,
  data: Partial<Omit<LessonProgressDoc, 'id' | 'user_id' | 'lesson_id'>>
): Promise<void> {
  const q = query(
    lessonProgressCollection,
    where('user_id', '==', userId),
    where('lesson_id', '==', lessonId)
  );
  const snap = await getDocs(q);
  const now = new Date().toISOString();

  if (snap.empty) {
    const ref = doc(lessonProgressCollection);
    await setDoc(ref, {
      user_id: userId,
      lesson_id: lessonId,
      completed: false,
      last_position_seconds: 0,
      completed_at: null,
      updated_at: now,
      ...data,
    });
  } else {
    await updateDoc(snap.docs[0].ref, { ...data, updated_at: now });
  }
}

export async function getUserCertificates(userId: string): Promise<CertificateDoc[]> {
  const q = query(certificatesCollection, where('user_id', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CertificateDoc));
}

export interface EventDoc {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  end_date: string | null;
  location: string | null;
  address: string | null;
  capacity: number;
  ticket_price: number;
  has_seating: boolean;
  image_url: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export const eventsCollection = collection(db, 'events');

export async function getUpcomingEvents(): Promise<EventDoc[]> {
  const now = new Date().toISOString();
  const q = query(
    eventsCollection,
    where('is_published', '==', true),
    where('event_date', '>=', now),
    orderBy('event_date')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as EventDoc));
}

export interface DealDoc {
  id: string;
  title: string;
  description: string | null;
  company_id: string | null;
  value: number;
  status: string;
  assigned_to: string | null;
  expected_close_date: string | null;
  closed_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CompanyDoc {
  id: string;
  name: string;
  rut: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  region: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskDoc {
  id: string;
  title: string;
  description: string | null;
  assigned_to: string | null;
  created_by: string | null;
  deal_id: string | null;
  company_id: string | null;
  due_date: string | null;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export const dealsCollection = collection(db, 'deals');
export const companiesCollection = collection(db, 'companies');
export const tasksCollection = collection(db, 'tasks');

export async function getDeals(limitCount = 5): Promise<DealDoc[]> {
  const q = query(dealsCollection, orderBy('created_at', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.slice(0, limitCount).map((d) => ({ id: d.id, ...d.data() } as DealDoc));
}

export async function getCompanies(limitCount = 5): Promise<CompanyDoc[]> {
  const q = query(companiesCollection, orderBy('created_at', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.slice(0, limitCount).map((d) => ({ id: d.id, ...d.data() } as CompanyDoc));
}

export async function getPendingTasks(limitCount = 5): Promise<TaskDoc[]> {
  const q = query(tasksCollection, where('completed', '==', false));
  const snap = await getDocs(q);
  return snap.docs.slice(0, limitCount).map((d) => ({ id: d.id, ...d.data() } as TaskDoc));
}

export async function getClosedDealsRevenue(): Promise<number> {
  const q = query(dealsCollection, where('status', '==', 'cerrado'));
  const snap = await getDocs(q);
  return snap.docs.reduce((sum, d) => sum + (Number((d.data() as DealDoc).value) || 0), 0);
}

export async function getProfileByEmail(email: string): Promise<ProfileDoc | null> {
  const q = query(profilesCollection, where('email', '==', email.toLowerCase().trim()));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as ProfileDoc;
}

export async function getCourseEnrollmentsWithProfiles(courseId: string): Promise<(EnrollmentDoc & { profile: ProfileDoc | null })[]> {
  const enrollments = await getCourseEnrollments(courseId);
  const results = await Promise.all(
    enrollments.map(async (e) => {
      const profile = await getProfile(e.user_id);
      return { ...e, profile };
    })
  );
  return results;
}

export async function updateInstructorProfile(uid: string, data: { instructor_bio?: string | null; instructor_signature_url?: string | null }): Promise<void> {
  await updateProfile(uid, data as Partial<Omit<ProfileDoc, 'id'>>);
}

export interface SubmissionDoc {
  id: string;
  lesson_id: string;
  user_id: string;
  user_name: string;
  file_url: string;
  file_name: string;
  submitted_at: string;
}

export const submissionsCollection = collection(db, 'submissions');

export async function getLessonSubmissions(lessonId: string): Promise<SubmissionDoc[]> {
  const q = query(submissionsCollection, where('lesson_id', '==', lessonId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as SubmissionDoc));
}

export async function updateLessonMeetUrl(lessonId: string, meetUrl: string): Promise<void> {
  await updateLesson(lessonId, { meet_url: meetUrl });
}

export interface NotificationDoc {
  id: string;
  user_id: string;
  message: string;
  course_id: string | null;
  read: boolean;
  created_at: string;
}

export const notificationsCollection = collection(db, 'notifications');

export async function sendStudentNotification(userId: string, message: string, courseId: string | null = null): Promise<void> {
  const ref = doc(notificationsCollection);
  await setDoc(ref, {
    user_id: userId,
    message,
    course_id: courseId,
    read: false,
    created_at: new Date().toISOString(),
  });
}

export interface AttendanceDoc {
  id: string;
  user_id: string;
  course_id: string;
  lesson_id: string | null;
  timestamp: string;
}

export const attendanceCollection = collection(db, 'attendance');

export async function createAttendanceRecord(userId: string, courseId: string, lessonId: string | null = null): Promise<void> {
  const ref = doc(attendanceCollection);
  await setDoc(ref, {
    user_id: userId,
    course_id: courseId,
    lesson_id: lessonId,
    timestamp: new Date().toISOString(),
  });
}

export async function getUserNotifications(userId: string): Promise<NotificationDoc[]> {
  const q = query(notificationsCollection, where('user_id', '==', userId));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as NotificationDoc))
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  await updateDoc(doc(db, 'notifications', notificationId), { read: true });
}

export async function getCourseAttendanceUserIds(courseId: string): Promise<string[]> {
  const q = query(attendanceCollection, where('course_id', '==', courseId));
  const snap = await getDocs(q);
  const ids = new Set<string>();
  snap.docs.forEach((d) => {
    const data = d.data();
    if (data.user_id) ids.add(data.user_id as string);
  });
  return Array.from(ids);
}

export interface GradeDoc {
  id: string;
  lesson_id: string;
  user_id: string;
  instructor_id: string;
  grade: number | null;
  feedback: string | null;
  created_at: string;
  updated_at: string;
}

export const gradesCollection = collection(db, 'submission_grades');

export async function getLessonGrades(lessonId: string): Promise<GradeDoc[]> {
  const q = query(gradesCollection, where('lesson_id', '==', lessonId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as GradeDoc));
}

export interface AuditLogDoc {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  action: 'login' | 'logout' | 'lesson_enter' | 'lesson_exit' | 'jitsi_enter' | 'jitsi_exit' | 'meet_join' | 'meet_leave' | 'download';
  course_id: string | null;
  lesson_id: string | null;
  duration_seconds: number | null;
  ip_address: string | null;
  metadata: Record<string, string | number | boolean | null>;
  created_at: string;
}

export const auditLogsCollection = collection(db, 'audit_logs');

export async function writeAuditLog(data: Omit<AuditLogDoc, 'id' | 'created_at'>): Promise<string> {
  const ref = doc(auditLogsCollection);
  await setDoc(ref, { ...data, created_at: new Date().toISOString() });
  return ref.id;
}

export async function getCourseAuditLogs(courseId: string): Promise<AuditLogDoc[]> {
  const q = query(auditLogsCollection, where('course_id', '==', courseId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as AuditLogDoc));
}

export async function getAllAuditLogs(limitCount = 500): Promise<AuditLogDoc[]> {
  const q = query(auditLogsCollection, orderBy('created_at', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.slice(0, limitCount).map((d) => ({ id: d.id, ...d.data() } as AuditLogDoc));
}

export interface SenceSurveyDoc {
  id: string;
  user_id: string;
  course_id: string;
  rating_relator: number;
  rating_contenidos: number;
  rating_infraestructura: number;
  rating_utilidad: number;
  submitted_at: string;
}

export const senceSurveysCollection = collection(db, 'sence_surveys');

export async function getSenceSurvey(userId: string, courseId: string): Promise<SenceSurveyDoc | null> {
  const q = query(
    senceSurveysCollection,
    where('user_id', '==', userId),
    where('course_id', '==', courseId)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as SenceSurveyDoc;
}

export async function submitSenceSurvey(
  userId: string,
  courseId: string,
  ratings: { relator: number; contenidos: number; infraestructura: number; utilidad: number }
): Promise<void> {
  const ref = doc(senceSurveysCollection);
  await setDoc(ref, {
    user_id: userId,
    course_id: courseId,
    rating_relator: ratings.relator,
    rating_contenidos: ratings.contenidos,
    rating_infraestructura: ratings.infraestructura,
    rating_utilidad: ratings.utilidad,
    submitted_at: new Date().toISOString(),
  });
}

export async function getCourseSenceSurveys(courseId: string): Promise<SenceSurveyDoc[]> {
  const q = query(senceSurveysCollection, where('course_id', '==', courseId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as SenceSurveyDoc));
}

export async function upsertGrade(
  lessonId: string,
  userId: string,
  instructorId: string,
  grade: number | null,
  feedback: string | null,
  existingId: string | null
): Promise<void> {
  const now = new Date().toISOString();
  if (existingId) {
    await updateDoc(doc(db, 'submission_grades', existingId), {
      grade,
      feedback,
      updated_at: now,
    });
  } else {
    const ref = doc(gradesCollection);
    await setDoc(ref, {
      lesson_id: lessonId,
      user_id: userId,
      instructor_id: instructorId,
      grade,
      feedback,
      created_at: now,
      updated_at: now,
    });
  }
}

export interface ExamResultDoc {
  id: string;
  lesson_id: string;
  course_id: string;
  user_id: string;
  score: number;
  passed: boolean;
  answers: number[];
  attempt: number;
  submitted_at: string;
}

export const examResultsCollection = collection(db, 'exam_results');

export async function getExamResult(userId: string, lessonId: string): Promise<ExamResultDoc | null> {
  const q = query(
    examResultsCollection,
    where('user_id', '==', userId),
    where('lesson_id', '==', lessonId)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const sorted = snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as ExamResultDoc))
    .sort((a, b) => b.attempt - a.attempt);
  return sorted[0];
}

export async function saveExamResult(data: Omit<ExamResultDoc, 'id'>): Promise<string> {
  const ref = doc(examResultsCollection);
  await setDoc(ref, data);
  return ref.id;
}

export async function getCourseExamResults(courseId: string): Promise<ExamResultDoc[]> {
  const q = query(examResultsCollection, where('course_id', '==', courseId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ExamResultDoc));
}

export interface SenceDeclarationDoc {
  id: string;
  user_id: string;
  course_id: string;
  lesson_id: string;
  accepted_at: string;
}

export const senceDeclarationsCollection = collection(db, 'sence_declarations');

export async function saveSenceDeclaration(userId: string, courseId: string, lessonId: string): Promise<void> {
  const ref = doc(senceDeclarationsCollection);
  await setDoc(ref, {
    user_id: userId,
    course_id: courseId,
    lesson_id: lessonId,
    accepted_at: new Date().toISOString(),
  });
}

export async function getCourseSenceDeclarations(courseId: string): Promise<SenceDeclarationDoc[]> {
  const q = query(senceDeclarationsCollection, where('course_id', '==', courseId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as SenceDeclarationDoc));
}

export async function getUserCourseDeclarations(userId: string, courseId: string): Promise<SenceDeclarationDoc[]> {
  const q = query(
    senceDeclarationsCollection,
    where('user_id', '==', userId),
    where('course_id', '==', courseId)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as SenceDeclarationDoc));
}
