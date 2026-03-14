'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DEFAULT_SKILLS } from '@/lib/constants';
import {
  ArrowRight, ArrowLeft, Loader2, CheckCircle2,
  TrendingUp, AlertTriangle, BarChart3,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RadarChart, PolarGrid, PolarAngleAxis,
  Radar, ResponsiveContainer, Tooltip,
} from 'recharts';

interface Step3FormProps {
  initialSkills: any[];
  userId: string;
}

const CATEGORY_META: Record<string, { label: string; accent: string; bg: string }> = {
  STRATEGIC: {
    label: 'Competências Estratégicas',
    accent: 'rgba(13,148,136,1)',
    bg: 'rgba(13,148,136,0.07)',
  },
  TECHNICAL: {
    label: 'Competências Técnicas',
    accent: 'rgba(99,102,241,1)',
    bg: 'rgba(99,102,241,0.07)',
  },
  COMMUNICATION: {
    label: 'Competências Relacionais',
    accent: 'rgba(20,184,166,1)',
    bg: 'rgba(20,184,166,0.07)',
  },
};

const ABBR: Record<string, string> = {
  'Pensamento Estratégico': 'P. Estratégico',
  'Análise de Dados': 'Dados',
  'Gestão de Riscos': 'G. Riscos',
  'Gestão Financeira': 'G. Financeira',
  'Análise de Indicadores de Desempenho': 'KPIs',
  'Gestão OKR': 'OKR',
  'Scrum & Kanban': 'Scrum',
  'Design Thinking': 'Design',
  'Lean': 'Lean',
  'Gestão de Backlog': 'Backlog',
  'Estimativas de Esforço': 'Estimativas',
  'Inteligência Artificial': 'IA',
  'Liderança': 'Liderança',
  'Comunicação Eficaz': 'Comunicação',
  'Inteligência Emocional': 'Int. Emocional',
  'Gestão de Pessoas': 'G. Pessoas',
};

function getScoreMeta(s: number): { label: string; color: string; barColor: string } {
  if (s <= 2) return { label: 'Iniciante',     color: '#ef4444', barColor: '#ef4444' };
  if (s <= 4) return { label: 'Básico',         color: '#f97316', barColor: '#f97316' };
  if (s <= 6) return { label: 'Intermediário',  color: '#eab308', barColor: '#eab308' };
  if (s <= 8) return { label: 'Avançado',       color: '#14b8a6', barColor: '#14b8a6' };
  return       { label: 'Expert',               color: '#10b981', barColor: '#10b981' };
}

function ScorePicker({ score, onChange }: { score: number; onChange: (v: number) => void }) {
  const { color } = getScoreMeta(score);
  return (
    <div className="flex gap-1 mt-2">
      {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className="w-[9%] aspect-square rounded text-[11px] font-bold transition-all focus:outline-none hover:scale-110"
          style={{
            background: n <= score ? color : 'rgba(255,255,255,0.06)',
            color: n <= score ? '#fff' : 'rgba(255,255,255,0.25)',
            border: n === score ? `2px solid ${color}` : '2px solid transparent',
            boxShadow: n === score ? `0 0 8px ${color}55` : 'none',
          }}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

const CustomRadarTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const { skill, value } = payload[0].payload;
  const meta = getScoreMeta(value);
  return (
    <div className="px-3 py-2 rounded-lg text-xs"
      style={{ background: 'rgba(6,13,24,0.95)', border: '1px solid rgba(13,148,136,0.25)' }}>
      <p className="font-bold text-white/80 mb-0.5">{skill}</p>
      <p style={{ color: meta.color }}>{value}/10 · {meta.label}</p>
    </div>
  );
};

export function Step3Form({ initialSkills, userId }: Step3FormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [skills, setSkills] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    Object.values(DEFAULT_SKILLS).flat().forEach(skill => {
      const existing = initialSkills.find(s => s.name === skill);
      map[skill] = existing?.score ?? 5;
    });
    return map;
  });

  const setScore = (skill: string, score: number) =>
    setSkills(prev => ({ ...prev, [skill]: score }));

  // Radar data
  const radarData = useMemo(() =>
    Object.values(DEFAULT_SKILLS).flat().map(skill => ({
      skill: ABBR[skill] ?? skill,
      fullName: skill,
      value: skills[skill],
    }))
  , [skills]);

  // Stats
  const allScores = Object.values(skills);
  const avg = (allScores.reduce((a, b) => a + b, 0) / allScores.length);
  const avgDisplay = avg.toFixed(1);
  const weak = Object.entries(skills)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 3);
  const strong = Object.entries(skills)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/step3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills, swot: null }),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => { router.push('/step3-swot'); router.refresh(); }, 900);
      }
    } catch {
      alert('Erro ao salvar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Legend */}
      <div className="grid grid-cols-5 gap-2">
        {[
          { range: '1–2', label: 'Iniciante', color: '#ef4444' },
          { range: '3–4', label: 'Básico', color: '#f97316' },
          { range: '5–6', label: 'Intermediário', color: '#eab308' },
          { range: '7–8', label: 'Avançado', color: '#14b8a6' },
          { range: '9–10', label: 'Expert', color: '#10b981' },
        ].map(({ range, label, color }) => (
          <div key={range} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
            style={{ background: `${color}10`, border: `1px solid ${color}25` }}>
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
            <div>
              <p className="text-[11px] font-bold leading-none" style={{ color }}>{range}</p>
              <p className="text-[10px] text-white/35 leading-none mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main layout: skills left + radar right */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">

        {/* Left: skill categories */}
        <div className="space-y-5">
          {Object.entries(DEFAULT_SKILLS).map(([category, skillList]) => {
            const meta = CATEGORY_META[category];
            return (
              <div key={category} className="rounded-2xl overflow-hidden"
                style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                {/* Category header */}
                <div className="px-5 py-3.5 flex items-center gap-3"
                  style={{ background: meta.bg, borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: meta.accent }} />
                  <p className="text-sm font-bold text-white/80">{meta.label}</p>
                  <span className="ml-auto text-xs text-white/30">{skillList.length} habilidades</span>
                </div>

                {/* Skill rows */}
                <div className="divide-y divide-white/[0.04]" style={{ background: 'rgba(255,255,255,0.015)' }}>
                  {skillList.map((skill, idx) => {
                    const score = skills[skill];
                    const { label, color } = getScoreMeta(score);
                    return (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.03, duration: 0.3 }}
                        className="px-5 py-4"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-sm font-semibold text-white/80">{skill}</p>
                          <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                            <span className="text-xs font-medium" style={{ color }}>{label}</span>
                            <span className="text-lg font-bold tabular-nums" style={{ color }}>{score}<span className="text-xs text-white/30 font-normal">/10</span></span>
                          </div>
                        </div>
                        <ScorePicker score={score} onChange={v => setScore(skill, v)} />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: sticky radar + summary */}
        <div className="lg:sticky lg:top-20 space-y-4">

          {/* Radar chart */}
          <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
              <BarChart3 className="w-3.5 h-3.5" />
              Perfil de Competências
            </p>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="72%">
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis
                  dataKey="skill"
                  tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 9, fontWeight: 500 }}
                />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="#0D9488"
                  fill="#0D9488"
                  fillOpacity={0.18}
                  strokeWidth={1.5}
                  dot={{ r: 2.5, fill: '#0D9488', strokeWidth: 0 }}
                />
                <Tooltip content={<CustomRadarTooltip />} />
              </RadarChart>
            </ResponsiveContainer>

            {/* Average score */}
            <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-xs text-white/40">Média geral</span>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-bold brand-gradient-text">{avgDisplay}</span>
                <span className="text-xs text-white/30">/10</span>
              </div>
            </div>
          </div>

          {/* Weak skills */}
          {weak.some(([, s]) => s <= 5) && (
            <div className="rounded-2xl p-4" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
              <p className="text-xs font-bold text-red-400/80 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Prioridade de Desenvolvimento
              </p>
              <div className="space-y-2">
                {weak.map(([skill, score]) => {
                  const { color } = getScoreMeta(score);
                  return (
                    <div key={skill} className="flex items-center justify-between">
                      <p className="text-xs text-white/60 truncate mr-2">{skill}</p>
                      <span className="text-xs font-bold flex-shrink-0" style={{ color }}>{score}/10</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Strong skills */}
          {strong.some(([, s]) => s >= 7) && (
            <div className="rounded-2xl p-4" style={{ background: 'rgba(13,148,136,0.05)', border: '1px solid rgba(13,148,136,0.15)' }}>
              <p className="text-xs font-bold text-teal-400/80 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                Pontos Fortes
              </p>
              <div className="space-y-2">
                {strong.map(([skill, score]) => {
                  const { color } = getScoreMeta(score);
                  return (
                    <div key={skill} className="flex items-center justify-between">
                      <p className="text-xs text-white/60 truncate mr-2">{skill}</p>
                      <span className="text-xs font-bold flex-shrink-0" style={{ color }}>{score}/10</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Save button (sidebar shortcut on desktop) */}
          <button
            onClick={handleSubmit}
            disabled={isLoading || saveSuccess}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hidden lg:flex items-center justify-center gap-2"
            style={{ background: saveSuccess ? 'rgba(16,185,129,0.2)' : 'rgba(13,148,136,0.15)', border: `1px solid ${saveSuccess ? 'rgba(16,185,129,0.3)' : 'rgba(13,148,136,0.25)'}` }}
          >
            {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Salvando...</> :
             saveSuccess ? <><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Salvo!</> :
             <><CheckCircle2 className="w-4 h-4 text-teal-400" /> Salvar mapeamento</>}
          </button>
        </div>
      </div>

      {/* Footer nav */}
      <div className="flex justify-between items-center pt-2">
        <Button
          variant="outline"
          onClick={() => router.push('/step2')}
          className="h-11 px-6 rounded-xl text-sm text-white/50 hover:text-white border-white/10 hover:border-white/20 hover:bg-white/5"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Etapa anterior
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={isLoading || saveSuccess}
          className="premium-button h-11 px-8 rounded-xl text-sm font-semibold group"
        >
          {isLoading ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando...</>
          ) : saveSuccess ? (
            <><CheckCircle2 className="w-4 h-4 mr-2" /> Salvo!</>
          ) : (
            <>Salvar e ir para SWOT <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" /></>
          )}
        </Button>
      </div>

      {/* Success toast */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 right-8 flex items-center gap-3 px-5 py-4 rounded-2xl z-50"
            style={{ background: 'rgba(6,13,24,0.97)', border: '1px solid rgba(16,185,129,0.3)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-sm font-bold text-white/90">Mapeamento salvo</p>
              <p className="text-xs text-white/45">Indo para a Análise SWOT...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
