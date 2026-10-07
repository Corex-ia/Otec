'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Mail, Phone, MapPin, Calendar, Clock, MessageSquare, Send, CheckCircle } from 'lucide-react';
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
  textMuted: '#9CA3AF',
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

export default function ContactoPage() {
  const router = useRouter();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    empresa: '',
    mensaje: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactMethods = [
    {
      icon: Phone,
      title: 'Teléfono',
      value: '+56 9 5522 2430',
      subtitle: 'Horario hábil',
      description: 'Llamada directa con nuestro equipo'
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'contacto@elpoderdecrear.cl',
      subtitle: 'Respuesta en 24 hrs hábiles',
      description: 'Envíanos tu consulta por correo'
    },
    {
      icon: MapPin,
      title: 'Dirección',
      value: 'Rengo 351 DP 901 Despacho 01',
      subtitle: 'Edificio Asturias, Los Ángeles',
      description: 'Cobertura nacional en todo Chile'
    },
    {
      icon: Clock,
      title: 'Horario de Atención',
      value: 'Lunes a Viernes',
      subtitle: '9:00 a 13:00 hrs',
      description: 'Atención presencial y remota'
    }
  ];

  const officeHours = [
    { day: 'Lunes - Viernes', hours: '9:00 - 13:00 hrs' },
    { day: 'Sábados y Domingos', hours: 'Cerrado' }
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section
        className="pt-32 pb-20"
        style={{
          background: 'linear-gradient(135deg, #FF8C42 0%, #6B5CE7 100%)'
        }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge
              className="mb-6"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              Contacto
            </Badge>

            <h1 className="text-5xl lg:text-6xl font-bold mb-6" style={{ color: 'white' }}>
              Hablemos sobre tu proyecto
            </h1>

            <p className="text-xl" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Nuestro equipo está listo para ayudarte a encontrar la mejor solución de capacitación para tu empresa
            </p>
          </div>
        </div>
      </section>

      {/* Métodos de contacto */}
      <section className="py-20" style={{ backgroundColor: CorporateColors.bgLight }}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactMethods.map((method, index) => (
              <Card
                key={index}
                className="p-6 text-center hover:scale-105 transition-transform"
                style={{
                  backgroundColor: 'white',
                  border: 'none',
                  boxShadow: CorporateShadow.lg
                }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: CorporateColors.primaryLight }}
                >
                  <method.icon className="w-7 h-7" style={{ color: CorporateColors.primary }} />
                </div>
                <h3 className="font-semibold mb-2" style={{ color: CorporateColors.textPrimary }}>
                  {method.title}
                </h3>
                <p className="text-sm font-semibold mb-1 break-words" style={{ color: CorporateColors.accent }}>
                  {method.value}
                </p>
                <p className="text-xs mb-3" style={{ color: CorporateColors.textSecondary }}>
                  {method.subtitle}
                </p>
                <p className="text-xs" style={{ color: CorporateColors.textMuted }}>
                  {method.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Formulario y horarios */}
      <section className="py-20" style={{ backgroundColor: 'white' }}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Formulario */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h2 className="text-4xl font-bold mb-4" style={{ color: CorporateColors.textPrimary }}>
                  Envíanos tu consulta
                </h2>
                <p className="text-lg" style={{ color: CorporateColors.textSecondary }}>
                  Completa el formulario y un ejecutivo se contactará contigo en menos de 24 horas
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Nombre y Apellido */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: CorporateColors.textPrimary }}>
                      Nombre *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg"
                      style={{
                        border: `2px solid ${CorporateColors.border}`,
                        backgroundColor: CorporateColors.bgLight
                      }}
                      placeholder="Juan"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: CorporateColors.textPrimary }}>
                      Apellido *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg"
                      style={{
                        border: `2px solid ${CorporateColors.border}`,
                        backgroundColor: CorporateColors.bgLight
                      }}
                      placeholder="Pérez"
                      required
                    />
                  </div>
                </div>

                {/* Email y Teléfono */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: CorporateColors.textPrimary }}>
                      Email corporativo *
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 rounded-lg"
                      style={{
                        border: `2px solid ${CorporateColors.border}`,
                        backgroundColor: CorporateColors.bgLight
                      }}
                      placeholder="juan@empresa.cl"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: CorporateColors.textPrimary }}>
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 rounded-lg"
                      style={{
                        border: `2px solid ${CorporateColors.border}`,
                        backgroundColor: CorporateColors.bgLight
                      }}
                      placeholder="+56 9 1234 5678"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Empresa y Cargo */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: CorporateColors.textPrimary }}>
                      Empresa *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg"
                      style={{
                        border: `2px solid ${CorporateColors.border}`,
                        backgroundColor: CorporateColors.bgLight
                      }}
                      placeholder="Nombre de la empresa"
                      name="empresa"
                      value={formData.empresa}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: CorporateColors.textPrimary }}>
                      Cargo
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg"
                      style={{
                        border: `2px solid ${CorporateColors.border}`,
                        backgroundColor: CorporateColors.bgLight
                      }}
                      placeholder="Gerente de RRHH"
                    />
                  </div>
                </div>

                {/* Tipo de consulta */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: CorporateColors.textPrimary }}>
                    ¿Qué te interesa? *
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-lg"
                    style={{
                      border: `2px solid ${CorporateColors.border}`,
                      backgroundColor: CorporateColors.bgLight
                    }}
                    required
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="demo">Agendar Demo Campus Virtual</option>
                    <option value="empresa">Capacitación para mi Empresa</option>
                    <option value="cursos">Información sobre Cursos</option>
                    <option value="sence">Acompañamiento SENCE</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                {/* Número de colaboradores */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: CorporateColors.textPrimary }}>
                    Número de colaboradores a capacitar
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-lg"
                    style={{
                      border: `2px solid ${CorporateColors.border}`,
                      backgroundColor: CorporateColors.bgLight
                    }}
                  >
                    <option value="">Selecciona un rango</option>
                    <option value="1-10">1 - 10</option>
                    <option value="11-50">11 - 50</option>
                    <option value="51-100">51 - 100</option>
                    <option value="101-500">101 - 500</option>
                    <option value="500+">Más de 500</option>
                  </select>
                </div>

                {/* Mensaje */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: CorporateColors.textPrimary }}>
                    Mensaje *
                  </label>
                  <textarea
                    className="w-full px-4 py-3 rounded-lg h-32 resize-none"
                    style={{
                      border: `2px solid ${CorporateColors.border}`,
                      backgroundColor: CorporateColors.bgLight
                    }}
                    placeholder="Cuéntanos sobre tus necesidades de capacitación..."
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Botón */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="px-8"
                    style={{
                      backgroundColor: CorporateColors.accent,
                      color: 'white'
                    }}
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Enviar Consulta
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    className="px-8"
                    style={{
                      borderColor: CorporateColors.primary,
                      color: CorporateColors.primary
                    }}
                    onClick={() => router.push('/agendar')}
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Agendar Reunión
                  </Button>
                </div>

                <p className="text-sm" style={{ color: CorporateColors.textMuted }}>
                  * Campos obligatorios
                </p>
              </form>

              {formSubmitted && (
                <div className="mt-6 p-4 bg-green-100 text-green-800 rounded-lg flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Tu consulta ha sido enviada exitosamente. Te contactaremos pronto.
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Horarios */}
              <Card
                className="p-6"
                style={{
                  backgroundColor: CorporateColors.bgLight,
                  border: 'none'
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: CorporateColors.primary }}
                  >
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold" style={{ color: CorporateColors.textPrimary }}>
                    Horarios de Atención
                  </h3>
                </div>
                <div className="space-y-3">
                  {officeHours.map((schedule, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2"
                      style={{
                        borderBottom: index < officeHours.length - 1 ? `1px solid ${CorporateColors.border}` : 'none'
                      }}
                    >
                      <span className="font-medium" style={{ color: CorporateColors.textPrimary }}>
                        {schedule.day}
                      </span>
                      <span style={{ color: CorporateColors.textSecondary }}>
                        {schedule.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* CTA Rápido */}
              <Card
                className="p-6"
                style={{
                  backgroundColor: CorporateColors.primary,
                  border: 'none'
                }}
              >
                <h3 className="text-xl font-semibold mb-3" style={{ color: 'white' }}>
                  ¿Necesitas respuesta inmediata?
                </h3>
                <p className="mb-6" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  Agenda una llamada con nuestro equipo comercial
                </p>
                <Button
                  className="w-full"
                  onClick={() => router.push('/agendar')}
                  style={{
                    backgroundColor: CorporateColors.accent,
                    color: 'white'
                  }}
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Agendar Llamada
                </Button>
              </Card>

              {/* Información adicional */}
              <Card
                className="p-6"
                style={{
                  backgroundColor: 'white',
                  border: `1px solid ${CorporateColors.border}`
                }}
              >
                <h3 className="text-lg font-semibold mb-4" style={{ color: CorporateColors.textPrimary }}>
                  También puedes
                </h3>
                <ul className="space-y-3">
                  <li>
                    <button
                      onClick={() => router.push('/cursos')}
                      className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity"
                      style={{ color: CorporateColors.secondary }}
                    >
                      → Ver catálogo de cursos
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => router.push('/modalidades')}
                      className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity"
                      style={{ color: CorporateColors.secondary }}
                    >
                      → Conocer Modalidades
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => router.push('/sence')}
                      className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity"
                      style={{ color: CorporateColors.secondary }}
                    >
                      → Información SENCE
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => router.push('/casos')}
                      className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity"
                      style={{ color: CorporateColors.secondary }}
                    >
                      → Ver casos de éxito
                    </button>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Ubicación con Mapa */}
      <section className="py-20" style={{ backgroundColor: CorporateColors.bgLight }}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ color: CorporateColors.textPrimary }}>
              Nuestra Ubicación
            </h2>
            <p className="text-xl mb-2" style={{ color: CorporateColors.textSecondary }}>
              Edificio Asturias, Los Ángeles
            </p>
            <p style={{ color: CorporateColors.textSecondary }}>
              Rengo 351 DP 901 Despacho 01, Los Ángeles, Región del Biobío
            </p>
          </div>

          {/* Google Maps Embed */}
          <div className="mb-12 rounded-xl overflow-hidden shadow-2xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3176.1!2d-72.3516!3d-37.4695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9669b58c3c3c3c3c%3A0x3c3c3c3c3c3c3c3c!2sRengo%20351%2C%20Los%20%C3%81ngeles%2C%20Biob%C3%ADo!5e0!3m2!1ses!2scl!4v1234567890"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="text-center mb-12">
            <Button
              size="lg"
              onClick={() => window.open('https://www.google.com/maps/dir/?api=1&destination=Rengo+351,+Los+Angeles,+Chile', '_blank')}
              style={{
                backgroundColor: CorporateColors.accent,
                color: 'white'
              }}
            >
              <MapPin className="w-5 h-5 mr-2" />
              Cómo Llegar
            </Button>
          </div>

          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-4" style={{ color: CorporateColors.textPrimary }}>
              Cobertura Nacional
            </h3>
            <p className="text-lg" style={{ color: CorporateColors.textSecondary }}>
              Atendemos empresas en todas las regiones de Chile
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { zone: 'Zona Norte', regions: 'Arica a Coquimbo' },
              { zone: 'Zona Centro', regions: 'Valparaíso a Maule' },
              { zone: 'Zona Sur', regions: 'Ñuble a Magallanes' }
            ].map((zone, index) => (
              <Card
                key={index}
                className="p-6 text-center"
                style={{
                  backgroundColor: 'white',
                  border: 'none',
                  boxShadow: CorporateShadow.md
                }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: CorporateColors.accentLight }}
                >
                  <MapPin className="w-6 h-6" style={{ color: CorporateColors.accent }} />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: CorporateColors.textPrimary }}>
                  {zone.zone}
                </h3>
                <p style={{ color: CorporateColors.textSecondary }}>
                  {zone.regions}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
