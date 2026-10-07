'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight, Play, CheckCircle, Award, Users, BookOpen,
  TrendingUp, Shield, Clock, MapPin, Phone, Mail, ArrowRight,
  BarChart3, FileCheck, Target, Zap, Star, Quote, ChevronLeft,
  Globe, Building2, GraduationCap, Calendar, MessageSquare, Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// ── Design tokens (colores originales del sitio corporativo) ──────────────────
const C = {
  primary:       '#5D3FD3',
  primaryLight:  '#E8E3FF',
  primaryDark:   '#4A2FB8',
  secondary:     '#6B5CE7',
  accent:        '#FF8C42',
  accentLight:   '#FFB380',
  textPrimary:   '#1F2937',
  textSecondary: '#6B7280',
  bgLight:       '#F9FAFB',
  border:        '#E5E7EB',
  success:       '#059669',
  successLight:  '#D1FAE5',
  secondaryLight:'#EDE9FF',
} as const;

const S = {
  md:  '0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -1px rgba(0,0,0,.06)',
  lg:  '0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -2px rgba(0,0,0,.05)',
  xl:  '0 20px 25px -5px rgba(0,0,0,.1),0 10px 10px -5px rgba(0,0,0,.04)',
  '2xl': '0 25px 50px -12px rgba(0,0,0,.25)',
} as const;

// ─────────────────────────────────────────────────────────────────────────────

const testimonials = [
  {
    name: 'María Fernanda González',
    position: 'Gerente de RRHH',
    company: 'Grupo Empresarial Nacional',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    text: 'El Campus Virtual superó nuestras expectativas. La integración con SENCE fue impecable y nuestros colaboradores valoran enormemente la calidad de las capacitaciones.',
  },
  {
    name: 'Roberto Sánchez',
    position: 'Director de Capacitación',
    company: 'Corporación Minera del Norte',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto',
    text: 'Implementamos el programa de Liderazgo Estratégico en nuestras 5 faenas. Los resultados en productividad y clima laboral han sido extraordinarios.',
  },
  {
    name: 'Carolina Muñoz',
    position: 'Jefa de Desarrollo Organizacional',
    company: 'Retail Group Chile',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carolina',
    text: 'La plataforma es intuitiva, el soporte técnico es excepcional y la trazabilidad SENCE nos da total tranquilidad. Altamente recomendados.',
  },
];

const featuredCourses = [
  { title: 'Liderazgo Estratégico',       category: 'Liderazgo',  duration: '40 horas', level: 'Avanzado',   students: 1250, rating: 4.9, sence: true },
  { title: 'Excel Avanzado para Negocios', category: 'Ofimática', duration: '32 horas', level: 'Intermedio', students: 2100, rating: 4.8, sence: true },
  { title: 'Marketing Digital Estratégico',category: 'Marketing', duration: '48 horas', level: 'Intermedio', students: 1680, rating: 4.9, sence: true },
  { title: 'Gestión de Proyectos Ágiles',  category: 'Gestión',   duration: '36 horas', level: 'Intermedio', students: 1420, rating: 4.7, sence: true },
];

const faqs = [
  {
    question: '¿Qué es SENCE y cómo funcionan los subsidios?',
    answer: 'SENCE (Servicio Nacional de Capacitación y Empleo) es el organismo del Estado que promueve la capacitación laboral. Como OTEC certificada, gestionamos todo el proceso de franquicia tributaria, permitiendo que tu empresa recupere hasta el 100% de la inversión en capacitación.',
  },
  {
    question: '¿Los cursos cuentan con certificación oficial?',
    answer: 'Sí, todos nuestros programas cuentan con certificación OTEC avalada por SENCE. Al finalizar exitosamente, los participantes reciben un certificado digital y físico con validez nacional.',
  },
  {
    question: '¿Qué modalidades de capacitación ofrecen?',
    answer: 'Ofrecemos tres modalidades: 100% online asincrónica (campus virtual), clases en vivo sincrónicas, y formato híbrido. Nos adaptamos a las necesidades operativas de tu empresa.',
  },
  {
    question: '¿Cómo es el soporte técnico y académico?',
    answer: 'Contamos con soporte técnico de lunes a viernes de 8:00 a 20:00 hrs y sábados de 9:00 a 14:00 hrs. El soporte académico está disponible a través de tutores dedicados durante todo el programa.',
  },
];

export default function HomePage() {
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const next = () => setTestimonialIndex((p) => (p + 1) % testimonials.length);
  const prev = () => setTestimonialIndex((p) => (p - 1 + testimonials.length) % testimonials.length);

  return (
    <div className="min-h-screen">

      {/* ── Hero ── */}
      <section id="inicio" className="pt-8 pb-20 relative overflow-hidden" style={{ backgroundColor: C.primary }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: C.accent }} />
          <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: C.secondary }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-6" style={{ backgroundColor: 'rgba(255,255,255,.2)', color: 'white', border: '1px solid rgba(255,255,255,.3)' }}>
                <Award className="w-3 h-3 mr-1" />
                OTEC Certificada SENCE
              </Badge>

              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight" style={{ color: 'white' }}>
                Transformamos el Talento de tu Empresa
              </h1>

              <p className="text-xl mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,.9)' }}>
                Campus Virtual LMS de última generación + Gestión SENCE completa + Capacitación profesional a nivel nacional
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button size="lg" className="text-lg px-8 py-6" style={{ backgroundColor: C.accent, color: 'white', boxShadow: S.xl }}>
                  <Calendar className="w-5 h-5 mr-2" />
                  Agendar Demo
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6" style={{ borderColor: 'white', color: 'white', backgroundColor: 'transparent', borderWidth: '2px' }} asChild>
                  <Link href="/cursos">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Ver Catálogo
                  </Link>
                </Button>
              </div>

              <div className="flex flex-wrap gap-8">
                {[
                  { value: '+15 años', label: 'Experiencia' },
                  { value: '+500',     label: 'Empresas' },
                  { value: '+25.000',  label: 'Alumnos' },
                  { value: '100%',     label: 'Cobertura Nacional' },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-3xl font-bold mb-1" style={{ color: 'white' }}>{s.value}</div>
                    <div className="text-sm" style={{ color: 'rgba(255,255,255,.8)' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl p-8 backdrop-blur-xl" style={{ backgroundColor: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.2)', boxShadow: S['2xl'] }}>
                <div className="aspect-video rounded-xl overflow-hidden mb-4 flex items-center justify-center" style={{ backgroundColor: C.secondary }}>
                  <Play className="w-20 h-20 text-white opacity-80" />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: 'white' }}>Conoce nuestro Aula Virtual</h3>
                <p style={{ color: 'rgba(255,255,255,.8)' }}>Plataforma LMS propia con tecnología de última generación</p>
              </div>

              <div className="absolute -bottom-6 -left-6 p-4 rounded-xl" style={{ backgroundColor: 'white', boxShadow: S.xl }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: C.accentLight }}>
                    <TrendingUp className="w-6 h-6" style={{ color: C.accent }} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold" style={{ color: C.textPrimary }}>95%</div>
                    <div className="text-sm" style={{ color: C.textSecondary }}>Satisfacción</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Soluciones ── */}
      <section id="soluciones" className="py-20" style={{ backgroundColor: C.bgLight }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4" style={{ backgroundColor: C.primaryLight, color: C.primary, border: 'none' }}>Soluciones Integrales</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4" style={{ color: C.textPrimary }}>Todo lo que tu empresa necesita</h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: C.textSecondary }}>Soluciones completas de capacitación profesional con tecnología de vanguardia</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Globe className="w-8 h-8" style={{ color: C.primary }} />,
                bg: C.primaryLight,
                title: 'Campus Virtual LMS',
                desc: 'Plataforma e-learning de última generación con gestión automática SENCE, seguimiento en tiempo real y reportería avanzada.',
                items: ['Plataforma 100% web responsive', 'Integración automática SENCE', 'Clases en vivo y grabadas', 'Analytics y reportes avanzados'],
                btnColor: C.primary,
                btnLabel: 'Ver Demo',
              },
              {
                icon: <Building2 className="w-8 h-8" style={{ color: C.secondary }} />,
                bg: C.secondaryLight,
                title: 'Capacitación para Empresas',
                desc: 'Programas corporativos diseñados a medida con acompañamiento integral y gestión completa de franquicia SENCE.',
                items: ['Planes corporativos flexibles', 'Gestión 100% franquicia SENCE', 'Acompañamiento personalizado', 'Cobertura nacional'],
                btnColor: C.secondary,
                btnLabel: 'Solicitar Acompañamiento',
              },
              {
                icon: <BookOpen className="w-8 h-8" style={{ color: C.accent }} />,
                bg: C.accentLight,
                title: 'Catálogo de Cursos',
                desc: 'Más de 100 programas certificados SENCE en las áreas más demandadas del mercado laboral chileno.',
                items: ['Liderazgo y Gestión', 'Tecnología y Ofimática', 'Marketing y Ventas', 'Habilidades Transversales'],
                btnColor: C.accent,
                btnLabel: 'Ver Catálogo',
              },
            ].map((card) => (
              <Card key={card.title} className="p-8 hover:scale-105 transition-transform cursor-pointer" style={{ backgroundColor: 'white', border: `1px solid ${C.border}`, boxShadow: S.lg }}>
                <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: card.bg }}>{card.icon}</div>
                <h3 className="text-2xl font-semibold mb-4" style={{ color: C.textPrimary }}>{card.title}</h3>
                <p className="mb-6" style={{ color: C.textSecondary }}>{card.desc}</p>
                <ul className="space-y-3 mb-6">
                  {card.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: C.success }} />
                      <span style={{ color: C.textSecondary }}>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" style={{ backgroundColor: card.btnColor, color: 'white' }}>
                  {card.btnLabel} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cómo Funciona ── */}
      <section className="py-20" style={{ backgroundColor: 'white' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4" style={{ backgroundColor: C.secondaryLight, color: C.secondary, border: 'none' }}>Proceso Simple</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4" style={{ color: C.textPrimary }}>Cómo Funciona</h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: C.textSecondary }}>Implementación ágil con acompañamiento experto en cada etapa</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: <Target className="w-10 h-10 text-white" />,      bg: C.primary,    step: 'PASO 1', title: 'Diagnóstico',     desc: 'Reunión inicial para entender tus necesidades, evaluar disponibilidad SENCE y diseñar plan a medida' },
              { icon: <Zap className="w-10 h-10 text-white" />,         bg: C.secondary,  step: 'PASO 2', title: 'Implementación',   desc: 'Configuración del campus virtual, carga de usuarios y tramitación completa SENCE' },
              { icon: <GraduationCap className="w-10 h-10 text-white" />,bg: C.accent,    step: 'PASO 3', title: 'Capacitación',     desc: 'Ejecución de programas con tutores expertos, soporte técnico y seguimiento constante' },
              { icon: <BarChart3 className="w-10 h-10 text-white" />,   bg: C.primary,    step: 'PASO 4', title: 'Reportes SENCE',   desc: 'Documentación completa, certificados y gestión de reembolso franquicia tributaria' },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: s.bg, boxShadow: S.lg }}>{s.icon}</div>
                <div className="text-sm font-semibold mb-2" style={{ color: C.accent }}>{s.step}</div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: C.textPrimary }}>{s.title}</h3>
                <p style={{ color: C.textSecondary }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SENCE ── */}
      <section id="sence" className="py-20" style={{ backgroundColor: C.primaryLight }}>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-6" style={{ backgroundColor: 'white', color: C.primary, border: 'none' }}>
                <Shield className="w-3 h-3 mr-1" /> Certificación Oficial
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: C.primary }}>Gestión SENCE 100% Garantizada</h2>
              <p className="text-xl mb-8" style={{ color: C.textPrimary }}>Como OTEC certificada, gestionamos íntegramente tu franquicia tributaria SENCE. Recupera hasta el 100% de tu inversión en capacitación.</p>

              <div className="space-y-4 mb-8">
                {[
                  { icon: <FileCheck className="w-6 h-6 text-white" />, title: 'Tramitación Completa',    desc: 'Nos encargamos de toda la documentación y seguimiento ante SENCE' },
                  { icon: <Clock className="w-6 h-6 text-white" />,     title: 'Seguimiento Automático',  desc: 'Control de asistencia y avance integrado en el Campus Virtual' },
                  { icon: <Award className="w-6 h-6 text-white" />,     title: 'Certificación Oficial',   desc: 'Certificados digitales y físicos con validez nacional' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: C.primary }}>{item.icon}</div>
                    <div>
                      <h4 className="font-semibold mb-1" style={{ color: C.textPrimary }}>{item.title}</h4>
                      <p style={{ color: C.textSecondary }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button size="lg" className="px-8" style={{ backgroundColor: C.accent, color: 'white' }}>
                <MessageSquare className="w-5 h-5 mr-2" /> Hablar con Especialista SENCE
              </Button>
            </div>

            <Card className="p-8" style={{ backgroundColor: 'white', border: 'none', boxShadow: S['2xl'] }}>
              <h3 className="text-2xl font-semibold mb-6" style={{ color: C.textPrimary }}>Beneficios Franquicia SENCE</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span style={{ color: C.textSecondary }}>Recuperación inversión</span>
                    <span className="font-bold text-2xl" style={{ color: C.accent }}>100%</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ backgroundColor: C.bgLight }}>
                    <div className="h-full rounded-full" style={{ backgroundColor: C.accent, width: '100%' }} />
                  </div>
                </div>
                <div className="border-t pt-6" style={{ borderColor: C.border }}>
                  <h4 className="font-semibold mb-4" style={{ color: C.textPrimary }}>Incluye:</h4>
                  <ul className="space-y-3">
                    {['Acompañamiento en disponibilidad presupuestaria', 'Inscripción y cierre de códigos SENCE', 'Seguimiento normativo automatizado', 'Documentación y respaldo ante fiscalización', 'Emisión de certificados oficiales'].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" style={{ color: C.success }} />
                        <span style={{ color: C.textSecondary }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: C.accentLight }}>
                  <div className="flex items-center gap-3">
                    <Download className="w-6 h-6" style={{ color: C.accent }} />
                    <div>
                      <div className="font-semibold" style={{ color: C.textPrimary }}>Guía SENCE 2025</div>
                      <div className="text-sm" style={{ color: C.textSecondary }}>Descarga nuestra guía completa</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ── Cursos Destacados ── */}
      <section id="cursos" className="py-20" style={{ backgroundColor: C.bgLight }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4" style={{ backgroundColor: C.accentLight, color: C.accent, border: 'none' }}>Programas Certificados</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4" style={{ color: C.textPrimary }}>Cursos Destacados</h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: C.textSecondary }}>Programas certificados SENCE en las áreas más demandadas del mercado</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {featuredCourses.map((course) => (
              <Card key={course.title} className="overflow-hidden hover:scale-105 transition-transform cursor-pointer" style={{ backgroundColor: 'white', border: `1px solid ${C.border}`, boxShadow: S.md }}>
                <div className="h-40 flex items-center justify-center" style={{ backgroundColor: C.bgLight }}>
                  <BookOpen className="w-16 h-16" style={{ color: C.primary }} />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" style={{ borderColor: C.accent, color: C.accent, fontSize: '0.75rem' }}>{course.category}</Badge>
                    {course.sence && <Badge style={{ backgroundColor: C.successLight, color: C.success, border: 'none', fontSize: '0.75rem' }}>SENCE</Badge>}
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: C.textPrimary }}>{course.title}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm" style={{ color: C.textSecondary }}><Clock className="w-4 h-4" />{course.duration}</div>
                    <div className="flex items-center gap-2 text-sm" style={{ color: C.textSecondary }}><Users className="w-4 h-4" />{course.students.toLocaleString()} alumnos</div>
                    <div className="flex items-center gap-2 text-sm" style={{ color: C.textSecondary }}><Star className="w-4 h-4" style={{ color: C.accent }} />{course.rating} / 5.0</div>
                  </div>
                  <Button className="w-full" variant="outline" style={{ borderColor: C.primary, color: C.primary }}>Ver detalles</Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" style={{ backgroundColor: C.primary, color: 'white' }} asChild>
              <Link href="/cursos">Ver Catálogo Completo <ChevronRight className="w-5 h-5 ml-2" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Impacto ── */}
      <section id="casos" className="py-20" style={{ backgroundColor: C.primary }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4" style={{ backgroundColor: C.primaryLight, color: C.primary, border: 'none' }}>Resultados Reales</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4" style={{ color: 'white' }}>Impacto Comprobado</h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: 'rgba(255,255,255,.8)' }}>Empresas líderes confían en nosotros para desarrollar su talento</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              { icon: <TrendingUp className="w-8 h-8" style={{ color: C.primary }} />, bg: C.primaryLight, value: '+35%', color: C.primary,   label: 'Aumento promedio en productividad' },
              { icon: <Users className="w-8 h-8" style={{ color: C.accent }} />,       bg: C.accentLight,  value: '95%',   color: C.accent,    label: 'Tasa de Satisfacción' },
              { icon: <Award className="w-8 h-8" style={{ color: C.secondary }} />,    bg: C.secondaryLight,value: '92%',  color: C.secondary, label: 'Tasa de aprobación de cursos' },
            ].map((s) => (
              <Card key={s.label} className="p-8 text-center" style={{ backgroundColor: 'white', border: 'none', boxShadow: S.lg }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: s.bg }}>{s.icon}</div>
                <div className="text-4xl font-bold mb-2" style={{ color: s.color }}>{s.value}</div>
                <p style={{ color: C.textSecondary }}>{s.label}</p>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-8" style={{ color: 'white' }}>Sectores que confían en nosotros</h3>
            <div className="flex flex-wrap justify-center gap-6">
              {['Minería', 'Retail', 'Construcción', 'Salud', 'Tecnología', 'Manufactura', 'Servicios', 'Educación'].map((sector) => (
                <div key={sector} className="px-6 py-3 rounded-lg" style={{ backgroundColor: 'white', border: `1px solid ${C.border}` }}>
                  <span style={{ color: C.textPrimary }}>{sector}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonios ── */}
      <section className="py-20" style={{ backgroundColor: 'white' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4" style={{ backgroundColor: C.accentLight, color: C.accent, border: 'none' }}>Testimonios</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4" style={{ color: C.textPrimary }}>Lo que dicen nuestros clientes</h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="p-12" style={{ backgroundColor: C.bgLight, border: 'none', boxShadow: S.xl }}>
              <Quote className="w-12 h-12 mb-6" style={{ color: C.accent }} />
              <p className="text-2xl mb-8 leading-relaxed" style={{ color: C.textPrimary }}>"{testimonials[testimonialIndex].text}"</p>
              <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={testimonials[testimonialIndex].image} alt={testimonials[testimonialIndex].name} className="w-16 h-16 rounded-full" />
                <div>
                  <div className="font-semibold text-lg" style={{ color: C.textPrimary }}>{testimonials[testimonialIndex].name}</div>
                  <div style={{ color: C.textSecondary }}>{testimonials[testimonialIndex].position}</div>
                  <div className="text-sm" style={{ color: C.accent }}>{testimonials[testimonialIndex].company}</div>
                </div>
              </div>
            </Card>

            <div className="flex justify-center gap-4 mt-8">
              <button onClick={prev} className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ backgroundColor: C.primary, boxShadow: S.md }}>
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button onClick={next} className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ backgroundColor: C.primary, boxShadow: S.md }}>
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setTestimonialIndex(i)} className="w-3 h-3 rounded-full transition-all" style={{ backgroundColor: i === testimonialIndex ? C.accent : C.border }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20" style={{ backgroundColor: C.primaryLight }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4" style={{ backgroundColor: C.secondaryLight, color: C.secondary, border: 'none' }}>Preguntas Frecuentes</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4" style={{ color: C.textPrimary }}>Resolvemos tus dudas</h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <Card key={i} className="overflow-hidden" style={{ backgroundColor: 'white', border: `1px solid ${C.border}` }}>
                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-all">
                  <span className="text-lg font-semibold pr-4" style={{ color: C.textPrimary }}>{faq.question}</span>
                  <ChevronRight className={`w-6 h-6 flex-shrink-0 transition-transform ${faqOpen === i ? 'rotate-90' : ''}`} style={{ color: C.accent }} />
                </button>
                {faqOpen === i && <div className="px-6 pb-6" style={{ color: C.textSecondary }}>{faq.answer}</div>}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA / Contacto ── */}
      <section id="contacto" className="py-20 relative overflow-hidden" style={{ backgroundColor: C.primary }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: C.accent }} />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: C.secondary }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: 'white' }}>Transforma el futuro de tu empresa hoy</h2>
            <p className="text-xl mb-12" style={{ color: 'rgba(255,255,255,.8)' }}>Agenda una demo personalizada y descubre cómo nuestro Campus Virtual puede revolucionar la capacitación en tu organización</p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="p-8 text-left" style={{ backgroundColor: 'white', border: 'none', boxShadow: S['2xl'] }}>
                <h3 className="text-2xl font-semibold mb-6" style={{ color: C.textPrimary }}>Agendar Demo</h3>
                <form className="space-y-4">
                  {[
                    { label: 'Nombre completo',   type: 'text',  placeholder: 'Juan Pérez' },
                    { label: 'Email corporativo',  type: 'email', placeholder: 'juan@empresa.cl' },
                    { label: 'Empresa',            type: 'text',  placeholder: 'Nombre de la empresa' },
                    { label: 'Teléfono',           type: 'tel',   placeholder: '+56 9 1234 5678' },
                  ].map((f) => (
                    <div key={f.label}>
                      <label className="block text-sm font-medium mb-2" style={{ color: C.textPrimary }}>{f.label}</label>
                      <input type={f.type} placeholder={f.placeholder} className="w-full px-4 py-3 rounded-lg outline-none focus:ring-2" style={{ border: `1px solid ${C.border}`, backgroundColor: C.bgLight }} />
                    </div>
                  ))}
                  <Button type="submit" className="w-full py-6 text-lg" style={{ backgroundColor: C.accent, color: 'white' }}>
                    Agendar Demo Gratuita <Calendar className="w-5 h-5 ml-2" />
                  </Button>
                </form>
              </Card>

              <div className="space-y-6">
                {[
                  { icon: <Phone className="w-6 h-6 text-white" />,  title: 'Teléfono', line1: '+56 9 3380 1355',           line2: 'Lun - Vie: 9:00 - 13:00 hrs' },
                  { icon: <Mail className="w-6 h-6 text-white" />,   title: 'Email',    line1: 'contacto@elpoderdecrear.cl', line2: 'Respuesta en 24 hrs' },
                  { icon: <MapPin className="w-6 h-6 text-white" />, title: 'Oficina',  line1: 'Rengo 351, Los Ángeles',     line2: 'Edificio Asturias' },
                ].map((c) => (
                  <Card key={c.title} className="p-6" style={{ backgroundColor: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.2)', backdropFilter: 'blur(10px)' }}>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: C.accent }}>{c.icon}</div>
                      <div>
                        <h4 className="font-semibold mb-1" style={{ color: 'white' }}>{c.title}</h4>
                        <p style={{ color: 'rgba(255,255,255,.8)' }}>{c.line1}</p>
                        <p className="text-sm" style={{ color: 'rgba(255,255,255,.6)' }}>{c.line2}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
