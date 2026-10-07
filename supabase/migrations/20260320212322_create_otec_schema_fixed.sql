/*
  # OTEC Platform Database Schema
  
  ## Overview
  Complete database schema for OTEC (Organismo Técnico de Capacitación) platform in Chile.
  Includes LMS, CRM, Events, E-commerce, and Course Management.
  
  ## 1. New Tables
  
  ### User & Company Management
  - `profiles` - Extended user profiles (name, role, avatar, phone)
  - `companies` - Client companies with RUT, contact info, address
  
  ### Course & Content Management
  - `courses` - Training courses (title, description, price, SENCE code, modality)
  - `modules` - Course modules with ordering
  - `lessons` - Course content (video, H5P, quiz, text)
  - `quiz_questions` - Multiple choice questions for quizzes
  - `quiz_answers` - Answer options for questions
  - `quiz_attempts` - User quiz attempt history
  
  ### Enrollment & Progress
  - `enrollments` - Individual course enrollments
  - `company_enrollments` - Bulk company enrollments
  - `lesson_progress` - Video position, completion tracking
  - `certificates` - Generated certificates with PDF URLs
  
  ### CRM System
  - `deals` - Sales opportunities with pipeline stages
  - `tasks` - Task management with assignments
  - `notes` - Polymorphic notes (company, deal, user)
  
  ### Events & Ticketing
  - `events` - Event listings with dates, location, capacity
  - `ticket_sections` - Seating sections for events
  - `orders` - Purchase orders with payment status
  - `order_items` - Order line items (courses or tickets)
  - `tickets` - Individual tickets with seat assignments
  
  ## 2. Security
  - Row Level Security (RLS) enabled on all tables
  - Policies for authenticated users based on roles
  - Admin-only access for sensitive operations
  - Users can only access their own data unless admin
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types (idempotent: create if not exists, then add any missing values)
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'ejecutivo', 'contable', 'ejecutor', 'vendedor', 'student');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
-- Ensure all values exist in case the type was created with a subset
DO $$ BEGIN ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'ejecutivo'; EXCEPTION WHEN others THEN null; END $$;
DO $$ BEGIN ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'contable';  EXCEPTION WHEN others THEN null; END $$;
DO $$ BEGIN ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'ejecutor';  EXCEPTION WHEN others THEN null; END $$;
DO $$ BEGIN ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'vendedor';  EXCEPTION WHEN others THEN null; END $$;
DO $$ BEGIN ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'student';   EXCEPTION WHEN others THEN null; END $$;
DO $$ BEGIN ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'admin';     EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE course_modality AS ENUM ('presencial', 'online', 'hibrido');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN ALTER TYPE course_modality ADD VALUE IF NOT EXISTS 'presencial'; EXCEPTION WHEN others THEN null; END $$;
DO $$ BEGIN ALTER TYPE course_modality ADD VALUE IF NOT EXISTS 'online';     EXCEPTION WHEN others THEN null; END $$;
DO $$ BEGIN ALTER TYPE course_modality ADD VALUE IF NOT EXISTS 'hibrido';    EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE lesson_type AS ENUM ('video', 'h5p', 'quiz', 'text');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN ALTER TYPE lesson_type ADD VALUE IF NOT EXISTS 'video'; EXCEPTION WHEN others THEN null; END $$;
DO $$ BEGIN ALTER TYPE lesson_type ADD VALUE IF NOT EXISTS 'h5p';   EXCEPTION WHEN others THEN null; END $$;
DO $$ BEGIN ALTER TYPE lesson_type ADD VALUE IF NOT EXISTS 'quiz';  EXCEPTION WHEN others THEN null; END $$;
DO $$ BEGIN ALTER TYPE lesson_type ADD VALUE IF NOT EXISTS 'text';  EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE deal_status AS ENUM ('negociacion', 'contrato', 'ejecucion', 'facturado', 'cerrado');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN ALTER TYPE deal_status ADD VALUE IF NOT EXISTS 'negociacion'; EXCEPTION WHEN others THEN null; END $$;
DO $$ BEGIN ALTER TYPE deal_status ADD VALUE IF NOT EXISTS 'contrato';    EXCEPTION WHEN others THEN null; END $$;
DO $$ BEGIN ALTER TYPE deal_status ADD VALUE IF NOT EXISTS 'ejecucion';   EXCEPTION WHEN others THEN null; END $$;
DO $$ BEGIN ALTER TYPE deal_status ADD VALUE IF NOT EXISTS 'facturado';   EXCEPTION WHEN others THEN null; END $$;
DO $$ BEGIN ALTER TYPE deal_status ADD VALUE IF NOT EXISTS 'cerrado';     EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE order_status AS ENUM ('pending', 'processing', 'completed', 'cancelled', 'refunded');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'pending';    EXCEPTION WHEN others THEN null; END $$;
DO $$ BEGIN ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'processing'; EXCEPTION WHEN others THEN null; END $$;
DO $$ BEGIN ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'completed';  EXCEPTION WHEN others THEN null; END $$;
DO $$ BEGIN ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'cancelled';  EXCEPTION WHEN others THEN null; END $$;
DO $$ BEGIN ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'refunded';   EXCEPTION WHEN others THEN null; END $$;

-- Companies table (create first as it's referenced by profiles)
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  rut text UNIQUE NOT NULL,
  email text,
  phone text,
  address text,
  city text,
  region text,
  contact_name text,
  contact_email text,
  contact_phone text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role user_role DEFAULT 'student',
  avatar_url text,
  phone text,
  company_id uuid REFERENCES companies(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role::text = 'admin'
    )
  );

CREATE POLICY "Authenticated users can view companies"
  ON companies FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin and ejecutivo can manage companies"
  ON companies FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role::text IN ('admin', 'ejecutivo', 'vendedor')
    )
  );

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  short_description text,
  image_url text,
  price decimal(10,2) DEFAULT 0,
  duration_hours int DEFAULT 0,
  modality course_modality DEFAULT 'online',
  area text,
  sence_code text,
  is_sence boolean DEFAULT false,
  is_published boolean DEFAULT false,
  instructor_name text,
  instructor_bio text,
  instructor_avatar text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published courses"
  ON courses FOR SELECT
  TO authenticated, anon
  USING (is_published = true);

CREATE POLICY "Admin can manage all courses"
  ON courses FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role::text = 'admin'
    )
  );

-- Modules table
CREATE TABLE IF NOT EXISTS modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  order_index int NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view modules of published courses"
  ON modules FOR SELECT
  TO authenticated, anon
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = modules.course_id AND courses.is_published = true
    )
  );

CREATE POLICY "Admin can manage modules"
  ON modules FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role::text = 'admin'
    )
  );

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  type lesson_type NOT NULL,
  order_index int NOT NULL,
  video_url text,
  duration_seconds int DEFAULT 0,
  h5p_content_url text,
  text_content text,
  is_free boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view lessons of published courses"
  ON lessons FOR SELECT
  TO authenticated, anon
  USING (
    EXISTS (
      SELECT 1 FROM modules m
      JOIN courses c ON c.id = m.course_id
      WHERE m.id = lessons.module_id AND c.is_published = true
    )
  );

CREATE POLICY "Admin can manage lessons"
  ON lessons FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role::text = 'admin'
    )
  );

-- Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  progress decimal(5,2) DEFAULT 0,
  UNIQUE(user_id, course_id)
);

ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own enrollments"
  ON enrollments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admin can view all enrollments"
  ON enrollments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role::text = 'admin'
    )
  );

CREATE POLICY "System can create enrollments"
  ON enrollments FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Quiz questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  points int DEFAULT 1,
  order_index int NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enrolled users can view quiz questions"
  ON quiz_questions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lessons l
      JOIN modules m ON m.id = l.module_id
      JOIN enrollments e ON e.course_id = m.course_id
      WHERE l.id = quiz_questions.lesson_id AND e.user_id = auth.uid()
    )
  );

-- Quiz answers table
CREATE TABLE IF NOT EXISTS quiz_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  answer_text text NOT NULL,
  is_correct boolean DEFAULT false,
  order_index int NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enrolled users can view quiz answers"
  ON quiz_answers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quiz_questions q
      JOIN lessons l ON l.id = q.lesson_id
      JOIN modules m ON m.id = l.module_id
      JOIN enrollments e ON e.course_id = m.course_id
      WHERE q.id = quiz_answers.question_id AND e.user_id = auth.uid()
    )
  );

-- Quiz attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  score int DEFAULT 0,
  max_score int DEFAULT 0,
  answers jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quiz attempts"
  ON quiz_attempts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create quiz attempts"
  ON quiz_attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Company enrollments table
CREATE TABLE IF NOT EXISTS company_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  seats_purchased int NOT NULL,
  seats_used int DEFAULT 0,
  price_per_seat decimal(10,2) DEFAULT 0,
  enrolled_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

ALTER TABLE company_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company members can view company enrollments"
  ON company_enrollments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND company_id = company_enrollments.company_id
    )
  );

CREATE POLICY "Admin can manage company enrollments"
  ON company_enrollments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role::text = 'admin'
    )
  );

-- Lesson progress table
CREATE TABLE IF NOT EXISTS lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  last_position_seconds int DEFAULT 0,
  completed_at timestamptz,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own lesson progress"
  ON lesson_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lesson progress"
  ON lesson_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lesson progress"
  ON lesson_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  certificate_url text NOT NULL,
  issued_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id)
);

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own certificates"
  ON certificates FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can create certificates"
  ON certificates FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Deals table (CRM)
CREATE TABLE IF NOT EXISTS deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  company_id uuid REFERENCES companies(id) ON DELETE SET NULL,
  value decimal(10,2) DEFAULT 0,
  status deal_status DEFAULT 'negociacion',
  assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  expected_close_date date,
  closed_at timestamptz,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "CRM users can view deals"
  ON deals FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role::text IN ('admin', 'ejecutivo', 'vendedor')
    )
  );

CREATE POLICY "CRM users can manage deals"
  ON deals FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role::text IN ('admin', 'ejecutivo', 'vendedor')
    )
  );

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  deal_id uuid REFERENCES deals(id) ON DELETE CASCADE,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  due_date date,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view assigned tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (
    auth.uid() = assigned_to OR
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role::text IN ('admin', 'ejecutivo')
    )
  );

CREATE POLICY "Users can create tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role::text IN ('admin', 'ejecutivo', 'vendedor')
    )
  );

CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = assigned_to OR
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role::text IN ('admin', 'ejecutivo')
    )
  );

-- Notes table (polymorphic)
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  deal_id uuid REFERENCES deals(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view notes"
  ON notes FOR SELECT
  TO authenticated
  USING (
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role::text IN ('admin', 'ejecutivo', 'vendedor')
    )
  );

CREATE POLICY "Users can create notes"
  ON notes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own notes"
  ON notes FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_date timestamptz NOT NULL,
  end_date timestamptz,
  location text,
  address text,
  capacity int DEFAULT 0,
  ticket_price decimal(10,2) DEFAULT 0,
  has_seating boolean DEFAULT false,
  image_url text,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published events"
  ON events FOR SELECT
  TO authenticated, anon
  USING (is_published = true);

CREATE POLICY "Admin can manage events"
  ON events FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role::text = 'admin'
    )
  );

-- Ticket sections table
CREATE TABLE IF NOT EXISTS ticket_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name text NOT NULL,
  price decimal(10,2) DEFAULT 0,
  capacity int DEFAULT 0,
  seats_available int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ticket_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view ticket sections"
  ON ticket_sections FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admin can manage ticket sections"
  ON ticket_sections FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role::text = 'admin'
    )
  );

-- Orders table (create before tickets)
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total decimal(10,2) DEFAULT 0,
  status order_status DEFAULT 'pending',
  payment_method text,
  webpay_token text,
  webpay_transaction_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (true);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  item_type text NOT NULL,
  course_id uuid REFERENCES courses(id) ON DELETE SET NULL,
  event_id uuid REFERENCES events(id) ON DELETE SET NULL,
  section_id uuid REFERENCES ticket_sections(id) ON DELETE SET NULL,
  seat_number text,
  quantity int DEFAULT 1,
  price decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "System can create order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Tickets table (create after orders)
CREATE TABLE IF NOT EXISTS tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  section_id uuid REFERENCES ticket_sections(id) ON DELETE SET NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  seat_number text,
  qr_code text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tickets"
  ON tickets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can create tickets"
  ON tickets FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Ensure columns exist on pre-existing tables (idempotent for incremental deploys)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company_id            uuid REFERENCES companies(id) ON DELETE SET NULL;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone                 text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url            text;

ALTER TABLE courses  ADD COLUMN IF NOT EXISTS instructor_id         uuid REFERENCES profiles(id) ON DELETE SET NULL;
ALTER TABLE courses  ADD COLUMN IF NOT EXISTS area                  text;
ALTER TABLE courses  ADD COLUMN IF NOT EXISTS sence_code            text;
ALTER TABLE courses  ADD COLUMN IF NOT EXISTS is_sence              boolean DEFAULT false;
ALTER TABLE courses  ADD COLUMN IF NOT EXISTS short_description     text;
ALTER TABLE courses  ADD COLUMN IF NOT EXISTS duration_hours        int DEFAULT 0;
ALTER TABLE courses  ADD COLUMN IF NOT EXISTS modality              text DEFAULT 'online';
ALTER TABLE courses  ADD COLUMN IF NOT EXISTS instructor_name       text;
ALTER TABLE courses  ADD COLUMN IF NOT EXISTS instructor_bio        text;
ALTER TABLE courses  ADD COLUMN IF NOT EXISTS instructor_avatar     text;
ALTER TABLE courses  ADD COLUMN IF NOT EXISTS is_published          boolean DEFAULT false;
ALTER TABLE courses  ADD COLUMN IF NOT EXISTS price                 decimal(10,2) DEFAULT 0;

ALTER TABLE lessons  ADD COLUMN IF NOT EXISTS video_url             text;
ALTER TABLE lessons  ADD COLUMN IF NOT EXISTS duration_seconds      int DEFAULT 0;
ALTER TABLE lessons  ADD COLUMN IF NOT EXISTS h5p_content_url       text;
ALTER TABLE lessons  ADD COLUMN IF NOT EXISTS text_content          text;
ALTER TABLE lessons  ADD COLUMN IF NOT EXISTS is_free               boolean DEFAULT false;
ALTER TABLE lessons  ADD COLUMN IF NOT EXISTS order_index           int DEFAULT 0;

ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS progress           decimal(5,2) DEFAULT 0;
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS completed_at       timestamptz;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_company ON profiles(company_id);
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published);
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_modules_course ON modules(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_module ON lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson ON lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_deals_status ON deals(status);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_user ON tickets(user_id);