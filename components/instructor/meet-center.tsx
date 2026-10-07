'use client';

import { useState } from 'react';
import { LessonDoc } from '@/lib/firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarClock, Video, Copy, CircleCheck as CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { generateRoomName } from '@/components/lms/jitsi-classroom';
import { useAuthStore } from '@/lib/stores/auth-store';
import { JitsiClassroom } from '@/components/lms/jitsi-classroom';

interface SessionWithCourse extends LessonDoc {
  courseTitle: string;
  moduleTitle: string;
  courseId: string;
}

interface Props {
  sessions: SessionWithCourse[];
  onSessionUpdated?: (lessonId: string, newUrl: string) => void;
}

export function MeetCenter({ sessions }: Props) {
  const profile = useAuthStore((state) => state.profile);
  const user = useAuthStore((state) => state.user);
  const [activeSession, setActiveSession] = useState<SessionWithCourse | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isToday = (iso: string) => {
    const d = new Date(iso);
    return d.toDateString() === new Date().toDateString();
  };

  const isWithin30Min = (iso: string) => {
    const diff = new Date(iso).getTime() - Date.now();
    return diff >= 0 && diff <= 30 * 60 * 1000;
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-CL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });

  const handleCopyRoom = (roomName: string, sessionId: string) => {
    navigator.clipboard.writeText(roomName).then(() => {
      setCopiedId(sessionId);
      toast.success('Nombre de sala copiado');
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  if (activeSession) {
    const roomName = generateRoomName(activeSession.courseId, activeSession.id);
    return (
      <JitsiClassroom
        roomName={roomName}
        lessonTitle={activeSession.title}
        courseTitle={activeSession.courseTitle}
        displayName={profile?.full_name || user?.user_metadata?.full_name || 'Instructor'}
        email={profile?.email || user?.email || undefined}
        isModerator={true}
        attachments={[]}
        onExit={() => setActiveSession(null)}
      />
    );
  }

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-slate-600" />
          <CardTitle className="text-base">Aulas Virtuales — Próximas Clases</CardTitle>
        </div>
        <CardDescription>Inicia sesiones en vivo embebidas directamente en la plataforma</CardDescription>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <div className="py-10 text-center">
            <CalendarClock className="h-10 w-10 mx-auto text-slate-200 mb-3" />
            <p className="text-slate-400 text-sm">No hay sesiones sincrónicas programadas</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => {
              const live = session.session_datetime ? isWithin30Min(session.session_datetime) : false;
              const today = session.session_datetime ? isToday(session.session_datetime) : false;
              const roomName = generateRoomName(session.courseId ?? session.id, session.id);

              return (
                <div
                  key={session.id}
                  className={`rounded-xl border p-4 transition-all ${
                    live
                      ? 'border-emerald-300 bg-emerald-50'
                      : today
                      ? 'border-blue-200 bg-blue-50/40'
                      : 'border-slate-100 bg-white'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="mt-0.5 flex-shrink-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-200 flex items-center justify-center">
                          <Video className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-slate-800 text-sm truncate">{session.title}</p>
                          {live && (
                            <Badge className="bg-emerald-600 text-white text-[10px] animate-pulse">
                              EN VIVO PRONTO
                            </Badge>
                          )}
                          {today && !live && (
                            <Badge variant="outline" className="text-blue-700 border-blue-300 text-[10px]">
                              Hoy
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {session.courseTitle} &bull; {session.moduleTitle}
                        </p>
                        {session.session_datetime && (
                          <p className="text-xs font-medium text-slate-500 mt-1">
                            {formatDate(session.session_datetime)} &mdash; {formatTime(session.session_datetime)}
                          </p>
                        )}
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className="text-[10px] text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded truncate max-w-[200px]">
                            {roomName}
                          </span>
                          <button
                            onClick={() => handleCopyRoom(roomName, session.id)}
                            className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
                            title="Copiar link de sala"
                          >
                            {copiedId === session.id
                              ? <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                              : <Copy className="h-3 w-3" />
                            }
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        className={`gap-2 text-xs h-8 ${
                          live ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-700 hover:bg-blue-800'
                        } text-white`}
                        onClick={() => setActiveSession(session)}
                      >
                        <Video className="h-3.5 w-3.5" />
                        {live ? 'Iniciar clase' : 'Abrir aula'}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
