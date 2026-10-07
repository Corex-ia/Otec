import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Target, Eye, Heart, Star, ArrowRight, CircleCheck as CheckCircle2 } from 'lucide-react';

const STATS = [
  { value: '10K+', label: 'Estudiantes capacitados', color: '#1E2E8C' },
  { value: '500+', label: 'Empresas confían en nosotros', color: '#FF8C42' },
  { value: '98%', label: 'Satisfacción de clientes', color: '#059669' },
  { value: '15+', label: 'Años de experiencia', color: '#2F5E9E' },
];

const VALUES = [
  {
    icon: Target,
    title: 'Misión',
    description: 'Entregar capacitación de excelencia que transforme vidas y potencie organizaciones a través de programas innovadores y pertinentes.',
    color: '#1E2E8C',
    bg: '#EBF0FF',
  },
  {
    icon: Eye,
    title: 'Visión',
    description: 'Ser el referente en capacitación profesional en Chile, reconocidos por la calidad, el impacto y la innovación en formación continua.',
    color: '#FF8C42',
    bg: '#FFF3E8',
  },
  {
    icon: Heart,
    title: 'Compromiso',
    description: 'Ponemos a nuestros estudiantes y empresas en el centro de todo lo que hacemos, con un servicio personalizado y orientado a resultados.',
    color: '#059669',
    bg: '#ECFDF5',
  },
  {
    icon: Star,
    title: 'Excelencia',
    description: 'Buscamos constantemente la mejora continua en nuestros programas, metodologías y servicios para entregar la mejor experiencia.',
    color: '#2F5E9E',
    bg: '#EBF2FF',
  },
];

const CERTIFICATIONS = [
  'Acreditado SENCE',
  'Norma Chilena NCh 2728:2015',
  'ISO 9001 Calidad',
  'Registro OTEC activo',
];

const WHY_US = [
  'Instructores certificados con experiencia práctica real',
  'Programas adaptados a cada sector y necesidad',
  'Aula Virtual disponible 24/7 para alumnos online',
  'Gestión completa de franquicia tributaria SENCE',
  'Reportes de avance e impacto para equipos RRHH',
  'Soporte permanente durante y después del curso',
];

export default function NosotrosPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section
        className="relative overflow-hidden py-24"
        style={{ background: 'linear-gradient(135deg, #0D1A4A 0%, #2F5E9E 60%, #4A90E2 100%)' }}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 80% 30%, rgba(255,140,66,0.1) 0%, transparent 55%)' }}
        />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
              style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              Nuestra Historia
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Formando el talento{' '}
              <span style={{ color: '#FF8C42' }}>que mueve Chile</span>
            </h1>
            <p className="text-lg text-white/80 mb-10 max-w-2xl leading-relaxed">
              Somos un OTEC certificado con más de 15 años transformando vidas y organizaciones
              a través de la educación. Creemos que el aprendizaje es el motor del progreso.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-white/10">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20" style={{ background: '#F8F7FF' }}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span
                  className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4"
                  style={{ background: '#EBF0FF', color: '#1E2E8C', border: '1px solid #C8D3EE' }}
                >
                  Quiénes somos
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#0D1A4A' }}>
                  Más de una década comprometidos con la formación
                </h2>
                <p className="text-base leading-relaxed mb-4" style={{ color: '#3A4A7A' }}>
                  OTEC El Poder de Crear nace con la convicción de que la capacitación de calidad
                  transforma tanto a las personas como a las organizaciones. Desde nuestros inicios,
                  hemos diseñado programas que responden a las necesidades reales del mercado laboral chileno.
                </p>
                <p className="text-base leading-relaxed mb-6" style={{ color: '#3A4A7A' }}>
                  Trabajamos con empresas de todos los sectores y con profesionales que buscan dar un
                  salto en su carrera. Nuestra metodología combina la teoría con la práctica, garantizando
                  aprendizajes que se aplican desde el primer día.
                </p>
                <div className="flex flex-wrap gap-2">
                  {CERTIFICATIONS.map((cert) => (
                    <span
                      key={cert}
                      className="text-xs font-semibold px-3 py-1.5 rounded-full border"
                      style={{ background: '#fff', borderColor: '#C8D3EE', color: '#3A4A7A' }}
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {VALUES.map((value) => (
                  <div
                    key={value.title}
                    className="p-5 rounded-2xl border"
                    style={{ background: '#fff', borderColor: '#C8D3EE' }}
                  >
                    <div
                      className="h-10 w-10 rounded-xl flex items-center justify-center mb-3"
                      style={{ background: value.bg }}
                    >
                      <value.icon className="h-5 w-5" style={{ color: value.color }} />
                    </div>
                    <h3 className="font-bold text-sm mb-1" style={{ color: '#0D1A4A' }}>{value.title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: '#3A4A7A' }}>{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20" style={{ background: '#fff' }}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: '#0D1A4A' }}>
                Por qué elegirnos
              </h2>
              <p className="text-lg" style={{ color: '#3A4A7A' }}>
                Lo que nos diferencia en el mercado de la capacitación
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {WHY_US.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 p-4 rounded-2xl border"
                  style={{ background: '#F8F7FF', borderColor: '#C8D3EE' }}
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" style={{ color: '#1E2E8C' }} />
                  <p className="text-sm font-medium" style={{ color: '#0D1A4A' }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-20 text-white"
        style={{ background: 'linear-gradient(135deg, #1E2E8C, #2A3FA8)' }}
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
              className="font-semibold text-[#1E2E8C] group"
              style={{ background: '#fff' }}
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
