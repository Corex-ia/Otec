'use client';

import { useState, useEffect } from 'react';
import {
  getPublishedCourses,
  getCourseEnrollments,
  getProfile,
  getAllAuditLogs,
  getCourseSenceSurveys,
  getUserLessonProgress,
  getCourseModules,
  getModuleLessons,
  getCourseExamResults,
  getCourseSenceDeclarations,
  CourseDoc,
  EnrollmentDoc,
  ProfileDoc,
  AuditLogDoc,
  SenceSurveyDoc,
  ExamResultDoc,
  SenceDeclarationDoc,
} from '@/lib/firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChartBar as BarChart2, Download, RefreshCw, FileSpreadsheet, Users, Clock, TrendingUp, Star, ClipboardList, Shield } from 'lucide-react';

interface StudentReport {
  user_id: string;
  rut: string;
  full_name: string;
  email: string;
  course_id: string;
  course_title: string;
  enrolled_at: string;
  meet_minutes: number;
  page_minutes: number;
  progress_percent: number;
  survey_avg: number | null;
  exam_score: number | null;
  exam_passed: boolean | null;
  declaration_at: string | null;
  is_approved: boolean;
}

function secondsToMinutes(secs: number): number {
  return Math.round(secs / 60);
}

function escapeCsv(val: string | number | null | undefined): string {
  const s = String(val ?? '');
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function exportToCsv(rows: StudentReport[], courseTitle: string) {
  const headers = [
    'RUT',
    'Nombre Completo',
    'Email',
    'Curso',
    'Fecha Inscripcion',
    'Min. Efectivos en Reunion (SENCE)',
    'Min. Totales en Plataforma',
    '% Progreso Contenidos',
    'Nota Examen (%)',
    'Estado Examen',
    'Nota Promedio Encuesta',
    'Timestamp Declaracion Jurada',
    'Estado',
  ];

  const csvRows = rows.map((r) => [
    escapeCsv(r.rut || 'N/A'),
    escapeCsv(r.full_name),
    escapeCsv(r.email),
    escapeCsv(r.course_title),
    escapeCsv(new Date(r.enrolled_at).toLocaleDateString('es-CL')),
    escapeCsv(r.meet_minutes),
    escapeCsv(r.page_minutes),
    escapeCsv(`${Math.round(r.progress_percent)}%`),
    escapeCsv(r.exam_score != null ? `${r.exam_score}%` : 'Sin examen'),
    escapeCsv(r.exam_score == null ? 'N/A' : r.exam_passed ? 'Aprobado' : 'Reprobado'),
    escapeCsv(r.survey_avg != null ? r.survey_avg.toFixed(1) : 'Pendiente'),
    escapeCsv(
      r.declaration_at
        ? new Date(r.declaration_at).toLocaleString('es-CL')
        : 'Sin declaracion'
    ),
    escapeCsv(r.is_approved ? 'Aprobado' : 'Pendiente'),
  ]);

  const csvContent = [headers.join(','), ...csvRows.map((r) => r.join(','))].join('\n');
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `SENCE_Auditoria_${courseTitle.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function SenceReportsPanel() {
  const [courses, setCourses] = useState<CourseDoc[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [reports, setReports] = useState<StudentReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    getPublishedCourses().then((data) => {
      setCourses(data);
      if (data.length > 0) setSelectedCourseId(data[0].id);
      setInitialLoading(false);
    });
  }, []);

  const generateReport = async () => {
    if (!selectedCourseId) return;
    setLoading(true);

    try {
      const [enrollments, allLogs, surveys, examResults, declarations] = await Promise.all([
        getCourseEnrollments(selectedCourseId),
        getAllAuditLogs(2000),
        getCourseSenceSurveys(selectedCourseId),
        getCourseExamResults(selectedCourseId),
        getCourseSenceDeclarations(selectedCourseId),
      ]);

      let filteredEnrollments = enrollments;
      if (dateFrom) {
        filteredEnrollments = filteredEnrollments.filter(
          (e) => e.enrolled_at >= new Date(dateFrom).toISOString()
        );
      }
      if (dateTo) {
        const toEnd = new Date(dateTo);
        toEnd.setHours(23, 59, 59, 999);
        filteredEnrollments = filteredEnrollments.filter(
          (e) => e.enrolled_at <= toEnd.toISOString()
        );
      }

      const modules = await getCourseModules(selectedCourseId);
      const allLessons = (
        await Promise.all(modules.map((m) => getModuleLessons(m.id)))
      ).flat();
      const nonExamLessons = allLessons.filter((l) => l.type !== 'examen');
      const totalLessonsCount = nonExamLessons.length;

      const surveyMap: Record<string, SenceSurveyDoc> = {};
      surveys.forEach((s) => { surveyMap[s.user_id] = s; });

      const examResultMap: Record<string, ExamResultDoc> = {};
      examResults.forEach((r) => {
        const existing = examResultMap[r.user_id];
        if (!existing || r.attempt > existing.attempt) {
          examResultMap[r.user_id] = r;
        }
      });

      const declarationMap: Record<string, string> = {};
      declarations.forEach((d) => {
        if (!declarationMap[d.user_id] || d.accepted_at < declarationMap[d.user_id]) {
          declarationMap[d.user_id] = d.accepted_at;
        }
      });

      const meetSecsByUser: Record<string, number> = {};
      const pageSecsByUser: Record<string, number> = {};

      allLogs
        .filter(
          (l) =>
            l.course_id === selectedCourseId &&
            l.action === 'meet_leave' &&
            l.duration_seconds != null
        )
        .forEach((l) => {
          meetSecsByUser[l.user_id] = (meetSecsByUser[l.user_id] ?? 0) + (l.duration_seconds ?? 0);
        });

      allLogs
        .filter(
          (l) =>
            l.course_id === selectedCourseId &&
            l.action === 'jitsi_exit' &&
            l.duration_seconds != null
        )
        .forEach((l) => {
          pageSecsByUser[l.user_id] = (pageSecsByUser[l.user_id] ?? 0) + (l.duration_seconds ?? 0);
          if (!meetSecsByUser[l.user_id]) {
            const meetSecs = typeof l.metadata?.meet_seconds === 'number' ? l.metadata.meet_seconds : 0;
            if (meetSecs > 0) {
              meetSecsByUser[l.user_id] = (meetSecsByUser[l.user_id] ?? 0) + meetSecs;
            }
          }
        });

      const rows: StudentReport[] = await Promise.all(
        filteredEnrollments.map(async (e: EnrollmentDoc) => {
          const profile = await getProfile(e.user_id);
          const progressData = await getUserLessonProgress(e.user_id);
          const lessonProgressMap: Record<string, boolean> = {};
          progressData.forEach((p) => { lessonProgressMap[p.lesson_id] = p.completed; });
          const completedCount = nonExamLessons.filter((l) => lessonProgressMap[l.id]).length;
          const progressPercent = totalLessonsCount > 0 ? (completedCount / totalLessonsCount) * 100 : 0;

          const survey = surveyMap[e.user_id];
          const surveyAvg = survey
            ? (survey.rating_relator + survey.rating_contenidos + survey.rating_infraestructura + survey.rating_utilidad) / 4
            : null;

          const examResult = examResultMap[e.user_id] ?? null;
          const meetMins = secondsToMinutes(meetSecsByUser[e.user_id] ?? 0);
          const pageMins = secondsToMinutes(pageSecsByUser[e.user_id] ?? 0);

          return {
            user_id: e.user_id,
            rut: (profile as any)?.rut ?? '',
            full_name: profile?.full_name ?? 'Desconocido',
            email: profile?.email ?? '',
            course_id: selectedCourseId,
            course_title: courses.find((c) => c.id === selectedCourseId)?.title ?? '',
            enrolled_at: e.enrolled_at,
            meet_minutes: meetMins,
            page_minutes: pageMins,
            progress_percent: progressPercent,
            survey_avg: surveyAvg,
            exam_score: examResult?.score ?? null,
            exam_passed: examResult?.passed ?? null,
            declaration_at: declarationMap[e.user_id] ?? null,
            is_approved: e.is_approved,
          };
        })
      );

      setReports(rows);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  const avgProgress = reports.length
    ? reports.reduce((s, r) => s + r.progress_percent, 0) / reports.length
    : 0;

  const avgMeetMinutes = reports.length
    ? reports.reduce((s, r) => s + r.meet_minutes, 0) / reports.length
    : 0;

  const examCount = reports.filter((r) => r.exam_score != null).length;
  const avgExam = examCount > 0
    ? reports.filter((r) => r.exam_score != null).reduce((s, r) => s + (r.exam_score ?? 0), 0) / examCount
    : null;

  const surveyCount = reports.filter((r) => r.survey_avg != null).length;
  const avgSurvey =
    surveyCount > 0
      ? reports.filter((r) => r.survey_avg != null).reduce((s, r) => s + (r.survey_avg ?? 0), 0) / surveyCount
      : null;

  if (initialLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-slate-200 rounded w-1/3" />
        <div className="h-40 bg-slate-200 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-slate-600" />
          <h2 className="font-semibold text-slate-800 text-lg">Reportes SENCE</h2>
        </div>
        <p className="text-slate-500 text-sm sm:ml-2">
          Auditoria y liquidacion para Franquicia Tributaria
        </p>
      </div>

      <Card className="border-slate-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm">Filtros del Reporte</CardTitle>
          <CardDescription>Selecciona curso y rango de fechas (opcional)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
            <select
              value={selectedCourseId}
              onChange={(e) => { setSelectedCourseId(e.target.value); setReports([]); }}
              className="flex-1 min-w-[200px] border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500 whitespace-nowrap">Desde</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500 whitespace-nowrap">Hasta</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button
              onClick={generateReport}
              disabled={loading || !selectedCourseId}
              className="gap-2 bg-slate-800 hover:bg-slate-700 text-white"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {loading ? 'Generando...' : 'Generar Reporte'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {reports.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="border-slate-200">
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-slate-500" />
                  <p className="text-xs text-slate-500 font-medium">Alumnos</p>
                </div>
                <p className="text-2xl font-bold text-slate-800">{reports.length}</p>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-emerald-600" />
                  <p className="text-xs text-slate-500 font-medium">Min. Prom. Reunion (SENCE)</p>
                </div>
                <p className="text-2xl font-bold text-slate-800">{Math.round(avgMeetMinutes)}</p>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-slate-500" />
                  <p className="text-xs text-slate-500 font-medium">Avance Prom.</p>
                </div>
                <p className="text-2xl font-bold text-slate-800">{Math.round(avgProgress)}%</p>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <ClipboardList className="h-4 w-4 text-slate-500" />
                  <p className="text-xs text-slate-500 font-medium">Nota Examen Prom.</p>
                </div>
                <p className="text-2xl font-bold text-slate-800">
                  {avgExam != null ? `${Math.round(avgExam)}%` : '—'}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm">Detalle por Alumno — Auditoria Completa</CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    {selectedCourse?.title} &mdash; {reports.length} registros
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 text-xs border-slate-200"
                  onClick={() => exportToCsv(reports, selectedCourse?.title ?? 'Reporte')}
                >
                  <FileSpreadsheet className="h-3.5 w-3.5" />
                  Exportar CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[800px]">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Alumno / RUT</th>
                      <th className="text-center py-2.5 px-3 text-xs font-semibold text-emerald-600 uppercase tracking-wide">
                        <div className="flex items-center justify-center gap-1">
                          <Clock className="h-3 w-3" />
                          Min. Reunion (SENCE)
                        </div>
                      </th>
                      <th className="text-center py-2.5 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                        Min. Pagina
                      </th>
                      <th className="text-center py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">% Contenido</th>
                      <th className="text-center py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        <div className="flex items-center justify-center gap-1">
                          <ClipboardList className="h-3 w-3" />
                          Examen
                        </div>
                      </th>
                      <th className="text-center py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        <div className="flex items-center justify-center gap-1">
                          <Shield className="h-3 w-3" />
                          Decl. Jurada
                        </div>
                      </th>
                      <th className="text-center py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="h-3 w-3" />
                          Encuesta
                        </div>
                      </th>
                      <th className="text-center py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((r, i) => (
                      <tr
                        key={r.user_id}
                        className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-50/30'}`}
                      >
                        <td className="py-3 px-3">
                          <div>
                            <p className="font-medium text-slate-800 truncate max-w-[180px]">{r.full_name}</p>
                            <p className="text-[11px] text-slate-400">{r.email}</p>
                            {r.rut && <p className="text-[10px] text-slate-400 font-mono mt-0.5">{r.rut}</p>}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div>
                            <span className={`font-semibold text-sm ${r.meet_minutes > 0 ? 'text-emerald-700' : 'text-slate-400'}`}>
                              {r.meet_minutes} min
                            </span>
                            {r.meet_minutes === 0 && r.page_minutes > 0 && (
                              <p className="text-[10px] text-amber-500 mt-0.5">Sin datos de reunion</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`text-xs ${r.page_minutes > 0 ? 'text-slate-500' : 'text-slate-300'}`}>
                            {r.page_minutes} min
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-xs font-semibold text-slate-700">{Math.round(r.progress_percent)}%</span>
                            <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full bg-blue-500 transition-all"
                                style={{ width: `${r.progress_percent}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          {r.exam_score != null ? (
                            <div className="space-y-0.5">
                              <p className="font-semibold text-xs text-slate-700">{r.exam_score}%</p>
                              <Badge
                                className={`text-[9px] ${
                                  r.exam_passed
                                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                    : 'bg-red-100 text-red-700 border-red-200'
                                }`}
                                variant="outline"
                              >
                                {r.exam_passed ? 'Aprobado' : 'Reprobado'}
                              </Badge>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs">Sin examen</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {r.declaration_at ? (
                            <div className="space-y-0.5">
                              <div className="flex items-center justify-center gap-1">
                                <Shield className="h-3 w-3 text-emerald-500" />
                                <span className="text-[10px] font-semibold text-emerald-700">Aceptada</span>
                              </div>
                              <p className="text-[9px] text-slate-400">
                                {new Date(r.declaration_at).toLocaleString('es-CL', {
                                  day: '2-digit', month: '2-digit', year: '2-digit',
                                  hour: '2-digit', minute: '2-digit',
                                })}
                              </p>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs">No registrada</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {r.survey_avg != null ? (
                            <div className="flex items-center justify-center gap-1">
                              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                              <span className="font-semibold text-slate-700 text-xs">{r.survey_avg.toFixed(1)}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs">Pendiente</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <Badge
                            className={`text-[10px] ${
                              r.is_approved
                                ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                            variant="outline"
                          >
                            {r.is_approved ? 'Aprobado' : 'Pendiente'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {!loading && reports.length === 0 && selectedCourseId && (
        <div className="text-center py-16 text-slate-400">
          <BarChart2 className="h-10 w-10 mx-auto mb-3 text-slate-200" />
          <p className="text-sm">Selecciona un curso y haz clic en &quot;Generar Reporte&quot;</p>
        </div>
      )}
    </div>
  );
}
