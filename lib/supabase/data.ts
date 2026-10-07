import { supabase } from './client';
import { UserRole, CourseModality } from '@/types/firebase';

// -----------------------------------------------------------------------
// Types — mirror the shape of lib/firebase/firestore.ts so existing
// call-sites (and types/index.ts re-exports) keep working unchanged.
// -----------------------------------------------------------------------

export interface ProfileDoc {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url: string | null;
  phone: string | null;
  company_id: string | null;
  total_points: number;
  instructor_bio?: string | null;
  instructor_signature_url?: string | null;
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

// -----------------------------------------------------------------------
// Profiles
// -----------------------------------------------------------------------

export async function getProfile(uid: string): Promise<ProfileDoc | null> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', uid).maybeSingle();
  if (error || !data) return null;
  return data as ProfileDoc;
}

export async function createProfile(
  uid: string,
  data: Omit<ProfileDoc, 'id' | 'created_at' | 'updated_at'>
): Promise<void> {
  const { error } = await supabase.from('profiles').insert({ id: uid, ...data });
  if (error) throw error;
}

export async function updateProfile(uid: string, data: Partial<Omit<ProfileDoc, 'id'>>): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', uid);
  if (error) throw error;
}

export async function addPointsToProfile(uid: string, points: number): Promise<void> {
  const profile = await getProfile(uid);
  if (!profile) return;
  const current = profile.total_points ?? 0;
  await updateProfile(uid, { total_points: current + points });
}

export async function getProfileByEmail(email: string): Promise<ProfileDoc | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email.toLowerCase().trim())
    .maybeSingle();
  if (error || !data) return null;
  return data as ProfileDoc;
}

export async function getInstructorProfiles(): Promise<ProfileDoc[]> {
  const { data, error } = await supabase.from('profiles').select('*').eq('role', 'instructor');
  if (error || !data) return [];
  return data as ProfileDoc[];
}

export async function updateInstructorProfile(
  uid: string,
  data: { instructor_bio?: string | null; instructor_signature_url?: string | null }
): Promise<void> {
  await updateProfile(uid, data as Partial<Omit<ProfileDoc, 'id'>>);
}

// -----------------------------------------------------------------------
// Courses
// -----------------------------------------------------------------------

export async function getPublishedCourses(): Promise<CourseDoc[]> {
  const { data, error } = await supabase.from('courses').select('*').eq('is_published', true);
  if (error || !data) return [];
  return data as CourseDoc[];
}

export async function getCourseBySlug(slug: string): Promise<CourseDoc | null> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();
  if (error || !data) return null;
  return data as CourseDoc;
}

export async function getCourseById(courseId: string): Promise<CourseDoc | null> {
  const { data, error } = await supabase.from('courses').select('*').eq('id', courseId).maybeSingle();
  if (error || !data) return null;
  return data as CourseDoc;
}

export async function createCourse(data: Omit<CourseDoc, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
  const { data: row, error } = await supabase.from('courses').insert(data).select('id').single();
  if (error) throw error;
  return row.id;
}

export async function updateCourse(courseId: string, data: Partial<Omit<CourseDoc, 'id'>>): Promise<void> {
  const { error } = await supabase
    .from('courses')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', courseId);
  if (error) throw error;
}

export async function getInstructorCourses(): Promise<CourseDoc[]> {
  const { data, error } = await supabase.from('courses').select('*');
  if (error || !data) return [];
  return data as CourseDoc[];
}

export async function getCoursesByInstructorId(instructorId: string): Promise<CourseDoc[]> {
  const { data, error } = await supabase.from('courses').select('*').eq('instructor_id', instructorId);
  if (error || !data) return [];
  return data as CourseDoc[];
}

// -----------------------------------------------------------------------
// Enrollments
// -----------------------------------------------------------------------

export async function getUserEnrollments(userId: string): Promise<EnrollmentDoc[]> {
  const { data, error } = await supabase.from('enrollments').select('*').eq('user_id', userId);
  if (error || !data) return [];
  return data as EnrollmentDoc[];
}

export async function getEnrollment(userId: string, courseId: string): Promise<EnrollmentDoc | null> {
  const { data, error } = await supabase
    .from('enrollments')
    .select('*')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .maybeSingle();
  if (error || !data) return null;
  return data as EnrollmentDoc;
}

export async function createEnrollment(
  data: Omit<EnrollmentDoc, 'id' | 'enrolled_at' | 'progress' | 'completed_at'>
): Promise<string> {
  const { data: row, error } = await supabase
    .from('enrollments')
    .insert({ ...data, completed_at: null, progress: 0 })
    .select('id')
    .single();
  if (error) throw error;
  return row.id;
}

export async function updateEnrollmentProgress(enrollmentId: string, progress: number): Promise<void> {
  const { error } = await supabase.from('enrollments').update({ progress }).eq('id', enrollmentId);
  if (error) throw error;
}

export async function updateEnrollmentApproval(enrollmentId: string, is_approved: boolean): Promise<void> {
  const { error } = await supabase.from('enrollments').update({ is_approved }).eq('id', enrollmentId);
  if (error) throw error;
}

export async function getCourseEnrollments(courseId: string): Promise<EnrollmentDoc[]> {
  const { data, error } = await supabase.from('enrollments').select('*').eq('course_id', courseId);
  if (error || !data) return [];
  return data as EnrollmentDoc[];
}

export async function getCourseEnrollmentsWithProfiles(
  courseId: string
): Promise<(EnrollmentDoc & { profile: ProfileDoc | null })[]> {
  const enrollments = await getCourseEnrollments(courseId);
  const results = await Promise.all(
    enrollments.map(async (e) => {
      const profile = await getProfile(e.user_id);
      return { ...e, profile };
    })
  );
  return results;
}

// -----------------------------------------------------------------------
// Modules & Lessons
// -----------------------------------------------------------------------

export async function createModule(data: Omit<ModuleDoc, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
  const { data: row, error } = await supabase.from('modules').insert(data).select('id').single();
  if (error) throw error;
  return row.id;
}

export async function updateModule(moduleId: string, data: Partial<Omit<ModuleDoc, 'id'>>): Promise<void> {
  const { error } = await supabase
    .from('modules')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', moduleId);
  if (error) throw error;
}

export async function deleteModule(moduleId: string): Promise<void> {
  const { error } = await supabase.from('modules').delete().eq('id', moduleId);
  if (error) throw error;
}

export async function getCourseModules(courseId: string): Promise<ModuleDoc[]> {
  const { data, error } = await supabase
    .from('modules')
    .select('*')
    .eq('course_id', courseId)
    .order('order_index', { ascending: true });
  if (error || !data) return [];
  return data as ModuleDoc[];
}

function normalizeLesson(row: Record<string, unknown>): LessonDoc {
  return { ...row, attachments: (row.attachments as LessonAttachment[]) ?? [] } as LessonDoc;
}

export async function createLesson(data: Omit<LessonDoc, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
  const { data: row, error } = await supabase.from('lessons').insert(data).select('id').single();
  if (error) throw error;
  return row.id;
}

export async function updateLesson(lessonId: string, data: Partial<Omit<LessonDoc, 'id'>>): Promise<void> {
  const { error } = await supabase
    .from('lessons')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', lessonId);
  if (error) throw error;
}

export async function deleteLesson(lessonId: string): Promise<void> {
  const { error } = await supabase.from('lessons').delete().eq('id', lessonId);
  if (error) throw error;
}

export async function getModuleLessons(moduleId: string): Promise<LessonDoc[]> {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('module_id', moduleId)
    .order('order_index', { ascending: true });
  if (error || !data) return [];
  return data.map(normalizeLesson);
}

export async function addLessonAttachment(lessonId: string, attachment: LessonAttachment): Promise<void> {
  const { data, error } = await supabase.from('lessons').select('attachments').eq('id', lessonId).single();
  if (error || !data) throw new Error('Lesson not found');
  const current: LessonAttachment[] = (data.attachments as LessonAttachment[]) ?? [];
  await updateLesson(lessonId, { attachments: [...current, attachment] });
}

export async function updateLessonMeetUrl(lessonId: string, meetUrl: string): Promise<void> {
  await updateLesson(lessonId, { meet_url: meetUrl });
}

export async function getUpcomingMeetSessions(instructorCourseIds: string[]): Promise<LessonDoc[]> {
  if (instructorCourseIds.length === 0) return [];
  const now = new Date().toISOString();
  const { data, error } = await supabase.from('lessons').select('*').eq('type', 'sincronica');
  if (error || !data) return [];
  return data
    .map(normalizeLesson)
    .filter((l) => l.session_datetime && l.session_datetime >= now)
    .sort((a, b) => (a.session_datetime! > b.session_datetime! ? 1 : -1));
}

// -----------------------------------------------------------------------
// Lesson progress & certificates
// -----------------------------------------------------------------------

export async function getUserLessonProgress(userId: string): Promise<LessonProgressDoc[]> {
  const { data, error } = await supabase.from('lesson_progress').select('*').eq('user_id', userId);
  if (error || !data) return [];
  return data as LessonProgressDoc[];
}

export async function upsertLessonProgress(
  userId: string,
  lessonId: string,
  data: Partial<Omit<LessonProgressDoc, 'id' | 'user_id' | 'lesson_id'>>
): Promise<void> {
  const now = new Date().toISOString();
  const { error } = await supabase
    .from('lesson_progress')
    .upsert(
      {
        user_id: userId,
        lesson_id: lessonId,
        completed: false,
        last_position_seconds: 0,
        completed_at: null,
        updated_at: now,
        ...data,
      },
      { onConflict: 'user_id,lesson_id' }
    );
  if (error) throw error;
}

export async function getUserCertificates(userId: string): Promise<CertificateDoc[]> {
  const { data, error } = await supabase.from('certificates').select('*').eq('user_id', userId);
  if (error || !data) return [];
  return data as CertificateDoc[];
}

// -----------------------------------------------------------------------
// Audit logs, attendance, SENCE surveys/declarations, exam results, grades,
// notifications, submissions — these tables don't exist in the Supabase
// schema yet; left as Firestore for now (see lib/firebase/firestore.ts).
// Re-exported here only where a single page needed a mixed import; check
// individual call-sites.
// -----------------------------------------------------------------------
