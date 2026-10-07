import {
  ProfileDoc as Profile,
  CourseDoc as Course,
  EnrollmentDoc as Enrollment,
  ModuleDoc as Module,
  LessonDoc as Lesson,
  LessonProgressDoc as LessonProgress,
  CertificateDoc as Certificate,
} from '@/lib/supabase/data';

export type { Profile, Course, Enrollment, Module, Lesson, LessonProgress, Certificate };

export type Event = {
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
};

export type TicketSection = {
  id: string;
  event_id: string;
  name: string;
  price: number;
  capacity: number;
  seats_available: number;
  created_at: string;
};

export type Company = {
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
};

export type Deal = {
  id: string;
  title: string;
  description: string | null;
  company_id: string | null;
  value: number;
  status: 'negociacion' | 'contrato' | 'ejecucion' | 'facturado' | 'cerrado';
  assigned_to: string | null;
  expected_close_date: string | null;
  closed_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type Task = {
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
};

export type Note = {
  id: string;
  content: string;
  created_by: string | null;
  company_id: string | null;
  deal_id: string | null;
  user_id: string | null;
  created_at: string;
  updated_at: string;
};

export interface CartCourseItem {
  type: 'course';
  id: string;
  title: string;
  price: number;
  quantity: number;
  image_url?: string | null;
}

export interface CartTicketItem {
  type: 'ticket';
  id: string;
  eventId: string;
  eventTitle: string;
  sectionId?: string;
  sectionName?: string;
  seatNumber?: string;
  price: number;
  quantity: number;
}

export type CartItem = CartCourseItem | CartTicketItem;

export interface ModuleWithLessons extends Module {
  lessons: Lesson[];
}

export interface CourseWithModules extends Course {
  modules: ModuleWithLessons[];
}

export interface EnrollmentWithCourse extends Enrollment {
  course: Course;
}
