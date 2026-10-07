'use client';

// Guarda de sesión SENCE para clases sincrónicas.
//
// Si el curso tiene cod_sence → redirige al alumno a SENCE (ClaveÚnica).
// Si no → muestra la declaración jurada interna (fallback para cursos sin SENCE).

import { useState } from 'react';
import { Shield, ExternalLink, TriangleAlert as AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SenceDeclaration } from './sence-declaration';
import { useAuthStore } from '@/lib/stores/auth-store';

interface Props {
  lessonTitle: string;
  courseTitle: string;
  courseId: string;
  lessonId: string;
  codSence?: string | null;       // Si está presente → flujo SENCE real
  sessionDatetime?: string | null;
  onAccept: () => void;
  onCancel: () => void;
}

export function SenceSessionGuard({
  lessonTitle,
  courseTitle,
  courseId,
  lessonId,
  codSence,
  sessionDatetime,
  onAccept,
  onCancel,
}: Props) {
  const user = useAuthStore((s) => s.user);
  const [redirecting, setRedirecting] = useState(false);

  // Curso sin SENCE → declaración jurada interna
  if (!codSence) {
    return (
      <SenceDeclaration
        lessonTitle={lessonTitle}
        courseTitle={courseTitle}
        sessionDatetime={sessionDatetime}
        userId={user?.id}
        courseId={courseId}
        lessonId={lessonId}
        onAccept={onAccept}
        onCancel={onCancel}
      />
    );
  }

  // Curso con SENCE → redirigir al portal oficial
  const handleIniciarSence = () => {
    setRedirecting(true);
    // Guardamos el access_token en sessionStorage para que la ruta /api/sence/iniciar
    // pueda autenticar al usuario (Next.js middleware no tiene cookie SSR en este flujo)
    const token = (user as any)?.access_token ?? '';
    const url = `/api/sence/iniciar?courseId=${courseId}&lessonId=${lessonId}`;

    // Navegamos directamente; el route handler devuelve HTML auto-submit
    window.location.href = url;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">

        <div className="bg-blue-700 px-6 py-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-base leading-tight">
              Registro de Asistencia SENCE
            </h2>
            <p className="text-blue-200 text-xs mt-0.5">
              Franquicia Tributaria — Autenticación con ClaveÚnica
            </p>
          </div>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
            <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-amber-800 text-sm leading-relaxed">
              Este curso usa <strong>Franquicia Tributaria SENCE</strong>.
              Para acreditar tu asistencia, serás redirigido al portal oficial
              de SENCE donde deberás autenticarte con tu <strong>ClaveÚnica</strong>.
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
            <div>
              <p className="text-slate-400 text-[11px] uppercase tracking-wide font-medium">Sesión</p>
              <p className="font-semibold text-slate-800">{lessonTitle}</p>
            </div>
            <div>
              <p className="text-slate-400 text-[11px] uppercase tracking-wide font-medium">Curso</p>
              <p className="font-semibold text-slate-800">{courseTitle}</p>
            </div>
            <div>
              <p className="text-slate-400 text-[11px] uppercase tracking-wide font-medium">Código SENCE</p>
              <p className="font-mono text-slate-700 text-xs">{codSence}</p>
            </div>
          </div>

          <p className="text-slate-500 text-xs leading-relaxed">
            El portal SENCE verificará tu identidad y registrará el inicio de sesión.
            Una vez autenticado, regresarás automáticamente a la clase.
          </p>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onCancel} disabled={redirecting}>
            Cancelar
          </Button>
          <Button
            className="flex-1 bg-blue-700 hover:bg-blue-800 text-white gap-2"
            onClick={handleIniciarSence}
            disabled={redirecting}
          >
            {redirecting ? (
              <>
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Conectando...
              </>
            ) : (
              <>
                <ExternalLink className="h-4 w-4" />
                Autenticar con SENCE
              </>
            )}
          </Button>
        </div>

      </div>
    </div>
  );
}
