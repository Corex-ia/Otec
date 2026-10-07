'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Clock, BadgeCheck, Monitor, HeadphonesIcon, ArrowRight } from 'lucide-react';

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

const BENEFITS = [
  {
    icon: Clock,
    title: 'Horarios Flexibles',
    desc: 'Estudia cuando quieras. Nuestro aula virtual está disponible las 24 horas, adaptándose a tu ritmo y agenda profesional.',
    color: C.primary,
    bg: C.primaryLight,
  },
  {
    icon: BadgeCheck,
    title: 'Certificación Oficial',
    desc: 'Obtén un certificado reconocido por SENCE y válido en el mercado laboral chileno al completar cada curso.',
    color: '#059669',
    bg: '#ECFDF5',
  },
  {
    icon: Monitor,
    title: 'Plataforma 24/7',
    desc: 'Accede a contenidos, videos y materiales desde cualquier dispositivo, en cualquier momento del día o la noche.',
    color: '#2563EB',
    bg: '#EFF6FF',
  },
  {
    icon: HeadphonesIcon,
    title: 'Soporte Continuo',
    desc: 'Tutores y equipo de soporte disponibles para responder tus dudas y acompañarte durante todo el proceso.',
    color: C.accent,
    bg: C.accentLight,
  },
];

const FEATURED_COURSES = [
  {
    emoji: '💼',
    title: 'Gestión de Equipos de Alto Rendimiento',
    category: 'Liderazgo',
    duration: '24 horas',
    level: 'Intermedio',
    color: C.primary,
    bg: C.primaryLight,
  },
  {
    emoji: '📊',
    title: 'Excel Avanzado para Profesionales',
    category: 'Tecnología',
    duration: '20 horas',
    level: 'Avanzado',
    color: '#2563EB',
    bg: '#EFF6FF',
  },
  {
    emoji: '🗣️',
    title: 'Comunicación Efectiva en el Trabajo',
    category: 'Habilidades Blandas',
    duration: '16 horas',
    level: 'Básico',
    color: '#059669',
    bg: '#ECFDF5',
  },
];

const STEPS = [
  { step: '01', title: 'Elige tu curso', desc: 'Explora nuestro catálogo y selecciona el programa que mejor se adapte a tus objetivos profesionales.' },
  { step: '02', title: 'Inscríbete', desc: 'Completa el proceso de inscripción en minutos. Recibe acceso inmediato al aula virtual y los materiales.' },
  { step: '03', title: 'Certifícate', desc: 'Completa el curso, aprueba la evaluación y obtén tu certificado oficial reconocido por SENCE.' },
];

const STATS = [
  { value: '70+', label: 'Cursos disponibles' },
  { value: '5K+', label: 'Alumnos activos' },
  { value: '95%', label: 'Tasa de satisfacción' },
  { value: '3', label: 'Modalidades' },
];

export default function EducacionContinuaPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO */}
      <section
        className="relative overflow-hidden py-24"
        style={{ background: `linear-gradient(135deg, ${C.accent} 0%, ${C.primary} 65%, #3B2BAA 100%)` }}
      >
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 20% 80%, rgba(255,255,255,0.07) 0%, transparent 55%)' }} />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}
            >
              Educación Continua — B2C
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Impulsa tu carrera{' '}
              <span className="underline decoration-white/40">profesional</span>
            </h1>
            <p className="text-lg text-white/85 mb-10 max-w-2xl leading-relaxed">
              Programas de formación continua en las áreas más demandadas del mercado. Estudia a tu ritmo,
              certifícate con SENCE y da el salto que tu carrera necesita.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                asChild
                className="font-semibold group"
                style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', color: '#fff' }}
              >
                <Link href="/cursos">
                  Explorar cursos
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-white/30 text-white hover:bg-white/10 hover:text-white font-medium"
              >
                <Link href="/lumen">Acceder al aula virtual</Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-16 border-t border-white/20">
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-3xl font-black text-white mb-1">{s.value}</div>
                  <div className="text-sm text-white/65">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="py-20" style={{ background: C.bgLight }}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: C.textPrimary }}>
              ¿Por qué elegir nuestra plataforma?
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: C.textSecondary }}>
              Diseñada para que el aprendizaje se adapte a tu vida, no al revés
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {BENEFITS.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border hover:shadow-lg transition-all bg-white"
                style={{ borderColor: C.border }}
              >
                <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-5" style={{ background: b.bg }}>
                  <b.icon className="h-6 w-6" style={{ color: b.color }} />
                </div>
                <h3 className="text-base font-bold mb-2" style={{ color: C.textPrimary }}>{b.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: C.textSecondary }}>{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CURSOS DESTACADOS */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: C.textPrimary }}>
              Cursos más populares
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: C.textSecondary }}>
              Los programas más elegidos por nuestros estudiantes este año
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {FEATURED_COURSES.map((course, i) => (
              <motion.div
                key={course.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="p-6 rounded-2xl border hover:shadow-lg transition-all"
                style={{ background: C.bgLight, borderColor: C.border }}
              >
                <div
                  className="h-14 w-14 rounded-2xl flex items-center justify-center text-2xl mb-5"
                  style={{ background: course.bg }}
                >
                  {course.emoji}
                </div>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full mb-3 inline-block"
                  style={{ background: course.bg, color: course.color }}
                >
                  {course.category}
                </span>
                <h3 className="font-bold mb-3 leading-snug" style={{ color: C.textPrimary }}>{course.title}</h3>
                <div className="flex gap-3 text-xs" style={{ color: C.textSecondary }}>
                  <span>⏱ {course.duration}</span>
                  <span>📈 {course.level}</span>
                </div>
                <Link
                  href="/cursos"
                  className="flex items-center gap-1 mt-4 text-sm font-semibold transition-colors"
                  style={{ color: course.color }}
                >
                  Ver curso <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild size="lg" variant="outline" style={{ borderColor: C.primary, color: C.primary }}>
              <Link href="/cursos">Ver todos los cursos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* PASOS */}
      <section className="py-20" style={{ background: C.bgLight }}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: C.textPrimary }}>
              ¿Cómo empezar?
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: C.textSecondary }}>
              En 3 simples pasos estarás aprendiendo y avanzando en tu carrera
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative p-8 rounded-2xl border bg-white text-center"
                style={{ borderColor: C.border }}
              >
                <div className="text-5xl font-black mb-4" style={{ color: `${C.primary}18` }}>{step.step}</div>
                <h3 className="font-bold text-lg mb-3" style={{ color: C.textPrimary }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: C.textSecondary }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section
        className="py-20 text-white"
        style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.primary})` }}
      >
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tu próximo paso profesional comienza aquí
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            La educación continua es la clave para mantenerte competitivo. Empieza hoy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              asChild
              className="font-semibold group"
              style={{ background: '#fff', color: C.primary }}
            >
              <Link href="/cursos">
                Ver todos los cursos
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white/40 text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/contacto">Más información</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
