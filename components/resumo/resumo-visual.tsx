'use client';

import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
} from 'recharts';
import {
  Target, TrendingUp, CheckCircle2, AlertCircle, Lightbulb,
  Shield, Zap, Users, ArrowRight, Sparkles, Briefcase, Building2, Banknote,
} from 'lucide-react';
import { motion } from 'framer-motion';

const SALARY_LABELS: Record<string, string> = {
  BELOW_6K: 'Até R$ 6k',
  RANGE_6K_7K: 'R$ 6k – 7k',
  RANGE_7K_8K: 'R$ 7k – 8k',
  RANGE_8K_10K: 'R$ 8k – 10k',
  ABOVE_10K: 'Acima de R$ 10k',
};

interface ResumoVisualProps {
  progress: any; profile: any; qualification: any; careerGoals: any;
  qualificationNeeds?: any; skills: any[]; swotAnalysis: any;
  objectives: any[]; sprints: any[];
  totalInitiatives: number; completedInitiatives: number;
}

function formatSalary(val: string | number | undefined): string {
  if (val == null || val === '' || val === '-') return '-';
  const s = String(val).replace(/\D/g, '');
  if (!s) return String(val);
  const n = parseInt(s, 10);
  if (isNaN(n)) return String(val);
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n);
}

/* ── Section wrapper ── */
function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ── Card ── */
function Card({ children, className = '', style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`premium-card ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

/* ── Stat mini ── */
function StatMini({
  icon: Icon, label, value, color, bg, border, delay = 0,
}: {
  icon: any; label: string; value: string | number; color: string; bg: string; border: string; delay?: number;
}) {
  return (
    <Section delay={delay}>
      <Card style={{ borderColor: border }}>
        <div className="p-6">
          <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          <p className={`text-4xl font-bold ${color} mb-1`}>{value}</p>
          <p className="text-sm text-white/45">{label}</p>
        </div>
      </Card>
    </Section>
  );
}

export function ResumoVisual({
  progress, profile, qualification, careerGoals, qualificationNeeds,
  skills = [], swotAnalysis,
  objectives = [], sprints = [],
  totalInitiatives = 0, completedInitiatives = 0,
}: ResumoVisualProps) {
  const safeSkills = Array.isArray(skills) ? skills : [];

  const skillsByCategory = {
    Estratégica: safeSkills.filter(s => s?.name && ['Pensamento Estratégico','Análise de Dados','Gestão de Riscos','Gestão Financeira','Análise de Indicadores de Desempenho'].includes(s.name)),
    Técnica:     safeSkills.filter(s => s?.name && ['Gestão OKR','Scrum & Kanban','Design Thinking','Lean','Gestão de Backlog','Estimativas de Esforço','Inteligência Artificial'].includes(s.name)),
    Comunicação: safeSkills.filter(s => s?.name && ['Liderança','Comunicação Eficaz','Inteligência Emocional','Gestão de Pessoas'].includes(s.name)),
  };

  const avgByCategory = Object.entries(skillsByCategory).map(([category, cs]) => ({
    category,
    average: cs.length > 0 ? Math.round(cs.reduce((a, s) => a + (s?.score ?? 0), 0) / cs.length) : 0,
    fullMark: 10,
  }));

  const topSkills = [...safeSkills].sort((a, b) => (b?.score ?? 0) - (a?.score ?? 0)).slice(0, 5);
  const lowSkills = [...safeSkills].sort((a, b) => (a?.score ?? 0) - (b?.score ?? 0)).slice(0, 5);
  const completionRate = totalInitiatives > 0 ? Math.round((completedInitiatives / totalInitiatives) * 100) : 0;

  const journeyProgress = [
    { step: 'Ponto de Partida',   completed: progress?.step1Completed || false },
    { step: 'Auto-Conhecimento',  completed: progress?.step2Completed || false },
    { step: 'Mapeamento de Skills', completed: progress?.step3Completed || false },
    { step: 'Plano de Ação',      completed: progress?.step5Completed || false },
  ];
  const completedSteps = journeyProgress.filter(s => s.completed).length;

  const currentRole    = profile?.currentRole || qualification?.currentRole || '-';
  const currentCompany = profile?.currentCompany;
  const currentSalary  = profile?.salaryRange ? (SALARY_LABELS[profile.salaryRange] || profile.salaryRange) : (qualification?.salaryRange ? SALARY_LABELS[qualification.salaryRange] : '-');
  const desiredRole    = careerGoals?.desiredRole || '-';
  const desiredSalaryRaw = careerGoals?.desiredSalary || careerGoals?.targetSalary || '-';
  const desiredSalary  = formatSalary(desiredSalaryRaw) !== '-' ? formatSalary(desiredSalaryRaw) : desiredSalaryRaw;
  const hasEvolution   = (currentRole !== '-' || currentSalary !== '-') && (desiredRole !== '-' || desiredSalaryRaw !== '-');

  const courses        = qualificationNeeds?.coursesNeeded ?? [];
  const certifications = careerGoals?.requiredCertifications ?? [];
  const skillsToDevelop = swotAnalysis?.skillsToDevelop ?? [];
  const gapSkills      = lowSkills.slice(0, 4);

  function buildConsultantAnalysis() {
    const blocks: { title: string; content: string; icon: string }[] = [];
    const role = desiredRole !== '-' ? desiredRole : 'seu cargo desejado';
    const intro = desiredRole !== '-'
      ? `Com base no seu perfil e metas, preparei uma análise estratégica para sua transição para ${desiredRole}. Cada recomendação abaixo foi pensada para acelerar sua jornada.`
      : `Com base no seu perfil e metas, preparei uma análise estratégica para sua transição de carreira. Cada recomendação abaixo foi pensada para acelerar sua jornada.`;

    if (currentRole !== desiredRole && desiredRole !== '-') {
      blocks.push({ title: 'Sua trajetória', icon: '🎯',
        content: `A mudança de ${currentRole} para ${desiredRole} exige planejamento e execução consistente. Boa notícia: você já deu o primeiro passo ao mapear suas metas. O próximo é transformar intenção em ação — e isso se faz com pequenos avanços diários.` });
    }
    if (gapSkills.length > 0) {
      const skillNames = gapSkills.map((s: any) => s?.name).filter(Boolean);
      const hasAgile = skillNames.some((n: string) => /scrum|kanban|okr|design thinking|gestão ágil|gestao agil|lean|backlog|estimativa|agilidade/i.test(String(n).toLowerCase()));
      const content = hasAgile
        ? `Invista em ${skillNames.join(', ')}. Essas habilidades aparecem como diferenciais para ${role}. Para Scrum, Kanban, OKR, Design Thinking e Gestão Ágil, consulte os cursos da MindMaster Treinamentos. Dedique pelo menos 30 minutos por dia.`
        : `Invista em ${skillNames.join(', ')}. Essas habilidades aparecem como diferenciais para ${role}. Sugiro dedicar pelo menos 30 minutos por dia — a constância supera a intensidade esporádica.`;
      blocks.push({ title: 'Competências prioritárias', icon: '📈', content });
    }
    if (courses.length > 0) {
      const courseList = (Array.isArray(courses) ? courses : []).slice(0, 3);
      const hasAgile = courseList.some((c: string) => /scrum|kanban|okr|design thinking|gestão ágil|gestao agil|lean|backlog|estimativa|agilidade/i.test(String(c).toLowerCase()));
      const content = hasAgile
        ? `Cursos como ${courseList.join(', ')} alinham seu perfil ao que o mercado espera. Para Scrum, Kanban, OKR, Design Thinking e Gestão Ágil, consulte a MindMaster Treinamentos. Defina um prazo realista — um curso concluído vale mais que três iniciados.`
        : `Cursos como ${courseList.join(', ')} alinham seu perfil ao que o mercado espera. Defina um prazo realista e busque conteúdos de qualidade. Um curso concluído vale mais que três iniciados.`;
      blocks.push({ title: 'Formação que acelera', icon: '📚', content });
    }
    if (certifications.length > 0) {
      blocks.push({ title: 'Credibilidade no currículo', icon: '🏆',
        content: `As certificações ${(Array.isArray(certifications) ? certifications : []).slice(0, 2).join(', ')} reforçam sua expertise. Pesquise os requisitos, monte um cronograma de estudos e agende a prova.` });
    }
    if (skillsToDevelop.length > 0) {
      const devList = (Array.isArray(skillsToDevelop) ? skillsToDevelop : []).slice(0, 2);
      const hasAgile = devList.some((s: string) => /scrum|kanban|okr|design thinking|gestão ágil|gestao agil|lean|backlog|estimativa|agilidade/i.test(String(s).toLowerCase()));
      const content = hasAgile
        ? `Sua análise SWOT indicou ${devList.join(', ')} como áreas de desenvolvimento. Para Scrum, Kanban, OKR, Design Thinking e Gestão Ágil, consulte a MindMaster Treinamentos. Trabalhe essas competências em paralelo às demais ações.`
        : `Sua análise SWOT indicou ${devList.join(', ')} como áreas de desenvolvimento. Trabalhe essas competências em paralelo às demais ações.`;
      blocks.push({ title: 'Alinhado à sua SWOT', icon: '💡', content });
    }
    blocks.push({ title: 'LinkedIn e networking', icon: '🔗',
      content: 'Publique um artigo por semana sobre temas da sua área, conecte-se com 5 pessoas relevantes por semana e busque vagas diariamente. Networking gera oportunidades que o currículo sozinho não alcança.' });
    blocks.push({ title: 'Próximos passos', icon: '🚀',
      content: 'Revise seu Plano de Ação no Kanban e priorize as tarefas mais impactantes. Execute uma ação por dia. Em 90 dias, você verá a diferença.' });

    return { intro, blocks };
  }

  const analysis = buildConsultantAnalysis();

  /* ── Shared tooltip style ── */
  const tooltipStyle = {
    backgroundColor: 'rgba(6,14,28,0.95)',
    border: '1px solid rgba(13,148,136,0.25)',
    borderRadius: '12px',
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
  };

  return (
    <div className="space-y-6">

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatMini delay={0}    icon={Target}      label="Etapas Concluídas"  value={`${completedSteps}/4`} color="text-teal-400"    bg="bg-teal-500/15"    border="rgba(13,148,136,0.2)" />
        <StatMini delay={0.08} icon={CheckCircle2} label="Ações Concluídas"   value={completedInitiatives}  color="text-emerald-400" bg="bg-emerald-500/15" border="rgba(16,185,129,0.2)" />
        <StatMini delay={0.16} icon={Zap}          label="Ações Pendentes"    value={totalInitiatives - completedInitiatives} color="text-cyan-400"  bg="bg-cyan-500/15"   border="rgba(6,182,212,0.2)"  />
        <StatMini delay={0.24} icon={TrendingUp}   label="Taxa de Conclusão"  value={`${completionRate}%`}  color="text-sky-400"    bg="bg-sky-500/15"    border="rgba(14,165,233,0.2)" />
      </div>

      {/* ── Career Evolution ── */}
      {hasEvolution && (
        <Section delay={0.1}>
          <Card style={{ borderColor: 'rgba(13,148,136,0.2)' }}>
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl brand-gradient flex items-center justify-center shadow-xl" style={{ boxShadow: '0 8px 24px rgba(13,148,136,0.3)' }}>
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Evolução de Carreira</h2>
                  <p className="text-sm text-white/40">Sua trajetória do ponto de partida ao destino</p>
                </div>
              </div>

              {/* Before → After */}
              <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-6 items-center mb-8">
                {/* Current */}
                <div className="p-5 rounded-2xl border space-y-3" style={{ background: 'rgba(6,182,212,0.04)', borderColor: 'rgba(6,182,212,0.2)' }}>
                  <p className="text-xs font-bold uppercase tracking-widest text-cyan-400/70">Ponto de Partida</p>
                  {[
                    { icon: Briefcase, label: 'Cargo', value: currentRole },
                    ...(currentCompany ? [{ icon: Building2, label: 'Empresa', value: currentCompany }] : []),
                    { icon: Banknote, label: 'Faixa Salarial', value: currentSalary },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3">
                      <Icon className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-white/35">{label}</p>
                        <p className="font-semibold text-white/85 text-sm">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Arrow */}
                <div className="hidden md:flex flex-col items-center gap-2">
                  <div className="w-px h-12 gradient-line-vertical" />
                  <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                  <div className="w-px h-12 gradient-line-vertical" />
                </div>
                <div className="flex md:hidden justify-center">
                  <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center rotate-90">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Desired */}
                <div className="p-5 rounded-2xl border space-y-3" style={{ background: 'rgba(13,148,136,0.06)', borderColor: 'rgba(13,148,136,0.3)' }}>
                  <p className="text-xs font-bold uppercase tracking-widest text-teal-400">Destino</p>
                  {[
                    { icon: Target, label: 'Cargo Desejado', value: desiredRole },
                    { icon: Banknote, label: 'Salário Alvo', value: desiredSalary },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3">
                      <Icon className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-teal-400/50">{label}</p>
                        <p className="font-semibold text-teal-100 text-sm">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Consultant analysis */}
              {analysis.blocks.length > 0 && (
                <div className="pt-6 border-t" style={{ borderColor: 'rgba(13,148,136,0.15)' }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(234,179,8,0.12)', border: '1px solid rgba(234,179,8,0.25)' }}>
                      <Lightbulb className="w-4.5 h-4.5 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white/90">Análise e Sugestões para sua Transição</h3>
                      <p className="text-xs text-white/35">Consultoria de carreira personalizada</p>
                    </div>
                  </div>
                  <p className="text-sm text-white/60 italic leading-relaxed mb-4">{analysis.intro}</p>
                  <div className="space-y-3">
                    {analysis.blocks.map((block, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.07 }}
                        className="flex items-start gap-4 p-4 rounded-xl border transition-all hover:border-teal-500/20"
                        style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}
                      >
                        <span className="text-xl flex-shrink-0">{block.icon}</span>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-1">{block.title}</p>
                          <p className="text-sm text-white/70 leading-relaxed">{block.content}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </Section>
      )}

      {/* ── Charts Row ── */}
      <div className="grid md:grid-cols-2 gap-6">
        <Section delay={0.2}>
          <Card>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xl">📊</span>
                <h3 className="font-bold text-white/90">Radar de Habilidades</h3>
              </div>
              <p className="text-xs text-white/35 mb-4 ml-9">Média por categoria</p>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={avgByCategory}>
                  <PolarGrid stroke="rgba(13,148,136,0.12)" />
                  <PolarAngleAxis dataKey="category" tick={{ fill: 'rgba(255,255,255,0.65)', fontSize: 12, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} />
                  <Radar name="Nível" dataKey="average" stroke="#14B8A6" fill="#14B8A6" fillOpacity={0.25} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Section>

        <Section delay={0.25}>
          <Card>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xl">🏆</span>
                <h3 className="font-bold text-white/90">Top 5 Habilidades</h3>
              </div>
              <p className="text-xs text-white/35 mb-4 ml-9">Suas maiores forças</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topSkills} layout="vertical" margin={{ left: 110 }}>
                  <XAxis type="number" domain={[0, 10]} stroke="rgba(255,255,255,0.15)" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.65)', fontWeight: 600 }} width={105} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(13,148,136,0.05)' }} />
                  <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                    {topSkills.map((_, i) => <Cell key={i} fill={`hsl(${168 + i * 6}, 75%, ${48 - i * 3}%)`} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Section>
      </div>

      {/* ── Skills to Develop + Journey Progress ── */}
      <div className="grid md:grid-cols-2 gap-6">
        <Section delay={0.3}>
          <Card style={{ borderColor: 'rgba(239,68,68,0.15)' }}>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <AlertCircle className="w-4.5 h-4.5 text-red-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white/90">Skills para Desenvolver</h3>
                  <p className="text-xs text-white/35">Priorize estas habilidades</p>
                </div>
              </div>
              <div className="space-y-2.5">
                {lowSkills.map((skill, i) => (
                  <div key={skill?.id ?? i} className="flex justify-between items-center p-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.12)' }}>
                    <span className="text-sm font-medium text-white/80">{skill?.name ?? '-'}</span>
                    <span className="text-sm font-bold text-red-400 tabular-nums bg-red-500/10 px-2.5 py-0.5 rounded-lg">{skill?.score ?? 0}/10</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </Section>

        <Section delay={0.35}>
          <Card style={{ borderColor: 'rgba(13,148,136,0.18)' }}>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl brand-gradient flex items-center justify-center">
                  <TrendingUp className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white/90">Progresso da Jornada</h3>
                  <p className="text-xs text-white/35">Etapas completadas</p>
                </div>
              </div>
              <div className="space-y-3">
                {journeyProgress.map((step, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.025)' }}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold
                      ${step.completed ? 'brand-gradient text-white' : 'text-white/30'}
                    `} style={step.completed ? { boxShadow: '0 4px 12px rgba(13,148,136,0.25)' } : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      {step.completed ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                    </div>
                    <span className={`text-sm font-medium flex-1 ${step.completed ? 'text-white/85' : 'text-white/35'}`}>
                      {step.step}
                    </span>
                    {step.completed && (
                      <span className="text-xs font-semibold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
                        ✓ Completo
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </Section>
      </div>

      {/* ── SWOT ── */}
      {swotAnalysis && (
        <Section delay={0.4}>
          <Card style={{ borderColor: 'rgba(13,148,136,0.15)' }}>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl brand-gradient flex items-center justify-center">
                  <Shield className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white/90">Análise SWOT</h3>
                  <p className="text-xs text-white/35">Visão estratégica da sua carreira</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { key: 'strengths',    label: 'Forças',       icon: Zap,         color: 'text-emerald-400', border: 'rgba(16,185,129,0.25)', bg: 'rgba(16,185,129,0.06)' },
                  { key: 'weaknesses',   label: 'Fraquezas',    icon: AlertCircle, color: 'text-red-400',     border: 'rgba(239,68,68,0.25)',  bg: 'rgba(239,68,68,0.06)'  },
                  { key: 'opportunities',label: 'Oportunidades', icon: Lightbulb,  color: 'text-sky-400',     border: 'rgba(14,165,233,0.25)', bg: 'rgba(14,165,233,0.06)' },
                  { key: 'threats',      label: 'Ameaças',      icon: Shield,      color: 'text-orange-400',  border: 'rgba(249,115,22,0.25)', bg: 'rgba(249,115,22,0.06)' },
                ].map(({ key, label, icon: Icon, color, border, bg }) => (
                  <div key={key} className="p-5 rounded-2xl border" style={{ background: bg, borderColor: border }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className={`w-4.5 h-4.5 ${color}`} />
                      <h4 className={`font-bold text-sm ${color}`}>{label}</h4>
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
                      {swotAnalysis[key] || 'Não preenchido'}
                    </p>
                  </div>
                ))}
              </div>

              {swotAnalysis.weaknessStrategy && (
                <div className="mt-4 p-5 rounded-2xl border" style={{ background: 'rgba(13,148,136,0.04)', borderColor: 'rgba(13,148,136,0.2)' }}>
                  <h4 className="font-bold text-teal-400 text-sm mb-2">Estratégia de Desenvolvimento</h4>
                  <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">{swotAnalysis.weaknessStrategy}</p>
                </div>
              )}
            </div>
          </Card>
        </Section>
      )}

      {/* ── Overall Completion ── */}
      <Section delay={0.45}>
        <Card style={{ borderColor: 'rgba(13,148,136,0.18)' }}>
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl brand-gradient flex items-center justify-center">
                <CheckCircle2 className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white/90">Taxa de Conclusão Geral</h3>
                <p className="text-xs text-white/35">{completedInitiatives} de {totalInitiatives} ações concluídas</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-6xl md:text-7xl font-bold brand-gradient-text flex-shrink-0">
                {completionRate}%
              </div>
              <div className="flex-1">
                <div className="h-3 rounded-full overflow-hidden mb-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <motion.div
                    className="h-full rounded-full progress-bar-teal"
                    initial={{ width: 0 }}
                    animate={{ width: `${completionRate}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                  />
                </div>
                <div className="flex justify-between text-xs text-white/30">
                  <span>Início</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Section>

    </div>
  );
}
