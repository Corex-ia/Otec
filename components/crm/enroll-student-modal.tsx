'use client';

import { useState } from 'react';
import {
  getProfileByEmail,
  createEnrollment,
  getEnrollment,
  CourseDoc,
  ProfileDoc,
} from '@/lib/firebase/firestore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, UserCheck, UserPlus, CircleAlert as AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  course: CourseDoc;
  open: boolean;
  onClose: () => void;
  onEnrolled?: () => void;
}

export function EnrollStudentModal({ course, open, onClose, onEnrolled }: Props) {
  const [email, setEmail] = useState('');
  const [searching, setSearching] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [foundProfile, setFoundProfile] = useState<ProfileDoc | null>(null);
  const [alreadyEnrolled, setAlreadyEnrolled] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async () => {
    if (!email.trim()) return;
    setSearching(true);
    setFoundProfile(null);
    setAlreadyEnrolled(false);
    setNotFound(false);
    try {
      const profile = await getProfileByEmail(email);
      if (!profile) {
        setNotFound(true);
        return;
      }
      const existing = await getEnrollment(profile.id, course.id);
      if (existing) {
        setAlreadyEnrolled(true);
        setFoundProfile(profile);
        return;
      }
      setFoundProfile(profile);
    } catch (err) {
      toast.error('Error al buscar el usuario');
    } finally {
      setSearching(false);
    }
  };

  const handleEnroll = async () => {
    if (!foundProfile) return;
    setEnrolling(true);
    try {
      await createEnrollment({
        user_id: foundProfile.id,
        course_id: course.id,
        is_approved: false,
      });
      toast.success(`${foundProfile.full_name} inscrito correctamente`);
      onEnrolled?.();
      handleClose();
    } catch (err) {
      toast.error('Error al inscribir al alumno');
    } finally {
      setEnrolling(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setFoundProfile(null);
    setAlreadyEnrolled(false);
    setNotFound(false);
    onClose();
  };

  const getInitials = (name: string) =>
    name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-slate-600" />
            Inscribir Alumno
          </DialogTitle>
          <DialogDescription className="truncate">
            Curso: <span className="font-medium text-slate-700">{course.title}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="enroll-email">Correo electrónico del alumno</Label>
            <div className="flex gap-2">
              <Input
                id="enroll-email"
                type="email"
                placeholder="alumno@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                disabled={searching}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleSearch}
                disabled={searching || !email.trim()}
                className="flex-shrink-0"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {notFound && (
            <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3">
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">
                No se encontró ningún usuario con ese correo. El alumno debe registrarse primero en la plataforma.
              </p>
            </div>
          )}

          {foundProfile && (
            <div className="rounded-xl border bg-slate-50 p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11">
                  <AvatarImage src={foundProfile.avatar_url ?? undefined} />
                  <AvatarFallback className="bg-slate-200 text-slate-600 font-medium">
                    {getInitials(foundProfile.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800">{foundProfile.full_name}</p>
                  <p className="text-sm text-slate-500 truncate">{foundProfile.email}</p>
                </div>
                <Badge variant={alreadyEnrolled ? 'secondary' : 'outline'} className="flex-shrink-0">
                  {alreadyEnrolled ? 'Ya inscrito' : foundProfile.role}
                </Badge>
              </div>

              {alreadyEnrolled ? (
                <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2 border border-amber-200">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  Este alumno ya está inscrito en el curso.
                </div>
              ) : (
                <Button
                  className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700"
                  onClick={handleEnroll}
                  disabled={enrolling}
                >
                  <UserCheck className="h-4 w-4" />
                  {enrolling ? 'Inscribiendo...' : `Inscribir a ${foundProfile.full_name.split(' ')[0]}`}
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
