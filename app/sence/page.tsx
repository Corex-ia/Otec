import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DollarSign, Award, FileText, CircleCheck as CheckCircle2, ArrowRight, Shield, Clock, Users } from 'lucide-react';

const BENEFITS = [
  {
    icon: DollarSign,
    title: 'Bonificación Tributaria',
    description: 'Las empresas pueden descontar hasta el 100% del costo de capacitación directamente de sus impuestos a pagar.',
    color: '#1E2E8C',
    bg: '#EBF0FF',
  },
  {
    icon: Award,
    title: 'Certificación Oficial',
    description: 'Todos nuestros cursos están certificados y reconocidos por SENCE, con código de curso oficial.',
    color: '#FF8C42',
    bg: '#FFF3E8',
  },
  {
    icon: FileText,
    title: 'Gestión Completa',
    description: 'Nos encargamos de toda la documentación, registros y reportes requeridos por SENCE.',
    color: '#059669',
    bg: '#ECFDF5',
  },
  {
    icon: Users,
    title: 'Modalidades Flexibles',
    description: 'Cursos presenciales, online (Aula Virtual) e híbridos. Todos válidos para franquicia SENCE.',
    color: '#2F5E9E',
    bg: '#EBF2FF',
  },
];

const STEPS = [
  {
    step: '01',
    title: 'Diagnóstico',
    desc: 'Identificamos los cursos SENCE disponibles según tu rubro y necesidades de capacitación.',
  },
  {
    step: '02',
    title: 'Inscripción',
    desc: 'Completamos el proceso de inscripción con los datos de tu empresa ante SENCE.',
  },
  {
    step: '03',
    title: 'Documentación',
    desc: 'Preparamos toda la documentación: listas de asistencia, material, DNC y más.',
  },
  {
    step: '04',
    title: 'Capacitación',
    desc: 'Se realiza el curso con relatores certificados y seguimiento de asistencia.',
  },
  {
    step: '05',
    title: 'Bonificación',
    desc: 'Entregamos el informe final para que apliques la bonificación en tu declaración.',
  },
];

const STATS = [
  { value: '100%', label: 'Cursos con código SENCE' },
  { value: '$0', label: 'Costo adicional de gestión' },
  { value: '48h', label: 'Tiempo de respuesta cotización' },
  { value: '500+', label: 'Empresas ya beneficiadas' },
];

const FAQS = [
  {
    q: '¿Quiénes pueden acceder a la franquicia SENCE?',
    a: 'Todas las empresas que cotizan en Chile pueden usar la franquicia SENCE equivalente al 1% de su planilla de remuneraciones imponibles anuales.',
  },
  {
    q: '¿Qué cursos califican para SENCE?',
    a: 'Todos nuestros cursos cuentan con código SENCE vigente. El curso debe estar relacionado con el giro de la empresa para ser bonificable.',
  },
  {
    q: '¿Pueden capacitarse trabajadores a distancia?',
    a: 'Sí. Nuestros cursos online en el Aula Virtual están habilitados para franquicia SENCE con seguimiento completo.',
  },
  {
    q: '¿Nosotros gestionamos el trámite o lo hace la empresa?',
    a: 'Nos encargamos de toda la gestión ante SENCE. La empresa solo necesita aprobar la propuesta y proporcionar los datos de los participantes.',
  },
];

export default function SencePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section
        className="relative overflow-hidden py-24"
        style={{ background: 'linear-gradient(135deg, #0D1A4A 0%, #059669 60%, #10B981 100%)' }}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 20% 60%, rgba(255,140,66,0.12) 0%, transparent 55%)' }}
        />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
              style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.95)', border: '1px solid rgba(255,255,255,0.25)' }}
            >
              Franquicia Tributaria — SENCE
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Capacita a tu equipo{' '}
              <span style={{ color: '#FF8C42' }}>sin costo</span>
            </h1>
            <p className="text-lg text-white/80 mb-10 max-w-2xl leading-relaxed">
              Accede a la franquicia tributaria SENCE y capacita a tus trabajadores descontando
              hasta el 100% del costo de los impuestos de tu empresa. Nosotros gestionamos todo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                asChild
                className="font-semibold text-white group"
                style={{ background: '#FF8C42', boxShadow: '0 4px 20px rgba(255,140,66,0.4)' }}
              >
                <Link href="/contacto">
                  Cotizar con SENCE
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-white/30 text-white hover:bg-white/10 hover:text-white font-medium"
              >
                <Link href="/cursos">Ver cursos disponibles</Link>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: '#0D1A4A' }}>
              Beneficios de capacitar con SENCE
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: '#3A4A7A' }}>
              La franquicia tributaria SENCE es una oportunidad que pocas empresas aprovechan al máximo
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
                <h3 className="text-base font-bold mb-2" style={{ color: '#0D1A4A' }}>{benefit.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#3A4A7A' }}>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20" style={{ background: '#fff' }}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: '#0D1A4A' }}>
                Cómo funciona
              </h2>
              <p className="text-lg" style={{ color: '#3A4A7A' }}>
                Proceso simple en 5 pasos. Nos encargamos de todo
              </p>
            </div>
            <div className="grid md:grid-cols-5 gap-4 relative">
              {STEPS.map((step, i) => (
                <div key={step.step} className="relative">
                  <div
                    className="p-5 rounded-2xl border h-full"
                    style={{ background: '#F8F7FF', borderColor: '#C8D3EE' }}
                  >
                    <div className="text-3xl font-black mb-3" style={{ color: 'rgba(5,150,105,0.15)' }}>
                      {step.step}
                    </div>
                    <h3 className="font-bold text-sm mb-2" style={{ color: '#0D1A4A' }}>{step.title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: '#3A4A7A' }}>{step.desc}</p>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="hidden md:flex absolute top-6 -right-2 z-10">
                      <ArrowRight className="h-4 w-4" style={{ color: '#7A8AB0' }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20" style={{ background: '#F8F7FF' }}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: '#0D1A4A' }}>
                Preguntas frecuentes
              </h2>
              <p className="text-lg" style={{ color: '#3A4A7A' }}>
                Todo lo que necesitas saber sobre la franquicia SENCE
              </p>
            </div>
            <div className="space-y-4">
              {FAQS.map((faq) => (
                <div
                  key={faq.q}
                  className="p-6 rounded-2xl border"
                  style={{ background: '#fff', borderColor: '#C8D3EE' }}
                >
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" style={{ color: '#059669' }} />
                    <div>
                      <h4 className="font-bold text-sm mb-2" style={{ color: '#0D1A4A' }}>{faq.q}</h4>
                      <p className="text-sm leading-relaxed" style={{ color: '#3A4A7A' }}>{faq.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-20 text-white"
        style={{ background: 'linear-gradient(135deg, #059669, #10B981)' }}
      >
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Aprovecha tu franquicia SENCE hoy
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Muchas empresas no saben que tienen saldo disponible. Consultamos sin costo y sin compromiso.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              asChild
              className="font-semibold text-[#059669]"
              style={{ background: '#fff' }}
            >
              <Link href="/contacto">Consultar saldo disponible</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white/40 text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/cursos">Ver cursos SENCE</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
