'use client';

import { FileText, Download } from 'lucide-react';
import { LessonAttachment } from '@/lib/firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DownloadableResourcesProps {
  attachments: LessonAttachment[];
  dark?: boolean;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function DownloadableResources({ attachments, dark = false }: DownloadableResourcesProps) {
  const pdfs = attachments.filter((a) => a.type === 'pdf');

  if (pdfs.length === 0) return null;

  if (dark) {
    return (
      <ul className="space-y-2">
        {pdfs.map((attachment) => (
          <li key={attachment.id}>
            <a
              href={attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              download={attachment.name}
              className="group flex items-center gap-3 p-2.5 rounded-lg border border-gray-800 hover:border-gray-600 hover:bg-gray-800/50 transition-all"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded bg-red-900/30 flex items-center justify-center border border-red-800/40">
                <FileText className="h-3.5 w-3.5 text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-gray-200 group-hover:text-white transition-colors">
                  {attachment.name}
                </p>
                <p className="text-xs text-gray-600">
                  PDF · {formatBytes(attachment.size)}
                </p>
              </div>
              <Download className="h-3.5 w-3.5 text-gray-600 group-hover:text-gray-300 transition-colors flex-shrink-0" />
            </a>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Recursos Descargables
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {pdfs.map((attachment) => (
            <li key={attachment.id}>
              <a
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                download={attachment.name}
                className="group flex items-center gap-3 p-3 rounded-lg border hover:border-primary hover:bg-primary/5 transition-all"
              >
                <div className="flex-shrink-0 w-9 h-9 rounded-md bg-red-50 flex items-center justify-center border border-red-100">
                  <FileText className="h-4 w-4 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                    {attachment.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF · {formatBytes(attachment.size)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  tabIndex={-1}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </a>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
