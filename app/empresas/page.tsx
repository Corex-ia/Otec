'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  Building2, Target, Users, FileText, CheckCircle,
  ArrowRight, BarChart3, Shield, Clock, Award,
  Sparkles, TrendingUp, BookOpen, Mail, Phone, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const CorporateColors = {
  primary: '#5D3FD3',
  primaryLight: '#F0ECFF',
  secondary: '#6B5CE7',
  accent: '#FF8C42',
  accentLight: '#FFF0E6',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  bgLight: '#F9FAFB',
  border: '#E5E7EB',
  white: '#FFFFFF',
  black: '#000000',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
};
const CorporateShadow = {
  sm: '0 1px 2px 0 rgba(0,0,0,0.05)',
  md: '0 4px 6px -1px rgba(0,0,0,0.1)',
  lg: '0 10px 15px -3px rgba(0,0,0,0.1)',
  xl: '0 20px 25px -5px rgba(0,0,0,0.1)',
};

export default function EmpresasPage() {
  const router = useRouter();
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: CorporateColors.bgLight }}>

      {/* HERO B2B */}
      <motion.section
        className="relative overflow-hidden py-20 lg:py-32"
        style={{
          background: 'linear-gradient(135deg, #FF8C42 0%, #6B5CE7 100%)'
        }}
        initial="hidden"
        animate="visible"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <motion.div
            className="absolute top-10 right-10 w-96 h-96 rounded-full blur-3xl"
            style={{ backgroundColor: CorporateColors.accent }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div variants={fadeInUp}>
              <Badge
                className="mb-6 text-sm px-4 py-2"
                style={{
                  backgroundColor: 'rgba(243, 108, 33, 0.2)',
                  color: 'white',
                  borderColor: CorporateColors.accent,
                  border: '1px solid'
                }}
              >
                <Building2 className="w-4 h-4 mr-2" />
                Capacitación Corporativa
              </Badge>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white"
              variants={fadeInUp}
            >
              Desarrolla el talento de tu{' '}
              <motion.span
                className="inline-block"
                style={{ color: CorporateColors.accent }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                equipo
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              Programas de capacitación a medida para empresas,
              ejecutables bajo el mecanismo de Franquicia Tributaria SENCE y gestión integral
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={fadeInUp}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-white hover:bg-gray-100"
                  style={{ color: CorporateColors.primary }}
                  onClick={() => {
                    document.getElementById('cotizacion-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Solicitar Cotización
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white/10"
                  onClick={() => router.push('/cursos')}
                >
                  Ver Catálogo para Empresas
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* BENEFICIOS */}
      <motion.section
        className="py-20"
        style={{ backgroundColor: 'white' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: CorporateColors.primary }}>
              ¿Por qué elegir{' '}
              <span style={{ color: CorporateColors.secondary }}>El Poder de Crear?</span>
            </h2>
            <p className="text-lg mb-2" style={{ color: CorporateColors.textPrimary }}><strong>OTEC Certificada</strong> bajo Norma Chilena NCh 2728:2015</p>
            <p className="text-base" style={{ color: CorporateColors.textSecondary }}>
              Procesos trazables y cumplimiento normativo exigido por SENCE.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Cuadro 1: OTEC certificada */}
            <motion.div variants={fadeInUp}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 text-center border-2 hover:shadow-xl transition-shadow flex flex-col" style={{ height: '360px' }}>
                  <motion.div
                    className="mb-4 inline-block"
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Shield className="w-12 h-12 mx-auto" style={{ color: CorporateColors.primary }} />
                  </motion.div>
                  <h3 className="font-bold mb-3 h-[56px] flex items-center justify-center" style={{ color: CorporateColors.primary }}>
                    OTEC certificada y procesos confiables
                  </h3>
                  <p className="text-sm text-justify flex-1" style={{ color: CorporateColors.textSecondary }}>
                    Somos un Organismo Técnico de Capacitación acreditado ante SENCE, certificados bajo la Norma Chilena NCh 2728:2015. Procesos trazables y controlados, conforme a la normativa vigente.
                  </p>
                </Card>
              </motion.div>
            </motion.div>

            {/* Cuadro 2: Experiencia comprobada */}
            <motion.div variants={fadeInUp}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 text-center border-2 hover:shadow-xl transition-shadow flex flex-col" style={{ height: '360px' }}>
                  <motion.div
                    className="mb-4 inline-block"
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Building2 className="w-12 h-12 mx-auto" style={{ color: CorporateColors.accent }} />
                  </motion.div>
                  <h3 className="font-bold mb-3 h-[56px] flex items-center justify-center" style={{ color: CorporateColors.accent }}>
                    Experiencia comprobada con empresas y organismos públicos
                  </h3>
                  <p className="text-sm text-justify flex-1" style={{ color: CorporateColors.textSecondary }}>
                    Amplia trayectoria trabajando con empresas privadas y organismos públicos, cumpliendo estándares técnicos, administrativos y de calidad.
                  </p>
                </Card>
              </motion.div>
            </motion.div>

            {/* Cuadro 3: Capacitación enfocada */}
            <motion.div variants={fadeInUp}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 text-center border-2 hover:shadow-xl transition-shadow flex flex-col" style={{ height: '360px' }}>
                  <motion.div
                    className="mb-4 inline-block"
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Target className="w-12 h-12 mx-auto" style={{ color: '#E63E96' }} />
                  </motion.div>
                  <h3 className="font-bold mb-3 h-[56px] flex items-center justify-center" style={{ color: '#E63E96' }}>
                    Capacitación enfocada en resultados reales
                  </h3>
                  <p className="text-sm text-justify flex-1" style={{ color: CorporateColors.textSecondary }}>
                    Nuestra metodología es activa e interactiva. Usamos herramientas participativas como Mentimeter y dinámicas prácticas que fomentan el aprendizaje aplicable.
                  </p>
                </Card>
              </motion.div>
            </motion.div>

            {/* Cuadro 4: Beneficio Franquicia */}
            <motion.div variants={fadeInUp}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 text-center border-2 hover:shadow-xl transition-shadow flex flex-col" style={{ height: '360px' }}>
                  <motion.div
                    className="mb-4 inline-block"
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div
                      className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#4CAF50' }}
                    >
                      <div className="text-white text-center">
                        <div className="text-[10px] font-semibold">Hasta</div>
                        <div className="text-lg font-bold leading-none">100%</div>
                        <div className="text-[10px]">recuperación</div>
                      </div>
                    </div>
                  </motion.div>
                  <h3 className="font-bold mb-3 h-[56px] flex items-center justify-center" style={{ color: CorporateColors.textPrimary }}>
                    Beneficio de Franquicia Tributaria
                  </h3>
                  <p className="text-sm text-justify flex-1" style={{ color: CorporateColors.textSecondary }}>
                    Si eres una empresa y cumples los requisitos, puedes utilizar la Franquicia Tributaria para financiar la capacitación y recuperar hasta el{' '}
                    <strong>100% del gasto</strong> como beneficio.
                  </p>
                </Card>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* EBOOK - CASOS REALES */}
      <motion.section
        className="py-20"
        style={{
          background: `linear-gradient(135deg, ${CorporateColors.primary}, ${CorporateColors.secondary})`
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="grid md:grid-cols-2 gap-12 items-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
            >
              {/* Left: Content */}
              <motion.div variants={fadeInUp}>
                <Badge
                  className="mb-6"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    borderColor: 'white',
                    border: '1px solid'
                  }}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Material Comercial
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                  Casos reales de transformación
                </h2>
                <p className="text-lg text-white/90 mb-8">
                  Conoce cómo hemos ayudado a múltiples empresas en Chile a desarrollar
                  el talento de sus equipos. Resultados medibles, testimonios reales y
                  metodología comprobada.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    'Casos reales en construcción, retail, tecnología y más',
                    'Resultados cuantitativos y testimonios verificables',
                    'Metodología paso a paso documentada',
                    'Modalidades presencial, online e híbrido'
                  ].map((item, idx) => (
                    <motion.li
                      key={idx}
                      className="flex items-start gap-3 text-white/90"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * idx }}
                    >
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: CorporateColors.accent }} />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
                <motion.div
                  className="flex flex-col sm:flex-row gap-4"
                  whileHover={{ scale: 1.02 }}
                >
                  <Button
                    size="lg"
                    className="group"
                    style={{
                      backgroundColor: CorporateColors.accent,
                      color: 'white'
                    }}
                    onClick={() => router.push('/ebook')}
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    Ver Ebook de Casos
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2"
                    style={{
                      borderColor: 'white',
                      color: 'white',
                      backgroundColor: 'transparent'
                    }}
                    onClick={() => window.open('/ebook', '_blank')}
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Descargar PDF
                  </Button>
                </motion.div>
              </motion.div>

              {/* Right: Visual */}
              <motion.div variants={fadeInUp}>
                <motion.div
                  className="relative rounded-2xl overflow-hidden"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    minHeight: '400px'
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1757405909200-5f19f1f39eae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxidXNpbmVzcyUyMHN1Y2Nlc3MlMjBjYXNlJTIwc3R1ZHklMjBwcmVzZW50YXRpb24lMjB0ZWFtfGVufDF8fHx8MTc3ODYwMzkzNnww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Casos reales de transformación empresarial"
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay de gradiente */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to right,
                        rgba(93, 63, 211, 0.3) 0%,
                        rgba(93, 63, 211, 0.2) 25%,
                        rgba(93, 63, 211, 0.1) 50%,
                        transparent 75%)`
                    }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* PROCESO */}
      <motion.section
        className="py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge
              className="mb-4"
              style={{
                backgroundColor: CorporateColors.primaryLight,
                color: CorporateColors.primary
              }}
            >
              Nuestro Proceso
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: CorporateColors.primary }}>
              Simple y efectivo
            </h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                number: '01',
                icon: Target,
                title: 'Diagnóstico',
                description: 'Evaluamos necesidades y objetivos de capacitación'
              },
              {
                number: '02',
                icon: FileText,
                title: 'Propuesta',
                description: 'Diseñamos programa personalizado con costos'
              },
              {
                number: '03',
                icon: BookOpen,
                title: 'Ejecución',
                description: 'Implementamos con seguimiento continuo'
              },
              {
                number: '04',
                icon: BarChart3,
                title: 'Reportes',
                description: 'Entregamos certificación y resultados'
              }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="relative"
              >
                {idx < 3 && (
                  <motion.div
                    className="hidden md:block absolute top-12 left-full w-full h-0.5"
                    style={{ backgroundColor: CorporateColors.border }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 * idx, duration: 0.6 }}
                  />
                )}
                <motion.div
                  className="relative z-10 text-center"
                  whileHover={{ y: -8 }}
                >
                  <motion.div
                    className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold"
                    style={{
                      backgroundColor: CorporateColors.primaryLight,
                      color: CorporateColors.primary
                    }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {step.number}
                  </motion.div>
                  <step.icon
                    className="w-8 h-8 mx-auto mb-3"
                    style={{ color: CorporateColors.accent }}
                  />
                  <h3 className="font-bold mb-2" style={{ color: CorporateColors.textPrimary }}>
                    {step.title}
                  </h3>
                  <p className="text-sm" style={{ color: CorporateColors.textSecondary }}>
                    {step.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* FORMULARIO COTIZACIÓN */}
      <motion.section
        id="cotizacion-form"
        className="py-20"
        style={{ backgroundColor: 'white' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge
                className="mb-4"
                style={{
                  backgroundColor: CorporateColors.primaryLight,
                  color: CorporateColors.primary
                }}
              >
                <Mail className="w-4 h-4 mr-2" />
                Solicita tu Cotización
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: CorporateColors.primary }}>
                Conversemos sobre tus necesidades
              </h2>
              <p style={{ color: CorporateColors.textSecondary }}>
                Completa el formulario y nos contactaremos a la brevedad
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 border-2">
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: CorporateColors.textPrimary }}>
                        Nombre Completo *
                      </label>
                      <Input placeholder="Juan Pérez" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: CorporateColors.textPrimary }}>
                        Empresa *
                      </label>
                      <Input placeholder="Mi Empresa S.A." />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: CorporateColors.textPrimary }}>
                        Email Corporativo *
                      </label>
                      <Input type="email" placeholder="jperez@empresa.cl" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: CorporateColors.textPrimary }}>
                        Teléfono *
                      </label>
                      <Input type="tel" placeholder="+56 9 1234 5678" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: CorporateColors.textPrimary }}>
                      Número de Participantes (aprox.)
                    </label>
                    <Input type="number" placeholder="10" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: CorporateColors.textPrimary }}>
                      Cuéntanos sobre tus necesidades de capacitación *
                    </label>
                    <Textarea
                      placeholder="Describe las áreas de capacitación, objetivos, fechas tentativas, etc."
                      rows={5}
                    />
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      style={{
                        backgroundColor: CorporateColors.primary,
                        color: 'white'
                      }}
                    >
                      Enviar Solicitud
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </motion.div>

                  <p className="text-xs text-center" style={{ color: CorporateColors.textSecondary }}>
                    * Campos obligatorios. Responderemos en menos de 24 horas hábiles.
                  </p>
                </form>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA CONTACTO DIRECTO */}
      <motion.section
        className="py-16"
        style={{
          background: `linear-gradient(135deg, ${CorporateColors.primary}, ${CorporateColors.secondary})`
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h3
              className="text-2xl md:text-3xl font-bold mb-6 text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              ¿Prefieres hablar directamente?
            </motion.h3>
            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <motion.a
                href="tel:+56955222430"
                className="flex items-center gap-3 text-white hover:text-gray-200 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <Phone className="w-6 h-6" />
                <span className="text-lg font-semibold">+56 9 5522 2430</span>
              </motion.a>
              <motion.a
                href="mailto:gestioncomercial@elpoderdecrear.cl"
                className="flex items-center gap-3 text-white hover:text-gray-200 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <Mail className="w-6 h-6" />
                <span className="text-lg font-semibold">gestioncomercial@elpoderdecrear.cl</span>
              </motion.a>
            </motion.div>
          </div>
        </div>
      </motion.section>

    </div>
  );
}
