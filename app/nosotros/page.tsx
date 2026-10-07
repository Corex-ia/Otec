'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, Heart, Shield, Zap, Users, Globe, Eye, ArrowRight } from 'lucide-react';

const C = {
  primary: '#5D3FD3',
  primaryLight: '#F0ECFF',
  secondary: '#6B5CE7',
  accent: '#FF8C42',
  accentLight: '#FFF0E6',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  bgLight: '#F9FAFB',
  border: '#E5E7EB',
};

const MISSION_VISION = [
  {
    icon: Target,
    label: 'Misión',
    text: 'Entregar capacitación de excelencia que transforme vidas y potencie organizaciones, a través de programas innovadores, pertinentes y accesibles para todos los chilenos.',
    color: C.primary,
    bg: C.primaryLight,
  },
  {
    icon: Eye,
    label: 'Visión',
    text: 'Ser el referente en capacitación profesional en Chile, reconocidos por la calidad, el impacto social y la innovación en formación continua y desarrollo de talento.',
    color: C.accent,
    bg: C.accentLight,
  },
];

const VALUES = [
  { icon: Target, title: 'Excelencia', desc: 'Buscamos la mejora continua en cada programa, metodología y servicio que ofrecemos.' },
  { icon: Heart, title: 'Compromiso', desc: 'Ponemos a nuestros estudiantes y empresas en el centro de todo lo que hacemos.' },
  { icon: Shield, title: 'Integridad', desc: 'Actuamos con transparencia y ética en cada interacción y proceso.' },
  { icon: Zap, title: 'Innovación', desc: 'Adoptamos nuevas tecnologías y metodologías para ofrecer la mejor experiencia.' },
  { icon: Users, title: 'Comunidad', desc: 'Creemos en el poder del aprendizaje colaborativo y el desarrollo conjunto.' },
  { icon: Globe, title: 'Impacto Social', desc: 'Contribuimos al desarrollo económico y social de Chile a través de la educación.' },
];

const TEAM = [
  { initials: 'OY', name: 'Osvaldo Yáñez', role: 'Director General', color: C.primary, bg: C.primaryLight },
  { initials: 'MM', name: 'Makarena Martínez', role: 'Coordinadora Académica', color: C.accent, bg: C.accentLight },
  { initials: 'IC', name: 'Israel Cifuentes', role: 'Líder Tecnología', color: '#2563EB', bg: '#EFF6FF' },
  { initials: 'BP', name: 'Bárbara Pérez', role: 'Gestora Comercial', color: '#059669', bg: '#ECFDF5' },
  { initials: 'DN', name: 'Daniela Navarrete', role: 'Coordinadora SENCE', color: '#7C3AED', bg: '#F5F3FF' },
];

const STATS = [
  { value: '15+', label: 'Años de experiencia' },
  { value: '10K+', label: 'Personas capacitadas' },
  { value: '500+', label: 'Empresas confían en nosotros' },
  { value: '98%', label: 'Satisfacción de clientes' },
];

export default function NosotrosPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden py-28 min-h-[480px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1563457012475-35409bbbba95?w=1400&q=80)' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(90deg, ${C.primary}EE 0%, ${C.primary}99 50%, transparent 100%)` }}
        />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}
            >
              Quiénes somos
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              El poder de crear{' '}
              <span style={{ color: C.accent }}>mejores futuros</span>
            </h1>
            <p className="text-lg text-white/85 mb-10 max-w-xl leading-relaxed">
              Somos un OTEC certificado con más de 15 años transformando vidas y organizaciones
              a través de la educación. Creemos que el aprendizaje es el motor del progreso.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-white/20">
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-3xl font-black text-white mb-1">{s.value}</div>
                  <div className="text-xs text-white/65">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* MISIÓN Y VISIÓN */}
      <section className="py-20" style={{ background: C.bgLight }}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: C.textPrimary }}>
              Nuestra razón de ser
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: C.textSecondary }}>
              Los pilares que guían cada decisión y cada programa que ofrecemos
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {MISSION_VISION.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="p-8 rounded-2xl border bg-white"
                style={{ borderColor: C.border }}
              >
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: item.bg }}>
                  <item.icon className="h-7 w-7" style={{ color: item.color }} />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: C.textPrimary }}>{item.label}</h3>
                <p className="leading-relaxed" style={{ color: C.textSecondary }}>{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA EBOOK */}
      <section
        className="relative py-16 overflow-hidden"
        style={{ background: C.textPrimary }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=1400&q=80)' }}
        />
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4" style={{ background: C.accentLight, color: C.accent }}>
            Recurso gratuito
          </span>
          <h2 className="text-3xl font-bold text-white mb-3">
            Descarga nuestra guía de capacitación profesional
          </h2>
          <p className="text-white/75 mb-8 max-w-xl mx-auto">
            Aprende cómo estructurar un plan de desarrollo para ti o tu equipo con nuestro ebook gratuito.
          </p>
          <Button size="lg" style={{ background: C.accent, color: '#fff' }} className="font-semibold" asChild>
            <a href="mailto:gestioncomercial@elpoderdecrear.cl?subject=Solicitud%20Ebook">
              Descargar ebook gratuito
            </a>
          </Button>
        </div>
      </section>

      {/* VALORES */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: C.textPrimary }}>
              Nuestros valores
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: C.textSecondary }}>
              Los principios que guían cada acción de nuestro equipo
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-4 p-5 rounded-2xl border"
                style={{ background: C.bgLight, borderColor: C.border }}
              >
                <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: C.primaryLight }}>
                  <v.icon className="h-5 w-5" style={{ color: C.primary }} />
                </div>
                <div>
                  <h3 className="font-bold mb-1" style={{ color: C.textPrimary }}>{v.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: C.textSecondary }}>{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* EQUIPO */}
      <section className="py-20" style={{ background: C.bgLight }}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: C.textPrimary }}>
              Nuestro equipo
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: C.textSecondary }}>
              Profesionales apasionados por la educación y el desarrollo de talento
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center p-6 rounded-2xl border bg-white w-44 text-center"
                style={{ borderColor: C.border }}
              >
                <div
                  className="h-16 w-16 rounded-full flex items-center justify-center text-xl font-black mb-4"
                  style={{ background: member.bg, color: member.color }}
                >
                  {member.initials}
                </div>
                <h3 className="font-bold text-sm mb-1" style={{ color: C.textPrimary }}>{member.name}</h3>
                <p className="text-xs" style={{ color: C.textSecondary }}>{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CERTIFICACIONES */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-2" style={{ color: C.textPrimary }}>
              Certificaciones y acreditaciones
            </h2>
            <p style={{ color: C.textSecondary }}>Avalados por organismos oficiales del sistema de capacitación chileno</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <div
              className="flex items-center gap-3 px-6 py-4 rounded-2xl border"
              style={{ background: C.primaryLight, borderColor: `${C.primary}33` }}
            >
              <Shield className="h-6 w-6" style={{ color: C.primary }} />
              <div>
                <p className="font-bold text-sm" style={{ color: C.primary }}>OTEC Certificada</p>
                <p className="text-xs" style={{ color: C.textSecondary }}>NCh 2728 — Registro activo SENCE</p>
              </div>
            </div>
            <div
              className="flex items-center gap-3 px-6 py-4 rounded-2xl border"
              style={{ background: C.accentLight, borderColor: `${C.accent}33` }}
            >
              <Shield className="h-6 w-6" style={{ color: C.accent }} />
              <div>
                <p className="font-bold text-sm" style={{ color: C.accent }}>ATE Registrada</p>
                <p className="text-xs" style={{ color: C.textSecondary }}>Asistencia Técnica Educativa — MINEDUC</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section
        className="py-20 text-white"
        style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}
      >
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Únete a nuestra comunidad
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Miles de profesionales y empresas ya confían en nosotros. Es tu turno.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              asChild
              className="font-semibold group"
              style={{ background: '#fff', color: C.primary }}
            >
              <Link href="/cursos">
                Ver cursos disponibles
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white/40 text-white hover:bg-white/10 hover:text-white font-medium"
            >
              <Link href="/contacto">Contactar al equipo</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
