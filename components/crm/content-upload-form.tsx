'use client';

import { useState, useRef } from 'react';
import { Upload, CircleCheck as CheckCircle2, FileImage, FileText, Award, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { uploadFile, StorageFolder, FOLDER_CONFIG, UploadProgress } from '@/lib/firebase/storage';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { LessonAttachment } from '@/lib/firebase/firestore';

const FOLDER_ICONS: Record<StorageFolder, React.ElementType> = {
  'courses/thumbnails': FileImage,
  'courses/materials': FileText,
  certificates: Award,
};

const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
  'https://images.unsplash.com/photo-1581726707445-75cbe4efc586?w=800&q=80',
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80',
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80',
];

interface UploadedFile {
  name: string;
  url: string;
  folder: StorageFolder;
  metadata: LessonAttachment;
}

export function ContentUploadForm() {
  const [selectedFolder, setSelectedFolder] = useState<StorageFolder>('courses/thumbnails');
  const [courseId, setCourseId] = useState('');
  const [dragging, setDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const config = FOLDER_CONFIG[selectedFolder];
  const FolderIcon = FOLDER_ICONS[selectedFolder];

  const handleFile = async (file: File) => {
    const maxBytes = config.maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      toast.error(`El archivo supera el límite de ${config.maxSizeMB} MB`);
      return;
    }

    const acceptedTypes = config.accept.split(',');
    if (!acceptedTypes.includes(file.type)) {
      toast.error('Tipo de archivo no permitido para esta carpeta');
      return;
    }

    setUploading(true);
    setUploadProgress(null);

    try {
      const options = {
        courseId: courseId.trim() || undefined,
        assetType: config.assetType,
      };
      const result = await uploadFile(file, options, (p) => setUploadProgress(p));
      setUploadedFiles((prev) => [
        { name: file.name, url: result.url, folder: selectedFolder, metadata: result.metadata },
        ...prev,
      ]);
      toast.success('Archivo subido correctamente');
    } catch {
      toast.error('Error al subir el archivo. Intenta de nuevo.');
    } finally {
      setUploading(false);
      setUploadProgress(null);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copiada al portapapeles');
  };

  const copyMetadata = (metadata: LessonAttachment) => {
    navigator.clipboard.writeText(JSON.stringify(metadata, null, 2));
    toast.success('Metadatos copiados al portapapeles');
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Carga de Contenido
        </CardTitle>
        <CardDescription>
          Sube imágenes de cursos, materiales PDF o certificados a Firebase Storage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Carpeta destino</Label>
            <Select
              value={selectedFolder}
              onValueChange={(v) => setSelectedFolder(v as StorageFolder)}
              disabled={uploading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(FOLDER_CONFIG) as [StorageFolder, typeof FOLDER_CONFIG[StorageFolder]][]).map(
                  ([key, cfg]) => {
                    const Icon = FOLDER_ICONS[key];
                    return (
                      <SelectItem key={key} value={key}>
                        <span className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {cfg.label}
                        </span>
                      </SelectItem>
                    );
                  }
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>
              ID del Curso <span className="text-muted-foreground font-normal">(opcional)</span>
            </Label>
            <Input
              placeholder="ej. abc123"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              disabled={uploading}
            />
          </div>
        </div>

        <p className="text-xs text-muted-foreground -mt-2">
          {courseId.trim()
            ? `Ruta: courses/${courseId.trim()}/${config.assetType}/`
            : `Ruta: ${selectedFolder}/`}
          {' '}— Acepta: {config.accept.replace(/[a-z]+\//g, '').replace(/,/g, ', ')} — Máx. {config.maxSizeMB} MB
        </p>

        <div
          className={cn(
            'relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
            dragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50',
            uploading && 'pointer-events-none opacity-60'
          )}
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept={config.accept}
            className="hidden"
            onChange={handleInputChange}
          />
          <div className="flex flex-col items-center gap-3">
            <div className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center',
              dragging ? 'bg-primary/10' : 'bg-muted'
            )}>
              <FolderIcon className={cn('h-6 w-6', dragging ? 'text-primary' : 'text-muted-foreground')} />
            </div>
            <div>
              <p className="text-sm font-medium">
                {dragging ? 'Suelta el archivo aquí' : 'Arrastra un archivo o haz clic para seleccionar'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{config.label}</p>
            </div>
          </div>
        </div>

        {uploading && uploadProgress && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Subiendo...</span>
              <span>{uploadProgress.percent}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="h-2 bg-primary rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress.percent}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-right">
              {formatBytes(uploadProgress.bytesTransferred)} / {formatBytes(uploadProgress.totalBytes)}
            </p>
          </div>
        )}

        {selectedFolder === 'courses/thumbnails' && !uploading && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Placeholders disponibles</p>
            <div className="grid grid-cols-5 gap-2">
              {PLACEHOLDER_IMAGES.map((src, i) => (
                <button
                  key={i}
                  className="group relative aspect-video rounded overflow-hidden border hover:border-primary transition-colors"
                  onClick={() => copyUrl(src)}
                  title="Copiar URL"
                >
                  <img
                    src={src}
                    alt={`placeholder ${i + 1}`}
                    className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                    <Copy className="h-4 w-4 text-white" />
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Haz clic en una imagen para copiar su URL</p>
          </div>
        )}

        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Archivos subidos en esta sesión</p>
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {uploadedFiles.map((f, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <p className="font-medium truncate">{f.metadata.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {f.metadata.type.toUpperCase()} · {formatBytes(f.metadata.size)}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{f.url}</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => copyUrl(f.url)}
                      title="Copiar URL"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => copyMetadata(f.metadata)}
                      title="Copiar metadatos JSON"
                    >
                      <FileText className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => window.open(f.url, '_blank')}
                      title="Abrir en nueva pestaña"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
