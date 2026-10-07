'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle,
  Calendar,
  FileText,
  Users,
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

const CONTACT_METHODS = [
  {
    icon: Phone,
    label: 'Teléfono',
    value: '+56 9 5522 2430',
    sub: 'Lun–Vie 9:00–18:00',
    href: 'tel:+56955222430',
    color: C.primary,
    bg: C.primaryLight,
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'contacto@elpoderdecrear.cl',
    sub: 'Respuesta en < 24 h',
    href: 'mailto:contacto@elpoderdecrear.cl',
    color: C.accent,
    bg: C.accentLight,
  },
  {
    icon: MapPin,
    label: 'Dirección',
    value: 'Rengo 351 DP 901',
    sub: 'Los Ángeles, Biobío',
    href: 'https://www.google.com/maps/search/Rengo+351+Los+Angeles+Chile',
    color: '#059669',
    bg: '#ECFDF5',
  },
  {
    icon: Clock,
    label: 'Horario',
    value: 'Lun–Vie 9:00–18:00',
    sub: 'Sáb 9:00–13:00',
    href: null,
    color: '#2563EB',
    bg: '#EFF6FF',
  },
];

const QUERY_TYPES = [
  'Consulta general',
  'Capacitación empresarial (B2B)',
  'Inscripción personal (B2C)',
  'Beneficios SENCE',
  'Asistencia Técnica (ATE)',
  'Aula virtual',
  'Otro',
];

const COLLABORATOR_OPTIONS = [
  '1–10 trabajadores',
  '11–50 trabajadores',
  '51–100 trabajadores',
  'Más de 100',
  'Soy persona natural',
];

const USEFUL_LINKS = [
  { icon: FileText, label: 'Ver catálogo de cursos', href: '/cursos' },
  { icon: Users, label: 'Capacitación empresarial', href: '/empresas' },
  { icon: Calendar, label: 'Plataforma LUMEN', href: '/lumen' },
];

export default function ContactoPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [queryType, setQueryType] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1100));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO */}
      <section
        className="relative overflow-hidden py-24"
        style={{ background: `linear-gradient(135deg, ${C.accent} 0%, ${C.primary} 65%, #3B2BAA 100%)` }}
      >
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 70% 30%, rgba(255,255,255,0.08) 0%, transparent 55%)' }} />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}
            >
              Contáctanos
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Hablemos sobre{' '}
              <span className="underline decoration-white/40">tu proyecto</span>
            </h1>
            <p className="text-lg text-white/85 leading-relaxed">
              Ya sea para tu empresa o para tu desarrollo personal, estamos listos para orientarte.
              Respondemos en menos de 24 horas hábiles.
            </p>
          </motion.div>
        </div>
      </section>

      {/* MÉTODOS DE CONTACTO */}
      <section className="py-16" style={{ background: C.bgLight }}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
            {CONTACT_METHODS.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-5 rounded-2xl border bg-white flex items-start gap-4"
                style={{ borderColor: C.border }}
              >
                <div className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: item.bg }}>
                  <item.icon className="h-5 w-5" style={{ color: item.color }} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: C.textSecondary }}>
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="text-sm font-semibold transition-colors hover:underline"
                      style={{ color: item.color }}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm font-semibold" style={{ color: C.textPrimary }}>{item.value}</p>
                  )}
                  <p className="text-xs mt-0.5" style={{ color: C.textSecondary }}>{item.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* FORMULARIO + SIDEBAR */}
          <div className="grid lg:grid-cols-5 gap-8">
            {/* FORMULARIO */}
            <div className="lg:col-span-3">
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-10 rounded-2xl border text-center bg-white"
                  style={{ borderColor: C.border }}
                >
                  <CheckCircle className="h-16 w-16 mx-auto mb-5" style={{ color: '#059669' }} />
                  <h3 className="text-2xl font-bold mb-2" style={{ color: C.textPrimary }}>¡Mensaje enviado!</h3>
                  <p className="mb-6 text-lg" style={{ color: C.textSecondary }}>
                    Te contactaremos en menos de 24 horas hábiles. Mientras tanto, puedes llamarnos al{' '}
                    <a href="tel:+56955222430" className="font-semibold" style={{ color: C.primary }}>
                      +56 9 5522 2430
                    </a>
                  </p>
                  <Button
                    onClick={() => { setSent(false); setQueryType(''); }}
                    style={{ background: C.primary, color: '#fff' }}
                  >
                    Enviar otra consulta
                  </Button>
                </motion.div>
              ) : (
                <div className="p-8 rounded-2xl border bg-white" style={{ borderColor: C.border }}>
                  <h2 className="text-xl font-bold mb-1" style={{ color: C.textPrimary }}>Envíanos un mensaje</h2>
                  <p className="text-sm mb-6" style={{ color: C.textSecondary }}>
                    Completa el formulario y te responderemos a la brevedad
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="nombre" className="text-xs font-semibold uppercase tracking-wider" style={{ color: C.textSecondary }}>
                          Nombre completo *
                        </Label>
                        <Input id="nombre" required placeholder="María González" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider" style={{ color: C.textSecondary }}>
                          Correo electrónico *
                        </Label>
                        <Input id="email" type="email" required placeholder="maria@empresa.cl" />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="telefono" className="text-xs font-semibold uppercase tracking-wider" style={{ color: C.textSecondary }}>
                          Teléfono
                        </Label>
                        <Input id="telefono" type="tel" placeholder="+56 9 xxxx xxxx" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="empresa" className="text-xs font-semibold uppercase tracking-wider" style={{ color: C.textSecondary }}>
                          Empresa (opcional)
                        </Label>
                        <Input id="empresa" placeholder="Nombre de tu empresa" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="tipo-consulta" className="text-xs font-semibold uppercase tracking-wider" style={{ color: C.textSecondary }}>
                        Tipo de consulta
                      </Label>
                      <select
                        id="tipo-consulta"
                        className="w-full border rounded-md px-3 py-2 text-sm"
                        style={{ borderColor: C.border, color: C.textPrimary }}
                        value={queryType}
                        onChange={(e) => setQueryType(e.target.value)}
                      >
                        <option value="">Selecciona una opción</option>
                        {QUERY_TYPES.map((q) => (
                          <option key={q} value={q}>{q}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="colaboradores" className="text-xs font-semibold uppercase tracking-wider" style={{ color: C.textSecondary }}>
                        N° de colaboradores
                      </Label>
                      <select
                        id="colaboradores"
                        className="w-full border rounded-md px-3 py-2 text-sm"
                        style={{ borderColor: C.border, color: C.textPrimary }}
                      >
                        <option value="">Selecciona una opción</option>
                        {COLLABORATOR_OPTIONS.map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="mensaje" className="text-xs font-semibold uppercase tracking-wider" style={{ color: C.textSecondary }}>
                        Mensaje *
                      </Label>
                      <Textarea
                        id="mensaje"
                        rows={5}
                        required
                        placeholder="Cuéntanos en qué podemos ayudarte..."
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
                          Enviar mensaje
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              )}
            </div>

            {/* SIDEBAR */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              {/* Horarios */}
              <div className="p-5 rounded-2xl border bg-white" style={{ borderColor: C.border }}>
                <h3 className="font-bold mb-3" style={{ color: C.textPrimary }}>Horarios de atención</h3>
                <div className="space-y-2">
                  {[
                    { dia: 'Lunes a Viernes', hora: '9:00 – 18:00' },
                    { dia: 'Sábados', hora: '9:00 – 13:00' },
                    { dia: 'Domingos y feriados', hora: 'Cerrado' },
                  ].map((h) => (
                    <div key={h.dia} className="flex justify-between text-sm">
                      <span style={{ color: C.textSecondary }}>{h.dia}</span>
                      <span className="font-semibold" style={{ color: C.textPrimary }}>{h.hora}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA agendar */}
              <div
                className="p-5 rounded-2xl text-white"
                style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.primary})` }}
              >
                <h3 className="font-bold mb-2">¿Prefieres hablar directamente?</h3>
                <p className="text-sm text-white/80 mb-4">
                  Llámanos y te atendemos de inmediato.
                </p>
                <a
                  href="tel:+56955222430"
                  className="flex items-center gap-2 text-sm font-bold"
                >
                  <Phone className="h-4 w-4" />
                  +56 9 5522 2430
                </a>
              </div>

              {/* Tiempos de respuesta */}
              <div className="p-5 rounded-2xl border bg-white" style={{ borderColor: C.border }}>
                <h3 className="font-bold mb-3" style={{ color: C.textPrimary }}>Tiempos de respuesta</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Consultas generales', time: '< 24 horas' },
                    { label: 'Cotizaciones B2B', time: '< 4 horas hábiles' },
                    { label: 'Soporte LUMEN', time: 'Inmediato (chat)' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-sm">
                      <span style={{ color: C.textSecondary }}>{item.label}</span>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: C.primaryLight, color: C.primary }}
                      >
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Links útiles */}
              <div className="p-5 rounded-2xl border bg-white" style={{ borderColor: C.border }}>
                <h3 className="font-bold mb-3" style={{ color: C.textPrimary }}>Links útiles</h3>
                <div className="space-y-2">
                  {USEFUL_LINKS.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="flex items-center gap-3 text-sm py-2 px-3 rounded-lg transition-colors hover:bg-gray-50"
                      style={{ color: C.textPrimary }}
                    >
                      <link.icon className="h-4 w-4 shrink-0" style={{ color: C.primary }} />
                      {link.label}
                      <ArrowRight className="h-3.5 w-3.5 ml-auto" style={{ color: C.textSecondary }} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAPA + COBERTURA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: C.textPrimary }}>
              Dónde estamos
            </h2>
            <p className="text-lg" style={{ color: C.textSecondary }}>
              Oficina central en Los Ángeles, Biobío — con cobertura nacional
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 rounded-2xl overflow-hidden border" style={{ borderColor: C.border, height: '380px' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3275.5374!2d-72.3541!3d-37.4694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDI4JzA5LjkiUyA3MsKwMjEnMTUuNCJX!5e0!3m2!1ses!2scl!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="p-5 rounded-2xl border bg-white" style={{ borderColor: C.border }}>
                <h3 className="font-bold mb-2" style={{ color: C.textPrimary }}>Oficina Central</h3>
                <p className="text-sm leading-relaxed" style={{ color: C.textSecondary }}>
                  Rengo 351, Departamento 901<br />
                  Los Ángeles, Región del Biobío<br />
                  Chile
                </p>
                <a
                  href="https://www.google.com/maps/search/Rengo+351+Los+Angeles+Chile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-3 text-sm font-semibold"
                  style={{ color: C.primary }}
                >
                  Ver en Google Maps <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
              <div className="p-5 rounded-2xl border" style={{ background: C.primaryLight, borderColor: `${C.primary}33` }}>
                <h3 className="font-bold mb-2" style={{ color: C.primary }}>Cobertura Nacional</h3>
                <p className="text-sm leading-relaxed" style={{ color: C.textSecondary }}>
                  Atendemos empresas y estudiantes en todas las regiones de Chile con modalidades presenciales, online e in-company.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
