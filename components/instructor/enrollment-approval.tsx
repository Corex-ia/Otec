'use client';

import { useState, useEffect } from 'react';
import {
  getCourseEnrollmentsWithProfiles,
  getCourseAttendanceUserIds,
  updateEnrollmentApproval,
  sendStudentNotification,
  EnrollmentDoc,
  ProfileDoc,
} from '@/lib/firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, CircleCheck as CheckCircle, Circle as XCircle, Clock, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

type EnrollmentWithProfile = EnrollmentDoc & { profile: ProfileDoc | null };

interface AttendanceMap {
  [userId: string]: boolean;
}

interface Props {
  courseId: string;
  courseTitle: string;
}

export function EnrollmentApproval({ courseId, courseTitle }: Props) {
  const [enrollments, setEnrollments] = useState<EnrollmentWithProfile[]>([]);
  const [attendance, setAttendance] = useState<AttendanceMap>({});
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    Promise.all([
      getCourseEnrollmentsWithProfiles(courseId),
      getCourseAttendanceUserIds(courseId),
    ]).then(([data, attendedIds]) => {
      setEnrollments(data);
      const map: AttendanceMap = {};
      attendedIds.forEach((uid) => {
        map[uid] = true;
      });
      setAttendance(map);
      setLoading(false);
    }).catch((err) => {
      console.error('[EnrollmentApproval] Error cargando datos:', err);
      setLoading(false);
    });
  }, [courseId]);

  const handleApprove = async (enrollment: EnrollmentWithProfile) => {
    setProcessingId(enrollment.id);
    try {
      await updateEnrollmentApproval(enrollment.id, true);
      setEnrollments((prev) =>
        prev.map((e) => (e.id === enrollment.id ? { ...e, is_approved: true } : e))
      );
      await sendStudentNotification(
        enrollment.user_id,
        `Has sido aprobado para el curso ${courseTitle}. Ya puedes unirte a las sesiones en vivo.`,
        enrollment.course_id
      );
      toast.success(`Alumno aprobado: ${enrollment.profile?.full_name ?? 'el alumno'}`);
    } catch {
      toast.error('Error al aprobar el acceso');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRevoke = async (enrollment: EnrollmentWithProfile) => {
    setProcessingId(enrollment.id);
    try {
      await updateEnrollmentApproval(enrollment.id, false);
      setEnrollments((prev) =>
        prev.map((e) => (e.id === enrollment.id ? { ...e, is_approved: false } : e))
      );
      toast.success('Acceso revocado');
    } catch {
      toast.error('Error al revocar el acceso');
    } finally {
      setProcessingId(null);
    }
  };

  const getInitials = (name: string) =>
    name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();

  const pending = enrollments.filter((e) => !e.is_approved);
  const approved = enrollments.filter((e) => e.is_approved);

  const EnrollmentRow = ({ enrollment }: { enrollment: EnrollmentWithProfile }) => (
    <div className="flex items-center gap-3 py-3 border-b last:border-0">
      <Avatar className="h-9 w-9 flex-shrink-0">
        <AvatarImage src={enrollment.profile?.avatar_url ?? undefined} />
        <AvatarFallback className="text-xs bg-slate-100 text-slate-600">
          {enrollment.profile?.full_name ? getInitials(enrollment.profile.full_name) : '?'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 truncate">
          {enrollment.profile?.full_name ?? 'Usuario desconocido'}
        </p>
        <p className="text-xs text-slate-400 truncate">{enrollment.profile?.email}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {attendance[enrollment.user_id] && (
          <Badge variant="outline" className="text-emerald-700 border-emerald-200 text-[10px] gap-1 hidden sm:flex">
            <CheckCircle className="h-3 w-3" />
            Meet
          </Badge>
        )}
        <p className="text-[11px] text-slate-400 hidden sm:block">
          {Math.round(enrollment.progress)}%
        </p>
        {enrollment.is_approved ? (
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs gap-1 text-red-600 border-red-200 hover:bg-red-50"
            onClick={() => handleRevoke(enrollment)}
            disabled={processingId === enrollment.id}
          >
            <XCircle className="h-3.5 w-3.5" />
            Revocar
          </Button>
        ) : (
          <Button
            size="sm"
            className="h-7 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700"
            onClick={() => handleApprove(enrollment)}
            disabled={processingId === enrollment.id}
          >
            <UserCheck className="h-3.5 w-3.5" />
            Aprobar
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-slate-600" />
            <CardTitle className="text-base">Consola de Alumnos</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {pending.length > 0 && (
              <Badge className="bg-amber-100 text-amber-800 text-xs gap-1 border-0">
                <Clock className="h-3 w-3" />
                {pending.length} pendiente{pending.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>
        <CardDescription className="truncate">{courseTitle}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-slate-100 rounded" />
            ))}
          </div>
        ) : enrollments.length === 0 ? (
          <div className="py-8 text-center">
            <Users className="h-8 w-8 mx-auto text-slate-200 mb-2" />
            <p className="text-slate-400 text-sm">Sin inscripciones en este curso</p>
          </div>
        ) : (
          <Tabs defaultValue="pending">
            <TabsList className="mb-4 h-8">
              <TabsTrigger value="pending" className="text-xs gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Pendientes ({pending.length})
              </TabsTrigger>
              <TabsTrigger value="approved" className="text-xs gap-1.5">
                <CheckCircle className="h-3.5 w-3.5" />
                Aprobados ({approved.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="pending">
              {pending.length === 0 ? (
                <p className="text-center text-sm text-slate-400 py-6">No hay alumnos pendientes</p>
              ) : (
                <div>
                  {pending.map((e) => (
                    <EnrollmentRow key={e.id} enrollment={e} />
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="approved">
              {approved.length === 0 ? (
                <p className="text-center text-sm text-slate-400 py-6">No hay alumnos aprobados</p>
              ) : (
                <div>
                  {approved.map((e) => (
                    <EnrollmentRow key={e.id} enrollment={e} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
