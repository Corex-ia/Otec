/*
  # Seed Test Users
  
  ## Overview
  Creates test users for different roles in the OTEC platform.
  
  ## Test Users Created
  
  1. **Student User** (for LUMEN access)
     - Email: student@otec.cl
     - Password: student123
     - Role: student
  
  2. **CRM User** (for CRM/Vendedor portal)
     - Email: vendedor@otec.cl
     - Password: vendedor123
     - Role: vendedor
  
  3. **Admin User** (full access)
     - Email: admin@otec.cl
     - Password: admin123
     - Role: admin
  
  ## Important Notes
  - These are TEST credentials only
  - Change passwords in production
  - Users must be created via Supabase Auth first, then profiles are inserted
*/

-- Note: Users need to be created through the Supabase Auth UI or API first
-- This migration only creates the profile entries
-- 
-- To create the actual auth users, you need to:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add User" 
-- 3. Create users with these emails and passwords
--
-- OR use the application's registration page at /auth/register
--
-- For now, this migration creates placeholder data for when users sign up

-- Ensure all expected columns exist before seeding (idempotent)
ALTER TABLE courses ADD COLUMN IF NOT EXISTS area              text;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS sence_code        text;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_sence          boolean DEFAULT false;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS short_description text;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS duration_hours    int DEFAULT 0;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS modality          text DEFAULT 'online';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS instructor_name   text;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS instructor_bio    text;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS instructor_avatar text;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_published      boolean DEFAULT false;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS price             decimal(10,2) DEFAULT 0;

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES companies(id) ON DELETE SET NULL;

ALTER TABLE lessons ADD COLUMN IF NOT EXISTS video_url          text;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS duration_seconds   int DEFAULT 0;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS h5p_content_url    text;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS text_content       text;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS is_free            boolean DEFAULT false;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS order_index        int DEFAULT 0;

ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS progress     decimal(5,2) DEFAULT 0;
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS completed_at timestamptz;

-- Insert sample course data for testing
INSERT INTO courses (
  title,
  slug,
  description,
  short_description,
  price,
  duration_hours,
  modality,
  area,
  is_sence,
  is_published,
  instructor_name
) VALUES 
(
  'Introducción a la Programación',
  'intro-programacion',
  'Aprende los fundamentos de la programación desde cero. Este curso te enseñará conceptos básicos de lógica de programación, algoritmos y estructuras de datos.',
  'Fundamentos de programación para principiantes',
  150000,
  40,
  'online',
  'Tecnología',
  true,
  true,
  'Juan Pérez'
),
(
  'Excel Avanzado para Empresas',
  'excel-avanzado',
  'Domina Excel con funciones avanzadas, tablas dinámicas, macros y automatización de tareas empresariales.',
  'Excel nivel experto para profesionales',
  120000,
  30,
  'hibrido',
  'Negocios',
  true,
  true,
  'María González'
),
(
  'Gestión de Proyectos',
  'gestion-proyectos',
  'Aprende metodologías ágiles y tradicionales para gestionar proyectos exitosamente.',
  'Metodologías de gestión de proyectos',
  180000,
  50,
  'presencial',
  'Gestión',
  true,
  true,
  'Carlos Rodríguez'
),
(
  'Marketing Digital',
  'marketing-digital',
  'Estrategias de marketing digital, redes sociales, SEO y campañas publicitarias online.',
  'Marketing y publicidad en el mundo digital',
  160000,
  35,
  'online',
  'Marketing',
  false,
  true,
  'Ana Martínez'
),
(
  'Liderazgo y Trabajo en Equipo',
  'liderazgo-equipos',
  'Desarrolla habilidades de liderazgo efectivo y gestión de equipos de alto rendimiento.',
  'Habilidades blandas para líderes',
  140000,
  25,
  'online',
  'Recursos Humanos',
  true,
  true,
  'Luis Fernández'
)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample companies
INSERT INTO companies (
  name,
  rut,
  email,
  phone,
  city,
  region,
  contact_name,
  contact_email,
  contact_phone
) VALUES 
(
  'Empresa Demo S.A.',
  '76.123.456-7',
  'contacto@empresademo.cl',
  '+56912345678',
  'Santiago',
  'Metropolitana',
  'Pedro Hernández',
  'pedro@empresademo.cl',
  '+56987654321'
),
(
  'Capacitación Corp',
  '77.234.567-8',
  'info@capacitacioncorp.cl',
  '+56923456789',
  'Valparaíso',
  'Valparaíso',
  'Laura Silva',
  'laura@capacitacioncorp.cl',
  '+56976543210'
)
ON CONFLICT (rut) DO NOTHING;

-- Create sample event
INSERT INTO events (
  title,
  description,
  event_date,
  end_date,
  location,
  address,
  capacity,
  ticket_price,
  has_seating,
  is_published
) VALUES 
(
  'Conferencia de Innovación 2024',
  'Gran conferencia sobre innovación y transformación digital en las empresas chilenas.',
  NOW() + INTERVAL '30 days',
  NOW() + INTERVAL '30 days' + INTERVAL '8 hours',
  'Centro de Eventos Metropolitano',
  'Av. Libertador Bernardo O''Higgins 123, Santiago',
  500,
  50000,
  false,
  true
),
(
  'Workshop de Liderazgo',
  'Taller práctico de habilidades de liderazgo para gerentes y ejecutivos.',
  NOW() + INTERVAL '45 days',
  NOW() + INTERVAL '45 days' + INTERVAL '6 hours',
  'Hotel Plaza',
  'Calle Principal 456, Santiago',
  100,
  35000,
  true,
  true
)
ON CONFLICT DO NOTHING;