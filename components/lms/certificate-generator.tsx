'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Award, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import CertificateTemplate, {
  CertificateMode,
} from '@/components/lms/certificate-template';

import { supabase } from '@/lib/supabase/client';

interface Props {
  studentName: string;
  studentRun?: string | null;
  courseTitle: string;
  completedAt: string;
  durationHours: number;
  instructorName?: string | null;
  courseId: string;
  userId: string;

  // NUEVO
  modality?: string;
  attendancePercent?: number;
  finalGrade?: number;

  // PARA DEMO / FUTURO
  participantInstitutionName?: string;
  useSence?: boolean;
}

export function CertificateGenerator({
  studentName,
  studentRun,
  courseTitle,
  completedAt,
  durationHours,
  instructorName,
  courseId,
  userId,
  modality = 'e-learning sincrónica',
  attendancePercent = 100,
  finalGrade = 7,
  participantInstitutionName,
  useSence = false,
}: Props) {
  const [generating, setGenerating] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  // 🔥 DETERMINAR MODALIDAD AUTOMÁTICAMENTE
  const resolveMode = (): CertificateMode => {
    if (!participantInstitutionName) return 'educacion_continua';
    if (useSence) return 'empresa_con_franquicia_sence';
    return 'empresa_sin_franquicia';
  };

  const generateCertificate = async () => {
    setGenerating(true);

    try {
      // 1. Obtener token de sesión Supabase
      const { data: { session } } = await supabase.auth.getSession();
      const idToken = session?.access_token;

      // 2. Crear certificado en backend (Firestore)
      const res = await fetch('/api/certificates/issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          courseId,
          courseTitle,
          userName: studentName,
        }),
      });

      const data = await res.json();

      if (!data?.certificate) {
        throw new Error('No se pudo generar certificado');
      }

      const certificate = data.certificate;

      // 3. Renderizar HTML → Canvas
      const element = certificateRef.current;
      if (!element) throw new Error('Template no encontrado');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');

      // 4. Crear PDF
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);

      // 5. Descargar
      const filename = `Certificado_${studentName.replace(/\s/g, '_')}.pdf`;
      pdf.save(filename);

      toast.success('Certificado generado correctamente');
    } catch (err) {
      console.error(err);
      toast.error('Error al generar el certificado');
    } finally {
      setGenerating(false);
    }
  };

  const mode = resolveMode();

  return (
    <>
      {/* BOTÓN */}
      <Button
        onClick={generateCertificate}
        disabled={generating}
        className="gap-2 bg-emerald-700 hover:bg-emerald-800 text-white"
      >
        {generating ? (
          <RefreshCw className="h-4 w-4 animate-spin" />
        ) : (
          <Award className="h-4 w-4" />
        )}
        {generating ? 'Generando...' : 'Descargar Certificado'}
      </Button>

      {/* TEMPLATE OCULTO PARA GENERAR PDF */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div ref={certificateRef}>
          <CertificateTemplate
            mode={mode}
            studentName={studentName}
            studentRun={studentRun}
            courseTitle={courseTitle}
            modalityLabel={modality}
            startDate={completedAt}
            endDate={completedAt}
            durationHours={durationHours}
            finalGrade={finalGrade}
            attendancePercent={attendancePercent}
            issuedAt={new Date().toLocaleDateString()}
            certificateCode={`CERT-${userId.slice(0, 6)}`}
            verificationUrl={`https://tu-dominio.com/certificados/${courseId}`}
            signerName={instructorName || 'Director Académico'}
            signerRole="Director Académico"
            participantInstitutionName={participantInstitutionName}
            senceRegistrationNumber={useSence ? 'N°4558' : undefined}
          />
        </div>
      </div>
    </>
  );
}