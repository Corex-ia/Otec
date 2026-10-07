'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  Heart, Users, Lightbulb, Cpu, CheckCircle, ArrowRight,
  BookOpen, TrendingUp, Target, Award, GraduationCap, Brain,
  Smile, ShieldCheck, BarChart3, Laptop, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useState } from 'react';
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
  pink: '#EC407A',
  text: '#1F2937',
};
const CorporateShadow = {
  sm: '0 1px 2px 0 rgba(0,0,0,0.05)',
  md: '0 4px 6px -1px rgba(0,0,0,0.1)',
  lg: '0 10px 15px -3px rgba(0,0,0,0.1)',
  xl: '0 20px 25px -5px rgba(0,0,0,0.1)',
  card: '0 4px 6px -1px rgba(0,0,0,0.1)',
};

export default function SencePage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
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

  // Pilares principales
  const pilares = [
    {
      icon: Users,
      title: 'Enfoque colaborativo',
      color: CorporateColors.primary
    },
    {
      icon: TrendingUp,
      title: 'Mejora continua',
      color: CorporateColors.secondary
    },
    {
      icon: Heart,
      title: 'Bienestar y convivencia',
      color: CorporateColors.accent
    },
    {
      icon: Cpu,
      title: 'Innovación y tecnología',
      color: CorporateColors.pink
    }
  ];

  // Áreas de trabajo principales
  const areasDeTabajo = [
    {
      icon: BookOpen,
      color: '#00BCD4',
      title: 'Gestión Pedagógica',
      description: 'Fortalecemos prácticas de enseñanza y aprendizaje para mejorar los resultados y experiencias educativas.'
    },
    {
      icon: Award,
      color: '#FFA726',
      title: 'Liderazgo Educativo',
      description: 'Desarrollamos capacidades de liderazgo para una gestión estratégica y el fortalecimiento institucional.'
    },
    {
      icon: Heart,
      color: '#AB47BC',
      title: 'Formación y Convivencia',
      description: 'Promovemos el bienestar socioemocional y la convivencia positiva en todas las comunidades.'
    },
    {
      icon: Laptop,
      color: '#42A5F5',
      title: 'Gestión de Recursos e Innovación',
      description: 'Asesoramos procesos de transformación digital y uso eficiente de recursos.'
    }
  ];

  // Cursos destacados para el carrusel
  const cursosDestacados = [
    {
      icon: Smile,
      color: '#00BCD4',
      title: 'Convivencia Escolar y Bienestar Educativo',
      description: 'Estrategias para promover el bienestar en la comunidad'
    },
    {
      icon: Brain,
      color: '#AB47BC',
      title: 'Inteligencia Artificial en la Docencia',
      description: 'IA aplicada para transformar la experiencia educativa'
    },
    {
      icon: ShieldCheck,
      color: '#FFA726',
      title: 'Resolución de Conflictos y Manejo de Aula',
      description: 'Técnicas efectivas para la gestión de conflictos y mediar en aula'
    },
    {
      icon: Heart,
      color: '#EC407A',
      title: 'Bienestar y Salud Mental Docente',
      description: 'Herramientas para el autocuidado para el bienestar emocional'
    },
    {
      icon: Cpu,
      color: '#42A5F5',
      title: 'Transformación Digital Educativa',
      description: 'Integra herramientas digitales para innovar y gestionar mejor tu aula'
    },
    {
      icon: BarChart3,
      color: '#66BB6A',
      title: 'Planificación y Evaluación para el Aprendizaje',
      description: 'Diseña planificaciones y evaluaciones para mejorar los aprendizajes de todos'
    }
  ];

  // Beneficios adicionales
  const beneficios = [
    {
      icon: Users,
      title: 'Equipos de profesionales',
      description: 'con amplia experiencia'
    },
    {
      icon: CheckCircle,
      title: 'Programas ajustados a PME',
      description: 'y normativa educativa'
    },
    {
      icon: Target,
      title: 'Modalidades flexibles',
      description: '(presencial, online y mixta)'
    },
    {
      icon: Heart,
      title: 'Asesoría cercana',
      description: 'y personalizada'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(cursosDestacados.length / 3));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(cursosDestacados.length / 3)) % Math.ceil(cursosDestacados.length / 3));
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section
        className="pt-32 pb-20 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #FF8C42 0%, #6B5CE7 100%)'
        }}
      >
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="text-center mb-12"
            >
              <Badge
                className="mb-6 text-sm px-4 py-2"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.3)'
                }}
              >
                ASISTENCIA TÉCNICA EDUCATIVA
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                El poder de crear mejores comunidades educativas
              </h1>

              <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                Acompañamos a establecimientos educacionales en su camino de mejora continua, fortaleciendo capacidades, promoviendo la innovación y generando aprendizajes significativos.
              </p>

              <Button
                size="lg"
                onClick={() => router.push('/nosotros')}
                className="group"
                style={{
                  backgroundColor: 'white',
                  color: CorporateColors.primary,
                  fontWeight: 600
                }}
              >
                Conoce más sobre nosotros
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            {/* Pilares principales */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerChildren}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
            >
              {pilares.map((pilar, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="text-center"
                >
                  <div
                    className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                  >
                    <pilar.icon className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-white font-medium text-sm">{pilar.title}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Nuestras Áreas de Trabajo */}
      <section className="py-20" style={{ backgroundColor: CorporateColors.bgLight }}>
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: CorporateColors.text }}>
              Nuestras Áreas de Trabajo
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {areasDeTabajo.map((area, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card
                  className="p-6 h-full hover:shadow-xl transition-all duration-300 cursor-pointer group border-0"
                  style={{ boxShadow: CorporateShadow.card }}
                  onClick={() => router.push('/cursos')}
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${area.color}15` }}
                  >
                    <area.icon className="w-8 h-8" style={{ color: area.color }} />
                  </div>

                  <h3 className="text-xl font-bold mb-3" style={{ color: CorporateColors.text }}>
                    {area.title}
                  </h3>

                  <p className="text-sm mb-4" style={{ color: CorporateColors.textSecondary }}>
                    {area.description}
                  </p>

                  <button
                    className="text-sm font-semibold flex items-center gap-2 group-hover:gap-3 transition-all"
                    style={{ color: area.color }}
                  >
                    Ver más
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Cursos Destacados - Carrusel */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: CorporateColors.text }}>
              Cursos Destacados
            </h2>
          </motion.div>

          {/* Carrusel */}
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {Array.from({ length: Math.ceil(cursosDestacados.length / 3) }).map((_, slideIndex) => (
                  <div key={slideIndex} className="min-w-full grid md:grid-cols-3 gap-6 px-2">
                    {cursosDestacados.slice(slideIndex * 3, slideIndex * 3 + 3).map((curso, index) => (
                      <Card
                        key={index}
                        className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group border-0"
                        style={{ boxShadow: CorporateShadow.card }}
                        onClick={() => router.push('/cursos')}
                      >
                        <div
                          className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                          style={{ backgroundColor: `${curso.color}15` }}
                        >
                          <curso.icon className="w-7 h-7" style={{ color: curso.color }} />
                        </div>

                        <h3 className="text-lg font-bold mb-2" style={{ color: CorporateColors.text }}>
                          {curso.title}
                        </h3>

                        <p className="text-sm" style={{ color: CorporateColors.textSecondary }}>
                          {curso.description}
                        </p>
                      </Card>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Controles del carrusel */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
              style={{ backgroundColor: CorporateColors.primary }}
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
              style={{ backgroundColor: CorporateColors.primary }}
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Botón Ver todos */}
          <div className="text-center mt-12">
            <Button
              onClick={() => router.push('/cursos')}
              size="lg"
              className="group"
              style={{
                backgroundColor: CorporateColors.primary,
                color: 'white'
              }}
            >
              Ver todos los cursos
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Beneficios adicionales */}
      <section className="py-20" style={{ backgroundColor: CorporateColors.bgLight }}>
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {beneficios.map((beneficio, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="flex items-start gap-4"
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${CorporateColors.primary}15` }}
                >
                  <beneficio.icon className="w-6 h-6" style={{ color: CorporateColors.primary }} />
                </div>
                <div>
                  <h4 className="font-bold mb-1" style={{ color: CorporateColors.text }}>
                    {beneficio.title}
                  </h4>
                  <p className="text-sm" style={{ color: CorporateColors.textSecondary }}>
                    {beneficio.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Final */}
      <section
        className="py-20 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #FF8C42 0%, #6B5CE7 100%)'
        }}
      >
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              ¿Listo para transformar tu comunidad educativa?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Conversemos sobre cómo podemos acompañar el desarrollo de tu establecimiento
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => router.push('/contacto')}
                style={{
                  backgroundColor: 'white',
                  color: CorporateColors.primary,
                  fontWeight: 600
                }}
              >
                Contáctanos
              </Button>
              <Button
                size="lg"
                onClick={() => router.push('/cursos')}
                variant="outline"
                style={{
                  borderColor: 'white',
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }}
              >
                Ver catálogo de cursos
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
