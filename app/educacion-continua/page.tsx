import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpen, TrendingUp, Users, Award, ArrowRight, Monitor, MapPin, Layers } from 'lucide-react';

const AREAS = [
  {
    title: 'Tecnologia',
    description: 'Desarrollo web, programacion, analisis de datos e inteligencia artificial.',
    icon: Monitor,
    color: '#1E2E8C',
    bg: '#EBF0FF',
    count: '24 cursos',
  },
  {
    title: 'Negocios',
    description: 'Gestion empresarial, liderazgo, marketing digital y emprendimiento.',
    icon: TrendingUp,
    color: '#FF8C42',
    bg: '#FFF3E8',
    count: '18 cursos',
  },
  {
    title: 'Recursos Humanos',
    description: 'Gestion de talento, clima laboral y desarrollo organizacional.',
    icon: Users,
    color: '#2F5E9E',
    bg: '#EBF2FF',
    count: '12 cursos',
  },
  {
    title: 'Habilidades Blandas',
    description: 'Comunicacion efectiva, trabajo en equipo y resolucion de problemas.',
    icon: Award,
    color: '#059669',
    bg: '#ECFDF5',
    count: '16 cursos',
  },
];

const MODALITIES = [
  {
    icon: Monitor,
    title: 'Online — Aula Virtual',
    description: 'Accede al campus virtual 24/7 desde cualquier dispositivo. Avanza a tu ritmo.',
    href: '/cursos?modalidad=online',
    color: '#1E2E8C',
    bg: '#EBF0FF',
  },
  {
    icon: MapPin,
    title: 'Presencial',
    description: 'Clases en nuestras instalaciones o directamente en tu empresa (in-company).',
    href: '/cursos?modalidad=presencial',
    color: '#FF8C42',
    bg: '#FFF3E8',
  },
  {
    icon: Layers,
    title: 'Hibrido',
    description: 'Lo mejor de ambos mundos: sesiones online combinadas con encuentros presenciales.',
    href: '/cursos?modalidad=hibrido',
    color: '#059669',
    bg: '#ECFDF5',
  },
];

const STATS = [
  { value: '70+', label: 'Cursos disponibles' },
  { value: '5K+', label: 'Alumnos activos' },
  { value: '95%', label: 'Satisfaccion' },
  { value: '4', label: 'Areas de formacion' },
];

export default function EducacionContinuaPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section
        className="relative overflow-hidden py-24"
        style={{ background: 'linear-gradient(135deg, #0D1A4A 0%, #1E2E8C 60%, #2A3FA8 100%)' }}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 30% 60%, rgba(255,140,66,0.12) 0%, transparent 55%)' }}
        />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
              style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              Educacion Continua — B2C
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Aprende hoy,{' '}
              <span style={{ color: '#FF8C42' }}>lideras</span>{' '}
              manana
            </h1>
            <p className="text-lg text-white/80 mb-10 max-w-2xl leading-relaxed">
              Mantente actualizado con programas de formacion continua en las areas mas demandadas.
              Cursos con certificacion SENCE, modalidad flexible y soporte permanente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                asChild
                className="font-semibold text-[#1E2E8C] group"
                style={{ background: '#fff', boxShadow: '0 4px 20px rgba(255,255,255,0.2)' }}
              >
                <Link href="/cursos">
                  Explorar Cursos
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-white/30 text-white hover:bg-white/10 hover:text-white font-medium"
              >
                <Link href="/lumen">Acceder al Aula Virtual</Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-16 border-t border-white/10">
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
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D1A4A] mb-3">
              Areas de Formacion
            </h2>
            <p className="text-[#3A4A7A] text-lg max-w-2xl mx-auto">
              Desarrolla nuevas competencias en las areas mas relevantes del mercado
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {AREAS.map((area) => (
              <Link key={area.title} href="/cursos">
                <div
                  className="p-6 rounded-2xl border hover:shadow-lg transition-all cursor-pointer group"
                  style={{ background: '#fff', borderColor: '#C8D3EE' }}
                >
                  <div
                    className="h-12 w-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: area.bg }}
                  >
                    <area.icon className="h-6 w-6" style={{ color: area.color }} />
                  </div>
                  <h3 className="text-base font-bold text-[#0D1A4A] mb-2">{area.title}</h3>
                  <p className="text-sm text-[#3A4A7A] leading-relaxed mb-4">{area.description}</p>
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: area.bg, color: area.color }}
                  >
                    {area.count}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20" style={{ background: '#fff' }}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D1A4A] mb-3">
              Modalidades de Aprendizaje
            </h2>
            <p className="text-[#3A4A7A] text-lg max-w-2xl mx-auto">
              Elige la forma que mejor se adapte a tu rutina y objetivos
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {MODALITIES.map((mod) => (
              <Link key={mod.title} href={mod.href}>
                <div
                  className="p-8 rounded-2xl border hover:shadow-lg transition-all cursor-pointer text-center group"
                  style={{ background: '#F8F7FF', borderColor: '#C8D3EE' }}
                >
                  <div
                    className="h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                    style={{ background: mod.bg }}
                  >
                    <mod.icon className="h-8 w-8" style={{ color: mod.color }} />
                  </div>
                  <h3 className="font-bold text-[#0D1A4A] mb-2">{mod.title}</h3>
                  <p className="text-sm text-[#3A4A7A] leading-relaxed mb-4">{mod.description}</p>
                  <span
                    className="inline-flex items-center gap-1 text-xs font-semibold group-hover:gap-2 transition-all"
                    style={{ color: mod.color }}
                  >
                    Ver cursos
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        className="py-20 text-white"
        style={{ background: 'linear-gradient(135deg, #1E2E8C, #2A3FA8)' }}
      >
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Invierte en tu desarrollo profesional
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            La educacion continua es clave para mantenerse competitivo. Empieza hoy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              asChild
              className="font-semibold text-[#1E2E8C]"
              style={{ background: '#fff' }}
            >
              <Link href="/cursos">Ver todos los cursos</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white/40 text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/contacto">Mas informacion</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
