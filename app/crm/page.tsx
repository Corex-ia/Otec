'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/stores/auth-store';
import {
  getDeals,
  getCompanies,
  getPendingTasks,
  getClosedDealsRevenue,
  DealDoc,
  TaskDoc,
} from '@/lib/firebase/firestore';
import { Button } from '@/components/ui/button';
import { DollarSign, Building2, SquareCheck as CheckSquare, TrendingUp, Chrome as Home, ChevronRight, Search, Sun, LogOut, ChartBar as BarChart2, Settings } from 'lucide-react';
import { ContentUploadForm } from '@/components/crm/content-upload-form';
import { SeedPanel } from '@/components/crm/seed-panel';
import { LessonMeetForm } from '@/components/crm/lesson-meet-form';
import { CourseBuilder } from '@/components/crm/course-builder';
import { CourseInstructorForm } from '@/components/crm/course-instructor-form';
import { SenceReportsPanel } from '@/components/crm/sence-reports-panel';
import { supabase } from '@/lib/supabase/client';

type MainTab = 'comercial' | 'operaciones' | 'finanzas';
type SubTab = 'dashboard' | 'cursos' | 'contenido' | 'sence';

const MAIN_TABS: { key: MainTab; label: string }[] = [
  { key: 'comercial', label: 'Comercial' },
  { key: 'operaciones', label: 'Operaciones' },
  { key: 'finanzas', label: 'Finanzas' },
];

const SUB_TABS: { key: SubTab; label: string }[] = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'sence', label: 'Reportes SENCE' },
  { key: 'cursos', label: 'Gestión de Cursos' },
  { key: 'contenido', label: 'Contenido' },
];

function CRMTopbar() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);

  const initials = (profile?.full_name || user?.email || 'U')
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <div
      className="flex items-center justify-between px-6 h-14 border-b shrink-0"
      style={{ borderColor: '#C8D3EE', background: '#fff' }}
    >
      <div className="flex items-center gap-3">
        <div
          className="h-9 w-9 rounded-lg flex items-center justify-center text-white text-xs font-bold"
          style={{ background: 'linear-gradient(135deg, #1E2E8C, #2A3FA8)' }}
        >
          PC
        </div>
        <div className="leading-none">
          <div className="text-sm font-bold text-[#0D1A4A]">PORTAL CRM</div>
          <div className="text-[11px] text-[#FF8C42] font-medium">El Poder de Crear</div>
        </div>
        <span
          className="ml-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border"
          style={{ color: '#FF8C42', borderColor: '#FF8C42', background: '#FFF3E8' }}
        >
          Interno
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button className="p-2 rounded-lg text-[#7A8AB0] hover:text-[#1E2E8C] hover:bg-[#EBF0FF] transition-colors">
          <Search className="h-4 w-4" />
        </button>
        <button className="p-2 rounded-lg text-[#7A8AB0] hover:text-[#1E2E8C] hover:bg-[#EBF0FF] transition-colors">
          <Sun className="h-4 w-4" />
        </button>
        <Link
          href="/"
          className="p-2 rounded-lg text-[#7A8AB0] hover:text-[#1E2E8C] hover:bg-[#EBF0FF] transition-colors"
        >
          <Home className="h-4 w-4" />
        </Link>

        <div className="flex items-center gap-2 ml-2 pl-3 border-l border-[#C8D3EE]">
          <div
            className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #1E2E8C, #2A3FA8)' }}
          >
            {initials}
          </div>
          <div className="hidden md:block leading-none">
            <div className="text-sm font-semibold text-[#0D1A4A]">
              {profile?.full_name?.split(' ')[0] || 'Admin'}
            </div>
            <div className="text-[10px] text-[#7A8AB0] uppercase">
              {profile?.role || 'admin'}-001
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="ml-1 p-1.5 rounded-lg text-[#7A8AB0] hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CRMDashboard() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const loading = useAuthStore((state) => state.loading);

  const [mainTab, setMainTab] = useState<MainTab>('comercial');
  const [subTab, setSubTab] = useState<SubTab>('dashboard');

  const [deals, setDeals] = useState<DealDoc[]>([]);
  const [tasks, setTasks] = useState<TaskDoc[]>([]);
  const [dealsCount, setDealsCount] = useState(0);
  const [companiesCount, setCompaniesCount] = useState(0);
  const [tasksCount, setTasksCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/auth/login?redirect=/crm');
      return;
    }
    if (profile && !['admin', 'ejecutivo', 'vendedor'].includes(profile.role)) {
      router.push('/');
      return;
    }

    const loadData = async () => {
      const [dealsData, companiesData, tasksData, revenue] = await Promise.all([
        getDeals(5),
        getCompanies(5),
        getPendingTasks(5),
        getClosedDealsRevenue(),
      ]);
      setDeals(dealsData);
      setTasks(tasksData);
      setDealsCount(dealsData.length);
      setCompaniesCount(companiesData.length);
      setTasksCount(tasksData.length);
      setTotalRevenue(revenue);
      setDataLoading(false);
    };
    loadData();
  }, [user, profile, loading, router]);

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen" style={{ background: '#F8F7FF' }}>
        <div className="h-14 border-b animate-pulse" style={{ background: '#fff', borderColor: '#C8D3EE' }} />
        <div className="p-8 space-y-4">
          <div className="h-8 w-64 rounded-lg bg-[#C8D3EE] animate-pulse" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 rounded-xl bg-[#C8D3EE] animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Oportunidades Activas',
      value: dealsCount,
      icon: DollarSign,
      color: '#1E2E8C',
      bg: '#EBF0FF',
      href: '/crm/deals',
    },
    {
      title: 'Empresas',
      value: companiesCount,
      icon: Building2,
      color: '#2F5E9E',
      bg: '#EBF2FF',
      href: '/crm/companies',
    },
    {
      title: 'Tareas Pendientes',
      value: tasksCount,
      icon: CheckSquare,
      color: '#FF8C42',
      bg: '#FFF3E8',
      href: '/crm/tasks',
    },
    {
      title: 'Ingresos Cerrados',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: '#059669',
      bg: '#ECFDF5',
      href: '/crm/deals',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F8F7FF' }}>
      <CRMTopbar />

      <div className="border-b px-6" style={{ background: '#fff', borderColor: '#C8D3EE' }}>
        <div className="flex">
          {MAIN_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setMainTab(tab.key)}
              className="px-5 py-3.5 text-sm font-semibold transition-colors"
              style={{
                color: mainTab === tab.key ? '#1E2E8C' : '#7A8AB0',
                borderBottom: mainTab === tab.key ? '2px solid #1E2E8C' : '2px solid transparent',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-b px-6" style={{ background: '#fff', borderColor: '#C8D3EE' }}>
        <div className="flex gap-1 overflow-x-auto py-1.5">
          {SUB_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSubTab(tab.key)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium whitespace-nowrap rounded-lg transition-all"
              style={{
                color: subTab === tab.key ? '#1E2E8C' : '#7A8AB0',
                background: subTab === tab.key ? '#EBF0FF' : 'transparent',
              }}
            >
              {tab.label}
              {tab.key === 'cursos' && (
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
                  style={{ background: '#FF8C42' }}
                >
                  3
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div
        className="px-6 py-2.5 border-b flex items-center gap-1.5 text-sm"
        style={{ background: '#fff', borderColor: '#C8D3EE' }}
      >
        <Home className="h-3.5 w-3.5 text-[#7A8AB0]" />
        <ChevronRight className="h-3.5 w-3.5 text-[#C4C0E0]" />
        <span className="text-[#7A8AB0] capitalize">{mainTab}</span>
        <ChevronRight className="h-3.5 w-3.5 text-[#C4C0E0]" />
        <span className="font-semibold text-[#0D1A4A] capitalize">{subTab}</span>
      </div>

      <div className="flex-1 p-6">
        {subTab === 'dashboard' && (
          <div className="space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[#0D1A4A]">Dashboard Personalizado</h1>
                <p className="text-sm text-[#7A8AB0] mt-0.5">
                  {deals.length} de {deals.length + 1} widgets activos
                </p>
              </div>
              <Button
                className="flex items-center gap-2 text-white font-semibold"
                style={{ background: '#1E2E8C', boxShadow: '0 4px 12px rgba(93,63,211,0.3)' }}
              >
                <Settings className="h-4 w-4" />
                Personalizar
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <Link key={stat.title} href={stat.href}>
                  <div
                    className="p-5 rounded-xl border cursor-pointer hover:shadow-md transition-all"
                    style={{ background: '#fff', borderColor: '#C8D3EE' }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold text-[#7A8AB0] uppercase tracking-wide leading-tight max-w-[120px]">
                        {stat.title}
                      </p>
                      <div
                        className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: stat.bg }}
                      >
                        <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-[#0D1A4A]">{stat.value}</div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
              <div
                className="rounded-xl border p-5"
                style={{ background: '#fff', borderColor: '#C8D3EE' }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <BarChart2 className="h-4 w-4 text-[#1E2E8C]" />
                  <h3 className="font-semibold text-[#0D1A4A]">Estado en Tiempo Real</h3>
                  <span
                    className="ml-auto flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: '#ECFDF5', color: '#059669' }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                    Conectado
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-t border-[#F3F1FC]">
                  <span className="text-sm text-[#3A4A7A]">Eventos recibidos:</span>
                  <span className="text-sm font-bold text-[#0D1A4A]">0</span>
                </div>
              </div>

              <div
                className="rounded-xl border p-5"
                style={{ background: '#fff', borderColor: '#C8D3EE' }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-[#1E2E8C]" />
                  <h3 className="font-semibold text-[#0D1A4A]">Ventas Mensuales</h3>
                </div>
                <p className="text-sm text-[#7A8AB0] mb-3">Comparación vs meta del mes</p>
                {deals.length > 0 ? (
                  <div className="space-y-0">
                    {deals.slice(0, 3).map((deal) => (
                      <div
                        key={deal.id}
                        className="flex items-center justify-between py-2.5 border-t border-[#F3F1FC]"
                      >
                        <div>
                          <p className="text-sm font-medium text-[#0D1A4A]">{deal.title}</p>
                          <p className="text-xs text-[#7A8AB0] capitalize">{deal.status}</p>
                        </div>
                        <p className="text-sm font-bold text-[#1E2E8C]">
                          ${Number(deal.value).toLocaleString()}
                        </p>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      asChild
                      className="w-full mt-3 border-[#C8D3EE] text-[#1E2E8C] hover:bg-[#EBF0FF] hover:border-[#1E2E8C]"
                    >
                      <Link href="/crm/deals">Ver todas</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-[#7A8AB0]">No hay oportunidades activas</p>
                  </div>
                )}
              </div>
            </div>

            {tasks.length > 0 && (
              <div
                className="rounded-xl border p-5"
                style={{ background: '#fff', borderColor: '#C8D3EE' }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <CheckSquare className="h-4 w-4 text-[#FF8C42]" />
                  <h3 className="font-semibold text-[#0D1A4A]">Tareas Pendientes</h3>
                </div>
                <div className="divide-y divide-[#F3F1FC]">
                  {tasks.map((task) => (
                    <div key={task.id} className="flex items-start gap-3 py-2.5">
                      <div
                        className="h-5 w-5 rounded-full border-2 mt-0.5 shrink-0"
                        style={{ borderColor: '#FF8C42' }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#0D1A4A] truncate">{task.title}</p>
                        {task.due_date && (
                          <p className="text-xs text-[#7A8AB0]">
                            Vence: {new Date(task.due_date).toLocaleDateString('es-CL')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  asChild
                  className="w-full mt-3 border-[#C8D3EE] text-[#1E2E8C] hover:bg-[#EBF0FF] hover:border-[#1E2E8C]"
                >
                  <Link href="/crm/tasks">Ver todas las tareas</Link>
                </Button>
              </div>
            )}
          </div>
        )}

        {subTab === 'sence' && (
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-[#0D1A4A]">Reportes SENCE</h1>
              <p className="text-sm text-[#7A8AB0] mt-0.5">Gestión y reportería normativa SENCE</p>
            </div>
            <SenceReportsPanel />
          </div>
        )}

        {subTab === 'cursos' && (
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-[#0D1A4A]">Gestión de Cursos</h1>
              <p className="text-sm text-[#7A8AB0] mt-0.5">Administra cursos, instructores y sesiones</p>
            </div>
            <CourseInstructorForm />
            <CourseBuilder />
            <LessonMeetForm />
          </div>
        )}

        {subTab === 'contenido' && (
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-[#0D1A4A]">Contenido</h1>
              <p className="text-sm text-[#7A8AB0] mt-0.5">Gestiona recursos y materiales de cursos</p>
            </div>
            <div className="grid lg:grid-cols-2 gap-4">
              <ContentUploadForm />
              <SeedPanel />
            </div>
          </div>
        )}
      </div>

      <div
        className="fixed bottom-4 right-4 flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-xs font-bold shadow-xl"
        style={{ background: '#DC2626' }}
      >
        <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
        USO INTERNO - PORTAL COMERCIAL
      </div>
    </div>
  );
}
