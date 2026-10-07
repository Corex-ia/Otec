'use client';

import { useState, useRef } from 'react';
import {
  createLesson,
  updateLesson,
  addLessonAttachment,
  LessonDoc,
  LessonAttachment,
} from '@/lib/firebase/firestore';
import { uploadFile, UploadProgress, ACCEPTED_PDF_TYPES } from '@/lib/firebase/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { FileText, Paperclip, Trash2, Upload, X, CalendarClock, Video, Type, Zap, Code as Code2, ClipboardList, Plus, Minus, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExamQuestion } from '@/lib/firebase/firestore';

interface LessonFormProps {
  moduleId: string;
  courseId: string;
  nextOrderIndex: number;
  lesson?: LessonDoc;
  onSaved: (lesson: LessonDoc) => void;
  onCancel: () => void;
}


type LessonType = 'video' | 'text' | 'sincronica' | 'interactive' | 'examen';

export function LessonForm({ moduleId, courseId, nextOrderIndex, lesson, onSaved, onCancel }: LessonFormProps) {
  const [title, setTitle] = useState(lesson?.title ?? '');
  const [description, setDescription] = useState(lesson?.description ?? '');
  const [type, setType] = useState<LessonType>(
    (lesson?.type as LessonType) === 'h5p' || (lesson?.type as LessonType) === 'quiz'
      ? 'interactive'
      : (lesson?.type as LessonType) ?? 'video'
  );
  const [videoUrl, setVideoUrl] = useState(lesson?.video_url ?? '');
  const [textContent, setTextContent] = useState(lesson?.text_content ?? '');
  const [embedCode, setEmbedCode] = useState(lesson?.embed_code ?? '');
  const [sessionDatetime, setSessionDatetime] = useState(
    lesson?.session_datetime ? lesson.session_datetime.slice(0, 16) : ''
  );
  const [examQuestions, setExamQuestions] = useState<ExamQuestion[]>(
    lesson?.exam_questions ?? []
  );
  const [examPassingScore, setExamPassingScore] = useState<string>(
    lesson?.exam_passing_score != null ? String(lesson.exam_passing_score) : '60'
  );
  const [examAllowRetry, setExamAllowRetry] = useState<boolean>(
    lesson?.exam_allow_retry ?? true
  );
  const [isFree, setIsFree] = useState(lesson?.is_free ?? false);
  const [points, setPoints] = useState<string>(lesson?.points != null ? String(lesson.points) : '');
  const [attachments, setAttachments] = useState<LessonAttachment[]>(lesson?.attachments ?? []);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('El título de la lección es obligatorio');
      return;
    }
    setSaving(true);
    try {
      const parsedPoints = points.trim() !== '' ? parseInt(points, 10) : null;

      const parsedPassingScore = parseInt(examPassingScore, 10);

      const payload: Omit<LessonDoc, 'id' | 'created_at' | 'updated_at'> = {
        module_id: moduleId,
        title: title.trim(),
        description: description.trim() || null,
        type,
        order_index: lesson?.order_index ?? nextOrderIndex,
        video_url: type === 'video' ? (videoUrl.trim() || null) : null,
        duration_seconds: 0,
        h5p_content_url: null,
        text_content: type === 'text' ? (textContent.trim() || null) : null,
        embed_code: type === 'interactive' ? (embedCode.trim() || null) : null,
        is_free: isFree,
        attachments,
        meet_url: null,
        session_datetime:
          type === 'sincronica' && sessionDatetime
            ? new Date(sessionDatetime).toISOString()
            : null,
        points: parsedPoints && !isNaN(parsedPoints) ? parsedPoints : null,
        exam_questions: type === 'examen' ? examQuestions : null,
        exam_passing_score: type === 'examen' && !isNaN(parsedPassingScore) ? parsedPassingScore : null,
        exam_allow_retry: type === 'examen' ? examAllowRetry : null,
      };

      let savedId: string;
      if (lesson) {
        await updateLesson(lesson.id, payload);
        savedId = lesson.id;
      } else {
        savedId = await createLesson(payload);
      }

      const saved: LessonDoc = {
        id: savedId,
        ...payload,
        created_at: lesson?.created_at ?? new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      toast.success(lesson ? 'Lección actualizada' : 'Lección creada');
      onSaved(saved);
    } catch {
      toast.error('Error al guardar la lección');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('Solo se permiten archivos PDF');
      return;
    }
    const maxBytes = 50 * 1024 * 1024;
    if (file.size > maxBytes) {
      toast.error('El archivo supera el límite de 50 MB');
      return;
    }

    setUploading(true);
    try {
      const result = await uploadFile(
        file,
        { courseId, assetType: 'pdf' },
        (p) => setUploadProgress(p)
      );
      const newAttachment = result.metadata;
      setAttachments((prev) => [...prev, newAttachment]);

      if (lesson) {
        await addLessonAttachment(lesson.id, newAttachment);
      }

      toast.success('PDF adjuntado correctamente');
    } catch {
      toast.error('Error al subir el PDF');
    } finally {
      setUploading(false);
      setUploadProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="rounded-xl border bg-slate-50 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm text-slate-700">
          {lesson ? 'Editar lección' : 'Nueva lección'}
        </h4>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Título *</Label>
          <Input
            placeholder="Ej. Introducción a la unidad"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-9 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Tipo de lección</Label>
          <Select value={type} onValueChange={(v) => setType(v as LessonType)}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="video">
                <span className="flex items-center gap-2">
                  <Video className="h-3.5 w-3.5" />
                  Video
                </span>
              </SelectItem>
              <SelectItem value="text">
                <span className="flex items-center gap-2">
                  <Type className="h-3.5 w-3.5" />
                  Texto
                </span>
              </SelectItem>
              <SelectItem value="sincronica">
                <span className="flex items-center gap-2">
                  <Video className="h-3.5 w-3.5 text-blue-600" />
                  Aula Virtual Pro
                </span>
              </SelectItem>
              <SelectItem value="interactive">
                <span className="flex items-center gap-2">
                  <Code2 className="h-3.5 w-3.5 text-amber-500" />
                  Interactiva (H5P / Genially)
                </span>
              </SelectItem>
              <SelectItem value="examen">
                <span className="flex items-center gap-2">
                  <ClipboardList className="h-3.5 w-3.5 text-red-600" />
                  Examen Final
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Descripción</Label>
        <Textarea
          placeholder="Descripción breve de esta lección..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="text-sm min-h-[60px] resize-none"
        />
      </div>

      {type === 'video' && (
        <div className="space-y-1.5">
          <Label className="text-xs flex items-center gap-1.5">
            <Video className="h-3.5 w-3.5" />
            URL del video
          </Label>
          <Input
            placeholder="https://www.youtube.com/watch?v=..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="h-9 text-sm"
          />
        </div>
      )}

      {type === 'text' && (
        <div className="space-y-1.5">
          <Label className="text-xs flex items-center gap-1.5">
            <Type className="h-3.5 w-3.5" />
            Contenido de texto
          </Label>
          <Textarea
            placeholder="Escribe el contenido de la lección..."
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            className="text-sm min-h-[100px] resize-none"
          />
        </div>
      )}

      {type === 'sincronica' && (
        <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-3 space-y-3">
          <div className="flex items-center gap-1.5 text-blue-700">
            <Video className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">Configuración de Aula Virtual (Jitsi)</span>
          </div>
          <div className="flex items-start gap-2 rounded-md bg-blue-50 border border-blue-200 px-3 py-2">
            <Info className="h-3.5 w-3.5 text-blue-500 mt-0.5 shrink-0" />
            <p className="text-[11px] text-blue-700">La sala virtual se generará automáticamente de forma privada.</p>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs flex items-center gap-1">
              <CalendarClock className="h-3.5 w-3.5" />
              Fecha y hora
            </Label>
            <Input
              type="datetime-local"
              value={sessionDatetime}
              onChange={(e) => setSessionDatetime(e.target.value)}
              className="h-9 text-sm"
            />
          </div>
        </div>
      )}

      {type === 'examen' && (
        <div className="rounded-lg border border-red-200 bg-red-50/40 p-3 space-y-3">
          <div className="flex items-center gap-1.5 text-red-700">
            <ClipboardList className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">Configuración del Examen Final</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Puntaje mínimo para aprobar (%)</Label>
              <Input
                type="number"
                min="1"
                max="100"
                value={examPassingScore}
                onChange={(e) => setExamPassingScore(e.target.value)}
                className="h-9 text-sm w-24"
              />
            </div>
            <div className="flex items-center gap-2 pt-5">
              <input
                id="allow-retry"
                type="checkbox"
                checked={examAllowRetry}
                onChange={(e) => setExamAllowRetry(e.target.checked)}
                className="h-4 w-4 rounded border-input"
              />
              <Label htmlFor="allow-retry" className="text-xs cursor-pointer">
                Permitir reintento
              </Label>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Preguntas ({examQuestions.length})</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-7 text-xs gap-1"
                onClick={() => {
                  const newQ: ExamQuestion = {
                    id: crypto.randomUUID(),
                    text: '',
                    options: ['', '', '', ''],
                    correct_index: 0,
                  };
                  setExamQuestions((prev) => [...prev, newQ]);
                }}
              >
                <Plus className="h-3 w-3" />
                Agregar pregunta
              </Button>
            </div>
            {examQuestions.map((q, qi) => (
              <div key={q.id} className="rounded-lg border bg-white p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-red-600 bg-red-100 rounded px-1.5 py-0.5">
                    P{qi + 1}
                  </span>
                  <Input
                    placeholder="Texto de la pregunta..."
                    value={q.text}
                    onChange={(e) => {
                      const updated = [...examQuestions];
                      updated[qi] = { ...q, text: e.target.value };
                      setExamQuestions(updated);
                    }}
                    className="h-8 text-xs flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0"
                    onClick={() => setExamQuestions((prev) => prev.filter((_, i) => i !== qi))}
                  >
                    <Minus className="h-3 w-3 text-red-500" />
                  </Button>
                </div>
                <div className="space-y-1.5 pl-2">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${q.id}`}
                        checked={q.correct_index === oi}
                        onChange={() => {
                          const updated = [...examQuestions];
                          updated[qi] = { ...q, correct_index: oi };
                          setExamQuestions(updated);
                        }}
                        className="h-3.5 w-3.5"
                      />
                      <Input
                        placeholder={`Opción ${oi + 1}`}
                        value={opt}
                        onChange={(e) => {
                          const updated = [...examQuestions];
                          const newOptions = [...q.options];
                          newOptions[oi] = e.target.value;
                          updated[qi] = { ...q, options: newOptions };
                          setExamQuestions(updated);
                        }}
                        className="h-7 text-xs"
                      />
                    </div>
                  ))}
                  <p className="text-[10px] text-muted-foreground pl-5">Selecciona la opción correcta con el radio button</p>
                </div>
              </div>
            ))}
            {examQuestions.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-3">
                Agrega al menos una pregunta para el examen
              </p>
            )}
          </div>
        </div>
      )}

      {type === 'interactive' && (
        <div className="rounded-lg border border-amber-200 bg-amber-50/40 p-3 space-y-3">
          <div className="flex items-center gap-1.5 text-amber-700">
            <Code2 className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">Código de embebido (iFrame)</span>
          </div>
          <Textarea
            placeholder={'<iframe src="https://..." width="100%" height="500px" ...></iframe>'}
            value={embedCode}
            onChange={(e) => setEmbedCode(e.target.value)}
            className="text-xs font-mono min-h-[100px] resize-none bg-white"
          />
          <p className="text-[10px] text-amber-700/70">
            Pega el iFrame de H5P, Genially, Google Forms u otro servicio externo.
            El sistema lo renderizará de forma responsiva en el LMS.
          </p>
        </div>
      )}

      <div className="rounded-lg border border-yellow-200 bg-yellow-50/40 p-3 space-y-1.5">
        <Label className="text-xs flex items-center gap-1.5 text-yellow-700 font-medium">
          <Zap className="h-3.5 w-3.5 fill-yellow-400 text-yellow-500" />
          Puntos de gamificación
          <span className="font-normal text-muted-foreground ml-1">(opcional)</span>
        </Label>
        <Input
          type="number"
          min="0"
          max="1000"
          placeholder="Ej. 50"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          className="h-8 text-sm w-32"
        />
        <p className="text-[10px] text-muted-foreground">
          Al completar esta lección el alumno gana estos puntos. Se suman a su perfil.
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-xs flex items-center gap-1.5">
          <Paperclip className="h-3.5 w-3.5" />
          Adjuntos PDF ({attachments.length})
        </Label>

        {attachments.length > 0 && (
          <div className="space-y-1.5">
            {attachments.map((att) => (
              <div key={att.id} className="flex items-center gap-2 p-2 bg-white rounded-lg border text-xs">
                <FileText className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />
                <span className="flex-1 truncate font-medium">{att.name}</span>
                <span className="text-muted-foreground flex-shrink-0">{formatBytes(att.size)}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 flex-shrink-0"
                  onClick={() => removeAttachment(att.id)}
                >
                  <Trash2 className="h-3 w-3 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-3 text-center cursor-pointer transition-colors',
            uploading
              ? 'pointer-events-none opacity-60 border-muted-foreground/20'
              : 'border-muted-foreground/25 hover:border-primary/50'
          )}
          onClick={() => !uploading && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_PDF_TYPES}
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFileUpload(f);
            }}
          />
          {uploading && uploadProgress ? (
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">Subiendo... {uploadProgress.percent}%</p>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div
                  className="h-1.5 bg-primary rounded-full transition-all"
                  style={{ width: `${uploadProgress.percent}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Upload className="h-3.5 w-3.5" />
              <span>Subir manual o material PDF (máx. 50 MB)</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <input
          id="is-free"
          type="checkbox"
          checked={isFree}
          onChange={(e) => setIsFree(e.target.checked)}
          className="h-4 w-4 rounded border-input"
        />
        <Label htmlFor="is-free" className="text-xs cursor-pointer">
          Lección gratuita (visible sin inscripción)
        </Label>
      </div>

      <div className="flex gap-2 pt-1">
        <Button onClick={handleSave} disabled={saving} size="sm" className="flex-1">
          {saving ? 'Guardando...' : lesson ? 'Guardar cambios' : 'Crear lección'}
        </Button>
        <Button onClick={onCancel} variant="outline" size="sm">
          Cancelar
        </Button>
      </div>
    </div>
  );
}
