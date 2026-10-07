/*
  # LMS Migration: additional columns required to mirror Firestore schema

  Adds columns that exist in the Firestore data model (lib/firebase/firestore.ts)
  but were missing from the original Supabase schema, so that the LMS
  (courses/modules/lessons/profiles) can be fully served from Supabase.
*/

-- profiles.total_points (gamification points used in /lumen)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'total_points'
  ) THEN
    ALTER TABLE profiles ADD COLUMN total_points integer DEFAULT 0;
  END IF;
END $$;

-- courses.instructor_id (FK to auth.users, used to scope instructor dashboard)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'courses' AND column_name = 'instructor_id'
  ) THEN
    ALTER TABLE courses ADD COLUMN instructor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_courses_instructor ON courses(instructor_id);

-- enrollments.is_approved (instructor approval gate for synchronous sessions)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'enrollments' AND column_name = 'is_approved'
  ) THEN
    ALTER TABLE enrollments ADD COLUMN is_approved boolean DEFAULT false;
  END IF;
END $$;

-- lessons: extra columns used by the richer Firestore lesson model
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lessons' AND column_name = 'embed_code') THEN
    ALTER TABLE lessons ADD COLUMN embed_code text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lessons' AND column_name = 'attachments') THEN
    ALTER TABLE lessons ADD COLUMN attachments jsonb DEFAULT '[]'::jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lessons' AND column_name = 'meet_url') THEN
    ALTER TABLE lessons ADD COLUMN meet_url text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lessons' AND column_name = 'session_datetime') THEN
    ALTER TABLE lessons ADD COLUMN session_datetime timestamptz;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lessons' AND column_name = 'points') THEN
    ALTER TABLE lessons ADD COLUMN points int;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lessons' AND column_name = 'exam_questions') THEN
    ALTER TABLE lessons ADD COLUMN exam_questions jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lessons' AND column_name = 'exam_passing_score') THEN
    ALTER TABLE lessons ADD COLUMN exam_passing_score int;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lessons' AND column_name = 'exam_allow_retry') THEN
    ALTER TABLE lessons ADD COLUMN exam_allow_retry boolean;
  END IF;
END $$;

-- lessons.type: Firestore allows 'sincronica', 'interactive', 'examen' in
-- addition to the original enum values. Widen the column to text so the
-- app can use these values without enum migrations being a blocker.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'lessons' AND column_name = 'type' AND data_type = 'USER-DEFINED'
  ) THEN
    ALTER TABLE lessons ALTER COLUMN type TYPE text;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_enrollments_approved ON enrollments(is_approved);
