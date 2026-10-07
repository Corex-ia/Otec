// SENCE e-learning integration — Registro de Asistencia (Redirección)
// Docs: https://sence.gob.cl/organismos/control-e-learning-otec
//
// Flujo:
//   1. OTEC POST → sistemas.sence.cl/rce/Registro/IniciarSesion
//   2. Alumno autentica con ClaveÚnica en SENCE
//   3. SENCE GET → [RetornoURL configurada en SENCE] con IdSesionSence + RunAlumno
//   4. OTEC POST → sistemas.sence.cl/rce/Registro/CerrarSesion al salir

export const SENCE_CONFIG = {
  // ── Completar con datos reales de la OTEC ────────────────────────────────
  rutOtec:            process.env.SENCE_RUT_OTEC             ?? 'PENDIENTE',
  token:              process.env.SENCE_TOKEN                ?? 'PENDIENTE',
  lineaCapacitacion:  parseInt(process.env.SENCE_LINEA_CAPACITACION ?? '3', 10),
  // ─────────────────────────────────────────────────────────────────────────
  env: (process.env.SENCE_ENV ?? 'test') as 'test' | 'production',
};

const BASE_URLS = {
  test:       'https://sistemastest.sence.cl/rce',
  production: 'https://sistemas.sence.cl/rce',
};

export function senceBaseUrl() {
  return BASE_URLS[SENCE_CONFIG.env];
}

export function isPending() {
  return SENCE_CONFIG.rutOtec === 'PENDIENTE' || SENCE_CONFIG.token === 'PENDIENTE';
}

/** Parámetros para el formulario POST → IniciarSesion */
export function buildIniciarForm(params: {
  codSence: string;    // Código SENCE del curso (asignado por SENCE al aprobar)
  codigoCurso: string; // ID único de esta sesión (≥7 chars, lo generamos nosotros)
}): { url: string; fields: Record<string, string> } {
  return {
    url: `${senceBaseUrl()}/Registro/IniciarSesion`,
    fields: {
      RutOtec:           SENCE_CONFIG.rutOtec,
      Token:             SENCE_CONFIG.token,
      CodSence:          params.codSence,
      CodigoCurso:       params.codigoCurso,
      LineaCapacitacion: String(SENCE_CONFIG.lineaCapacitacion),
    },
  };
}

/** Cierra la sesión en SENCE. Llamar al salir del aula virtual. */
export async function cerrarSesionSence(params: {
  codSence: string;
  idSesionSence: string;
}): Promise<{ ok: boolean; error?: string }> {
  const url = `${senceBaseUrl()}/Registro/CerrarSesion`;
  const body = new URLSearchParams({
    RutOtec:       SENCE_CONFIG.rutOtec,
    Token:         SENCE_CONFIG.token,
    CodSence:      params.codSence,
    IdSesionSence: params.idSesionSence,
  });

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
    if (!res.ok) {
      return { ok: false, error: `HTTP ${res.status}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

/** Genera un HTML de auto-submit para redirigir al alumno a SENCE */
export function buildAutoSubmitHtml(formUrl: string, fields: Record<string, string>): string {
  const inputs = Object.entries(fields)
    .map(([name, value]) => `<input type="hidden" name="${name}" value="${value}">`)
    .join('\n    ');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Redirigiendo a SENCE...</title>
  <style>
    body { font-family: system-ui, sans-serif; display: flex; align-items: center;
           justify-content: center; min-height: 100vh; margin: 0;
           background: #f0f4ff; color: #1e293b; }
    .card { background: white; border-radius: 16px; padding: 2.5rem 3rem;
            box-shadow: 0 4px 24px rgba(0,0,0,.08); text-align: center; max-width: 380px; }
    .spinner { width: 40px; height: 40px; border: 3px solid #e2e8f0;
               border-top-color: #1d4ed8; border-radius: 50%;
               animation: spin .8s linear infinite; margin: 0 auto 1.25rem; }
    @keyframes spin { to { transform: rotate(360deg) } }
    p { font-size: .9rem; color: #64748b; line-height: 1.6; }
    strong { color: #1e293b; }
  </style>
</head>
<body>
  <div class="card">
    <div class="spinner"></div>
    <strong>Conectando con SENCE</strong>
    <p>Serás redirigido al portal SENCE para autenticar tu asistencia con <strong>ClaveÚnica</strong>.</p>
    <p style="font-size:.75rem;margin-top:1rem;color:#94a3b8">
      ${SENCE_CONFIG.env === 'test' ? '⚠️ Ambiente de pruebas' : ''}
    </p>
  </div>
  <form id="f" method="POST" action="${formUrl}" style="display:none">
    ${inputs}
  </form>
  <script>document.getElementById('f').submit();</script>
</body>
</html>`;
}
