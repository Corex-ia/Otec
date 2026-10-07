-- SENCE integration: session tracking + cod_sence per course
--
-- sence_sessions: one row per alumno-session.
--   id_sesion_alumno  = CodigoCurso que enviamos a SENCE (≥7 chars, UUID)
--   id_sesion_sence   = ID que SENCE nos devuelve en el retorno (necesario para CerrarSesion)
--   run_alumno        = RUT validado por SENCE vía ClaveÚnica

CREATE TABLE IF NOT EXISTS sence_sessions (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  id_sesion_alumno  text        UNIQUE NOT NULL,
  id_sesion_sence   text,
  user_id           uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  course_id         text        NOT NULL,
  lesson_id         text        NOT NULL,
  run_alumno        text,
  cod_sence         text        NOT NULL,
  status            text        NOT NULL DEFAULT 'initiated',
    -- initiated | active | closed | error | aborted
  error_code        text,
  fecha_hora_inicio timestamptz,
  fecha_hora_cierre timestamptz,
  zona_horaria      text,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sence_sessions_user_id_idx    ON sence_sessions(user_id);
CREATE INDEX IF NOT EXISTS sence_sessions_course_id_idx  ON sence_sessions(course_id);
CREATE INDEX IF NOT EXISTS sence_sessions_id_alumno_idx  ON sence_sessions(id_sesion_alumno);

ALTER TABLE sence_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sence sessions"
  ON sence_sessions FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Updated_at trigger
DROP TRIGGER IF EXISTS sence_sessions_set_updated_at ON sence_sessions;
CREATE TRIGGER sence_sessions_set_updated_at
  BEFORE UPDATE ON sence_sessions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Add SENCE fields to courses table
ALTER TABLE courses ADD COLUMN IF NOT EXISTS cod_sence          text;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS linea_capacitacion int;
