'use client';

import { useState } from 'react';
import { Star, ClipboardList, CircleCheck as CheckCircle2, TriangleAlert as AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { submitSenceSurvey } from '@/lib/firebase/firestore';
import { toast } from 'sonner';

interface Props {
  userId: string;
  courseId: string;
  courseTitle: string;
  onCompleted: () => void;
  onSkip?: () => void;
  mandatory?: boolean;
}

const CRITERIA = [
  {
    key: 'relator' as const,
    label: 'Relator / Instructor',
    description: 'Calidad pedagogica, dominio del tema y capacidad de comunicacion',
  },
  {
    key: 'contenidos' as const,
    label: 'Contenidos del Curso',
    description: 'Relevancia, profundidad y actualizacion de los contenidos',
  },
  {
    key: 'infraestructura' as const,
    label: 'Infraestructura Virtual',
    description: 'Plataforma, accesibilidad y recursos tecnicos disponibles',
  },
  {
    key: 'utilidad' as const,
    label: 'Utilidad y Aplicabilidad',
    description: 'Aplicacion practica en tu trabajo y pertinencia del aprendizaje',
  },
] as const;

const LABELS: Record<number, string> = {
  1: 'Muy deficiente',
  2: 'Deficiente',
  3: 'Aceptable',
  4: 'Bueno',
  5: 'Excelente',
};

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110 focus:outline-none"
        >
          <Star
            className="h-7 w-7 transition-colors"
            fill={star <= display ? '#f59e0b' : 'none'}
            stroke={star <= display ? '#f59e0b' : '#94a3b8'}
            strokeWidth={1.5}
          />
        </button>
      ))}
      {display > 0 && (
        <span className="ml-2 text-sm font-medium text-slate-600">{LABELS[display]}</span>
      )}
    </div>
  );
}

export function SenceSurvey({ userId, courseId, courseTitle, onCompleted, onSkip, mandatory = true }: Props) {
  const [ratings, setRatings] = useState<Record<string, number>>({
    relator: 0,
    contenidos: 0,
    infraestructura: 0,
    utilidad: 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const allRated = Object.values(ratings).every((v) => v > 0);

  const handleSubmit = async () => {
    if (!allRated) return;
    setSubmitting(true);
    try {
      await submitSenceSurvey(userId, courseId, {
        relator: ratings.relator,
        contenidos: ratings.contenidos,
        infraestructura: ratings.infraestructura,
        utilidad: ratings.utilidad,
      });
      setSubmitted(true);
      toast.success('Encuesta enviada. Gracias por tu evaluacion.');
      setTimeout(() => onCompleted(), 1800);
    } catch {
      toast.error('Error al enviar la encuesta. Intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Encuesta Enviada</h2>
          <p className="text-slate-500 text-sm">
            Tu evaluacion ha sido registrada correctamente en el sistema SENCE.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full my-4 overflow-hidden">
        <div className="bg-slate-800 px-6 py-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <ClipboardList className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-base leading-tight">Encuesta de Satisfaccion SENCE</h2>
            <p className="text-slate-400 text-xs mt-0.5">Evaluacion obligatoria para Franquicia Tributaria</p>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          {mandatory && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2.5">
              <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-amber-800 text-xs leading-relaxed">
                Esta encuesta es <strong>obligatoria</strong> para certificar la capacitacion ante SENCE. Tu certificado estara disponible una vez completada.
              </p>
            </div>
          )}

          <div>
            <p className="text-slate-500 text-xs uppercase tracking-wide font-medium mb-0.5">Curso evaluado</p>
            <p className="font-semibold text-slate-800">{courseTitle}</p>
          </div>

          <div className="space-y-5">
            {CRITERIA.map((criterion) => (
              <div key={criterion.key} className="space-y-1.5">
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{criterion.label}</p>
                  <p className="text-slate-500 text-xs">{criterion.description}</p>
                </div>
                <StarRating
                  value={ratings[criterion.key]}
                  onChange={(v) => setRatings((prev) => ({ ...prev, [criterion.key]: v }))}
                />
              </div>
            ))}
          </div>

          {!allRated && (
            <p className="text-center text-xs text-slate-400">
              Debes calificar todos los criterios para poder enviar la encuesta
            </p>
          )}
        </div>

        <div className="px-6 pb-6 flex gap-3">
          {!mandatory && onSkip && (
            <Button variant="outline" className="flex-1" onClick={onSkip}>
              Omitir
            </Button>
          )}
          <Button
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white"
            disabled={!allRated || submitting}
            onClick={handleSubmit}
          >
            {submitting ? 'Enviando...' : 'Enviar Evaluacion'}
          </Button>
        </div>
      </div>
    </div>
  );
}
