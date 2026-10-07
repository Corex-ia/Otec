'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useAnimationControls } from 'motion/react';
import {
  Building2, Users, GraduationCap, Award, CheckCircle,
  ArrowRight, Sparkles, Target, TrendingUp, BookOpen,
  Shield, Play, Star, Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const C = {
  primary: '#5D3FD3',
  primaryLight: '#F0ECFF',
  secondary: '#6B5CE7',
  accent: '#FF8C42',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  bgLight: '#F9FAFB',
  border: '#E5E7EB',
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
  }
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const scaleOnHover = {
  rest: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.3, ease: 'easeOut' } }
};

// ─── TrustedCompanies ────────────────────────────────────────────────────────
const COMPANIES = [
  'Ministerio de Bienes Nacionales',
  'Ministerio de Agricultura',
  'Programa Quiero mi Barrio',
  'Subsecretaría de Transportes',
  'DGAC Chile',
  'Senado de Chile',
  'SERNAMEG',
  'Municipalidad de Santa Bárbara',
  'Municipalidad de Navidad',
  'Programa Familias',
  'Chile Aduanas',
  'DIPRECA',
  'Corp. Municipal Punta Arenas',
  'SEREMI Reg. Metropolitana',
  'Subsecretaría FFAA',
];

function TrustedCompanies() {
  const [isPaused, setIsPaused] = useState(false);
  const controls = useAnimationControls();
  const duplicated = [...COMPANIES, ...COMPANIES, ...COMPANIES];

  useEffect(() => {
    if (!isPaused) {
      controls.start({
        x: [0, -(220 * COMPANIES.length)],
        transition: {
          x: { repeat: Infinity, repeatType: 'loop', duration: COMPANIES.length * 3.5, ease: 'linear' },
        },
      });
    } else {
      controls.stop();
    }
  }, [isPaused, controls]);

  return (
    <motion.section
      className="py-20 relative overflow-hidden"
      style={{ backgroundColor: 'white' }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: C.primary }} />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: C.accent }} />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div className="text-center mb-12" variants={fadeInUp}>
          <Badge
            className="mb-4 text-sm px-4 py-2"
            style={{ background: `linear-gradient(135deg, ${C.primary} 0%, ${C.secondary} 100%)`, color: 'white', border: 'none' }}
          >
            Nuestros Clientes
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4" style={{ color: C.primary }}>
            Instituciones que Han Confiado en Nosotros
          </h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: C.textSecondary }}>
            Organismos públicos y empresas de diversos sectores han transformado sus equipos
            con nuestras soluciones de capacitación acreditadas por SENCE
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="mt-12 overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <motion.div className="flex gap-6" animate={controls} style={{ width: 'fit-content' }}>
            {duplicated.map((name, index) => (
              <motion.div
                key={`${name}-${index}`}
                className="flex-shrink-0 group cursor-pointer"
                style={{ width: '210px' }}
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              >
                <div
                  className="relative rounded-xl border-2 flex items-center justify-center p-5 transition-all duration-300"
                  style={{ borderColor: C.border, backgroundColor: 'white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', minHeight: '80px' }}
                >
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(135deg, ${C.primary}10 0%, ${C.accent}15 100%)` }}
                  />
                  <span className="relative z-10 text-xs font-semibold text-center leading-tight" style={{ color: C.textSecondary }}>
                    {name}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div className="mt-8 text-center" variants={fadeInUp}>
          <div
            className="inline-block px-8 py-4 rounded-2xl"
            style={{ background: `linear-gradient(135deg, ${C.primary}08 0%, ${C.accent}08 100%)`, border: `1px solid ${C.border}` }}
          >
            <p className="text-sm font-medium mb-1" style={{ color: C.textSecondary }}>OTEC Certificada NCh 2728:2015</p>
            <p
              className="text-2xl md:text-3xl font-bold"
              style={{
                background: `linear-gradient(135deg, ${C.primary} 0%, ${C.accent} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Múltiples Instituciones Capacitadas
            </p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

// ─── OurHistory ──────────────────────────────────────────────────────────────
function OurHistory() {
  const stats = [
    { icon: Award, value: 'Ley 19.518', label: 'Franquicia Tributaria', color: C.primary },
    { icon: Shield, value: 'NCh 2728', label: 'Certificación vigente', color: C.secondary },
    { icon: Star, value: '95%', label: 'Satisfacción', color: C.accent },
    { icon: TrendingUp, value: '100%', label: 'Compromiso con calidad', color: C.primary },
  ];

  return (
    <motion.section
      className="py-20"
      style={{ backgroundColor: C.bgLight }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-12" variants={fadeInUp}>
            <Badge className="mb-4" style={{ backgroundColor: C.primaryLight, color: C.primary }}>Sobre Nosotros</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: C.primary }}>Nuestra Historia</h2>
            <p className="text-lg max-w-3xl mx-auto leading-relaxed" style={{ color: C.textSecondary }}>
              Desde nuestros inicios, hemos trabajado con la convicción de que la capacitación
              profesional es la clave para el crecimiento personal y empresarial. Como OTEC
              certificada bajo la norma NCh 2728:2015 y acreditada por el SENCE, nos
              enorgullecemos de ofrecer formación de excelencia que transforma vidas y organizaciones.
            </p>
          </motion.div>

          <motion.div className="mb-12" variants={fadeInUp}>
            <Card className="overflow-hidden border-2" style={{ borderColor: C.border }}>
              <div
                className="relative aspect-video flex items-center justify-center group cursor-pointer"
                style={{ background: `linear-gradient(135deg, ${C.primary} 0%, ${C.secondary} 100%)` }}
              >
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                </div>
                <motion.div className="relative z-10" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}>
                    <Play className="w-10 h-10 ml-1" style={{ color: C.accent }} fill={C.accent} />
                  </div>
                </motion.div>
                <div className="absolute inset-0 flex items-end p-8 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="text-white">
                    <p className="text-2xl font-bold mb-2">Conoce nuestra historia</p>
                    <p className="text-sm opacity-90">Video institucional • 3:45 min</p>
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge className="text-xs px-3 py-1" style={{ backgroundColor: C.accent, color: 'white' }}>Video próximamente</Badge>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-6" variants={staggerChildren}>
            {stats.map((stat, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
                  <Card className="p-6 text-center border-2 hover:shadow-lg transition-shadow" style={{ borderColor: C.border }}>
                    <motion.div className="mb-4" whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                      <stat.icon className="w-10 h-10 mx-auto" style={{ color: stat.color }} />
                    </motion.div>
                    <div className="text-3xl font-bold mb-2" style={{ color: C.primary }}>{stat.value}</div>
                    <div className="text-sm font-medium" style={{ color: C.textSecondary }}>{stat.label}</div>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div className="mt-12 text-center" variants={fadeInUp}>
            <p className="text-base max-w-3xl mx-auto leading-relaxed" style={{ color: C.textSecondary }}>
              Nuestro compromiso va más allá de la enseñanza: acompañamos a cada empresa y persona
              en su proceso de transformación, entregando herramientas concretas, certificaciones
              válidas y un seguimiento personalizado que garantiza resultados medibles.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const navigate = (page: string) => {
    const routes: Record<string, string> = {
      home: '/',
      nosotros: '/nosotros',
      empresas: '/empresas',
      ate: '/sence',
      'educacion-continua': '/educacion-continua',
      cursos: '/cursos',
      eventos: '/eventos',
      contacto: '/contacto',
      checkout: '/checkout',
    };
    router.push(routes[page] ?? `/${page}`);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.bgLight }}>

      {/* ── HERO ── */}
      <motion.section
        className="relative overflow-hidden"
        style={{ backgroundColor: C.primary }}
        initial="hidden"
        animate="visible"
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <motion.div
            className="absolute top-20 right-20 w-96 h-96 rounded-full blur-3xl"
            style={{ backgroundColor: C.accent }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-20 left-20 w-96 h-96 rounded-full blur-3xl"
            style={{ backgroundColor: C.secondary }}
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="container mx-auto px-4 lg:px-8 py-24 lg:py-40 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div className="text-center mb-16" variants={fadeInUp}>

              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
              >
                <Badge
                  variant="outline"
                  className="mb-8 text-sm px-5 py-2.5 border-2 inline-flex items-center gap-2"
                  style={{ borderColor: C.accent, color: 'white', backgroundColor: 'rgba(243,108,33,0.15)' }}
                >
                  <Shield className="w-4 h-4" />
                  OTEC Certificada NCh 2728:2015 • Acreditada por SENCE
                </Badge>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              >
                <h1
                  className="text-5xl md:text-6xl lg:text-8xl font-bold mb-6 text-white leading-tight"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  EL PODER DE{' '}
                  <motion.span
                    className="inline-block"
                    style={{ color: C.accent }}
                    animate={{
                      textShadow: [
                        '0 0 20px rgba(243,108,33,0)',
                        '0 0 20px rgba(243,108,33,0.3)',
                        '0 0 20px rgba(243,108,33,0)',
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    CREAR
                  </motion.span>
                </h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
              >
                <p
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-10 text-white/95"
                  style={{ fontStyle: 'italic', letterSpacing: '0.01em', lineHeight: '1.3' }}
                >
                  Aprendes hoy,{' '}
                  <span style={{ color: C.accent }}>lideras mañana</span>
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
              >
                <p className="text-xl md:text-2xl text-white/90 mb-16 max-w-4xl mx-auto leading-relaxed">
                  Capacitación profesional para empresas y organizaciones,{' '}
                  <strong>con enfoque en calidad, pertinencia y desarrollo de competencias.</strong>
                </p>
              </motion.div>

              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-16 max-w-4xl mx-auto"
                initial="hidden"
                animate="visible"
                variants={staggerChildren}
              >
                {[
                  { value: 'Ley 19.518', label: 'Franquicia Tributaria', icon: Award },
                  { value: '95%', label: 'Satisfacción', icon: Star },
                  { value: '100%', label: 'Compromiso con calidad', icon: Shield },
                  { value: '24/7', label: 'Soporte continuo', icon: Users },
                ].map((stat, index) => (
                  <motion.div key={index} variants={fadeInUp} className="text-center">
                    <stat.icon className="w-8 h-8 mx-auto mb-3" style={{ color: C.accent }} />
                    <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-white/70">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Dual CTA cards */}
            <motion.div
              className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"
              variants={staggerChildren}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={fadeInUp}>
                <motion.div whileHover="hover" initial="rest" variants={scaleOnHover}>
                  <Card
                    className="p-8 cursor-pointer group relative overflow-hidden border-2 h-full"
                    style={{ backgroundColor: 'white', borderColor: C.primary }}
                    onClick={() => navigate('empresas')}
                  >
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                      style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.accent})` }}
                    />
                    <div className="relative z-10">
                      <Building2 className="w-12 h-12 mb-4" style={{ color: C.primary }} />
                      <h3 className="text-2xl font-bold mb-3" style={{ color: C.primary }}>Para Empresas</h3>
                      <p className="text-base mb-6" style={{ color: C.textSecondary }}>
                        Capacitación corporativa, diagnóstico, propuestas a medida
                        y gestión completa con respaldo SENCE
                      </p>
                      <ul className="space-y-3 mb-6">
                        {['Programas personalizados', 'Financiamiento SENCE', 'Reportería y certificación', 'Acompañamiento especializado'].map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: C.accent }} />
                            <span className="text-sm" style={{ color: C.textPrimary }}>{item}</span>
                          </li>
                        ))}
                      </ul>
                      <Button className="w-full" style={{ backgroundColor: C.primary, color: 'white' }}>
                        Cotizar Capacitación
                        <motion.span
                          className="inline-block ml-2"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </motion.span>
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <motion.div whileHover="hover" initial="rest" variants={scaleOnHover}>
                  <Card
                    className="p-8 cursor-pointer group relative overflow-hidden border-2 h-full"
                    style={{ backgroundColor: 'white', borderColor: C.accent }}
                    onClick={() => navigate('educacion-continua')}
                  >
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                      style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.secondary})` }}
                    />
                    <div className="relative z-10">
                      <GraduationCap className="w-12 h-12 mb-4" style={{ color: C.accent }} />
                      <h3 className="text-2xl font-bold mb-3" style={{ color: C.accent }}>Educación Continua</h3>
                      <p className="text-base mb-6" style={{ color: C.textSecondary }}>
                        Cursos individuales para tu crecimiento profesional,
                        con certificación válida y acceso a plataforma
                      </p>
                      <ul className="space-y-3 mb-6">
                        {['Inscripción individual', 'Certificación oficial', 'Horarios flexibles', 'Plataforma 24/7'].map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: C.primary }} />
                            <span className="text-sm" style={{ color: C.textPrimary }}>{item}</span>
                          </li>
                        ))}
                      </ul>
                      <Button className="w-full" style={{ backgroundColor: C.accent, color: 'white' }}>
                        Ver Cursos
                        <motion.span
                          className="inline-block ml-2"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </motion.span>
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          style={{ opacity: scrollOpacity }}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/50 rounded-full" />
          </div>
        </motion.div>
      </motion.section>

      {/* ── CLIENTES ── */}
      <TrustedCompanies />

      {/* ── PROVEEDORES DEL ESTADO ── */}
      <motion.section
        className="py-16 border-y"
        style={{ backgroundColor: C.primaryLight, borderColor: C.border }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4" style={{ backgroundColor: C.primary, color: 'white', fontSize: '0.875rem', padding: '0.5rem 1.5rem' }}>
                <Shield className="w-4 h-4 mr-2 inline-block" />
                Proveedor Oficial
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: C.textPrimary }}>
                Somos Proveedores del Estado
              </h2>
              <p className="text-lg md:text-xl mb-6" style={{ color: C.textSecondary }}>
                Organismo Técnico de Capacitación certificado y acreditado para brindar servicios
                de formación a instituciones públicas y organismos estatales en Chile.
              </p>
              <div className="flex flex-wrap justify-center gap-6 mt-8">
                {['Certificación NCh 2728:2015', 'Acreditación SENCE', 'Experiencia en sector público'].map((text) => (
                  <div key={text} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" style={{ color: C.accent }} />
                    <span style={{ color: C.textSecondary }}>{text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ── NUESTRA HISTORIA ── */}
      <OurHistory />

      {/* ── SOLUCIONES CON TABS ── */}
      <motion.section
        className="py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4" style={{ backgroundColor: C.primaryLight, color: C.primary }}>
              Nuestras Soluciones
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: C.primary }}>
              Capacitación para cada necesidad
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: C.textSecondary }}>
              Elige el camino que mejor se adapte a tus objetivos de formación
            </p>
          </motion.div>

          <Tabs defaultValue="empresas" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
              <TabsTrigger value="empresas" className="text-base">
                <Building2 className="w-4 h-4 mr-2" />
                Empresas
              </TabsTrigger>
              <TabsTrigger value="personas" className="text-base">
                <GraduationCap className="w-4 h-4 mr-2" />
                Personas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="empresas">
              <motion.div className="grid md:grid-cols-3 gap-6" variants={staggerChildren} initial="hidden" animate="visible">
                {[
                  { icon: Target, title: 'Diagnóstico', description: 'Evaluamos las necesidades de capacitación de tu equipo', color: C.primary },
                  { icon: BookOpen, title: 'Propuesta a Medida', description: 'Diseñamos programas personalizados para tus objetivos', color: C.secondary },
                  { icon: TrendingUp, title: 'Ejecución y Reportes', description: 'Gestión completa con seguimiento y certificación', color: C.accent },
                ].map((item, idx) => (
                  <motion.div key={idx} variants={fadeInUp}>
                    <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
                      <Card className="p-6 h-full border-2 hover:shadow-lg transition-shadow">
                        <motion.div className="mb-4" whileHover={{ scale: 1.1, rotate: 5 }}>
                          <item.icon className="w-12 h-12" style={{ color: item.color }} />
                        </motion.div>
                        <h3 className="text-xl font-bold mb-3" style={{ color: C.textPrimary }}>{item.title}</h3>
                        <p style={{ color: C.textSecondary }}>{item.description}</p>
                      </Card>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="personas">
              <motion.div className="grid md:grid-cols-3 gap-6" variants={staggerChildren} initial="hidden" animate="visible">
                {[
                  { icon: Sparkles, title: 'Elige tu Curso', description: 'Catálogo actualizado con cursos certificados', color: C.accent },
                  { icon: Play, title: 'Aprende Online', description: 'Acceso 24/7 a nuestra plataforma LUMEN', color: C.secondary },
                  { icon: Award, title: 'Certifícate', description: 'Obtén certificación oficial validada', color: C.primary },
                ].map((item, idx) => (
                  <motion.div key={idx} variants={fadeInUp}>
                    <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
                      <Card className="p-6 h-full border-2 hover:shadow-lg transition-shadow">
                        <motion.div className="mb-4" whileHover={{ scale: 1.1, rotate: -5 }}>
                          <item.icon className="w-12 h-12" style={{ color: item.color }} />
                        </motion.div>
                        <h3 className="text-xl font-bold mb-3" style={{ color: C.textPrimary }}>{item.title}</h3>
                        <p style={{ color: C.textSecondary }}>{item.description}</p>
                      </Card>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </motion.section>

      {/* ── CTA FINAL ── */}
      <motion.section
        className="py-20"
        style={{ background: `linear-gradient(135deg, ${C.primary} 0%, ${C.secondary} 100%)` }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-6 text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              ¿Listo para comenzar?
            </motion.h2>
            <motion.p
              className="text-lg text-white/90 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Contáctanos y descubre cómo podemos ayudarte a alcanzar tus objetivos
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="bg-white hover:bg-gray-100 font-semibold" style={{ color: C.primary }} asChild>
                  <Link href="/empresas">
                    Soy Empresa
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 font-semibold"
                  style={{ borderColor: 'white', color: 'white', backgroundColor: 'transparent' }}
                  asChild
                >
                  <Link href="/educacion-continua">
                    Busco Curso Individual
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-white/80"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <a href="tel:+56955222430" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
                +56 9 5522 2430
              </a>
              <span className="hidden sm:block opacity-40">|</span>
              <a href="mailto:contacto@elpoderdecrear.cl" className="hover:text-white transition-colors">
                contacto@elpoderdecrear.cl
              </a>
            </motion.div>
          </div>
        </div>
      </motion.section>

    </div>
  );
}
