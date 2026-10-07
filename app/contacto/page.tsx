'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Clock, ArrowRight, Navigation } from 'lucide-react';
import { toast } from 'sonner';

const CONTACT_INFO = [
  {
    icon: Phone,
    label: 'Teléfono',
    value: '+56 9 5522 2430',
    href: 'tel:+56955222430',
    color: '#1E2E8C',
    bg: '#EBF0FF',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'contacto@otec.cl',
    href: 'mailto:contacto@otec.cl',
    color: '#FF8C42',
    bg: '#FFF3E8',
  },
  {
    icon: MapPin,
    label: 'Dirección',
    value: 'Santiago, Chile',
    href: null,
    color: '#059669',
    bg: '#ECFDF5',
  },
  {
    icon: Clock,
    label: 'Horario',
    value: 'Lun–Vie 9:00–18:00 | Sáb 9:00–13:00',
    href: null,
    color: '#2F5E9E',
    bg: '#EBF2FF',
  },
];

const TOPICS = [
  'Consulta general',
  'Capacitación empresarial (B2B)',
  'Inscripción personal (B2C)',
  'Beneficios SENCE',
  'Aula Virtual',
  'Otro',
];

export default function ContactoPage() {
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success('Mensaje enviado. Te contactaremos en menos de 24 horas.');
    setLoading(false);
    setTopic('');
    (e.target as HTMLFormElement).reset();
  };

  const handleGetDirections = () => {
    window.open('https://www.google.com/maps/search/Santiago,+Chile', '_blank');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <section
        className="relative overflow-hidden py-20"
        style={{ background: 'linear-gradient(135deg, #0D1A4A 0%, #1E2E8C 60%, #2A3FA8 100%)' }}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 70% 40%, rgba(255,140,66,0.12) 0%, transparent 55%)' }}
        />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
              style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              Contáctanos
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Hablemos de tu{' '}
              <span style={{ color: '#FF8C42' }}>próxima capacitación</span>
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              Ya sea para tu empresa o para tu desarrollo personal, estamos listos para orientarte.
              Respondemos en menos de 24 horas hábiles.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16" style={{ background: '#F8F7FF' }}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-4 mb-14">
            {CONTACT_INFO.map((item) => (
              <div
                key={item.label}
                className="p-5 rounded-2xl border flex items-start gap-4"
                style={{ background: '#fff', borderColor: '#C8D3EE' }}
              >
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: item.bg }}
                >
                  <item.icon className="h-5 w-5" style={{ color: item.color }} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#7A8AB0' }}>
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm font-medium transition-colors"
                      style={{ color: '#0D1A4A' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = item.color)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#0D1A4A')}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm font-medium" style={{ color: '#0D1A4A' }}>{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <div
                className="p-8 rounded-2xl border"
                style={{ background: '#fff', borderColor: '#C8D3EE' }}
              >
                <h2 className="text-xl font-bold mb-1" style={{ color: '#0D1A4A' }}>Envíanos un mensaje</h2>
                <p className="text-sm mb-6" style={{ color: '#7A8AB0' }}>
                  Completa el formulario y te responderemos a la brevedad
                </p>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#3A4A7A' }}>
                        Nombre completo
                      </Label>
                      <Input
                        id="name"
                        required
                        placeholder="Juan Pérez"
                        className="border-[#C8D3EE] focus:border-[#1E2E8C] focus:ring-[#1E2E8C]/20"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#3A4A7A' }}>
                        Correo electrónico
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        placeholder="juan@empresa.cl"
                        className="border-[#C8D3EE] focus:border-[#1E2E8C] focus:ring-[#1E2E8C]/20"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#3A4A7A' }}>
                        Teléfono
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+56 9 xxxx xxxx"
                        className="border-[#C8D3EE] focus:border-[#1E2E8C] focus:ring-[#1E2E8C]/20"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="company" className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#3A4A7A' }}>
                        Empresa (opcional)
                      </Label>
                      <Input
                        id="company"
                        placeholder="Nombre de tu empresa"
                        className="border-[#C8D3EE] focus:border-[#1E2E8C] focus:ring-[#1E2E8C]/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#3A4A7A' }}>
                      Motivo de consulta
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {TOPICS.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTopic(t)}
                          className="text-xs font-medium px-3 py-1.5 rounded-full border transition-all"
                          style={{
                            background: topic === t ? '#1E2E8C' : '#fff',
                            borderColor: topic === t ? '#1E2E8C' : '#C8D3EE',
                            color: topic === t ? '#fff' : '#3A4A7A',
                          }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#3A4A7A' }}>
                      Mensaje
                    </Label>
                    <Textarea
                      id="message"
                      rows={5}
                      required
                      placeholder="Cuéntanos en qué podemos ayudarte..."
                      className="border-[#C8D3EE] focus:border-[#1E2E8C] focus:ring-[#1E2E8C]/20 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full font-semibold text-white group"
                    style={{ background: loading ? '#7A8AB0' : '#FF8C42', boxShadow: loading ? 'none' : '0 4px 16px rgba(255,140,66,0.35)' }}
                  >
                    {loading ? 'Enviando...' : (
                      <>
                        Enviar mensaje
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-5">
              <div
                className="rounded-2xl border overflow-hidden"
                style={{ borderColor: '#C8D3EE', height: '320px' }}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d424574.2940064024!2d-71.03049945!3d-33.45694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c5410425af2f%3A0x84c1f09d0a50caa2!2sSantiago%2C+Regi%C3%B3n+Metropolitana!5e0!3m2!1ses!2scl!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <button
                onClick={handleGetDirections}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl border font-semibold text-sm transition-all group"
                style={{ background: '#fff', borderColor: '#C8D3EE', color: '#1E2E8C' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#EBF0FF';
                  e.currentTarget.style.borderColor = '#1E2E8C';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.borderColor = '#C8D3EE';
                }}
              >
                <Navigation className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                Cómo llegar
              </button>

              <div
                className="p-5 rounded-2xl border"
                style={{ background: '#fff', borderColor: '#C8D3EE' }}
              >
                <h3 className="text-sm font-bold mb-3" style={{ color: '#0D1A4A' }}>Respuesta garantizada</h3>
                <div className="space-y-2.5">
                  {[
                    { label: 'Consultas generales', time: '< 24 horas' },
                    { label: 'Cotizaciones B2B', time: '< 4 horas hábiles' },
                    { label: 'Soporte LUMEN', time: 'Inmediato (chat)' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: '#3A4A7A' }}>{item.label}</span>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: '#EBF0FF', color: '#1E2E8C' }}
                      >
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
