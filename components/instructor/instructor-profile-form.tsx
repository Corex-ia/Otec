'use client';

import { useState } from 'react';
import { updateInstructorProfile } from '@/lib/firebase/firestore';
import { useAuthStore } from '@/lib/stores/auth-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CircleUser as UserCircle, Save, PenLine, Signature } from 'lucide-react';
import { toast } from 'sonner';
import { FirebaseProfile } from '@/types/firebase';

interface InstructorProfileDoc extends FirebaseProfile {
  instructor_bio?: string | null;
  instructor_signature_url?: string | null;
  total_points?: number;
}

interface Props {
  profile: InstructorProfileDoc;
}

export function InstructorProfileForm({ profile }: Props) {
  const user = useAuthStore((state) => state.user);
  const [bio, setBio] = useState((profile as any).instructor_bio ?? '');
  const [signatureUrl, setSignatureUrl] = useState((profile as any).instructor_signature_url ?? '');
  const [saving, setSaving] = useState(false);

  const getInitials = (name: string) =>
    name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateInstructorProfile(user.id, {
        instructor_bio: bio.trim() || null,
        instructor_signature_url: signatureUrl.trim() || null,
      });
      toast.success('Perfil actualizado correctamente');
    } catch {
      toast.error('Error al guardar el perfil');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <div className="flex items-center gap-2">
          <UserCircle className="h-5 w-5 text-slate-600" />
          <CardTitle className="text-base">Mi Perfil de Instructor</CardTitle>
        </div>
        <CardDescription>
          Tu bio aparecerá en las páginas de curso. La firma digital se usará en los certificados.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile.avatar_url ?? undefined} />
            <AvatarFallback className="text-lg bg-slate-100 text-slate-600">
              {getInitials(profile.full_name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-slate-800">{profile.full_name}</p>
            <p className="text-sm text-slate-400">{profile.email}</p>
            <p className="text-xs text-slate-400 capitalize mt-0.5">Rol: {profile.role}</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm flex items-center gap-1.5">
            <PenLine className="h-3.5 w-3.5" />
            Mini-bio profesional
          </Label>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Escribe una breve descripción de tu experiencia profesional, áreas de especialización, logros académicos..."
            className="resize-none min-h-[100px] text-sm"
            maxLength={500}
          />
          <p className="text-xs text-slate-400 text-right">{bio.length}/500</p>
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm flex items-center gap-1.5">
            <Signature className="h-3.5 w-3.5" />
            URL de firma digital
          </Label>
          <Input
            value={signatureUrl}
            onChange={(e) => setSignatureUrl(e.target.value)}
            placeholder="https://storage.example.com/mi-firma.png"
            className="h-9 text-sm"
          />
          <p className="text-xs text-slate-400">
            Sube tu firma como imagen PNG con fondo transparente y pega la URL aquí
          </p>
        </div>

        {signatureUrl && (
          <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs text-slate-400 mb-2">Vista previa de firma:</p>
            <img
              src={signatureUrl}
              alt="Firma digital"
              className="max-h-20 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="flex justify-end pt-1">
          <Button
            className="gap-2 bg-slate-800 hover:bg-slate-700"
            onClick={handleSave}
            disabled={saving}
          >
            <Save className="h-4 w-4" />
            {saving ? 'Guardando...' : 'Guardar perfil'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
