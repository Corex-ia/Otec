'use client';
import { useRouter } from 'next/navigation';
import {
  Target, Heart, Shield, Zap, Users, Globe,
  Award, Building2, GraduationCap, CheckCircle,
  ArrowRight, Sparkles, TrendingUp, Eye, Linkedin,
  BookOpen, Mail
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

export default function NosotrosPage() {
  const router = useRouter();
  const values = [
    {
      icon: Target,
      title: 'Excelencia Educativa',
      description: 'Comprometidos con la más alta calidad en contenidos, metodologías y resultados de aprendizaje.'
    },
    {
      icon: Heart,
      title: 'Pasión por el Desarrollo',
      description: 'Creemos en el potencial de cada persona y trabajamos para transformar vidas a través de la educación.'
    },
    {
      icon: Shield,
      title: 'Integridad y Transparencia',
      description: 'Operamos con total transparencia, cumpliendo rigurosamente todas las normativas y compromisos.'
    },
    {
      icon: Zap,
      title: 'Innovación Continua',
      description: 'Incorporamos constantemente nuevas tecnologías y metodologías para mejorar la experiencia de aprendizaje.'
    },
    {
      icon: Users,
      title: 'Compromiso con el Cliente',
      description: 'Cada empresa es única. Adaptamos nuestras soluciones a las necesidades específicas de cada organización.'
    },
    {
      icon: Globe,
      title: 'Impacto Social',
      description: 'Contribuimos al desarrollo del país capacitando profesionales que impulsan el crecimiento económico.'
    }
  ];

  const milestones = [
    {
      year: '2009',
      title: 'Fundación',
      description: 'Inicio de operaciones como OTEC certificada en Santiago'
    },
    {
      year: '2012',
      title: 'Expansión Nacional',
      description: 'Presencia en las principales regiones de Chile'
    },
    {
      year: '2015',
      title: 'Campus Virtual',
      description: 'Lanzamiento de nuestra plataforma LMS propia'
    },
    {
      year: '2018',
      title: 'Expansión de Servicios',
      description: 'Consolidación de programas presenciales y online'
    },
    {
      year: '2020',
      title: 'Transformación Digital',
      description: 'Adaptación completa a modalidades online y blended'
    },
    {
      year: '2023',
      title: 'Certificación NCh 2728',
      description: 'Obtención de certificación de calidad vigente'
    },
    {
      year: '2026',
      title: 'Líderes en Innovación',
      description: 'Reconocidos como referentes en e-learning corporativo'
    }
  ];

  const team = [
    {
      name: 'Osvaldo Yáñez',
      role: 'Gerente General',
      bio: '',
      icon: 'OY'
    },
    {
      name: 'Makarena Martínez',
      role: 'Representante de Gerencia',
      bio: '',
      icon: 'MM'
    },
    {
      name: 'Israel Cifuentes',
      role: 'Asesor Comercial',
      bio: '',
      icon: 'IC'
    },
    {
      name: 'Bárbara Pérez',
      role: 'Encargada de Capacitación',
      bio: '',
      icon: 'BP'
    },
    {
      name: 'Daniela Navarrete',
      role: 'Coordinadora Académica',
      bio: '',
      icon: 'DN'
    }
  ];

  const certifications = [
    {
      name: 'OTEC - El poder de Crear',
      description: 'OTEC certificada bajo estándar de calidad NCh 2728:2015',
      logo: null
    },
    {
      name: 'ATE - El poder de Crear',
      description: 'ATE registrada y validada por el Ministerio de Educación de Chile',
      icon: Award
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'white' }}>

      {/* Hero Section */}
      <section
        className="pt-32 pb-20 relative overflow-hidden"
        style={{
          background: '#6B5CE7',
          minHeight: '600px'
        }}
      >
        {/* Imagen de fondo que cubre todo el ancho */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <img
            src="https://images.unsplash.com/photo-1563457012475-13cf086fd600?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxIaXNwYW5pYyUyMGJ1c2luZXNzJTIwdHJhaW5pbmclMjBwcmVzZW50YXRpb24lMjBwZW9wbGV8ZW58MXx8fHwxNzc0MDI5OTQyfDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Capacitación Profesional"
            className="w-full h-full object-cover"
          />

          {/* Overlay de gradiente desde la izquierda */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to right,
                #6B5CE7 0%,
                #6B5CE7F8 15%,
                #6B5CE7E8 25%,
                #6B5CE7B8 35%,
                #6B5CE780 45%,
                #6B5CE740 55%,
                transparent 70%)`
            }}
          />
        </motion.div>

        {/* Efectos decorativos */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: CorporateColors.accent }} />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: CorporateColors.secondary }} />
        </div>

        {/* Contenido de texto */}
        <div className="container mx-auto px-4 lg:px-8 relative z-10 h-full">
          <div className="flex items-center h-full">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <Badge
                className="mb-6"
                style={{
                  backgroundColor: CorporateColors.accent,
                  color: 'white',
                  fontSize: '0.875rem',
                  padding: '0.5rem 1.5rem'
                }}
              >
                Sobre Nosotros
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
                Transformando
                <br />
                el Futuro
                <br />
                <span style={{ color: CorporateColors.accent }}>a través de la Educación</span>
              </h1>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Mission */}
            <Card
              className="p-10"
              style={{
                backgroundColor: 'white',
                border: `1px solid ${CorporateColors.border}`,
                boxShadow: CorporateShadow.lg
              }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                style={{ backgroundColor: CorporateColors.primary }}
              >
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4" style={{ color: CorporateColors.primary }}>
                Nuestra Misión
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: CorporateColors.textSecondary, textAlign: 'justify' }}>
                Nuestra misión es contribuir en la creación y crecimiento de las organizaciones, mediante programas de capacitación de excelencia, entregando servicios de alta eficiencia y de calidad, que sean adecuados a las necesidades específicas de nuestros clientes y que permitan potenciar el desarrollo de habilidades personales y competencias técnicas de sus colaboradores.
              </p>
            </Card>

            {/* Vision */}
            <Card
              className="p-10"
              style={{
                backgroundColor: 'white',
                border: `1px solid ${CorporateColors.border}`,
                boxShadow: CorporateShadow.lg
              }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                style={{ backgroundColor: CorporateColors.accent }}
              >
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4" style={{ color: CorporateColors.primary }}>
                Nuestra Visión
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: CorporateColors.textSecondary, textAlign: 'justify' }}>
                Nuestra visión es ser líder a nivel nacional en servicios de capacitación, siendo reconocidos como un socio estratégico para nuestros clientes a la hora de incrementar las competencias y habilidades de sus colaboradores, entregando soluciones a la medida de sus necesidades, aumentando la empleabilidad todo esto con enfoque en la mejora continua y así aportar al desarrollo social y económico del país.
              </p>
            </Card>
          </div>

          {/* CTA Ebook */}
          <div className="max-w-4xl mx-auto mt-16">
            <Card
              className="p-8 text-center"
              style={{
                backgroundColor: CorporateColors.primaryLight,
                border: `2px solid ${CorporateColors.primary}`
              }}
            >
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: CorporateColors.primary }}
              >
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: CorporateColors.primary }}>
                Conoce Nuestra Trayectoria Completa
              </h3>
              <p className="text-base mb-6 max-w-2xl mx-auto" style={{ color: CorporateColors.textSecondary }}>
                Descarga nuestro Ebook con casos reales de empresas que han transformado
                su capacitación con El Poder de Crear
              </p>
              <Button
                size="lg"
                onClick={() => router.push('/ebook')}
                style={{
                  backgroundColor: CorporateColors.accent,
                  color: 'white'
                }}
              >
                <BookOpen className="mr-2 w-5 h-5" />
                Ver Ebook de Casos Reales
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20" style={{ backgroundColor: CorporateColors.bgLight }}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="mb-4"
              style={{
                borderColor: CorporateColors.accent,
                color: CorporateColors.accent
              }}
            >
              Nuestros Valores
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: CorporateColors.textPrimary }}>
              Lo que nos Define
            </h2>
            <p className="text-lg max-w-3xl mx-auto" style={{ color: CorporateColors.textSecondary }}>
              Principios que guían cada decisión y acción en nuestra organización
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <Card
                key={index}
                className="p-8 hover:scale-105 transition-all"
                style={{
                  backgroundColor: 'white',
                  border: `1px solid ${CorporateColors.border}`,
                  boxShadow: CorporateShadow.md
                }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: CorporateColors.primaryLight }}
                >
                  <value.icon className="w-7 h-7" style={{ color: CorporateColors.primary }} />
                </div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: CorporateColors.textPrimary }}>
                  {value.title}
                </h3>
                <p style={{ color: CorporateColors.textSecondary }}>
                  {value.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* Team */}
      <section className="py-20" style={{ backgroundColor: CorporateColors.bgLight }}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="mb-4"
              style={{
                borderColor: CorporateColors.accent,
                color: CorporateColors.accent
              }}
            >
              Nuestro Equipo
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: CorporateColors.textPrimary }}>
              Liderazgo Comprometido
            </h2>
            <p className="text-lg max-w-3xl mx-auto" style={{ color: CorporateColors.textSecondary }}>
              Profesionales con amplia experiencia en educación, tecnología y gestión
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {team.map((member, index) => (
              <Card
                key={index}
                className="p-4 text-center hover:scale-105 transition-all flex flex-col"
                style={{
                  backgroundColor: 'white',
                  border: `1px solid ${CorporateColors.border}`,
                  boxShadow: CorporateShadow.md,
                  minHeight: '240px'
                }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold text-white"
                  style={{ backgroundColor: CorporateColors.primary }}
                >
                  {member.icon}
                </div>
                <h3 className="text-base font-semibold mb-2 min-h-[40px] flex items-center justify-center" style={{ color: CorporateColors.textPrimary }}>
                  {member.name}
                </h3>
                <p className="text-xs font-medium mb-3 min-h-[32px] flex items-center justify-center" style={{ color: CorporateColors.accent }}>
                  {member.role}
                </p>
                <div className="flex-1"></div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-auto"
                  style={{ color: CorporateColors.primary }}
                >
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="mb-4"
              style={{
                borderColor: CorporateColors.secondary,
                color: CorporateColors.secondary
              }}
            >
              Certificaciones
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: CorporateColors.textPrimary }}>
              Respaldados por las Mejores Acreditaciones
            </h2>
            <p className="text-lg max-w-3xl mx-auto" style={{ color: CorporateColors.textSecondary }}>
              Cumplimos con los más altos estándares de calidad y normativa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {certifications.map((cert, index) => {
              const [firstLine, secondLine] = cert.name.split(' - ');
              return (
                <Card
                  key={index}
                  className="p-8 text-center"
                  style={{
                    backgroundColor: 'white',
                    border: `1px solid ${CorporateColors.border}`,
                    boxShadow: CorporateShadow.md
                  }}
                >
                  <div className="mb-4 flex justify-center">
                    {cert.logo ? (
                      <img src={cert.logo} alt={cert.name} className="h-16 object-contain" />
                    ) : (
                      <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: CorporateColors.primaryLight }}
                      >
                        {cert.icon && <cert.icon className="w-8 h-8" style={{ color: CorporateColors.primary }} />}
                      </div>
                    )}
                  </div>
                  <h3 className="mb-2" style={{ color: CorporateColors.textPrimary }}>
                    <div className="text-2xl font-bold">{firstLine}</div>
                    <div className="text-lg font-normal mt-1">{secondLine}</div>
                  </h3>
                  <p className="text-sm" style={{ color: CorporateColors.textSecondary }}>
                    {cert.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20"
        style={{ backgroundColor: CorporateColors.primary }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              ¿Quieres Conocer Más sobre Nosotros?
            </h2>
            <p className="text-xl mb-10 text-white opacity-90">
              Agenda una reunión con nuestro equipo y descubre cómo podemos ayudarte a
              transformar la capacitación en tu organización.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-lg px-8 py-6"
                onClick={() => router.push('/contacto')}
                style={{ backgroundColor: CorporateColors.accent, color: 'white' }}
              >
                <Mail className="mr-2 w-5 h-5" />
                Contáctanos
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 hover:bg-white/10"
                onClick={() => router.push('/cursos')}
                style={{
                  borderColor: 'white',
                  color: 'white',
                  borderWidth: '2px',
                  backgroundColor: 'transparent'
                }}
              >
                Ver Catálogo de Cursos
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
