'use client';

import { useState } from 'react';
import { LessonDoc, ExamQuestion, saveExamResult, getExamResult } from '@/lib/firebase/firestore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, CircleCheck as CheckCircle2, Circle as XCircle, RefreshCw, Trophy, CircleAlert as AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Props {
  lesson: LessonDoc;
  courseId: string;
  userId: string;
  existingResult?: { score: number; passed: boolean; attempt: number } | null;
  onPassed: () => void;
}

export function ExamPlayer({ lesson, courseId, userId, existingResult, onPassed }: Props) {
  const questions: ExamQuestion[] = lesson.exam_questions ?? [];
  const passingScore = lesson.exam_passing_score ?? 60;
  const allowRetry = lesson.exam_allow_retry ?? true;

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ score: number; passed: boolean; correct: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showRetry, setShowRetry] = useState(false);

  const allAnswered = questions.length > 0 && Object.keys(answers).length === questions.length;

  const handleSubmit = async () => {
    if (!allAnswered) {
      toast.error('Responde todas las preguntas antes de enviar');
      return;
    }
    setSubmitting(true);
    try {
      const correct = questions.filter((q, i) => answers[i] === q.correct_index).length;
      const score = Math.round((correct / questions.length) * 100);
      const passed = score >= passingScore;
      const attempt = (existingResult?.attempt ?? 0) + 1;

      await saveExamResult({
        lesson_id: lesson.id,
        course_id: courseId,
        user_id: userId,
        score,
        passed,
        answers: questions.map((_, i) => answers[i] ?? -1),
        attempt,
        submitted_at: new Date().toISOString(),
      });

      setResult({ score, passed, correct });
      setSubmitted(true);

      if (passed) {
        toast.success('Examen aprobado! Felicitaciones.');
        onPassed();
      } else {
        toast.error(`Examen reprobado. Obtuviste ${score}% (minimo: ${passingScore}%)`);
      }
    } catch {
      toast.error('Error al guardar el resultado del examen');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    setResult(null);
    setShowRetry(false);
  };

  if (questions.length === 0) {
    return (
      <div className="rounded-xl border bg-amber-50 p-6 text-center">
        <AlertCircle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
        <p className="text-sm text-amber-700 font-medium">El examen no tiene preguntas configuradas aun.</p>
      </div>
    );
  }

  if (submitted && result) {
    const pct = result.score;
    return (
      <div className="rounded-xl border overflow-hidden">
        <div className={cn(
          'px-6 py-5 flex items-center gap-4',
          result.passed ? 'bg-emerald-600' : 'bg-red-600'
        )}>
          {result.passed ? (
            <CheckCircle2 className="h-8 w-8 text-white flex-shrink-0" />
          ) : (
            <XCircle className="h-8 w-8 text-white flex-shrink-0" />
          )}
          <div>
            <h3 className="text-white font-bold text-lg">
              {result.passed ? 'Examen Aprobado' : 'Examen Reprobado'}
            </h3>
            <p className="text-white/80 text-sm">
              {result.correct} de {questions.length} respuestas correctas
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-4xl font-black text-white">{pct}%</p>
            <p className="text-white/70 text-xs">Min. aprobacion: {passingScore}%</p>
          </div>
        </div>

        <div className="p-5 space-y-4 bg-white">
          {questions.map((q, qi) => {
            const studentAnswer = answers[qi];
            const isCorrect = studentAnswer === q.correct_index;
            return (
              <div key={q.id} className={cn(
                'rounded-lg border p-3 space-y-2',
                isCorrect ? 'border-emerald-200 bg-emerald-50/50' : 'border-red-200 bg-red-50/50'
              )}>
                <div className="flex items-start gap-2">
                  {isCorrect
                    ? <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                    : <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                  }
                  <p className="text-sm font-medium text-slate-800">{q.text}</p>
                </div>
                <div className="space-y-1 pl-6">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className={cn(
                      'text-xs px-2 py-1 rounded',
                      oi === q.correct_index ? 'bg-emerald-100 text-emerald-800 font-semibold' :
                      oi === studentAnswer && !isCorrect ? 'bg-red-100 text-red-700 line-through' :
                      'text-slate-500'
                    )}>
                      {oi === q.correct_index && <span className="mr-1">✓</span>}
                      {opt}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {!result.passed && allowRetry && (
            <Button onClick={handleRetry} variant="outline" className="w-full gap-2">
              <RefreshCw className="h-4 w-4" />
              Reintentar Examen
            </Button>
          )}
          {!result.passed && !allowRetry && (
            <div className="text-center text-sm text-muted-foreground">
              El instructor no permite reintentos en este examen.
            </div>
          )}
        </div>
      </div>
    );
  }

  if (existingResult?.passed) {
    return (
      <div className="rounded-xl border bg-emerald-50 p-6 text-center space-y-3">
        <Trophy className="h-10 w-10 text-emerald-600 mx-auto" />
        <div>
          <p className="font-bold text-emerald-800 text-lg">Examen ya aprobado</p>
          <p className="text-emerald-700 text-sm">Obtuviste {existingResult.score}% en el intento {existingResult.attempt}</p>
        </div>
      </div>
    );
  }

  if (existingResult && !existingResult.passed && !allowRetry) {
    return (
      <div className="rounded-xl border bg-red-50 p-6 text-center space-y-2">
        <XCircle className="h-10 w-10 text-red-500 mx-auto" />
        <p className="font-bold text-red-700">Examen reprobado</p>
        <p className="text-red-600 text-sm">Obtuviste {existingResult.score}% y no se permiten reintentos.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border overflow-hidden">
      <div className="px-5 py-4 bg-slate-800 flex items-center gap-3">
        <ClipboardList className="h-5 w-5 text-white" />
        <div className="flex-1">
          <h3 className="text-white font-bold">{lesson.title}</h3>
          <p className="text-slate-400 text-xs">{questions.length} preguntas &bull; Minimo {passingScore}% para aprobar</p>
        </div>
        <Badge variant="secondary" className="bg-white/10 text-white border-0 text-xs">
          {Object.keys(answers).length}/{questions.length} respondidas
        </Badge>
      </div>

      {existingResult && !existingResult.passed && (
        <div className="px-5 py-2.5 bg-amber-50 border-b border-amber-200 flex items-center gap-2">
          <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
          <p className="text-xs text-amber-700">
            Intento anterior: {existingResult.score}% (reprobado). Este es tu intento #{(existingResult.attempt ?? 0) + 1}.
          </p>
        </div>
      )}

      <div className="p-5 space-y-5 bg-white">
        {questions.map((q, qi) => (
          <div key={q.id} className="space-y-2.5">
            <p className="text-sm font-semibold text-slate-800">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 text-white text-[10px] font-bold mr-2">
                {qi + 1}
              </span>
              {q.text}
            </p>
            <div className="space-y-1.5 pl-7">
              {q.options.map((opt, oi) => (
                <button
                  key={oi}
                  type="button"
                  onClick={() => setAnswers((prev) => ({ ...prev, [qi]: oi }))}
                  className={cn(
                    'w-full text-left text-sm px-3 py-2.5 rounded-lg border-2 transition-all',
                    answers[qi] === oi
                      ? 'border-blue-600 bg-blue-50 text-blue-800 font-medium'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  )}
                >
                  <span className={cn(
                    'inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold mr-2 shrink-0',
                    answers[qi] === oi ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                  )}>
                    {String.fromCharCode(65 + oi)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="pt-2 border-t border-slate-100">
          <Button
            onClick={handleSubmit}
            disabled={!allAnswered || submitting}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white gap-2"
          >
            {submitting ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <ClipboardList className="h-4 w-4" />
            )}
            {submitting ? 'Enviando...' : 'Enviar Examen'}
          </Button>
          {!allAnswered && (
            <p className="text-center text-xs text-muted-foreground mt-2">
              Responde todas las preguntas para poder enviar
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
