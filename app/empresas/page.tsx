import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Users,
  TrendingUp,
  Award,
  DollarSign,
  ArrowRight,
  Building2,
  Shield,
} from 'lucide-react';

const BENEFITS = [
  {
    icon: Users,
    title: 'Capacitacion Grupal',
    description: 'Programas disenados para equipos completos con descuentos por volumen y seguimiento personalizado.',
    color: '#1E2E8C',
    bg: '#EBF0FF',
  },
  {
    icon: Award,
    title: 'Certificacion SENCE',
    description: 'Acceso a bonificaciones y beneficios tributarios hasta el 100% del costo de capacitacion.',
    color: '#FF8C42',
    bg: '#FFF3E8',
  },
  {
    icon: TrendingUp,
    title: 'Mejora Continua',
    description: 'Desarrolla competencias clave con metricas de avance y reportes de impacto para RRHH.',
    color: '#059669',
    bg: '#ECFDF5',
  },
  {
    icon: DollarSign,
    title: 'ROI Comprobado',
    description: 'Aumenta la productividad y retencion de talento con programas orientados a resultados.',
    color: '#2F5E9E',
    bg: '#EBF2FF',
  },
];

const PROCESS_STEPS = [
  { step: '01', title: 'Diagnostico', desc: 'Analizamos las necesidades de tu equipo y objetivos organizacionales.' },
  { step: '02', title: 'Propuesta', desc: 'Disenamos un programa a medida con modalidad, horarios y contenido.' },
  { step: '03', title: 'Ejecucion', desc: 'Impartimos el curso con relatores certificados y seguimiento continuo.' },
  { step: '04', title: 'Certificacion', desc: 'Tu equipo recibe certificados oficiales SENCE y reportes de resultados.' },
];

const SECTORS = [
  'Retail y Comercio', 'Salud y Bienestar', 'Tecnologia', 'Construccion',
  'Logistica', 'Servicios Financieros', 'Educacion', 'Manufactura',
];

const STATS = [
  { value: '500+', label: 'Empresas atendidas' },
  { value: '10K+', label: 'Trabajadores capacitados' },
  { value: '98%', label: 'Satisfaccion empresarial' },
  { value: '100%', label: 'Cobertura SENCE disponible' },
];

export default function EmpresasPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section
        className="relative overflow-hidden py-24"
        style={{ background: 'linear-gradient(135deg, #1E2E8C 0%, #152270 50%, #0D1A4A 100%)' }}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(255,140,66,0.15) 0%, transparent 60%)' }}
        />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
              style={{ background: 'rgba(255,140,66,0.2)', color: '#FF8C42', border: '1px solid rgba(255,140,66,0.3)' }}
            >
              Para Empresas — B2B
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Capacitacion que{' '}
              <span style={{ color: '#FF8C42' }}>transforma</span>{' '}
              equipos
            </h1>
            <p className="text-lg text-white/80 mb-10 max-w-2xl leading-relaxed">
              Programas a medida para tu organizacion, con certificacion SENCE, gestion completa y
              reportes de impacto. Invierte en tu capital humano con respaldo tributario.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                asChild
                className="font-semibold text-white group"
                style={{ background: '#FF8C42', boxShadow: '0 4px 20px rgba(255,140,66,0.4)' }}
              >
                <Link href="/contacto">
                  Solicitar Cotizacion
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="font-medium border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/sence">Ver beneficios SENCE</Link>
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
              Beneficios para tu Empresa
            </h2>
            <p className="text-[#3A4A7A] text-lg max-w-2xl mx-auto">
              Soluciones de capacitacion integrales que generan resultados medibles
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="p-6 rounded-2xl border hover:shadow-lg transition-all"
                style={{ background: '#fff', borderColor: '#C8D3EE' }}
              >
                <div
                  className="h-12 w-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: benefit.bg }}
                >
                  <benefit.icon className="h-6 w-6" style={{ color: benefit.color }} />
                </div>
                <h3 className="text-base font-bold text-[#0D1A4A] mb-2">{benefit.title}</h3>
                <p className="text-sm text-[#3A4A7A] leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20" style={{ background: '#fff' }}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0D1A4A] mb-3">
                Proceso de Trabajo
              </h2>
              <p className="text-[#3A4A7A] text-lg">
                Desde el diagnostico hasta la certificacion, te acompanamos en cada etapa
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-6 relative">
              {PROCESS_STEPS.map((step, i) => (
                <div key={step.step} className="relative">
                  <div
                    className="p-6 rounded-2xl border h-full"
                    style={{ background: '#F8F7FF', borderColor: '#C8D3EE' }}
                  >
                    <div className="text-4xl font-black mb-4" style={{ color: 'rgba(93,63,211,0.15)' }}>
                      {step.step}
                    </div>
                    <h3 className="font-bold text-[#0D1A4A] mb-2">{step.title}</h3>
                    <p className="text-sm text-[#3A4A7A] leading-relaxed">{step.desc}</p>
                  </div>
                  {i < PROCESS_STEPS.length - 1 && (
                    <div className="hidden md:flex absolute top-8 -right-3 z-10">
                      <ArrowRight className="h-5 w-5 text-[#7A8AB0]" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-14" style={{ background: '#F8F7FF' }}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#0D1A4A] mb-2">Sectores que atendemos</h2>
            <p className="text-[#3A4A7A]">Experiencia en multiples industrias y rubros</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {SECTORS.map((sector) => (
              <span
                key={sector}
                className="px-4 py-2 rounded-full text-sm font-medium border"
                style={{ background: '#fff', borderColor: '#C8D3EE', color: '#3A4A7A' }}
              >
                {sector}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section
        className="py-20 text-white"
        style={{ background: 'linear-gradient(135deg, #1E2E8C, #152270)' }}
      >
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Listo para capacitar a tu equipo?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Contactanos y disenaremos un programa personalizado para tu empresa en 24 horas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              asChild
              className="font-semibold text-[#1E2E8C]"
              style={{ background: '#fff' }}
            >
              <Link href="/contacto">Solicitar Cotizacion</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white/40 text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/cursos">Ver Cursos Disponibles</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
