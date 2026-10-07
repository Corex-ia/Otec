export type UserRole = 'admin' | 'instructor' | 'ejecutivo' | 'contable' | 'ejecutor' | 'vendedor' | 'student';
export type CourseModality = 'presencial' | 'online' | 'hibrido';
export type LessonType = 'video' | 'h5p' | 'quiz' | 'text' | 'sincronica';
export type DealStatus = 'negociacion' | 'contrato' | 'ejecucion' | 'facturado' | 'cerrado';
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';

export interface FirebaseProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url: string | null;
  phone: string | null;
  company_id: string | null;
  created_at: string;
  updated_at: string;
}
