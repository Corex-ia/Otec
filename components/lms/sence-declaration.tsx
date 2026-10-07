'use client';

import { useState } from 'react';
import { Shield, TriangleAlert as AlertTriangle, FileText, SquareCheck as CheckSquare, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { saveSenceDeclaration } from '@/lib/firebase/firestore';

interface Props {
  lessonTitle: string;
  courseTitle: string;
  sessionDatetime?: string | null;
  userId?: string;
  courseId?: string;
  lessonId?: string;
  onAccept: () => void;
  onCancel: () => void;
}

export function SenceDeclaration({ lessonTitle, courseTitle, sessionDatetime, userId, courseId, lessonId, onAccept, onCancel }: Props) {
  const [checked, setChecked] = useState(false);

  const handleAccept = async () => {
    if (userId && courseId && lessonId) {
      saveSenceDeclaration(userId, courseId, lessonId).catch(() => {});
    }
    onAccept();
  };

  const formattedDate = sessionDatetime
    ? new Date(sessionDatetime).toLocaleDateString('es-CL', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : new Date().toLocaleDateString('es-CL', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        <div className="bg-blue-700 px-6 py-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-base leading-tight">Declaracion Jurada de Asistencia</h2>
            <p className="text-blue-200 text-xs mt-0.5">Franquicia Tributaria SENCE — Requerimiento Legal</p>
          </div>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
            <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-amber-800 text-sm leading-relaxed">
              Para que tu empleador pueda acceder a la Franquicia Tributaria SENCE, debes declarar formalmente tu asistencia a esta sesion.
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 space-y-2">
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-slate-500 text-[11px] uppercase tracking-wide font-medium mb-0.5">Sesion</p>
                <p className="text-slate-800 font-semibold">{lessonTitle}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-slate-500 text-[11px] uppercase tracking-wide font-medium mb-0.5">Curso</p>
                <p className="text-slate-800 font-semibold">{courseTitle}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-slate-500 text-[11px] uppercase tracking-wide font-medium mb-0.5">Fecha y hora</p>
                <p className="text-slate-800 font-semibold capitalize">{formattedDate}</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setChecked((v) => !v)}
            className="w-full flex items-start gap-3 p-4 rounded-xl border-2 transition-all text-left cursor-pointer select-none"
            style={{
              borderColor: checked ? '#1d4ed8' : '#e2e8f0',
              backgroundColor: checked ? '#eff6ff' : '#ffffff',
            }}
          >
            <div className="flex-shrink-0 mt-0.5">
              {checked ? (
                <CheckSquare className="h-5 w-5 text-blue-700" />
              ) : (
                <Square className="h-5 w-5 text-slate-400" />
              )}
            </div>
            <p className="text-sm leading-relaxed" style={{ color: checked ? '#1e40af' : '#374151' }}>
              <strong>Declaro bajo juramento</strong> mi asistencia personal y efectiva a esta sesion sincronica, para todos los efectos legales de Franquicia Tributaria contemplados en la Ley N° 19.518 del SENCE.
            </p>
          </button>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button
            className="flex-1 bg-blue-700 hover:bg-blue-800 text-white"
            disabled={!checked}
            onClick={handleAccept}
          >
            <Shield className="h-4 w-4 mr-2" />
            Confirmar y Entrar
          </Button>
        </div>
      </div>
    </div>
  );
}
