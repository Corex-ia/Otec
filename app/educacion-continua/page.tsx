'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  GraduationCap, Users, Clock, Award, CheckCircle, ArrowRight,
  BookOpen, Star, Zap, Target, TrendingUp, Heart, Shield,
  Play, Laptop
} from 'lucide-react';
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

export default function EducacionContinuaPage() {
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
        staggerChildren: 0.12
      }
    }
  };

  const cursosDestacados = [
    {
      titulo: 'Excel Avanzado para Profesionales',
      modalidad: 'Online',
      duracion: '40 horas',
      sence: true,
      rating: 4.8,
      precio: 'Consultar',
      imagen: '💼'
    },
    {
      titulo: 'Gestión de Proyectos PMI',
      modalidad: 'Híbrido',
      duracion: '60 horas',
      sence: true,
      rating: 4.9,
      precio: 'Consultar',
      imagen: '📊'
    },
    {
      titulo: 'Marketing Digital Estratégico',
      modalidad: 'Online',
      duracion: '50 horas',
      sence: true,
      rating: 4.7,
      precio: 'Consultar',
      imagen: '📱'
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: CorporateColors.bgLight }}>

      {/* HERO B2C */}
      <motion.section
        className="relative overflow-hidden py-20 lg:py-32"
        style={{
          background: 'linear-gradient(135deg, #FF8C42 0%, #6B5CE7 100%)'
        }}
        initial="hidden"
        animate="visible"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            className="absolute top-10 right-10 w-96 h-96 rounded-full blur-3xl"
            style={{ backgroundColor: CorporateColors.primary }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-10 left-10 w-80 h-80 rounded-full blur-3xl"
            style={{ backgroundColor: 'white' }}
            animate={{
              scale: [1.1, 1, 1.1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div variants={fadeInUp}>
              <Badge
                className="mb-6 text-sm px-4 py-2 border-2"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  borderColor: 'white'
                }}
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Educación Continua
              </Badge>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white"
              variants={fadeInUp}
            >
              Impulsa tu{' '}
              <motion.span
                className="inline-block relative"
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                carrera profesional
                <motion.div
                  className="absolute -right-8 -top-6"
                  animate={{ rotate: [0, 15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart className="w-8 h-8 text-yellow-300" />
                </motion.div>
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-white/95 mb-8 max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              Cursos certificados para tu desarrollo, con horarios flexibles
              y acceso a nuestra plataforma online 24/7
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={fadeInUp}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-white hover:bg-gray-100 font-semibold"
                  style={{ color: CorporateColors.primary }}
                  onClick={() => router.push('/cursos')}
                >
                  Explorar Cursos
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 hover:bg-white/10"
                  style={{
                    borderColor: 'white',
                    color: 'white',
                    backgroundColor: 'transparent'
                  }}
                  onClick={() => window.open('https://elpoderdecrear.cl/aulavirtual/', '_blank')}
                >
                  Acceder a LUMEN
                  <Play className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* BENEFICIOS INDIVIDUALES */}
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
            <Badge
              className="mb-4"
              style={{
                backgroundColor: `${CorporateColors.accent}20`,
                color: CorporateColors.accent
              }}
            >
              Beneficios
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: CorporateColors.primary }}>
              Aprende a tu ritmo
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: CorporateColors.textSecondary }}>
              Diseñado para profesionales que buscan crecer
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Clock,
                title: 'Horarios Flexibles',
                description: 'Estudia cuando quieras, donde quieras',
                color: CorporateColors.accent
              },
              {
                icon: Award,
                title: 'Certificación Oficial',
                description: 'Validada y reconocida por SENCE',
                color: CorporateColors.primary
              },
              {
                icon: Laptop,
                title: 'Plataforma 24/7',
                description: 'Acceso completo a LUMEN online',
                color: CorporateColors.secondary
              },
              {
                icon: Users,
                title: 'Soporte Continuo',
                description: 'Tutores y especialistas disponibles',
                color: CorporateColors.accent
              }
            ].map((item, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-6 h-full text-center border-2 hover:shadow-xl transition-shadow">
                    <motion.div
                      className="mb-4 inline-block"
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.6 }}
                    >
                      <item.icon className="w-12 h-12 mx-auto" style={{ color: item.color }} />
                    </motion.div>
                    <h3 className="font-bold mb-2" style={{ color: CorporateColors.textPrimary }}>
                      {item.title}
                    </h3>
                    <p className="text-sm" style={{ color: CorporateColors.textSecondary }}>
                      {item.description}
                    </p>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CURSOS DESTACADOS */}
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
                backgroundColor: `${CorporateColors.accent}20`,
                color: CorporateColors.accent
              }}
            >
              Cursos Populares
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: CorporateColors.primary }}>
              Comienza hoy
            </h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {cursosDestacados.map((curso, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    className="overflow-hidden border-2 hover:shadow-xl transition-shadow cursor-pointer"
                    onClick={() => router.push('/curso-detalle')}
                  >
                    {/* Image placeholder */}
                    <div
                      className="h-48 flex items-center justify-center text-6xl"
                      style={{ backgroundColor: CorporateColors.primaryLight }}
                    >
                      {curso.imagen}
                    </div>

                    <div className="p-6">
                      {curso.sence && (
                        <Badge
                          className="mb-3"
                          style={{
                            backgroundColor: CorporateColors.primaryLight,
                            color: CorporateColors.primary
                          }}
                        >
                          <Shield className="w-3 h-3 mr-1" />
                          SENCE
                        </Badge>
                      )}

                      <h3 className="font-bold mb-3 text-lg" style={{ color: CorporateColors.textPrimary }}>
                        {curso.titulo}
                      </h3>

                      <div className="flex items-center gap-4 mb-4 text-sm" style={{ color: CorporateColors.textSecondary }}>
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {curso.modalidad}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {curso.duracion}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-current" style={{ color: '#FFA500' }} />
                          <span className="font-semibold">{curso.rating}</span>
                        </div>
                        <span className="font-bold text-lg" style={{ color: CorporateColors.accent }}>
                          {curso.precio}
                        </span>
                      </div>

                      <Button
                        className="w-full"
                        style={{
                          backgroundColor: CorporateColors.accent,
                          color: 'white'
                        }}
                      >
                        Inscribirme
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant="outline"
                className="border-2"
                style={{
                  borderColor: CorporateColors.accent,
                  color: CorporateColors.accent
                }}
                onClick={() => router.push('/cursos')}
              >
                Ver Todos los Cursos
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* CÓMO FUNCIONA */}
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
            <Badge
              className="mb-4"
              style={{
                backgroundColor: `${CorporateColors.accent}20`,
                color: CorporateColors.accent
              }}
            >
              Proceso Simple
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: CorporateColors.primary }}>
              En 3 pasos
            </h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                number: '1',
                icon: BookOpen,
                title: 'Elige tu curso',
                description: 'Explora nuestro catálogo y encuentra el curso ideal para ti'
              },
              {
                number: '2',
                icon: Play,
                title: 'Inscríbete',
                description: 'Proceso rápido online con acceso inmediato a la plataforma'
              },
              {
                number: '3',
                icon: Award,
                title: 'Certifícate',
                description: 'Completa el curso y obtén tu certificación oficial'
              }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="text-center"
              >
                <motion.div
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold"
                  style={{
                    backgroundColor: CorporateColors.accent,
                    color: 'white'
                  }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {step.number}
                </motion.div>
                <motion.div
                  className="inline-block mb-3"
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <step.icon className="w-10 h-10 mx-auto" style={{ color: CorporateColors.primary }} />
                </motion.div>
                <h3 className="font-bold mb-2 text-lg" style={{ color: CorporateColors.textPrimary }}>
                  {step.title}
                </h3>
                <p className="text-sm" style={{ color: CorporateColors.textSecondary }}>
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA FINAL */}
      <motion.section
        className="py-20"
        style={{
          background: `linear-gradient(135deg, ${CorporateColors.accent} 0%, ${CorporateColors.primary} 100%)`
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-6 text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              ¿Listo para comenzar tu transformación?
            </motion.h2>
            <motion.p
              className="text-lg text-white/90 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Explora nuestro catálogo y da el primer paso hacia tu desarrollo profesional
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-white hover:bg-gray-100"
                  style={{ color: CorporateColors.accent }}
                  onClick={() => router.push('/cursos')}
                >
                  Ver Catálogo Completo
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

    </div>
  );
}
