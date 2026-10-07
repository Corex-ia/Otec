'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Shield,
  Award,
  Star,
  Users,
  ArrowRight,
  GraduationCap,
  Building2,
  Target,
  TrendingUp,
  CheckCircle,
  BookOpen,
  Zap,
  ChevronLeft,
  ChevronRight,
  Play,
  Image as ImageIcon,
  UserPlus,
  Smile,
} from "lucide-react";

const CorporateColors = {
  primary: '#5D3FD3',
  primaryLight: '#F0ECFF',
  secondary: '#6B5CE7',
  accent: '#FF8C42',
  accentLight: '#FFF0E6',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  bgLight: '#F9FAFB',
  bgGradient: 'linear-gradient(135deg, #F0ECFF 0%, #FFF0E6 100%)',
  border: '#E5E7EB',
  borderLight: 'rgba(229, 231, 235, 0.5)',
  white: '#FFFFFF',
  purple: '#9B6DFF',
  blue: '#4A90E2',
  pink: '#E63E96',
};

// ─── GalleryCarousel ──────────────────────────────────────────────────────────
function GalleryCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const galleryItems = [
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop',
      title: 'Capacitación en Liderazgo Estratégico',
      description: 'Programa ejecutivo para mandos medios - Ministerio de Agricultura',
      category: 'Liderazgo'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=600&fit=crop',
      title: 'Taller de Innovación Digital',
      description: 'Transformación digital para equipos públicos - DGAC',
      category: 'Tecnología'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&h=600&fit=crop',
      title: 'Programa de Trabajo en Equipo',
      description: 'Fortalecimiento de equipos de alto rendimiento - SERNAMEG',
      category: 'Soft Skills'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&h=600&fit=crop',
      title: 'Gestión de Proyectos',
      description: 'Metodologías ágiles aplicadas al sector público - Senado de Chile',
      category: 'Gestión'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&h=600&fit=crop',
      title: 'Campus Virtual en Acción',
      description: 'Plataforma e-learning implementada - Programa Familias',
      category: 'E-Learning'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=600&fit=crop',
      title: 'Certificación de Participantes',
      description: 'Entrega de certificados SENCE - Municipalidad de Santa Bárbara',
      category: 'Certificación'
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % galleryItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, galleryItems.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryItems.length);
    setIsAutoPlaying(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const currentItem = galleryItems[currentIndex];

  return (
    <motion.section
      className="py-20 relative overflow-hidden"
      style={{ backgroundColor: 'white' }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: CorporateColors.primary }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: CorporateColors.accent }}
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div className="text-center mb-12" variants={fadeInUp}>
          <Badge
            className="mb-4 text-sm px-4 py-2"
            style={{
              background: `linear-gradient(135deg, ${CorporateColors.primary} 0%, ${CorporateColors.accent} 100%)`,
              color: 'white',
              border: 'none'
            }}
          >
            Nuestro Trabajo
          </Badge>

          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            style={{ color: CorporateColors.primary }}
          >
            Cursos que Hemos Impartido
          </h2>

          <p
            className="text-lg md:text-xl max-w-3xl mx-auto"
            style={{ color: CorporateColors.textSecondary }}
          >
            Conoce algunos de los programas de capacitación que hemos ejecutado exitosamente para instituciones públicas y empresas privadas
          </p>
        </motion.div>

        <motion.div className="relative max-w-6xl mx-auto" variants={fadeInUp}>
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              height: '500px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)'
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src={currentItem.url}
                  alt={currentItem.title}
                  className="w-full h-full object-cover"
                />

                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)'
                  }}
                />

                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <Badge
                    className="mb-3"
                    style={{
                      backgroundColor: CorporateColors.accent,
                      color: 'white',
                      border: 'none'
                    }}
                  >
                    {currentItem.category}
                  </Badge>
                  <h3 className="text-3xl font-bold mb-2">
                    {currentItem.title}
                  </h3>
                  <p className="text-lg opacity-90">
                    {currentItem.description}
                  </p>
                </div>

                <div className="absolute top-6 right-6">
                  <div
                    className="px-4 py-2 rounded-full flex items-center gap-2"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      color: 'white'
                    }}
                  >
                    {currentItem.type === 'video' ? (
                      <>
                        <Play className="w-4 h-4" />
                        <span className="text-sm font-medium">Video</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">Foto</span>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = CorporateColors.primary;
                e.currentTarget.querySelector('svg')?.setAttribute('stroke', 'white');
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                e.currentTarget.querySelector('svg')?.setAttribute('stroke', CorporateColors.primary);
              }}
            >
              <ChevronLeft
                className="w-6 h-6"
                style={{ color: CorporateColors.primary }}
              />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = CorporateColors.primary;
                e.currentTarget.querySelector('svg')?.setAttribute('stroke', 'white');
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                e.currentTarget.querySelector('svg')?.setAttribute('stroke', CorporateColors.primary);
              }}
            >
              <ChevronRight
                className="w-6 h-6"
                style={{ color: CorporateColors.primary }}
              />
            </button>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {galleryItems.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: currentIndex === index ? '40px' : '12px',
                  height: '12px',
                  backgroundColor: currentIndex === index
                    ? CorporateColors.primary
                    : CorporateColors.border
                }}
              />
            ))}
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-8">
            {galleryItems.map((item, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className="relative rounded-lg overflow-hidden group aspect-video transition-all duration-300"
                style={{
                  border: currentIndex === index
                    ? `3px solid ${CorporateColors.primary}`
                    : '3px solid transparent'
                }}
              >
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                  style={{
                    filter: currentIndex === index ? 'grayscale(0%)' : 'grayscale(100%)'
                  }}
                />
                <div
                  className="absolute inset-0 bg-black transition-opacity duration-300"
                  style={{
                    opacity: currentIndex === index ? 0 : 0.4
                  }}
                />
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div className="text-center mt-8" variants={fadeInUp}>
          <p
            className="text-sm"
            style={{ color: CorporateColors.textSecondary }}
          >
            {isAutoPlaying
              ? 'Reproducción automática activada • Haz clic en las flechas para controlar manualmente'
              : 'Reproducción automática pausada • Las imágenes cambian automáticamente cada 5 segundos'}
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}

// ─── InstructorsSection ───────────────────────────────────────────────────────
function InstructorsSection() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
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

  const requirements = [
    {
      icon: GraduationCap,
      title: 'Formación Académica Formal',
      description: 'Título profesional acreditado, complementado con diplomados, magíster y/o doctorado según el área de especialización.',
      color: CorporateColors.primary
    },
    {
      icon: TrendingUp,
      title: 'Especialización Técnica Actualizada',
      description: 'Formación continua en cursos, seminarios y certificaciones que aseguran dominio técnico vigente en su disciplina.',
      color: CorporateColors.secondary
    },
    {
      icon: Users,
      title: 'Competencias Transversales',
      description: 'Habilidades comunicacionales, liderazgo pedagógico y capacidad de trabajo colaborativo, fundamentales para procesos formativos efectivos.',
      color: CorporateColors.accent
    },
    {
      icon: Award,
      title: 'Experiencia Profesional Comprobable',
      description: 'Trayectoria laboral demostrable en el área de desempeño, garantizando enfoque práctico y aplicado.',
      color: '#4A90E2'
    },
    {
      icon: BookOpen,
      title: 'Experiencia en Relatoría',
      description: 'Experiencia acreditable en ejecución de cursos de capacitación, con enfoque en resultados de aprendizaje y transferencia al puesto de trabajo.',
      color: '#E63E96'
    }
  ];

  const trustReasons = [
    {
      icon: Award,
      title: 'OTEC acreditada',
      description: 'Procesos respaldados por Sistema de Gestión de Calidad certificado NCh 2728:2015.',
      color: CorporateColors.primary
    },
    {
      icon: Star,
      title: 'Relatores expertos',
      description: 'Facilitadores con experiencia comprobable y enfoque práctico.',
      color: CorporateColors.accent
    },
    {
      icon: Smile,
      title: '95% satisfacción',
      description: 'Alta valoración de participantes en nuestras capacitaciones.',
      color: CorporateColors.secondary
    }
  ];

  return (
    <motion.section
      className="py-20 relative overflow-hidden"
      style={{
        backgroundColor: CorporateColors.bgLight,
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: CorporateColors.secondary }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: CorporateColors.accent }}
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          variants={fadeInUp}
        >
          <Badge
            className="mb-4 text-sm px-4 py-2"
            style={{
              background: `linear-gradient(135deg, ${CorporateColors.primary} 0%, ${CorporateColors.accent} 100%)`,
              color: 'white',
              border: 'none'
            }}
          >
            Excelencia Académica
          </Badge>

          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            style={{ color: CorporateColors.primary }}
          >
            El perfil de nuestros relatores
          </h2>

          <p
            className="text-lg md:text-xl max-w-3xl mx-auto"
            style={{ color: CorporateColors.textSecondary }}
          >
            En OTEC El Poder de Crear contamos con un cuerpo académico seleccionado bajo criterios técnicos y de calidad, garantizando una experiencia formativa rigurosa y alineada con la normativa vigente.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto mb-16">
          <motion.div
            variants={staggerChildren}
            className="space-y-6"
          >
            {requirements.map((req, index) => (
              <motion.div
                key={index}
                variants={fadeInLeft}
                className="flex gap-4 group"
              >
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${req.color}15 0%, ${req.color}25 100%)`,
                  }}
                >
                  <req.icon
                    className="w-6 h-6"
                    style={{ color: req.color }}
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3
                      className="text-lg font-bold"
                      style={{ color: CorporateColors.textPrimary }}
                    >
                      {req.title}
                    </h3>
                    <CheckCircle
                      className="w-5 h-5 flex-shrink-0 mt-0.5"
                      style={{ color: '#10b981' }}
                    />
                  </div>
                  <p
                    className="leading-relaxed"
                    style={{ color: CorporateColors.textSecondary }}
                  >
                    {req.description}
                  </p>
                </div>
              </motion.div>
            ))}

            <motion.div
              variants={fadeInLeft}
              className="pt-6"
            >
              <div
                className="inline-flex items-center gap-3 px-6 py-4 rounded-xl"
                style={{
                  background: `linear-gradient(135deg, ${CorporateColors.primary} 0%, ${CorporateColors.secondary} 100%)`,
                  color: 'white'
                }}
              >
                <Target className="w-6 h-6" />
                <span className="font-semibold">
                  Relatores calificados, conforme a la Norma NCh 2728:2015.
                </span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeInRight}
            className="relative"
          >
            <div
              className="relative rounded-2xl overflow-hidden shadow-2xl"
              style={{
                border: `4px solid ${CorporateColors.primary}20`
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1758518732175-5d608ba3abdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHRlYW0lMjBtZWV0aW5nJTIwb2ZmaWNlfGVufDF8fHx8MTc3MDgxNzQyMHww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Equipo de Relatores Profesionales"
                className="w-full h-auto object-cover"
                style={{ aspectRatio: '4/3' }}
              />

              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to top, rgba(93, 63, 211, 0.2) 0%, transparent 50%)'
                }}
              />
            </div>

            <motion.div
              className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-2xl p-6"
              style={{
                border: `2px solid ${CorporateColors.border}`,
                maxWidth: '340px'
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-4 mb-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${CorporateColors.primary} 0%, ${CorporateColors.accent} 100%)`
                  }}
                >
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p
                    className="text-xl font-bold leading-tight"
                    style={{
                      background: `linear-gradient(135deg, ${CorporateColors.primary} 0%, ${CorporateColors.accent} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    Multidisciplinarios
                  </p>
                  <p
                    className="text-sm font-medium"
                    style={{ color: CorporateColors.textSecondary }}
                  >
                    Especialistas en Diversas Áreas
                  </p>
                </div>
              </div>
              <p
                className="text-xs"
                style={{ color: CorporateColors.textSecondary }}
              >
                Profesionales certificados en diversas áreas de especialización
              </p>
            </motion.div>

            <div
              className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-20 blur-xl"
              style={{
                background: `linear-gradient(135deg, ${CorporateColors.primary} 0%, ${CorporateColors.accent} 100%)`
              }}
            />
          </motion.div>
        </div>

        <motion.div
          className="max-w-5xl mx-auto"
          variants={fadeInUp}
        >
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-12 h-0.5" style={{ backgroundColor: CorporateColors.accent }} />
              <Star className="w-5 h-5" style={{ color: CorporateColors.accent }} />
              <div className="w-12 h-0.5" style={{ backgroundColor: CorporateColors.accent }} />
            </div>

            <h3
              className="text-2xl md:text-3xl font-bold mb-3"
              style={{ color: CorporateColors.primary }}
            >
              ¿Por qué confiar en nuestro equipo?
            </h3>

            <p
              className="text-base md:text-lg"
              style={{ color: CorporateColors.textSecondary }}
            >
              Respaldo, experiencia y resultados para su próxima capacitación.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trustReasons.map((reason, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-2xl text-center bg-white"
                style={{
                  border: `1px solid ${CorporateColors.border}`,
                  boxShadow: '0 4px 12px rgba(93, 63, 211, 0.06)'
                }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: '0 8px 24px rgba(93, 63, 211, 0.12)',
                  transition: { duration: 0.3 }
                }}
              >
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{
                    background: `${reason.color}15`
                  }}
                >
                  <reason.icon className="w-8 h-8" style={{ color: reason.color }} />
                </div>

                <h4
                  className="text-lg font-bold mb-3"
                  style={{ color: CorporateColors.textPrimary }}
                >
                  {reason.title}
                </h4>

                <p
                  className="text-sm leading-relaxed"
                  style={{ color: CorporateColors.textSecondary }}
                >
                  {reason.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="text-center mt-12"
          variants={fadeInUp}
        >
          <Button
            size="lg"
            className="text-lg px-8 py-6 font-semibold rounded-xl"
            style={{
              background: `linear-gradient(135deg, ${CorporateColors.primary} 0%, ${CorporateColors.accent} 100%)`,
              color: 'white',
              border: 'none'
            }}
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Únete a Nuestro Equipo de Relatores
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function NewHomePageDynamic() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "empresas" | "personas"
  >("empresas");
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2],
    [1, 0],
  );

  const onNavigate = (page: string) => router.push('/' + page);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: CorporateColors.bgGradient,
      }}
    >
      {/* HERO SECTION - ESTILO DINÁMICO */}
      <motion.section
        className="relative pt-32 pb-24 overflow-hidden"
        style={{
          backgroundColor: CorporateColors.primary,
        }}
      >
        {/* Partículas flotantes de fondo */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 6 + 2 + "px",
                height: Math.random() * 6 + 2 + "px",
                backgroundColor:
                  i % 3 === 0
                    ? CorporateColors.accent
                    : i % 3 === 1
                      ? CorporateColors.secondary
                      : CorporateColors.primary,
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
                opacity: 0.2,
              }}
              animate={{
                y: [0, Math.random() * -100 - 50],
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Contenido Principal */}
              <div>
                {/* Badge OTEC con glassmorphism */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block mb-8"
                >
                  <div
                    className="px-6 py-3 rounded-full flex items-center gap-3"
                    style={{
                      backgroundColor: CorporateColors.accent,
                      border: "none",
                    }}
                  >
                    <Shield className="w-5 h-5 text-white" />
                    <span className="text-white font-semibold text-sm">
                      OTEC Acreditada por SENCE
                    </span>
                  </div>
                </motion.div>

                {/* Título Principal */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <h1
                    className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight"
                    style={{ color: "white" }}
                  >
                    El Poder de
                    <br />
                    <span
                      className="relative inline-block"
                      style={{ color: CorporateColors.accent }}
                    >
                      Crear
                      <motion.div
                        className="absolute bottom-2 left-0 right-0 h-2"
                        style={{
                          backgroundColor: "white",
                          opacity: 0.3,
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{
                          delay: 0.8,
                          duration: 0.8,
                        }}
                      />
                    </span>
                  </h1>
                </motion.div>

                {/* Slogan */}
                <motion.p
                  className="text-2xl mb-8 italic"
                  style={{ color: "rgba(255, 255, 255, 0.9)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  Aprendes hoy, lideras mañana
                </motion.p>

                {/* Descripción */}
                <motion.p
                  className="text-lg mb-10 max-w-xl"
                  style={{ color: "rgba(255, 255, 255, 0.85)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  Somos un Organismo Técnico de Capacitación
                  (OTEC) certificado bajo la Norma Chilena NCh
                  2728:2015, especializado en el desarrollo de
                  competencias laborales para empresas y
                  personas, mediante programas de capacitación
                  alineados a la normativa vigente y a las
                  necesidades reales del entorno laboral.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      className="text-lg px-8 py-6 font-semibold"
                      style={{
                        backgroundColor: CorporateColors.accent,
                        color: "white",
                      }}
                      onClick={() => router.push('/empresas')}
                    >
                      Soluciones para Empresas
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="text-lg px-8 py-6 font-semibold"
                      style={{
                        borderColor: "white",
                        color: "white",
                        borderWidth: "2px",
                        backgroundColor: "transparent",
                      }}
                      onClick={() =>
                        router.push('/educacion-continua')
                      }
                    >
                      Cursos Individuales
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </motion.div>
                </motion.div>
              </div>

              {/* Cards Flotantes — patrón dado: logo al centro, 4 cards en esquinas */}
              <div className="relative hidden lg:block" style={{ height: "460px" }}>

                {/* CENTRO: Logo OTEC */}
                <motion.div className="absolute p-4 rounded-2xl shadow-2xl"
                  style={{
                    backgroundColor: "white",
                    border: `2px solid ${CorporateColors.borderLight}`,
                    width: "170px", height: "170px",
                    top: "50%", left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 10,
                  }}
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <img src="/logo-otec.png" alt="El Poder de Crear - OTEC"
                      className="w-full h-full" style={{ objectFit: "contain" }} />
                  </div>
                </motion.div>

                {/* ESQUINA arriba-izquierda — 95% Satisfacción (naranja) */}
                <motion.div className="absolute p-4 rounded-2xl shadow-xl"
                  style={{
                    background: "rgba(255, 107, 53, 0.15)", backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 107, 53, 0.3)", width: "148px",
                    top: "0", left: "0", zIndex: 5,
                  }}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2 mx-auto" style={{ backgroundColor: "rgba(255, 107, 53, 0.3)" }}>
                    <Star className="w-5 h-5" style={{ color: "#FF6B35" }} />
                  </div>
                  <div className="text-xl font-bold text-white text-center mb-0.5">95%</div>
                  <div className="text-xs text-white/80 text-center leading-tight mb-1">Satisfacción</div>
                  <div className="text-xs text-white/70 text-center leading-tight">Relatores especializados</div>
                </motion.div>

                {/* ESQUINA arriba-derecha — Soporte Continuo (púrpura) */}
                <motion.div className="absolute p-4 rounded-2xl shadow-xl"
                  style={{
                    background: "rgba(107, 92, 231, 0.15)", backdropFilter: "blur(10px)",
                    border: "1px solid rgba(107, 92, 231, 0.3)", width: "148px",
                    top: "0", right: "0", zIndex: 5,
                  }}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2 mx-auto" style={{ backgroundColor: "rgba(107, 92, 231, 0.3)" }}>
                    <Users className="w-5 h-5" style={{ color: "#6B5CE7" }} />
                  </div>
                  <div className="text-base font-bold text-white text-center mb-0.5 leading-tight">Soporte Continuo</div>
                  <div className="text-xs text-white/80 text-center leading-tight">Acompañamiento permanente</div>
                </motion.div>

                {/* ESQUINA abajo-izquierda — Metodologías (cyan) */}
                <motion.div className="absolute p-4 rounded-2xl shadow-xl"
                  style={{
                    background: "rgba(0, 217, 255, 0.15)", backdropFilter: "blur(10px)",
                    border: "1px solid rgba(0, 217, 255, 0.3)", width: "148px",
                    bottom: "0", left: "0", zIndex: 5,
                  }}
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2 mx-auto" style={{ backgroundColor: "rgba(0, 217, 255, 0.3)" }}>
                    <Target className="w-5 h-5" style={{ color: "#00D9FF" }} />
                  </div>
                  <div className="text-base font-bold text-white text-center mb-0.5 leading-tight">Metodologías aplicadas</div>
                  <div className="text-xs text-white/80 text-center leading-tight">Enfoque práctico</div>
                </motion.div>

                {/* ESQUINA abajo-derecha — Experiencia multisectorial (rosa) */}
                <motion.div className="absolute p-4 rounded-2xl shadow-xl"
                  style={{
                    background: "rgba(230, 62, 150, 0.15)", backdropFilter: "blur(10px)",
                    border: "1px solid rgba(230, 62, 150, 0.3)", width: "148px",
                    bottom: "0", right: "0", zIndex: 5,
                  }}
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 3.3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2 mx-auto" style={{ backgroundColor: "rgba(230, 62, 150, 0.3)" }}>
                    <Building2 className="w-5 h-5" style={{ color: "#E63E96" }} />
                  </div>
                  <div className="text-base font-bold text-white text-center mb-0.5 leading-tight">Experiencia multisectorial</div>
                  <div className="text-xs text-white/80 text-center leading-tight">
                    Público y privado
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* SECCIÓN: GALERÍA - Cursos que Hemos Impartido */}
      <GalleryCarousel />

      {/* SECCIÓN: ¿QUÉ OFRECEMOS? - Con tabs dinámicos */}
      <motion.section
        className="py-20"
        style={{ backgroundColor: CorporateColors.bgLight }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge
                className="mb-4"
                style={{
                  backgroundColor: CorporateColors.primary,
                  color: "white",
                  fontSize: "0.875rem",
                  padding: "0.5rem 1.5rem",
                }}
              >
                Nuestras Soluciones
              </Badge>
              <h2
                className="text-4xl md:text-5xl font-bold mb-4"
                style={{ color: CorporateColors.textPrimary }}
              >
                Capacitación Diseñada para{" "}
                <span
                  style={{ color: CorporateColors.primary }}
                >
                  Tu Éxito
                </span>
              </h2>
              <p
                className="text-xl max-w-3xl mx-auto"
                style={{ color: CorporateColors.textSecondary }}
              >
                Programas flexibles que se adaptan a tus
                necesidades
              </p>
            </motion.div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(val) =>
              setActiveTab(val as "empresas" | "personas")
            }
            className="max-w-6xl mx-auto"
          >
            <div className="flex justify-center mb-12">
              <TabsList
                className="p-2 rounded-2xl"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  border: `2px solid ${CorporateColors.border}`,
                }}
              >
                <TabsTrigger
                  value="empresas"
                  className="px-8 py-3 rounded-xl font-semibold transition-all"
                  style={{
                    backgroundColor:
                      activeTab === "empresas"
                        ? CorporateColors.primary
                        : "rgba(93, 63, 211, 0)",
                    color:
                      activeTab === "empresas"
                        ? "white"
                        : CorporateColors.textSecondary,
                  }}
                >
                  <Building2 className="w-5 h-5 mr-2" />
                  Para Empresas
                </TabsTrigger>
                <TabsTrigger
                  value="personas"
                  className="px-8 py-3 rounded-xl font-semibold transition-all"
                  style={{
                    backgroundColor:
                      activeTab === "personas"
                        ? CorporateColors.primary
                        : "rgba(93, 63, 211, 0)",
                    color:
                      activeTab === "personas"
                        ? "white"
                        : CorporateColors.textSecondary,
                  }}
                >
                  <Users className="w-5 h-5 mr-2" />
                  Educación Continua
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="empresas">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      icon: Target,
                      title: "Diagnóstico y Planificación",
                      description:
                        "Analizamos las necesidades de tu equipo y diseñamos un plan de capacitación a medida.",
                      color: CorporateColors.purple,
                      bgColor: "rgba(155, 109, 255, 0.1)",
                    },
                    {
                      icon: GraduationCap,
                      title: "Ejecución de Programas",
                      description:
                        "Implementamos cursos con relatores expertos en modalidad presencial, online o blended.",
                      color: CorporateColors.accent,
                      bgColor: "rgba(255, 140, 66, 0.1)",
                    },
                    {
                      icon: Shield,
                      title: "Acompañamiento en procesos SENCE",
                      description:
                        "Orientamos y acompañamos a empresas y personas en los requisitos y etapas del proceso SENCE, conforme a la normativa vigente.",
                      color: CorporateColors.blue,
                      bgColor: "rgba(74, 144, 226, 0.1)",
                    },
                    {
                      icon: TrendingUp,
                      title: "Medición de Resultados",
                      description:
                        "Evaluamos el impacto de la capacitación con indicadores claros y reportes detallados.",
                      color: CorporateColors.pink,
                      bgColor: "rgba(230, 62, 150, 0.1)",
                    },
                    {
                      icon: Users,
                      title: "Acompañamiento Continuo",
                      description:
                        "Equipo dedicado disponible para resolver dudas y apoyar en todo momento.",
                      color: CorporateColors.purple,
                      bgColor: "rgba(155, 109, 255, 0.1)",
                    },
                    {
                      icon: CheckCircle,
                      title: "Certificación Oficial",
                      description:
                        "Entrega de certificados con validez nacional avalados por SENCE.",
                      color: CorporateColors.accent,
                      bgColor: "rgba(255, 140, 66, 0.1)",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <Card
                        className="p-6 h-full hover:shadow-xl transition-all"
                        style={{
                          backgroundColor: "white",
                          border: `2px solid ${item.bgColor}`,
                        }}
                      >
                        <div
                          className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                          style={{
                            backgroundColor: item.bgColor,
                          }}
                        >
                          <item.icon
                            className="w-7 h-7"
                            style={{ color: item.color }}
                          />
                        </div>
                        <h3
                          className="text-xl font-semibold mb-3"
                          style={{
                            color: CorporateColors.textPrimary,
                          }}
                        >
                          {item.title}
                        </h3>
                        <p
                          style={{
                            color:
                              CorporateColors.textSecondary,
                          }}
                        >
                          {item.description}
                        </p>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  className="text-center mt-12"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <Button
                    size="lg"
                    className="text-lg px-8 py-6 font-semibold"
                    style={{
                      backgroundColor: CorporateColors.primary,
                      color: "white",
                    }}
                    onClick={() => router.push('/empresas')}
                  >
                    Ver Más Sobre Soluciones Empresariales
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
              </motion.div>
            </TabsContent>

            <TabsContent value="personas">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  <Card
                    className="p-8 hover:shadow-xl transition-all"
                    style={{
                      backgroundColor: "white",
                      border: `2px solid rgba(155, 109, 255, 0.2)`,
                    }}
                  >
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
                      style={{
                        backgroundColor:
                          "rgba(155, 109, 255, 0.1)",
                      }}
                    >
                      <BookOpen
                        className="w-8 h-8"
                        style={{
                          color: CorporateColors.purple,
                        }}
                      />
                    </div>
                    <h3
                      className="text-2xl font-semibold mb-4"
                      style={{
                        color: CorporateColors.textPrimary,
                      }}
                    >
                      Cursos Abiertos
                    </h3>
                    <p
                      className="mb-6"
                      style={{
                        color: CorporateColors.textSecondary,
                      }}
                    >
                      Programas diseñados para profesionales que
                      buscan actualizar sus competencias y
                      destacar en el mercado laboral.
                    </p>
                    <ul className="space-y-3 mb-6">
                      {[
                        "Inscripción flexible",
                        "Horarios adaptables",
                        "Certificación oficial",
                        "Metodología práctica",
                        "Acceso a plataforma 24/7",
                      ].map((item, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-3"
                        >
                          <CheckCircle
                            className="w-5 h-5"
                            style={{
                              color: CorporateColors.purple,
                            }}
                          />
                          <span
                            style={{
                              color:
                                CorporateColors.textSecondary,
                            }}
                          >
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      size="lg"
                      style={{
                        backgroundColor: CorporateColors.purple,
                        color: "white",
                      }}
                      onClick={() =>
                        router.push('/educacion-continua')
                      }
                    >
                      Explorar Cursos Abiertos
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Card>

                  <Card
                    className="p-8 hover:shadow-xl transition-all"
                    style={{
                      backgroundColor: "white",
                      border: `2px solid rgba(230, 62, 150, 0.2)`,
                    }}
                  >
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
                      style={{
                        backgroundColor:
                          "rgba(230, 62, 150, 0.1)",
                      }}
                    >
                      <Zap
                        className="w-8 h-8"
                        style={{ color: CorporateColors.pink }}
                      />
                    </div>
                    <h3
                      className="text-2xl font-semibold mb-4"
                      style={{
                        color: CorporateColors.textPrimary,
                      }}
                    >
                      Demo Gratis
                    </h3>
                    <p
                      className="mb-6"
                      style={{
                        color: CorporateColors.textSecondary,
                      }}
                    >
                      Prueba nuestro Campus Virtual sin costo y
                      descubre la experiencia de aprendizaje que
                      ofrecemos.
                    </p>
                    <ul className="space-y-3 mb-6">
                      {[
                        "Acceso inmediato",
                        "Contenido de muestra",
                        "Sin compromiso",
                        "Soporte en línea",
                        "Certificado de prueba",
                      ].map((item, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-3"
                        >
                          <CheckCircle
                            className="w-5 h-5"
                            style={{
                              color: CorporateColors.pink,
                            }}
                          />
                          <span
                            style={{
                              color:
                                CorporateColors.textSecondary,
                            }}
                          >
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      size="lg"
                      variant="outline"
                      style={{
                        borderColor: CorporateColors.pink,
                        color: CorporateColors.pink,
                        borderWidth: "2px",
                      }}
                      onClick={() =>
                        router.push('/educacion-continua')
                      }
                    >
                      Solicitar Demo Gratis
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Card>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </motion.section>

      {/* INSTITUCIONES QUE HAN CONFIADO EN NOSOTROS */}
      <section className="py-16 overflow-hidden" style={{ backgroundColor: 'white', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB' }}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-3" style={{ backgroundColor: CorporateColors.primaryLight, color: CorporateColors.primary }}>Instituciones que confían en nosotros</span>
            <h2 className="text-2xl font-bold" style={{ color: CorporateColors.textPrimary }}>Presencia en todo Chile</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {['Min. Bienes Nacionales','Min. Agricultura','Min. Transportes','Senado de Chile','DGAC Chile','SERNAMEG','M. Santa Bárbara','M. Navidad','Dipreca','Aduanas','FFAA','SEREMI','Punta Arenas','Programa Familias'].map((name) => (
              <div key={name} className="px-5 py-3 rounded-xl text-sm font-medium border" style={{ backgroundColor: CorporateColors.bgLight, color: CorporateColors.textSecondary, borderColor: CorporateColors.border }}>{name}</div>
            ))}
          </div>
        </div>
      </section>

      {/* SOMOS PROVEEDORES DEL ESTADO */}
      <motion.section
        className="py-16 border-y"
        style={{
          backgroundColor: CorporateColors.primaryLight,
          borderColor: CorporateColors.border
        }}
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
              <Badge
                className="mb-4"
                style={{
                  backgroundColor: CorporateColors.primary,
                  color: 'white',
                  fontSize: '0.875rem',
                  padding: '0.5rem 1.5rem'
                }}
              >
                <Shield className="w-4 h-4 mr-2 inline-block" />
                Proveedor Oficial
              </Badge>
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ color: CorporateColors.textPrimary }}
              >
                Somos Proveedores del Estado
              </h2>
              <p
                className="text-lg md:text-xl mb-6"
                style={{ color: CorporateColors.textSecondary }}
              >
                Organismo Técnico de Capacitación certificado y acreditado para brindar servicios de formación a instituciones públicas y organismos estatales en Chile.
              </p>
              <div className="flex flex-wrap justify-center gap-6 mt-8">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" style={{ color: CorporateColors.accent }} />
                  <span style={{ color: CorporateColors.textSecondary }}>Certificación NCh 2728:2015</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" style={{ color: CorporateColors.accent }} />
                  <span style={{ color: CorporateColors.textSecondary }}>Acreditación SENCE</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" style={{ color: CorporateColors.accent }} />
                  <span style={{ color: CorporateColors.textSecondary }}>Experiencia en sector público</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* SECCIÓN: INSTRUCTORES */}
      <InstructorsSection />
    </div>
  );
}
