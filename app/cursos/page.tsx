'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getPublishedCourses, CourseDoc } from '@/lib/supabase/data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, ArrowRight, Search, SlidersHorizontal, X, Building2, User } from 'lucide-react';
import { useCartStore } from '@/lib/stores/cart-store';
import { toast } from 'sonner';

type Audience = 'todos' | 'b2c' | 'b2b';
type Modality = 'todos' | 'online' | 'presencial' | 'hibrido';
type Area = 'todos' | 'tecnologia' | 'negocios' | 'rrhh' | 'habilidades';

const MODALITY_LABELS: Record<string, string> = {
  online: 'Online',
  presencial: 'Presencial',
  hibrido: 'Híbrido',
  Online: 'Online',
  Presencial: 'Presencial',
  Híbrido: 'Híbrido',
};

function CourseCard({ course, audience }: { course: CourseDoc; audience: Audience }) {
  const addCourse = useCartStore((state) => state.addCourse);

  const handleAddToCart = () => {
    addCourse({
      id: course.id,
      title: course.title,
      price: course.price,
    });
    toast.success(`"${course.title}" agregado al carrito`);
  };

  const modalityColor: Record<string, string> = {
    online: '#1E2E8C',
    Online: '#1E2E8C',
    presencial: '#FF8C42',
    Presencial: '#FF8C42',
    hibrido: '#059669',
    Híbrido: '#059669',
  };

  const modalityBg: Record<string, string> = {
    online: '#EBF0FF',
    Online: '#EBF0FF',
    presencial: '#FFF3E8',
    Presencial: '#FFF3E8',
    hibrido: '#ECFDF5',
    Híbrido: '#ECFDF5',
  };

  const color = modalityColor[course.modality] ?? '#1E2E8C';
  const bg = modalityBg[course.modality] ?? '#EBF0FF';

  return (
    <div
      className="rounded-2xl border overflow-hidden hover:shadow-lg transition-all group flex flex-col"
      style={{ background: '#fff', borderColor: '#C8D3EE' }}
    >
      {course.image_url ? (
        <div className="relative h-44 w-full overflow-hidden">
          <Image
            src={course.image_url}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,16,64,0.3) 0%, transparent 60%)' }} />
        </div>
      ) : (
        <div
          className="h-44 w-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #EBF0FF 0%, #EBF2FF 100%)' }}
        >
          <div className="text-4xl font-black" style={{ color: 'rgba(93,63,211,0.15)' }}>
            {course.title.charAt(0)}
          </div>
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          {course.is_sence && (
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ background: '#ECFDF5', color: '#059669' }}
            >
              SENCE
            </span>
          )}
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{ background: bg, color }}
          >
            {MODALITY_LABELS[course.modality] ?? course.modality}
          </span>
        </div>

        <h3 className="font-bold text-sm leading-snug mb-2 line-clamp-2 flex-1" style={{ color: '#0D1A4A' }}>
          {course.title}
        </h3>

        {course.short_description && (
          <p className="text-xs leading-relaxed mb-4 line-clamp-2" style={{ color: '#3A4A7A' }}>
            {course.short_description}
          </p>
        )}

        <div className="flex items-center gap-3 mb-4" style={{ color: '#7A8AB0' }}>
          <div className="flex items-center gap-1 text-xs">
            <Clock className="h-3.5 w-3.5" />
            <span>{course.duration_hours}h</span>
          </div>
        </div>

        <div className="border-t pt-4 flex items-center justify-between" style={{ borderColor: '#C8D3EE' }}>
          <div>
            {course.price > 0 ? (
              <span className="text-base font-bold" style={{ color: '#0D1A4A' }}>
                ${course.price.toLocaleString('es-CL')}
              </span>
            ) : (
              <span className="text-sm font-semibold" style={{ color: '#059669' }}>Consultar precio</span>
            )}
          </div>
          {audience === 'b2b' ? (
            <Link href="/contacto">
              <Button
                size="sm"
                className="text-xs font-semibold text-white"
                style={{ background: '#FF8C42', boxShadow: '0 2px 8px rgba(255,140,66,0.3)' }}
              >
                Cotizar
              </Button>
            </Link>
          ) : (
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="text-xs font-semibold text-white"
              style={{ background: '#1E2E8C', boxShadow: '0 2px 8px rgba(93,63,211,0.3)' }}
            >
              Inscribirme
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function CursosContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<CourseDoc[]>([]);
  const [loading, setLoading] = useState(true);

  // Read filters from URL — persists across navigation
  const audience = (searchParams.get('audiencia') as Audience) ?? 'todos';
  const modality = (searchParams.get('modalidad') as Modality) ?? 'todos';
  const senceOnly = searchParams.get('sence') === '1';
  const search = searchParams.get('q') ?? '';

  const setParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === 'todos' || value === '') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.replace(`/cursos?${params.toString()}`, { scroll: false });
  };

  const setAudience = (v: Audience) => setParam('audiencia', v);
  const setModality = (v: Modality) => setParam('modalidad', v);
  const setSenceOnly = (v: boolean) => setParam('sence', v ? '1' : null);
  const setSearch = (v: string) => setParam('q', v);

  const clearFilters = () => {
    router.replace('/cursos', { scroll: false });
  };

  useEffect(() => {
    getPublishedCourses().then((data) => {
      setCourses(data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      if (senceOnly && !c.is_sence) return false;
      if (modality !== 'todos') {
        const m = c.modality.toLowerCase();
        if (modality === 'online' && m !== 'online') return false;
        if (modality === 'presencial' && m !== 'presencial') return false;
        if (modality === 'hibrido' && m !== 'híbrido' && m !== 'hibrido') return false;
      }
      if (search) {
        const q = search.toLowerCase();
        if (!c.title.toLowerCase().includes(q) && !(c.short_description ?? '').toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [courses, modality, senceOnly, search]);

  const activeFiltersCount = (modality !== 'todos' ? 1 : 0) + (senceOnly ? 1 : 0);

  return (
    <div className="flex flex-col min-h-screen">
      <section
        className="relative overflow-hidden py-16"
        style={{ background: 'linear-gradient(135deg, #0D1A4A 0%, #1E2E8C 60%, #2A3FA8 100%)' }}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 60% 40%, rgba(255,140,66,0.1) 0%, transparent 55%)' }}
        />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5"
              style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              Catálogo de Cursos
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Encuentra tu{' '}
              <span style={{ color: '#FF8C42' }}>próximo curso</span>
            </h1>
            <p className="text-base text-white/80 leading-relaxed max-w-2xl">
              Más de 70 cursos certificados SENCE en modalidades presencial, online e híbrida.
              Para personas y empresas.
            </p>
          </div>
        </div>
      </section>

      <section className="sticky top-16 z-30 border-b" style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)', borderColor: '#C8D3EE' }}>
        <div className="container mx-auto px-4 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="flex items-center gap-1 p-1 rounded-xl border shrink-0" style={{ background: '#F8F7FF', borderColor: '#C8D3EE' }}>
              {([
                { key: 'todos', label: 'Todos', icon: null },
                { key: 'b2c', label: 'Personal', icon: User },
                { key: 'b2b', label: 'Empresa', icon: Building2 },
              ] as const).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setAudience(tab.key)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                  style={{
                    background: audience === tab.key ? '#1E2E8C' : 'transparent',
                    color: audience === tab.key ? '#fff' : '#3A4A7A',
                  }}
                >
                  {tab.icon && <tab.icon className="h-3.5 w-3.5" />}
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#7A8AB0' }} />
              <input
                type="text"
                placeholder="Buscar cursos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border outline-none transition-colors"
                style={{ borderColor: '#C8D3EE', color: '#0D1A4A' }}
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="h-3.5 w-3.5" style={{ color: '#7A8AB0' }} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {(['todos', 'online', 'presencial', 'hibrido'] as Modality[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setModality(m)}
                  className="text-xs font-medium px-3 py-1.5 rounded-full border transition-all capitalize"
                  style={{
                    background: modality === m ? '#0D1A4A' : '#fff',
                    borderColor: modality === m ? '#0D1A4A' : '#C8D3EE',
                    color: modality === m ? '#fff' : '#3A4A7A',
                  }}
                >
                  {m === 'todos' ? 'Todas las modalidades' : m === 'hibrido' ? 'Híbrido' : m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
              <button
                onClick={() => setSenceOnly(!senceOnly)}
                className="text-xs font-medium px-3 py-1.5 rounded-full border transition-all"
                style={{
                  background: senceOnly ? '#059669' : '#fff',
                  borderColor: senceOnly ? '#059669' : '#C8D3EE',
                  color: senceOnly ? '#fff' : '#3A4A7A',
                }}
              >
                Solo SENCE
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 flex-1" style={{ background: '#F8F7FF' }}>
        <div className="container mx-auto px-4 lg:px-8">
          {audience === 'b2b' && (
            <div
              className="mb-8 p-5 rounded-2xl border flex items-start gap-4"
              style={{ background: '#FFF3E8', borderColor: '#FFD4A8' }}
            >
              <Building2 className="h-5 w-5 shrink-0 mt-0.5" style={{ color: '#FF8C42' }} />
              <div className="flex-1">
                <p className="text-sm font-semibold mb-1" style={{ color: '#0D1A4A' }}>
                  Modo Empresa activado
                </p>
                <p className="text-xs" style={{ color: '#3A4A7A' }}>
                  Los cursos se cotizarán para grupos. Los precios y condiciones se personalizan según tu equipo y necesidades.
                  Hacemos click en "Cotizar" para solicitar una propuesta con beneficios SENCE incluidos.
                </p>
              </div>
              <Link href="/empresas">
                <button className="text-xs font-semibold shrink-0 flex items-center gap-1" style={{ color: '#FF8C42' }}>
                  Saber más <ArrowRight className="h-3 w-3" />
                </button>
              </Link>
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <p className="text-sm" style={{ color: '#3A4A7A' }}>
              {loading ? 'Cargando...' : `${filtered.length} curso${filtered.length !== 1 ? 's' : ''} disponible${filtered.length !== 1 ? 's' : ''}`}
            </p>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-xs font-medium flex items-center gap-1"
                style={{ color: '#1E2E8C' }}
              >
                <X className="h-3.5 w-3.5" />
                Limpiar filtros ({activeFiltersCount})
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="rounded-2xl border overflow-hidden animate-pulse" style={{ background: '#fff', borderColor: '#C8D3EE' }}>
                  <div className="h-44" style={{ background: '#EBF0FF' }} />
                  <div className="p-5 space-y-3">
                    <div className="h-3 rounded-full" style={{ background: '#EBF0FF', width: '60%' }} />
                    <div className="h-4 rounded-full" style={{ background: '#EBF0FF' }} />
                    <div className="h-4 rounded-full" style={{ background: '#EBF0FF', width: '80%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((course) => (
                <CourseCard key={course.id} course={course} audience={audience} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div
                className="h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: '#EBF0FF' }}
              >
                <Search className="h-8 w-8" style={{ color: '#7A8AB0' }} />
              </div>
              <h3 className="font-bold mb-2" style={{ color: '#0D1A4A' }}>Sin resultados</h3>
              <p className="text-sm mb-6" style={{ color: '#3A4A7A' }}>
                No encontramos cursos con esos filtros. Prueba cambiando los criterios.
              </p>
              <Button
                onClick={clearFilters}
                className="text-sm font-semibold text-white"
                style={{ background: '#1E2E8C' }}
              >
                Ver todos los cursos
              </Button>
            </div>
          )}
        </div>
      </section>

      {audience !== 'b2b' && (
        <section
          className="py-16 text-white"
          style={{ background: 'linear-gradient(135deg, #1E2E8C, #2A3FA8)' }}
        >
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              ¿Buscas capacitación para tu empresa?
            </h2>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
              Programas a medida, descuentos por volumen y gestión completa de franquicia SENCE.
            </p>
            <Button
              size="lg"
              asChild
              className="font-semibold text-[#1E2E8C]"
              style={{ background: '#fff' }}
            >
              <Link href="/empresas">
                Ver soluciones para empresas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      )}

      {audience === 'b2b' && (
        <section
          className="py-16 text-white"
          style={{ background: 'linear-gradient(135deg, #FF8C42, #E5722A)' }}
        >
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              ¿Necesitas un programa personalizado?
            </h2>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
              Diseñamos programas a medida para tu organización. Con o sin franquicia SENCE.
            </p>
            <Button
              size="lg"
              asChild
              className="font-semibold text-[#E5722A]"
              style={{ background: '#fff' }}
            >
              <Link href="/contacto">
                Solicitar propuesta personalizada
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}

export default function CursosPage() {
  return (
    <Suspense>
      <CursosContent />
    </Suspense>
  );
}
