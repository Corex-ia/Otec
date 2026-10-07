/*
  # Agregar tiempos auditables de reunion a meet_attendance

  ## Descripcion
  Separa el tiempo de pagina del tiempo efectivo de conexion a la reunion Jitsi.
  SENCE audita el tiempo real en la reunion, no el tiempo en la pagina de la plataforma.

  ## Cambios en tablas existentes
  - `meet_attendance`: Se agregan columnas para registrar:
    - `join_at`: Cuando el alumno hizo clic en "Abrir sala" (inicia la reunion)
    - `leave_at`: Cuando el alumno cerro la ventana de Jitsi
    - `meet_duration_seconds`: Duracion efectiva en la reunion (leave_at - join_at)
    - `page_duration_seconds`: Tiempo total en la pagina de clase

  ## Notas
  - `clicked_at` existente se mantiene como retrocompatibilidad
  - `meet_duration_seconds` es el campo auditable para SENCE
  - `page_duration_seconds` puede ser mayor ya que incluye tiempo antes/despues de unirse
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'meet_attendance' AND column_name = 'join_at'
  ) THEN
    ALTER TABLE meet_attendance ADD COLUMN join_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'meet_attendance' AND column_name = 'leave_at'
  ) THEN
    ALTER TABLE meet_attendance ADD COLUMN leave_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'meet_attendance' AND column_name = 'meet_duration_seconds'
  ) THEN
    ALTER TABLE meet_attendance ADD COLUMN meet_duration_seconds integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'meet_attendance' AND column_name = 'page_duration_seconds'
  ) THEN
    ALTER TABLE meet_attendance ADD COLUMN page_duration_seconds integer;
  END IF;
END $$;
