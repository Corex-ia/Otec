'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  X, FileText, BookOpen, Clock, Video,
  Maximize2, Minimize2, TriangleAlert as AlertTriangle,
  Copy, CheckCheck, ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DownloadableResources } from '@/components/lms/downloadable-resources';
import { writeAuditLog } from '@/lib/firebase/firestore';

declare global {
  interface Window {
    JitsiMeetExternalAPI: new (
      domain: string,
      options: Record<string, unknown>
    ) => JitsiAPI;
  }
}

interface JitsiAPI {
  dispose: () => void;
  addEventListener: (event: string, listener: (e?: unknown) => void) => void;
  _getIFrame: () => HTMLIFrameElement | null;
}

interface Attachment {
  id?: string;
  name: string;
  url: string;
  type: string;
  size?: number;
}

export interface JitsiClassroomProps {
  roomName: string;
  lessonTitle: string;
  courseTitle: string;
  displayName: string;
  email?: string;
  isModerator?: boolean;
  attachments?: Attachment[];
  userId?: string;
  courseId?: string;
  lessonId?: string;
  onExit: (durationSeconds?: number) => void;
}

type SidebarTab = 'resources' | 'info';
type Phase = 'idle' | 'loading' | 'active' | 'error';

const JITSI_DOMAIN = '8x8.vc';
const APP_ID = 'vpaas-magic-cookie-5d6513283a094fa5a31dbc4c08404bce';

const IFRAME_ALLOW =
  'camera; microphone; display-capture; autoplay; clipboard-write; fullscreen';

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      if ((window as Window & typeof globalThis).JitsiMeetExternalAPI) {
        resolve();
      } else {
        const existing = document.querySelector(`script[src="${src}"]`);
        existing?.addEventListener('load', () => resolve());
        existing?.addEventListener('error', () => reject(new Error('Script load failed')));
      }
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

export function JitsiClassroom({
  roomName,
  lessonTitle,
  courseTitle,
  displayName,
  email,
  isModerator = false,
  attachments = [],
  userId,
  courseId,
  lessonId,
  onExit,
}: JitsiClassroomProps) {
  const pageEnterTimeRef = useRef<number>(Date.now());
  const meetJoinTimeRef = useRef<number | null>(null);
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<JitsiAPI | null>(null);
  const mountedRef = useRef(false);
  const exitCalledRef = useRef(false);

  const [phase, setPhase] = useState<Phase>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('info');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [pageElapsed, setPageElapsed] = useState(0);
  const [meetElapsed, setMeetElapsed] = useState(0);
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);
  const [debugJwt, setDebugJwt] = useState<string | null>(null);
  const [jwtCopied, setJwtCopied] = useState(false);
  const [toast, setToast] = useState<{ text: string; type: 'error' | 'info' } | null>(null);

  const hasPdfs = attachments.some((a) => a.type === 'pdf');

  const showToast = useCallback((text: string, type: 'error' | 'info' = 'info') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 6000);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setPageElapsed(Math.floor((Date.now() - pageEnterTimeRef.current) / 1000));
      if (meetJoinTimeRef.current !== null) {
        setMeetElapsed(Math.floor((Date.now() - meetJoinTimeRef.current) / 1000));
      }
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!userId || !courseId) return;
    writeAuditLog({
      user_id: userId,
      user_name: displayName,
      user_email: email ?? '',
      action: 'jitsi_enter',
      course_id: courseId,
      lesson_id: lessonId ?? null,
      duration_seconds: null,
      ip_address: null,
      metadata: { roomName, lessonTitle },
    }).catch(() => {});
  }, []);

  const doExit = useCallback(() => {
    if (exitCalledRef.current) return;
    exitCalledRef.current = true;

    const pageSecs = Math.floor((Date.now() - pageEnterTimeRef.current) / 1000);
    const meetSecs = meetJoinTimeRef.current
      ? Math.floor((Date.now() - meetJoinTimeRef.current) / 1000)
      : 0;

    if (apiRef.current) {
      try { apiRef.current.dispose(); } catch (_) {}
      apiRef.current = null;
    }

    if (userId && courseId) {
      writeAuditLog({
        user_id: userId,
        user_name: displayName,
        user_email: email ?? '',
        action: 'jitsi_exit',
        course_id: courseId,
        lesson_id: lessonId ?? null,
        duration_seconds: pageSecs,
        ip_address: null,
        metadata: { roomName, lessonTitle, page_seconds: pageSecs, meet_seconds: meetSecs },
      }).catch(() => {});
    }

    onExit(meetSecs > 0 ? meetSecs : pageSecs);
  }, [userId, courseId, lessonId, displayName, email, roomName, lessonTitle, onExit]);

  const mountJitsi = useCallback((jwt: string) => {
    if (mountedRef.current) return;
    if (!jitsiContainerRef.current) {
      setErrorMsg('Contenedor de video no disponible.');
      setPhase('error');
      return;
    }
    if (!window.JitsiMeetExternalAPI) {
      setErrorMsg('JitsiMeetExternalAPI no disponible.');
      setPhase('error');
      return;
    }

    mountedRef.current = true;
    jitsiContainerRef.current.innerHTML = '';

    const joinTime = Date.now();
    meetJoinTimeRef.current = joinTime;

    console.log('[Jitsi] Mounting room:', `${APP_ID}/${roomName}`);

    try {
      const api = new window.JitsiMeetExternalAPI(JITSI_DOMAIN, {
        roomName: `${APP_ID}/${roomName}`,
        jwt,
        parentNode: jitsiContainerRef.current,
        userInfo: { displayName, email: email ?? '' },
        configOverwrite: {
          prejoinPageEnabled: false,
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          disableDeepLinking: true,
          requireDisplayName: false,
          enableWelcomePage: false,
          enableClosePage: false,
          disableThirdPartyRequests: false,
          p2p: { enabled: true },
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'chat', 'settings',
            'raisehand', 'videoquality', 'tileview', 'mute-everyone',
          ],
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_BRAND_WATERMARK: false,
          BRAND_WATERMARK_LINK: '',
          SHOW_POWERED_BY: false,
          SHOW_PROMOTIONAL_CLOSEST_REGION: false,
          MOBILE_APP_PROMO: false,
          DISPLAY_WELCOME_PAGE_CONTENT: false,
          ENABLE_DIAL_IN: false,
          SHOW_CHROME_EXTENSION_BANNER: false,
        },
        width: '100%',
        height: '100%',
      } as Record<string, unknown>);

      apiRef.current = api;

      const injectIframePermissions = () => {
        try {
          const iframe = api._getIFrame();
          if (iframe) {
            iframe.setAttribute('allow', IFRAME_ALLOW);
            iframe.setAttribute('allowfullscreen', '');
            console.log('[Jitsi] iframe allow attrs applied');
          }
        } catch (_) {}
      };

      injectIframePermissions();
      setTimeout(injectIframePermissions, 200);
      setTimeout(injectIframePermissions, 800);

      api.addEventListener('videoConferenceJoined', () => {
        console.log('[Jitsi] Joined successfully');
        showToast('Conectado a la sala.', 'info');
        setPhase('active');

        if (userId && courseId) {
          writeAuditLog({
            user_id: userId,
            user_name: displayName,
            user_email: email ?? '',
            action: 'meet_join',
            course_id: courseId,
            lesson_id: lessonId ?? null,
            duration_seconds: null,
            ip_address: null,
            metadata: { roomName, lessonTitle, join_at: new Date(joinTime).toISOString() },
          }).catch(() => {});
        }
      });

      api.addEventListener('videoConferenceLeft', () => {
        doExit();
      });

      api.addEventListener('participantRoleChanged', (e: unknown) => {
        const role = e && typeof e === 'object' && 'role' in e
          ? (e as { role: string }).role : '';
        console.log('[Jitsi] Role:', role);
      });

      api.addEventListener('errorOccurred', (e: unknown) => {
        const msg = e && typeof e === 'object' && 'error' in e
          ? String((e as { error: unknown }).error) : JSON.stringify(e);
        console.error('[Jitsi] errorOccurred:', msg);
        showToast(`Error: ${msg}`, 'error');
      });

    } catch (err) {
      mountedRef.current = false;
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[Jitsi] Init error:', msg);
      setErrorMsg(`Error al inicializar Jitsi: ${msg}`);
      setPhase('error');
    }
  }, [roomName, displayName, email, isModerator, userId, courseId, lessonId, lessonTitle, showToast, doExit]);

  const handleJoin = useCallback(async () => {
    setPhase('loading');
    setErrorMsg(null);
    exitCalledRef.current = false;
    mountedRef.current = false;

    try {
      await loadScript(`https://${JITSI_DOMAIN}/${APP_ID}/external_api.js`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[Jitsi] Script error:', msg);
      setErrorMsg(`No se pudo cargar el SDK de Jitsi: ${msg}`);
      setPhase('error');
      return;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    let jwt: string;
    try {
      const res = await fetch(`${supabaseUrl}/functions/v1/jitsi-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({ room: roomName, displayName, email: email ?? '', isModerator }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }

      const data = await res.json();
      if (!data.token) throw new Error(`Token ausente en respuesta: ${JSON.stringify(data)}`);

      jwt = data.token;
      console.log('[Jitsi] JWT received, length:', jwt.length);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[Jitsi] Token error:', msg);
      setErrorMsg(`Error obteniendo token JWT: ${msg}`);
      setPhase('error');
      return;
    }

    setDebugJwt(jwt);
    setFallbackUrl(`https://${JITSI_DOMAIN}/${APP_ID}/${roomName}?jwt=${jwt}`);
    setPhase('active');

    requestAnimationFrame(() => {
      mountJitsi(jwt);
    });
  }, [roomName, displayName, email, isModerator, mountJitsi]);

  useEffect(() => {
    return () => {
      if (apiRef.current) {
        try { apiRef.current.dispose(); } catch (_) {}
        apiRef.current = null;
      }
    };
  }, []);

  const handleCopyJwt = useCallback(() => {
    if (!debugJwt) return;
    navigator.clipboard.writeText(debugJwt).then(() => {
      setJwtCopied(true);
      setTimeout(() => setJwtCopied(false), 2000);
    }).catch(() => {});
  }, [debugJwt]);

  const formatElapsed = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    setFullscreen((f) => {
      const next = !f;
      setSidebarOpen(!next);
      return next;
    });
  };

  const isActive = phase === 'active';
  const isLoading = phase === 'loading';
  const isError = phase === 'error';
  const isIdle = phase === 'idle';

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', flexDirection: 'column', background: '#030712' }}>

      {toast && (
        <div style={{
          position: 'absolute', top: 56, left: '50%', transform: 'translateX(-50%)',
          zIndex: 100, padding: '10px 18px', borderRadius: 8, fontSize: 13, fontWeight: 500,
          maxWidth: 480, pointerEvents: 'none',
          background: toast.type === 'error' ? '#7f1d1d' : '#1e3a5f',
          color: toast.type === 'error' ? '#fca5a5' : '#93c5fd',
          border: `1px solid ${toast.type === 'error' ? '#991b1b' : '#1d4ed8'}`,
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        }}>
          {toast.text}
        </div>
      )}

      <header style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', background: '#111827', borderBottom: '1px solid #1f2937', flexShrink: 0, height: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 11 }}>
            OT
          </div>
          <span style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>OTEC</span>
          <span style={{ color: '#374151', fontSize: 14 }}>/</span>
          <span style={{ color: '#9ca3af', fontSize: 14, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{courseTitle}</span>
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
          {isActive ? (
            <Badge className="bg-red-600/20 text-red-400 border-red-700/40 text-[10px] px-2 py-0 font-semibold tracking-wide animate-pulse">
              EN VIVO
            </Badge>
          ) : (
            <Badge className="bg-gray-700/40 text-gray-400 border-gray-700/40 text-[10px] px-2 py-0 font-semibold tracking-wide">
              CLASE VIRTUAL
            </Badge>
          )}
          <span style={{ color: 'white', fontSize: 14, fontWeight: 500 }}>{lessonTitle}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          {isActive && meetElapsed > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#4ade80', padding: '4px 8px', borderRadius: 6, background: 'rgba(20,83,45,0.3)', border: '1px solid rgba(22,101,52,0.4)', fontSize: 12, fontFamily: 'monospace' }}>
              <Clock className="h-3 w-3" />
              <span>{formatElapsed(meetElapsed)}</span>
              <span style={{ fontSize: 9, color: '#166534', marginLeft: 2 }}>SENCE</span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6b7280', padding: '4px 8px', borderRadius: 6, background: 'rgba(31,41,55,0.5)', fontSize: 12, fontFamily: 'monospace' }}>
              <Clock className="h-3 w-3" />
              <span>{formatElapsed(pageElapsed)}</span>
            </div>
          )}

          {isActive && (
            <button onClick={toggleFullscreen} style={{ color: '#9ca3af', padding: 6, borderRadius: 6, background: 'none', border: 'none', cursor: 'pointer' }}>
              {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          )}

          {isActive && !fullscreen && (
            <button onClick={() => setSidebarOpen((o) => !o)} style={{ color: '#9ca3af', padding: 6, borderRadius: 6, background: 'none', border: 'none', cursor: 'pointer' }}>
              <BookOpen className="h-4 w-4" />
            </button>
          )}

          <Button size="sm" onClick={doExit} className="gap-1.5 text-xs h-8 bg-red-700 hover:bg-red-800 text-white ml-1">
            <X className="h-3.5 w-3.5" />
            Finalizar clase
          </Button>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ flex: 1, position: 'relative', background: '#030712', minWidth: 0 }}>

          {isIdle && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 32 }}>
              <div style={{ textAlign: 'center', maxWidth: 420 }}>
                <div style={{ width: 80, height: 80, borderRadius: 16, background: 'rgba(29,78,216,0.15)', border: '1px solid rgba(29,78,216,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <Video style={{ width: 40, height: 40, color: '#60a5fa' }} />
                </div>
                <h2 style={{ color: 'white', fontSize: 20, fontWeight: 600, marginBottom: 8 }}>{lessonTitle}</h2>
                <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 32 }}>{courseTitle}</p>
                <Button size="lg" onClick={handleJoin} className="gap-2 bg-blue-700 hover:bg-blue-600 text-white px-8">
                  <Video className="h-4 w-4" />
                  Unirse a la clase
                </Button>
                <p style={{ color: '#374151', fontSize: 12, marginTop: 16 }}>La sala se abrira dentro de esta plataforma.</p>
              </div>
            </div>
          )}

          {isLoading && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#030712', zIndex: 10 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 40, height: 40, border: '2px solid #3b82f6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                <p style={{ color: '#9ca3af', fontSize: 14 }}>Conectando a la sala...</p>
              </div>
            </div>
          )}

          {isError && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 32 }}>
              <div style={{ textAlign: 'center', maxWidth: 520 }}>
                <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(127,29,29,0.2)', border: '1px solid rgba(153,27,27,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <AlertTriangle style={{ width: 32, height: 32, color: '#f87171' }} />
                </div>
                <h2 style={{ color: 'white', fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Error al conectar</h2>
                <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>{errorMsg}</p>

                {debugJwt && (
                  <div style={{ background: '#111827', border: '1px solid #1d4ed8', borderRadius: 8, padding: 12, marginBottom: 20, textAlign: 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <p style={{ color: '#3b82f6', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>JWT (validar en jwt.io)</p>
                      <button
                        onClick={handleCopyJwt}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, color: jwtCopied ? '#4ade80' : '#60a5fa', fontSize: 11, background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        {jwtCopied ? <CheckCheck className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        {jwtCopied ? 'Copiado' : 'Copiar'}
                      </button>
                    </div>
                    <p style={{ color: '#6b7280', fontSize: 10, fontFamily: 'monospace', wordBreak: 'break-all', maxHeight: 60, overflow: 'hidden' }}>
                      {debugJwt.slice(0, 120)}...
                    </p>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button
                    onClick={() => { setPhase('idle'); setErrorMsg(null); mountedRef.current = false; }}
                    className="bg-blue-700 hover:bg-blue-600 text-white"
                  >
                    Reintentar
                  </Button>
                  {fallbackUrl && (
                    <a
                      href={fallbackUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 gap-2">
                        <ExternalLink className="h-3.5 w-3.5" />
                        Abrir en ventana nueva
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          <div
            ref={jitsiContainerRef}
            style={{
              position: 'absolute',
              inset: 0,
              visibility: isActive ? 'visible' : 'hidden',
            }}
          />

          {isActive && fallbackUrl && (
            <div style={{ position: 'absolute', bottom: 12, right: 12, zIndex: 20 }}>
              <a
                href={fallbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px',
                  borderRadius: 6, background: 'rgba(17,24,39,0.8)', border: '1px solid #374151',
                  color: '#6b7280', fontSize: 11, textDecoration: 'none',
                  backdropFilter: 'blur(4px)', transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#9ca3af')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#6b7280')}
              >
                <ExternalLink style={{ width: 11, height: 11 }} />
                ¿Problemas de visualización? Abrir aula en ventana segura
              </a>
            </div>
          )}
        </div>

        {isActive && sidebarOpen && !fullscreen && (
          <aside style={{ width: 288, flexShrink: 0, background: '#111827', borderLeft: '1px solid #1f2937', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #1f2937' }}>
              {(['info', 'resources'] as SidebarTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSidebarTab(tab)}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: 6, padding: '10px 8px', fontSize: 12, fontWeight: 500, cursor: 'pointer',
                    background: 'none', border: 'none',
                    borderBottom: sidebarTab === tab ? '2px solid #3b82f6' : '2px solid transparent',
                    color: sidebarTab === tab ? 'white' : '#6b7280',
                  }}
                >
                  {tab === 'info' ? <BookOpen className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
                  {tab === 'info' ? 'Info' : 'Recursos'}
                </button>
              ))}
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
              {sidebarTab === 'info' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {[
                    { label: 'Clase', value: lessonTitle, mono: false },
                    { label: 'Curso', value: courseTitle, mono: false },
                    { label: 'Sala', value: roomName, mono: true },
                    { label: 'Participante', value: displayName, mono: false },
                  ].map(({ label, value, mono }) => (
                    <div key={label}>
                      <p style={{ color: '#6b7280', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{label}</p>
                      <p style={{ color: mono ? '#6b7280' : '#d1d5db', fontSize: mono ? 11 : 14, fontFamily: mono ? 'monospace' : undefined, wordBreak: 'break-all' }}>{value}</p>
                    </div>
                  ))}

                  {isModerator && (
                    <div style={{ paddingTop: 8, borderTop: '1px solid #1f2937' }}>
                      <Badge className="bg-amber-600/20 text-amber-400 border-amber-700/40 text-[10px]">
                        Modo Instructor
                      </Badge>
                      <p style={{ color: '#4b5563', fontSize: 12, marginTop: 8, lineHeight: 1.5 }}>
                        Eres el moderador de la sala.
                      </p>
                    </div>
                  )}

                  <div style={{ paddingTop: 8, borderTop: '1px solid #1f2937' }}>
                    <p style={{ color: '#6b7280', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Tiempo SENCE</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(20,83,45,0.15)', border: '1px solid rgba(22,101,52,0.3)', borderRadius: 8, padding: '8px 12px' }}>
                      <Clock style={{ width: 14, height: 14, color: '#4ade80', flexShrink: 0 }} />
                      <div>
                        <p style={{ color: '#4ade80', fontFamily: 'monospace', fontSize: 14, fontWeight: 600 }}>{formatElapsed(meetElapsed)}</p>
                        <p style={{ color: '#166534', fontSize: 10 }}>Tiempo en sala (auditable)</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {sidebarTab === 'resources' && (
                <div>
                  <p style={{ color: '#6b7280', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Material de la clase</p>
                  {hasPdfs ? (
                    <DownloadableResources attachments={attachments as Parameters<typeof DownloadableResources>[0]['attachments']} dark />
                  ) : (
                    <div style={{ textAlign: 'center', paddingTop: 40 }}>
                      <FileText style={{ width: 32, height: 32, color: '#374151', margin: '0 auto 8px' }} />
                      <p style={{ color: '#4b5563', fontSize: 14 }}>Sin recursos adjuntos</p>
                      <p style={{ color: '#374151', fontSize: 12, marginTop: 4 }}>El instructor puede agregar PDFs desde el panel.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export function generateRoomName(courseId: string, lessonId: string): string {
  const clean = (s: string) => s.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12);
  return `OTECCorexia-${clean(courseId)}-${clean(lessonId)}`;
}
