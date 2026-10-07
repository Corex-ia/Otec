import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const QUICK_LINKS = [
  { name: 'Inicio', href: '/' },
  { name: 'Para Empresas', href: '/empresas' },
  { name: 'Catálogo de Cursos', href: '/cursos' },
  { name: 'ATE / SENCE', href: '/sence' },
  { name: 'Casos de Éxito', href: '/nosotros' },
];

const SERVICES = [
  { name: 'Capacitación Empresarial', href: '/empresas' },
  { name: 'Educación Continua', href: '/educacion-continua' },
  { name: 'Modalidades', href: '/cursos' },
  { name: 'Campus Virtual Aula Virtual', href: '/lumen' },
  { name: 'Agendar Reunión', href: '/contacto' },
];

export function CorporateFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ background: '#1a1040', color: '#fff' }}>
      <div className="container mx-auto px-4 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Logo + descripción */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/logo-otec.png"
                alt="OTEC El Poder de Crear"
                width={160}
                height={52}
                className="h-12 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Organismo Técnico de Capacitación certificado bajo la Norma Chilena NCh 2728:2015 y acreditado por el SENCE.
            </p>
            <div className="flex gap-2 mt-2">
              <span className="text-[10px] font-semibold px-2 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}>
                NCh 2728:2015
              </span>
              <span className="text-[10px] font-semibold px-2 py-1 rounded-full" style={{ background: 'rgba(255,140,66,0.2)', color: '#FF8C42' }}>
                SENCE
              </span>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Enlaces Rápidos
            </h4>
            <nav className="flex flex-col gap-2">
              {QUICK_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm transition-colors"
                  style={{ color: 'rgba(255,255,255,0.65)' }}
                  onMouseOver={(e) => (e.currentTarget.style.color = '#FF8C42')}
                  onMouseOut={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Servicios */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Servicios
            </h4>
            <nav className="flex flex-col gap-2">
              {SERVICES.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm transition-colors"
                  style={{ color: 'rgba(255,255,255,0.65)' }}
                  onMouseOver={(e) => (e.currentTarget.style.color = '#FF8C42')}
                  onMouseOut={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Contacto
            </h4>
            <div className="flex flex-col gap-3">
              <a href="tel:+56955222430" className="flex items-start gap-2 text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.65)' }}>
                <Phone className="h-4 w-4 mt-0.5 shrink-0 text-[#FF8C42]" />
                +56 9 5522 2430
              </a>
              <a href="mailto:contacto@elpoderdecrear.cl" className="flex items-start gap-2 text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.65)' }}>
                <Mail className="h-4 w-4 mt-0.5 shrink-0 text-[#FF8C42]" />
                contacto@elpoderdecrear.cl
              </a>
              <span className="flex items-start gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-[#FF8C42]" />
                Santiago, Chile — Cobertura Nacional
              </span>
              <span className="flex items-start gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                <Clock className="h-4 w-4 mt-0.5 shrink-0 text-[#FF8C42]" />
                Lun - Vie: 9:00 - 18:00<br />Soporte 24/7 online
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
            &copy; {currentYear} El Poder de Crear. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacidad" className="text-xs transition-colors" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Política de Privacidad
            </Link>
            <Link href="/terminos" className="text-xs transition-colors" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Términos y Condiciones
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
