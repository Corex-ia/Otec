'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Users,
  Star,
  Target,
  Shield,
  Lightbulb,
  Heart,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

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

const HERO_PILLARS = [
  { icon: BookOpen, label: 'Innovación Pedagógica' },
  { icon: Users, label: 'Desarrollo Docente' },
  { icon: Star, label: 'Calidad Educativa' },
  { icon: Shield, label: 'Gestión Institucional' },
];

const WORK_AREAS = [
  {
    icon: Target,
    title: 'Gestión Pedagógica',
    desc: 'Fortalecemos las capacidades de los equipos docentes en diseño curricular, metodologías activas y evaluación del aprendizaje para mejorar los resultados educativos.',
    color: C.primary,
    bg: C.primaryLight,
  },
  {
    icon: Star,
    title: 'Liderazgo Educativo',
    desc: 'Desarrollamos habilidades directivas en líderes escolares para una gestión efectiva, toma de decisiones informada y construcción de comunidades educativas de excelencia.',
    color: C.accent,
    bg: C.accentLight,
  },
  {
    icon: Heart,
    title: 'Formación y Convivencia',
    desc: 'Programas para fortalecer la convivencia escolar, el bienestar socioemocional y la formación integral de los estudiantes en ambientes seguros y acogedores.',
    color: '#059669',
    bg: '#ECFDF5',
  },
  {
    icon: Lightbulb,
    title: 'Gestión de Recursos',
    desc: 'Herramientas para optimizar los recursos educativos, tecnológicos y administrativos del establecimiento, mejorando la eficiencia y el impacto institucional.',
    color: '#2563EB',
    bg: '#EFF6FF',
  },
];

const COURSES = [
  { emoji: '🎓', title: 'Didáctica para el Siglo XXI', hours: '32 h', level: 'Todos los niveles', category: 'Pedagogía' },
  { emoji: '📐', title: 'Evaluación para el Aprendizaje', hours: '24 h', level: 'Docentes', category: 'Evaluación' },
  { emoji: '🧠', title: 'Neurociencias Aplicadas a la Educación', hours: '20 h', level: 'Intermedio', category: 'Neuroeducación' },
  { emoji: '🤝', title: 'Liderazgo Escolar Efectivo', hours: '28 h', level: 'Directivos', category: 'Liderazgo' },
  { emoji: '💬', title: 'Convivencia Escolar y Clima Educativo', hours: '16 h', level: 'Todos', category: 'Convivencia' },
  { emoji: '🖥️', title: 'Tecnologías para la Enseñanza', hours: '20 h', level: 'Básico', category: 'TIC' },
];

const EXTRA_BENEFITS = [
  { icon: Shield, title: 'Acreditados por MINEDUC', desc: 'Somos ATE registrada ante el Ministerio de Educación. Todos nuestros programas son válidos para el sistema escolar chileno.', color: C.primary, bg: C.primaryLight },
  { icon: Star, title: 'Relatores Especialistas', desc: 'Nuestro equipo está formado por docentes y profesionales con amplia trayectoria en el sistema educativo nacional.', color: C.accent, bg: C.accentLight },
  { icon: Target, title: 'Seguimiento de Impacto', desc: 'Medimos y reportamos el impacto de cada programa en el establecimiento para demostrar el retorno de la inversión educativa.', color: '#059669', bg: '#ECFDF5' },
  { icon: Users, title: 'Modalidades Adaptables', desc: 'Talleres presenciales, jornadas in-situ, cursos online y programas híbridos que se ajustan al calendario escolar.', color: '#2563EB', bg: '#EFF6FF' },
];

const STATS = [
  { value: '200+', label: 'Establecimientos atendidos' },
  { value: '5K+', label: 'Docentes formados' },
  { value: '15', label: 'Regiones con cobertura' },
  { value: '98%', label: 'Satisfacción declarada' },
];

export default function SencePage() {
  const [slide, setSlide] = useState(0);
  const perPage = 3;
  const totalSlides = Math.ceil(COURSES.length / perPage);
  const visibleCourses = COURSES.slice(slide * perPage, slide * perPage + perPage);

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO */}
      <section
        className="relative overflow-hidden py-24"
        style={{ background: `linear-gradient(135deg, ${C.accent} 0%, ${C.primary} 65%, #3B2BAA 100%)` }}
      >
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.07) 0%, transparent 60%)' }} />
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
              Asistencia Técnica Educativa — ATE
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              El poder de crear{' '}
              <span className="underline decoration-white/40">mejores comunidades educativas</span>
            </h1>
            <p className="text-lg text-white/85 mb-12 max-w-2xl leading-relaxed">
              Acompañamos a establecimientos educacionales y sus equipos en procesos de mejora continua,
              desarrollo docente y gestión institucional con programas avalados por MINEDUC.
            </p>

            {/* 4 pilares */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
              {HERO_PILLARS.map((p) => (
                <div
                  key={p.label}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl text-center"
                  style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
                >
                  <p.icon className="h-6 w-6 text-white" />
                  <span className="text-xs font-semibold text-white/90">{p.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                asChild
                className="font-semibold group"
                style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', color: '#fff' }}
              >
                <Link href="/contacto">
                  Solicitar propuesta ATE
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-white/30 text-white hover:bg-white/10 hover:text-white font-medium"
              >
                <Link href="/cursos">Ver cursos disponibles</Link>
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

      {/* ÁREAS DE TRABAJO */}
      <section className="py-20" style={{ background: C.bgLight }}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: C.textPrimary }}>
              Áreas de trabajo ATE
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: C.textSecondary }}>
              Abordamos de forma integral los ejes clave del desarrollo educativo institucional
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {WORK_AREAS.map((area, i) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border hover:shadow-lg transition-all bg-white"
                style={{ borderColor: C.border }}
              >
                <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-5" style={{ background: area.bg }}>
                  <area.icon className="h-6 w-6" style={{ color: area.color }} />
                </div>
                <h3 className="text-base font-bold mb-2" style={{ color: C.textPrimary }}>{area.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: C.textSecondary }}>{area.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CURSOS CARRUSEL */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: C.textPrimary }}>
                Programas ATE destacados
              </h2>
              <p className="text-lg" style={{ color: C.textSecondary }}>
                Formación especializada para equipos educativos
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSlide((s) => Math.max(0, s - 1))}
                disabled={slide === 0}
                className="h-10 w-10 rounded-xl border flex items-center justify-center transition-all disabled:opacity-40"
                style={{ borderColor: C.border }}
              >
                <ChevronLeft className="h-5 w-5" style={{ color: C.textPrimary }} />
              </button>
              <button
                onClick={() => setSlide((s) => Math.min(totalSlides - 1, s + 1))}
                disabled={slide === totalSlides - 1}
                className="h-10 w-10 rounded-xl border flex items-center justify-center transition-all disabled:opacity-40"
                style={{ borderColor: C.border }}
              >
                <ChevronRight className="h-5 w-5" style={{ color: C.textPrimary }} />
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {visibleCourses.map((course, i) => (
              <motion.div
                key={course.title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border hover:shadow-lg transition-all"
                style={{ background: C.bgLight, borderColor: C.border }}
              >
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center text-2xl mb-4" style={{ background: C.primaryLight }}>
                  {course.emoji}
                </div>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full mb-3 inline-block"
                  style={{ background: C.primaryLight, color: C.primary }}
                >
                  {course.category}
                </span>
                <h3 className="font-bold mb-3 leading-snug" style={{ color: C.textPrimary }}>{course.title}</h3>
                <div className="flex gap-3 text-xs mb-4" style={{ color: C.textSecondary }}>
                  <span>⏱ {course.hours}</span>
                  <span>👥 {course.level}</span>
                </div>
                <Link
                  href="/contacto"
                  className="flex items-center gap-1 text-sm font-semibold"
                  style={{ color: C.primary }}
                >
                  Solicitar programa <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className="h-2 rounded-full transition-all"
                style={{
                  width: slide === i ? '24px' : '8px',
                  background: slide === i ? C.primary : C.border,
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* BENEFICIOS ADICIONALES */}
      <section className="py-20" style={{ background: C.bgLight }}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: C.textPrimary }}>
              ¿Por qué elegirnos como ATE?
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: C.textSecondary }}>
              Experiencia, calidad y compromiso con el mejoramiento educativo continuo
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {EXTRA_BENEFITS.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border bg-white hover:shadow-md transition-all"
                style={{ borderColor: C.border }}
              >
                <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-4" style={{ background: b.bg }}>
                  <b.icon className="h-6 w-6" style={{ color: b.color }} />
                </div>
                <h3 className="font-bold mb-2" style={{ color: C.textPrimary }}>{b.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: C.textSecondary }}>{b.desc}</p>
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
            ¿Tu establecimiento necesita apoyo ATE?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Conversemos sobre los desafíos de tu comunidad educativa y diseñemos un plan a medida.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              asChild
              className="font-semibold group"
              style={{ background: '#fff', color: C.primary }}
            >
              <Link href="/contacto">
                Solicitar propuesta ATE
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white/40 text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/cursos">Ver catálogo completo</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
