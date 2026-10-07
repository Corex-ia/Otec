/*
  # Instructor Profile Extensions and Meet Attendance

  ## Summary
  Adds two new tables and extends the profiles table for the instructor dashboard.

  ## Changes

  ### 1. Extended profiles table
  - `instructor_bio` (text) — Short instructor biography
  - `instructor_signature_url` (text) — URL to digital signature image

  ### 2. New table: `meet_attendance`
  Tracks when a student clicks the Meet link for a synchronous lesson.
  - `lesson_id` (text) — Firestore lesson document ID
  - `user_id` (uuid, fk → auth.users)
  - `clicked_at` (timestamptz)

  ### 3. New table: `submission_grades`
  Instructor feedback and grades for student task submissions.
  - `lesson_id` (text) — Firestore lesson ID
  - `user_id` (uuid) — Student being graded
  - `instructor_id` (uuid) — Grading instructor
  - `grade` (numeric) — Numeric score
  - `feedback` (text) — Written feedback

  ## Security
  - RLS enabled on both new tables with role-based policies
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'instructor_bio'
  ) THEN
    ALTER TABLE profiles ADD COLUMN instructor_bio text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'instructor_signature_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN instructor_signature_url text;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS meet_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  clicked_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS meet_attendance_lesson_user_idx
  ON meet_attendance (lesson_id, user_id);

ALTER TABLE meet_attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can record own attendance"
  ON meet_attendance FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Students can view own attendance"
  ON meet_attendance FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Instructors and admins can view all attendance"
  ON meet_attendance FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role IN ('instructor', 'admin')
    )
  );

CREATE TABLE IF NOT EXISTS submission_grades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  instructor_id uuid NOT NULL REFERENCES auth.users(id),
  grade numeric(5,2),
  feedback text,
  graded_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS submission_grades_lesson_user_idx
  ON submission_grades (lesson_id, user_id);

ALTER TABLE submission_grades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own grades"
  ON submission_grades FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Instructors can insert grades"
  ON submission_grades FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT auth.uid()) = instructor_id AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role IN ('instructor', 'admin')
    )
  );

CREATE POLICY "Instructors can update their own grades"
  ON submission_grades FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = instructor_id)
  WITH CHECK ((SELECT auth.uid()) = instructor_id);

CREATE POLICY "Instructors can read all grades"
  ON submission_grades FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role IN ('instructor', 'admin')
    )
  );
