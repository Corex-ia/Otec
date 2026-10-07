'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Shield,
  Building2,
  Target,
  BadgeCheck,
  ArrowRight,
  Phone,
  Mail,
  CheckCircle,
} from 'lucide-react';

const C = {
  primary: '#5D3FD3',
  primaryLight: '#F0ECFF',
  secondary: '#6B5CE7',
  accent: '#FF8C42',
  accentLight: '#FFF0E6',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  bgLight: '#F9FAFB',
  border: '#E5E7EB',
};

const BENEFITS = [
  {
    icon: Shield,
    title: 'Gestión SENCE Completa',
    description: 'Nos encargamos de toda la documentación y registros ante SENCE para que tu empresa acceda a la franquicia tributaria sin complicaciones.',
    color: C.primary,
    bg: C.primaryLight,
  },
  {
    icon: Building2,
    title: 'Programas a Medida',
    description: 'Diseñamos el plan de capacitación ajustado a tu rubro, cantidad de trabajadores, objetivos y horarios. Sin soluciones genéricas.',
    color: '#2563EB',
    bg: '#EFF6FF',
  },
  {
    icon: Target,
    title: 'Resultados Medibles',
    description: 'Entregamos reportes de impacto, avance y productividad para que RRHH pueda evaluar el retorno real de la inversión en capacitación.',
    color: C.accent,
    bg: C.accentLight,
  },
  {
    icon: BadgeCheck,
    title: '100% Bonificable SENCE',
    description: 'Todos nuestros cursos cuentan con código SENCE vigente. Tu empresa puede recuperar hasta el 100% del costo vía franquicia tributaria.',
    color: '#059669',
    bg: '#ECFDF5',
  },
];

const PROCESS_STEPS = [
  { step: '01', title: 'Diagnóstico', desc: 'Analizamos las necesidades de tu equipo y los objetivos organizacionales para diseñar el plan ideal.' },
  { step: '02', title: 'Propuesta', desc: 'Elaboramos una propuesta personalizada con programa, modalidad, horarios y gestión SENCE incluida.' },
  { step: '03', title: 'Ejecución', desc: 'Impartimos el curso con relatores certificados, seguimiento de asistencia y soporte continuo.' },
  { step: '04', title: 'Certificación', desc: 'Tu equipo recibe certificados oficiales y entregamos el informe para aplicar la bonificación.' },
];

const STATS = [
  { value: '500+', label: 'Empresas atendidas' },
  { value: '10K+', label: 'Trabajadores capacitados' },
  { value: '98%', label: 'Satisfacción empresarial' },
  { value: '100%', label: 'Cobertura SENCE' },
];

export default function EmpresasPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO */}
      <section
        className="relative overflow-hidden py-24"
        style={{ background: `linear-gradient(135deg, ${C.accent} 0%, ${C.primary} 60%, #3B2BAA 100%)` }}
      >
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 60%)' }} />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}
            >
              Para Empresas — B2B
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Desarrolla el talento{' '}
              <span className="underline decoration-white/40">de tu equipo</span>
            </h1>
            <p className="text-lg text-white/85 mb-10 max-w-2xl leading-relaxed">
              Programas de capacitación a medida para empresas, con gestión SENCE completa,
              relatores certificados y reportes de impacto. Invierte en tu capital humano con respaldo tributario.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="font-semibold text-white group"
                style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)' }}
                onClick={() => document.getElementById('cotizacion-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Solicitar cotización
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-16 border-t border-white/20">
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-3xl font-black text-white mb-1">{s.value}</div>
                  <div className="text-sm text-white/65">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="py-20" style={{ background: C.bgLight }}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: C.textPrimary }}>
              ¿Por qué capacitar con nosotros?
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: C.textSecondary }}>
              Soluciones integrales que generan resultados medibles para tu organización
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {BENEFITS.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border hover:shadow-lg transition-all bg-white"
                style={{ borderColor: C.border }}
              >
                <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-5" style={{ background: b.bg }}>
                  <b.icon className="h-6 w-6" style={{ color: b.color }} />
                </div>
                <h3 className="text-base font-bold mb-2" style={{ color: C.textPrimary }}>{b.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: C.textSecondary }}>{b.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* EBOOK BANNER */}
      <section
        className="relative py-20 overflow-hidden"
        style={{ background: C.textPrimary }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1400&q=80)' }}
        />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4"
              style={{ background: C.accentLight, color: C.accent }}
            >
              Recurso Gratuito
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Guía: Cómo maximizar la franquicia SENCE en tu empresa
            </h2>
            <p className="text-white/75 text-lg mb-8 max-w-xl mx-auto">
              Descarga nuestra guía práctica y aprende a aprovechar al máximo el beneficio tributario para capacitación.
            </p>
            <Button
              size="lg"
              className="font-semibold"
              style={{ background: C.accent, color: '#fff' }}
              asChild
            >
              <a href="mailto:gestioncomercial@elpoderdecrear.cl?subject=Solicitud%20Ebook%20SENCE">
                Descargar ebook gratuito
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* PROCESO */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: C.textPrimary }}>
              Nuestro proceso de trabajo
            </h2>
            <p className="text-lg" style={{ color: C.textSecondary }}>
              Desde el diagnóstico hasta la certificación, te acompañamos en cada etapa
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto relative">
            {PROCESS_STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                <div className="p-6 rounded-2xl border h-full" style={{ background: C.bgLight, borderColor: C.border }}>
                  <div className="text-4xl font-black mb-4" style={{ color: `${C.primary}22` }}>{step.step}</div>
                  <h3 className="font-bold mb-2" style={{ color: C.textPrimary }}>{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: C.textSecondary }}>{step.desc}</p>
                </div>
                {i < PROCESS_STEPS.length - 1 && (
                  <div className="hidden md:flex absolute top-8 -right-3 z-10">
                    <ArrowRight className="h-5 w-5" style={{ color: C.textSecondary }} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FORMULARIO DE COTIZACIÓN */}
      <section id="cotizacion-form" className="py-20" style={{ background: C.bgLight }}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: C.textPrimary }}>
                Solicita tu cotización
              </h2>
              <p className="text-lg" style={{ color: C.textSecondary }}>
                Cuéntanos sobre tu empresa y te enviamos una propuesta personalizada en menos de 24 horas
              </p>
            </div>

            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-10 rounded-2xl border text-center bg-white"
                style={{ borderColor: C.border }}
              >
                <CheckCircle className="h-14 w-14 mx-auto mb-4" style={{ color: '#059669' }} />
                <h3 className="text-xl font-bold mb-2" style={{ color: C.textPrimary }}>¡Cotización recibida!</h3>
                <p className="mb-6" style={{ color: C.textSecondary }}>
                  Te contactaremos en menos de 24 horas hábiles con una propuesta personalizada.
                </p>
                <Button
                  onClick={() => setSent(false)}
                  style={{ background: C.primary, color: '#fff' }}
                >
                  Enviar otra consulta
                </Button>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="p-8 rounded-2xl border bg-white space-y-5"
                style={{ borderColor: C.border }}
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="nombre" className="text-xs font-semibold uppercase tracking-wider" style={{ color: C.textSecondary }}>
                      Nombre completo *
                    </Label>
                    <Input id="nombre" required placeholder="María González" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="cargo" className="text-xs font-semibold uppercase tracking-wider" style={{ color: C.textSecondary }}>
                      Cargo
                    </Label>
                    <Input id="cargo" placeholder="Gerente de RRHH" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="empresa" className="text-xs font-semibold uppercase tracking-wider" style={{ color: C.textSecondary }}>
                      Empresa *
                    </Label>
                    <Input id="empresa" required placeholder="Nombre de tu empresa" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="rut" className="text-xs font-semibold uppercase tracking-wider" style={{ color: C.textSecondary }}>
                      RUT empresa
                    </Label>
                    <Input id="rut" placeholder="76.000.000-0" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email-emp" className="text-xs font-semibold uppercase tracking-wider" style={{ color: C.textSecondary }}>
                      Correo electrónico *
                    </Label>
                    <Input id="email-emp" type="email" required placeholder="maria@empresa.cl" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="telefono" className="text-xs font-semibold uppercase tracking-wider" style={{ color: C.textSecondary }}>
                      Teléfono
                    </Label>
                    <Input id="telefono" type="tel" placeholder="+56 9 xxxx xxxx" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="trabajadores" className="text-xs font-semibold uppercase tracking-wider" style={{ color: C.textSecondary }}>
                      N° de trabajadores a capacitar
                    </Label>
                    <select
                      id="trabajadores"
                      className="w-full border rounded-md px-3 py-2 text-sm"
                      style={{ borderColor: C.border, color: C.textPrimary }}
                    >
                      <option value="">Seleccionar</option>
                      <option>1–10 trabajadores</option>
                      <option>11–50 trabajadores</option>
                      <option>51–100 trabajadores</option>
                      <option>Más de 100</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="modalidad" className="text-xs font-semibold uppercase tracking-wider" style={{ color: C.textSecondary }}>
                      Modalidad preferida
                    </Label>
                    <select
                      id="modalidad"
                      className="w-full border rounded-md px-3 py-2 text-sm"
                      style={{ borderColor: C.border, color: C.textPrimary }}
                    >
                      <option value="">Seleccionar</option>
                      <option>Presencial</option>
                      <option>Online (Aula Virtual)</option>
                      <option>Híbrido</option>
                      <option>In-company</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="necesidades" className="text-xs font-semibold uppercase tracking-wider" style={{ color: C.textSecondary }}>
                    Necesidades de capacitación
                  </Label>
                  <Textarea
                    id="necesidades"
                    rows={4}
                    placeholder="Describe las áreas o temas en los que necesitas capacitar a tu equipo..."
                    className="resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  size="lg"
                  className="w-full font-semibold text-white group"
                  style={{ background: loading ? C.textSecondary : C.accent }}
                >
                  {loading ? 'Enviando...' : (
                    <>
                      Solicitar cotización gratuita
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* CTA CONTACTO DIRECTO */}
      <section className="py-16" style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.primary})` }}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">¿Prefieres hablar directamente?</h2>
            <p className="text-white/80 mb-8">Nuestro equipo comercial está disponible para atenderte de lunes a viernes.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+56955222430"
                className="flex items-center gap-3 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all"
                style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.35)', color: '#fff' }}
              >
                <Phone className="h-4 w-4" />
                +56 9 5522 2430
              </a>
              <a
                href="mailto:gestioncomercial@elpoderdecrear.cl"
                className="flex items-center gap-3 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all"
                style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.35)', color: '#fff' }}
              >
                <Mail className="h-4 w-4" />
                gestioncomercial@elpoderdecrear.cl
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
