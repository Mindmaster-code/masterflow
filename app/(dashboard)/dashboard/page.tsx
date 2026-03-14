import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowRight, Target, Brain, BarChart3, Rocket,
  TrendingUp, CheckCircle2, Sparkles, Kanban,
  ChevronRight, Clock, CircleCheck,
} from 'lucide-react';

/* ── Circular progress SVG ── */
function CircleProgress({ value }: { value: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" className="rotate-[-90deg]">
      <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
      <circle
        cx="48" cy="48" r={r} fill="none"
        stroke="url(#tealGrad)" strokeWidth="8"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
      <defs>
        <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0D9488" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  const [progress, profile, actions] = await Promise.all([
    db.journeyProgress.findUnique({ where: { userId: session.user.id } }),
    db.profile.findUnique({ where: { userId: session.user.id } }),
    db.action.findMany({ where: { userId: session.user.id } }),
  ]);

  const firstName = (profile?.name || session.user.name || 'Executivo').split(' ')[0];
  const todoActions  = actions.filter(a => a.status === 'TODO').length;
  const doingActions = actions.filter(a => a.status === 'DOING').length;
  const doneActions  = actions.filter(a => a.status === 'DONE').length;
  const totalActions = actions.length;

  /* ── Empty state ── */
  if (!progress) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-2xl brand-gradient flex items-center justify-center mx-auto mb-6 shadow-2xl"
            style={{ boxShadow: '0 16px 48px rgba(13,148,136,0.35)' }}>
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-3">
            Bem-vindo, <span className="brand-gradient-text">{firstName}</span>!
          </h1>
          <p className="text-white/50 text-lg mb-8 leading-relaxed">
            Sua jornada de desenvolvimento executivo começa agora.
          </p>
          <Link href="/step1">
            <Button className="premium-button text-base px-8 h-12 rounded-xl group">
              Iniciar Jornada
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const journeySteps = [
    { id: 1, path: '/step1', title: 'Ponto de Partida',  desc: 'Perfil e Desafios',   icon: Target,   completed: progress.step1Completed, color: 'from-teal-500 to-cyan-500',    glow: 'rgba(20,184,166,0.3)'  },
    { id: 2, path: '/step2', title: 'Auto-Conhecimento', desc: 'Metas de Carreira',   icon: Brain,    completed: progress.step2Completed, color: 'from-cyan-500 to-sky-500',     glow: 'rgba(6,182,212,0.3)'   },
    { id: 3, path: '/step3', title: 'Mapeamento',        desc: 'Skills e SWOT',       icon: BarChart3, completed: progress.step3Completed, color: 'from-sky-500 to-blue-500',    glow: 'rgba(14,165,233,0.3)'  },
    { id: 4, path: '/step5', title: 'Plano de Ação',     desc: 'Execute suas ações',  icon: Rocket,   completed: progress.step5Completed, color: 'from-teal-600 to-emerald-500', glow: 'rgba(13,148,136,0.3)'  },
  ];

  const completedSteps = journeySteps.filter(s => s.completed).length;
  const currentStepData = journeySteps.find(s => s.id === progress.currentStep);
  const kanbanAccessible = progress.currentStep >= 4;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-7 animate-fade-in">

      {/* ── Header ── */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-teal-400/70 mb-1">Olá de volta</p>
          <h1 className="text-3xl md:text-4xl font-bold">
            <span className="brand-gradient-text">{firstName}</span>
            <span className="text-white/85"> 👋</span>
          </h1>
        </div>
        {/* Compact progress ring */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="relative hidden sm:block">
            <CircleProgress value={progress.overallProgress} />
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-base font-bold brand-gradient-text">{progress.overallProgress}%</span>
              <span className="text-[9px] text-white/35 uppercase tracking-wider">progresso</span>
            </div>
          </div>
          {currentStepData && (
            <Link href={currentStepData.path}>
              <Button className="premium-button h-10 px-5 rounded-xl text-sm group">
                Continuar
                <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* ── Hero Cards: Resumo + Kanban ── */}
      <div className="grid md:grid-cols-2 gap-5">

        {/* Resumo */}
        <Link href="/resumo" className="block group">
          <div
            className="relative overflow-hidden rounded-2xl border p-6 h-full cursor-pointer transition-all duration-300 hover:border-teal-500/40"
            style={{
              background: 'linear-gradient(135deg, rgba(13,148,136,0.1) 0%, rgba(6,182,212,0.05) 100%)',
              borderColor: 'rgba(13,148,136,0.25)',
            }}
          >
            {/* Glow orb */}
            <div className="absolute top-0 right-0 w-48 h-48 orb orb-teal opacity-40" style={{ transform: 'translate(30%,-30%)' }} />

            <div className="relative flex flex-col h-full gap-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl brand-gradient flex items-center justify-center shadow-xl flex-shrink-0"
                  style={{ boxShadow: '0 8px 24px rgba(13,148,136,0.35)' }}>
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Ver tudo <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold tracking-widest uppercase text-teal-400/70 mb-1">Análise Completa</div>
                <h2 className="text-xl font-bold text-white mb-1.5">Resumo da Jornada</h2>
                <p className="text-sm text-white/45 leading-relaxed">
                  Gráficos de skills, análise SWOT, gap de competências e consultoria personalizada de carreira.
                </p>
              </div>

              {/* Mini stats */}
              <div className="flex gap-3 mt-auto pt-3 border-t" style={{ borderColor: 'rgba(13,148,136,0.15)' }}>
                {[
                  { value: `${completedSteps}/4`, label: 'Etapas' },
                  { value: `${progress.overallProgress}%`, label: 'Progresso' },
                  { value: doneActions.toString(), label: 'Ações concluídas' },
                ].map(s => (
                  <div key={s.label}>
                    <p className="text-lg font-bold brand-gradient-text">{s.value}</p>
                    <p className="text-[11px] text-white/35">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Link>

        {/* Kanban */}
        <Link href={kanbanAccessible ? '/step5' : '#'} className={`block group ${!kanbanAccessible ? 'pointer-events-none' : ''}`}>
          <div
            className="relative overflow-hidden rounded-2xl border p-6 h-full cursor-pointer transition-all duration-300"
            style={{
              background: kanbanAccessible
                ? 'linear-gradient(135deg, rgba(6,182,212,0.08) 0%, rgba(14,165,233,0.05) 100%)'
                : 'rgba(255,255,255,0.02)',
              borderColor: kanbanAccessible ? 'rgba(6,182,212,0.22)' : 'rgba(255,255,255,0.06)',
              opacity: kanbanAccessible ? 1 : 0.5,
            }}
          >
            <div className="absolute top-0 right-0 w-48 h-48 orb orb-cyan opacity-30" style={{ transform: 'translate(30%,-30%)' }} />

            <div className="relative flex flex-col h-full gap-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0"
                  style={{
                    background: kanbanAccessible ? 'linear-gradient(135deg,#06B6D4,#0EA5E9)' : 'rgba(255,255,255,0.06)',
                    boxShadow: kanbanAccessible ? '0 8px 24px rgba(6,182,212,0.3)' : 'none',
                  }}>
                  <Kanban className="w-6 h-6 text-white" />
                </div>
                {!kanbanAccessible && (
                  <span className="text-[10px] font-bold tracking-wider text-white/25 uppercase bg-white/5 px-2 py-1 rounded-lg">Bloqueado</span>
                )}
                {kanbanAccessible && (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Abrir <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              <div>
                <div className="text-[10px] font-bold tracking-widest uppercase text-cyan-400/70 mb-1">Plano de Ação</div>
                <h2 className="text-xl font-bold text-white mb-1.5">Kanban de Carreira</h2>
                <p className="text-sm text-white/45 leading-relaxed">
                  Gerencie suas ações prioritárias, arraste entre colunas e acompanhe sua execução.
                </p>
              </div>

              {/* Kanban mini preview */}
              {kanbanAccessible && totalActions > 0 ? (
                <div className="flex gap-3 mt-auto pt-3 border-t" style={{ borderColor: 'rgba(6,182,212,0.12)' }}>
                  {[
                    { value: todoActions,  label: 'A Fazer',    color: 'text-white/50'   },
                    { value: doingActions, label: 'Em Andamento', color: 'text-cyan-400' },
                    { value: doneActions,  label: 'Concluídas',  color: 'text-emerald-400' },
                  ].map(s => (
                    <div key={s.label}>
                      <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                      <p className="text-[11px] text-white/35">{s.label}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-auto pt-3 border-t" style={{ borderColor: 'rgba(6,182,212,0.12)' }}>
                  <p className="text-xs text-white/30">
                    {kanbanAccessible ? 'Nenhuma ação criada ainda' : 'Complete as etapas anteriores para desbloquear'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Link>
      </div>

      {/* ── Suas Etapas ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white/90">Suas Etapas</h2>
            <p className="text-sm text-white/35">{completedSteps} de 4 concluídas</p>
          </div>
          {/* Progress inline */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-32 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div
                className="h-full rounded-full progress-bar-teal transition-all duration-1000"
                style={{ width: `${progress.overallProgress}%` }}
              />
            </div>
            <span className="text-sm font-bold brand-gradient-text">{progress.overallProgress}%</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {journeySteps.map((step) => {
            const Icon = step.icon;
            const isAccessible = step.id <= progress.currentStep;
            const isCurrent = step.id === progress.currentStep;

            return (
              <Link key={step.id} href={isAccessible ? step.path : '#'} className={!isAccessible ? 'pointer-events-none' : ''}>
                <div className={`
                  relative overflow-hidden rounded-2xl border p-5 h-full transition-all duration-300
                  ${isCurrent
                    ? 'hover:border-teal-500/40 hover:-translate-y-1'
                    : isAccessible
                    ? 'hover:border-white/15 hover:-translate-y-1'
                    : 'opacity-30 cursor-default'
                  }
                `}
                  style={{
                    background: isCurrent
                      ? 'linear-gradient(145deg, rgba(13,148,136,0.1) 0%, rgba(6,182,212,0.04) 100%)'
                      : 'rgba(255,255,255,0.02)',
                    borderColor: isCurrent ? 'rgba(13,148,136,0.3)' : 'rgba(255,255,255,0.06)',
                    boxShadow: isCurrent ? '0 0 0 1px rgba(13,148,136,0.12), 0 12px 32px rgba(13,148,136,0.12)' : 'none',
                  }}
                >
                  {/* Current pulse */}
                  {isCurrent && (
                    <span className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold text-teal-400 uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                      Atual
                    </span>
                  )}

                  <div
                    className={`w-11 h-11 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-br ${step.completed ? 'from-emerald-500 to-teal-600' : step.color}`}
                    style={{ boxShadow: `0 6px 16px ${step.completed ? 'rgba(16,185,129,0.25)' : step.glow}` }}
                  >
                    {step.completed
                      ? <CheckCircle2 className="w-5.5 h-5.5 text-white" />
                      : <Icon className="w-5.5 h-5.5 text-white" />
                    }
                  </div>

                  <p className="text-[10px] font-bold tracking-widest text-white/25 uppercase mb-1">Etapa 0{step.id}</p>
                  <h3 className="font-bold text-white/90 text-sm mb-0.5">{step.title}</h3>
                  <p className="text-xs text-white/35 mb-4">{step.desc}</p>

                  <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border
                    ${step.completed
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                      : isCurrent
                      ? 'text-teal-400 bg-teal-500/10 border-teal-500/20'
                      : 'text-white/25 bg-white/3 border-white/6'
                    }`}
                  >
                    {step.completed
                      ? <><CircleCheck className="w-3 h-3" /> Concluído</>
                      : isCurrent
                      ? <><span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" /> Em andamento</>
                      : <>Bloqueado</>
                    }
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}
