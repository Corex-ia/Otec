import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin } from 'lucide-react';

const FOOTER_LINKS = [
  { name: 'Empresas', href: '/empresas' },
  { name: 'Educación Continua', href: '/educacion-continua' },
  { name: 'Cursos', href: '/cursos' },
  { name: 'SENCE', href: '/sence' },
  { name: 'Nosotros', href: '/nosotros' },
  { name: 'Contacto', href: '/contacto' },
];

export function CorporateFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ background: '#F8F7FF', borderTop: '1px solid #C8D3EE' }}>
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-4">
            <div className="flex items-center">
              <Image
                src="/logo-otec.png"
                alt="OTEC El Poder de Crear"
                width={160}
                height={52}
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-[#3A4A7A] leading-relaxed max-w-xs">
              Organismo Técnico de Capacitación certificado bajo la Norma Chilena NCh 2728:2015.
            </p>
            <div className="space-y-2">
              <a
                href="tel:+56912345678"
                className="flex items-center gap-2 text-sm text-[#3A4A7A] hover:text-[#1E2E8C] transition-colors"
              >
                <Phone className="h-3.5 w-3.5 text-[#FF8C42]" />
                +56 9 1234 5678
              </a>
              <a
                href="mailto:contacto@otec.cl"
                className="flex items-center gap-2 text-sm text-[#3A4A7A] hover:text-[#1E2E8C] transition-colors"
              >
                <Mail className="h-3.5 w-3.5 text-[#FF8C42]" />
                contacto@otec.cl
              </a>
              <span className="flex items-center gap-2 text-sm text-[#3A4A7A]">
                <MapPin className="h-3.5 w-3.5 text-[#FF8C42]" />
                Santiago, Chile
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#7A8AB0] mb-4">
              Navegacion
            </h4>
            <nav className="grid grid-cols-2 gap-x-4 gap-y-2">
              {FOOTER_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm text-[#3A4A7A] hover:text-[#1E2E8C] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#7A8AB0] mb-4">
              Plataformas
            </h4>
            <div className="space-y-2.5">
              <Link
                href="/lumen"
                className="flex items-center gap-2 text-sm text-[#3A4A7A] hover:text-[#1E2E8C] transition-colors"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-[#1E2E8C]" />
                Aula Virtual
              </Link>
              <Link
                href="/crm"
                className="flex items-center gap-2 text-sm text-[#3A4A7A] hover:text-[#1E2E8C] transition-colors"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-[#FF8C42]" />
                Portal CRM Interno
              </Link>
              <Link
                href="/auth/login"
                className="flex items-center gap-2 text-sm text-[#3A4A7A] hover:text-[#1E2E8C] transition-colors"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-[#2F5E9E]" />
                Acceso Alumnos
              </Link>
            </div>
          </div>
        </div>

        <div
          className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid #C8D3EE' }}
        >
          <p className="text-xs text-[#7A8AB0]">
            &copy; {currentYear} OTEC El Poder de Crear. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-1.5">
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-[#1E2E8C]"
              style={{ background: '#EBF0FF' }}
            >
              ACREDITADO SENCE
            </span>
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-[#FF8C42]"
              style={{ background: '#FFF3E8' }}
            >
              NCh 2728:2015
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
