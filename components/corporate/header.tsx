'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Menu, X, ShoppingCart, LogOut, BookOpen, LayoutDashboard, Presentation, Phone, Mail, GraduationCap, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/stores/cart-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { supabase } from '@/lib/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';

const NAV_LINKS = [
  { name: 'Nosotros', href: '/nosotros' },
  { name: 'Empresas', href: '/empresas' },
  { name: 'ATE', href: '/sence' },
  { name: 'Educación Continua', href: '/educacion-continua' },
  { name: 'Cursos', href: '/cursos' },
  { name: 'Eventos', href: '/eventos' },
];

function AuthSection() {
  const router = useRouter();
  const itemCount = useCartStore((state) => state.getItemCount());
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const loading = useAuthStore((state) => state.loading);

  const isInstructor = profile?.role === 'instructor';
  const isAdmin = profile?.role && ['admin', 'ejecutivo', 'vendedor'].includes(profile.role);
  const isAdminOrInstructor = profile?.role === 'admin' || isInstructor;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3">
        <div className="h-9 w-20 rounded-lg bg-[#EBF0FF] animate-pulse" />
        <div className="h-9 w-24 rounded-lg bg-[#FF8C42]/20 animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="hidden md:flex items-center gap-2">
        <Button
          variant="outline"
          asChild
          className="text-sm font-medium text-[#5D3FD3] border-[#5D3FD3] hover:bg-[#F0ECFF] hover:text-[#4A2FB8]"
        >
          <Link href="/contacto">Cotizar</Link>
        </Button>
        <Button
          asChild
          className="text-sm font-semibold bg-[#FF8C42] hover:bg-[#E5722A] text-white border-0 px-6"
          style={{ boxShadow: '0 4px 12px rgba(255, 140, 66, 0.35)' }}
        >
          <Link href="/contacto">Contactar</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {isAdminOrInstructor && (
        <Link
          href="/dashboard/instructor"
          className="hidden md:flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg text-[#3A4A7A] hover:text-[#1E2E8C] hover:bg-[#EBF0FF] transition-colors"
        >
          <Presentation className="h-4 w-4" />
          Relator
        </Link>
      )}
      {isAdmin && (
        <Link
          href="/crm"
          className="hidden md:flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg text-[#3A4A7A] hover:text-[#1E2E8C] hover:bg-[#EBF0FF] transition-colors"
        >
          <LayoutDashboard className="h-4 w-4" />
          CRM
        </Link>
      )}

      <Link href="/checkout">
        <Button variant="ghost" size="icon" className="relative hover:bg-[#EBF0FF]">
          <ShoppingCart className="h-5 w-5 text-[#3A4A7A]" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-[#FF8C42] text-white text-[10px] font-bold">
              {itemCount}
            </span>
          )}
        </Button>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-[#EBF0FF] transition-colors">
            <div className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg, #1E2E8C, #2A3FA8)' }}>
              {(profile?.full_name || user.email || 'U').charAt(0).toUpperCase()}
            </div>
            <span className="hidden md:block text-sm font-medium text-[#0D1A4A] max-w-[120px] truncate">
              {profile?.full_name || 'Usuario'}
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60 border-[#C8D3EE]">
          <div className="flex flex-col space-y-0.5 p-3">
            <p className="text-sm font-semibold text-[#0D1A4A]">{profile?.full_name || 'Usuario'}</p>
            <p className="text-xs text-[#7A8AB0]">{user.email}</p>
            {profile?.role && (
              <span className="mt-1.5 self-start text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#EBF0FF] text-[#1E2E8C] capitalize">
                {profile.role === 'instructor' ? 'Relator' : profile.role}
              </span>
            )}
          </div>
          <DropdownMenuSeparator className="bg-[#C8D3EE]" />

          {isAdminOrInstructor && (
            <>
              <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-[#7A8AB0] font-semibold px-3 py-1.5">
                Panel Relator
              </DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/instructor" className="cursor-pointer gap-2 text-[#0D1A4A]">
                  <Presentation className="h-4 w-4 text-[#1E2E8C]" />
                  Panel de Instructor
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#C8D3EE]" />
            </>
          )}

          <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-[#7A8AB0] font-semibold px-3 py-1.5">
            Como Alumno
          </DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href="/lumen" className="cursor-pointer gap-2 text-[#0D1A4A]">
              <BookOpen className="h-4 w-4 text-[#1E2E8C]" />
              Mis Cursos
            </Link>
          </DropdownMenuItem>

          {isAdmin && (
            <>
              <DropdownMenuSeparator className="bg-[#C8D3EE]" />
              <DropdownMenuItem asChild>
                <Link href="/crm" className="cursor-pointer gap-2 text-[#0D1A4A]">
                  <LayoutDashboard className="h-4 w-4 text-[#1E2E8C]" />
                  Portal CRM
                </Link>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator className="bg-[#C8D3EE]" />
          <DropdownMenuItem
            onClick={handleSignOut}
            className="cursor-pointer text-red-500 focus:text-red-600 gap-2"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const loading = useAuthStore((state) => state.loading);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const isInstructor = profile?.role === 'instructor';
  const isAdmin = profile?.role && ['admin', 'ejecutivo', 'vendedor'].includes(profile.role);
  const isAdminOrInstructor = profile?.role === 'admin' || isInstructor;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onClose();
    router.push('/auth/login');
  };

  if (!open || loading) return null;

  return (
    <div className="md:hidden border-t border-[#C8D3EE] py-4">
      <nav className="flex flex-col gap-1 px-1">
        {NAV_LINKS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className="text-sm px-3 py-2.5 rounded-lg transition-colors"
              style={{
                color: active ? '#1E2E8C' : '#3A4A7A',
                background: active ? '#EBF0FF' : 'transparent',
                fontWeight: active ? 700 : 500,
              }}
              onClick={onClose}
            >
              {item.name}
            </Link>
          );
        })}

        <div className="h-px bg-[#C8D3EE] my-2" />

        {user ? (
          <>
            {isAdminOrInstructor && (
              <Link
                href="/dashboard/instructor"
                className="flex items-center gap-2 text-sm font-medium text-[#3A4A7A] hover:text-[#1E2E8C] px-3 py-2.5 rounded-lg hover:bg-[#EBF0FF] transition-colors"
                onClick={onClose}
              >
                <Presentation className="h-4 w-4" />
                Panel de Instructor
              </Link>
            )}
            {isAdmin && (
              <Link
                href="/crm"
                className="flex items-center gap-2 text-sm font-medium text-[#3A4A7A] hover:text-[#1E2E8C] px-3 py-2.5 rounded-lg hover:bg-[#EBF0FF] transition-colors"
                onClick={onClose}
              >
                <LayoutDashboard className="h-4 w-4" />
                Portal CRM
              </Link>
            )}
            <div className="h-px bg-[#C8D3EE] my-1" />
            <button
              onClick={handleSignOut}
              className="text-sm font-medium text-red-500 text-left px-3 py-2.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          <div className="flex flex-col gap-2 pt-1">
            <Button
              variant="ghost"
              asChild
              className="justify-start text-[#3A4A7A] hover:text-[#1E2E8C] hover:bg-[#EBF0FF]"
            >
              <Link href="/auth/login" onClick={onClose}>Ingresar</Link>
            </Button>
            <Button
              asChild
              className="bg-[#FF8C42] hover:bg-[#E5722A] text-white border-0"
            >
              <Link href="/contacto" onClick={onClose}>Contactar</Link>
            </Button>
          </div>
        )}
      </nav>
    </div>
  );
}

export function CorporateHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Barra superior */}
      <div style={{ background: '#5D3FD3' }}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-9 text-xs text-white/90">
            <div className="flex items-center gap-5">
              <a href="tel:+56955222430" className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Phone className="h-3 w-3" />
                +56 9 5522 2430
              </a>
              <a href="mailto:contacto@elpoderdecrear.cl" className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Mail className="h-3 w-3" />
                contacto@elpoderdecrear.cl
              </a>
            </div>
            <div className="hidden md:flex items-center gap-5">
              <Link href="/lumen" className="flex items-center gap-1.5 font-medium hover:text-white transition-colors">
                <GraduationCap className="h-3.5 w-3.5" />
                Acceso Aula Virtual
              </Link>
              <span className="flex items-center gap-1.5 text-white/70">
                <BadgeCheck className="h-3 w-3" />
                OTEC Certificada NCh 2728:2015 | Acreditada por SENCE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Barra principal */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.97)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: scrolled ? '1px solid #C8D3EE' : '1px solid rgba(228, 225, 245, 0.5)',
          boxShadow: scrolled ? '0 2px 20px rgba(93, 63, 211, 0.08)' : 'none',
        }}
      >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8 lg:gap-10">
            <Link href="/" className="flex items-center shrink-0">
              <Image
                src="/logo-otec.png"
                alt="OTEC El Poder de Crear"
                width={160}
                height={52}
                className="h-10 w-auto object-contain"
                priority
              />
            </Link>

            <nav className="hidden md:flex items-center gap-0.5">
              {NAV_LINKS.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className="text-sm font-medium px-3 py-1.5 rounded-lg transition-all duration-150"
                    style={{
                      color: active ? '#1E2E8C' : '#3A4A7A',
                      background: active ? '#EBF0FF' : 'transparent',
                      fontWeight: active ? 700 : 500,
                    }}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {mounted && <AuthSection />}

            {!mounted && (
              <div className="hidden md:flex items-center gap-3">
                <div className="h-9 w-20 rounded-lg bg-[#EBF0FF] animate-pulse" />
                <div className="h-9 w-24 rounded-lg bg-[#FF8C42]/20 animate-pulse" />
              </div>
            )}

            <button
              className="md:hidden p-2 rounded-lg text-[#3A4A7A] hover:text-[#1E2E8C] hover:bg-[#EBF0FF] transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menú"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mounted && (
          <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        )}
      </div>
      </div>
    </header>
  );
}
