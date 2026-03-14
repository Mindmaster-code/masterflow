'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Shield, Lightbulb, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Step3SwotFormProps {
  initialSwotAnalysis: any;
  lowScoreSkills: string[];
  userId: string;
}

export function Step3SwotForm({
  initialSwotAnalysis,
  lowScoreSkills,
  userId,
}: Step3SwotFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [swot, setSwot] = useState({
    strengths: initialSwotAnalysis?.strengths || '',
    weaknesses: initialSwotAnalysis?.weaknesses || '',
    opportunities: initialSwotAnalysis?.opportunities || '',
    threats: initialSwotAnalysis?.threats || '',
    lowScoreSkills: lowScoreSkills,
    skillsToDevelop: initialSwotAnalysis?.skillsToDevelop || [],
    useStrengthsForOpportunities: initialSwotAnalysis?.useStrengthsForOpportunities || '',
    reduceWeaknessesAvoidThreats: initialSwotAnalysis?.reduceWeaknessesAvoidThreats || '',
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    setSaveSuccess(false);

    try {
      const response = await fetch('/api/step3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skills: null,
          swot,
        }),
      });

      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => {
          router.push('/step5');
          router.refresh();
        }, 1000);
      }
    } catch (error) {
      console.error('Error saving SWOT:', error);
      alert('Erro ao salvar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Low score skills info box */}
      {lowScoreSkills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(239,68,68,0.18)' }}
        >
          <div
            className="px-5 py-3.5 flex items-center gap-3"
            style={{ background: 'rgba(239,68,68,0.07)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: '#ef4444' }} />
            <p className="text-sm font-bold text-white/80">Habilidades com Baixa Pontuação</p>
            <span className="ml-auto text-xs text-white/30">da etapa anterior</span>
          </div>
          <div className="px-5 py-4" style={{ background: 'rgba(255,255,255,0.015)' }}>
            <p className="text-xs text-white/45 mb-3">
              Considere estas áreas ao preencher suas fraquezas e estratégias abaixo.
            </p>
            <div className="flex flex-wrap gap-2">
              {lowScoreSkills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs px-3 py-1.5 rounded-lg font-medium"
                  style={{
                    background: 'rgba(239,68,68,0.10)',
                    border: '1px solid rgba(239,68,68,0.22)',
                    color: '#fca5a5',
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* SWOT Matrix */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(255,255,255,0.07)' }}
      >
        {/* Section header */}
        <div
          className="px-5 py-3.5 flex items-center gap-3"
          style={{ background: 'rgba(13,148,136,0.07)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: 'rgba(13,148,136,1)' }} />
          <p className="text-sm font-bold text-white/80">Matriz SWOT</p>
          <span className="ml-auto text-xs text-white/30">análise estratégica</span>
        </div>

        {/* 2x2 Grid */}
        <div className="grid md:grid-cols-2" style={{ background: 'rgba(255,255,255,0.015)' }}>

          {/* Strengths — top-left */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-none overflow-hidden"
            style={{ borderRight: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div
              className="px-4 py-3 flex items-center gap-2"
              style={{ background: 'rgba(16,185,129,0.06)', borderLeft: '3px solid #10b981' }}
            >
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#10b981' }}>
                Forças · Strengths
              </p>
            </div>
            <div className="p-4">
              <p className="text-xs text-white/35 mb-3">O que você faz bem? Quais são seus diferenciais?</p>
              <Textarea
                id="strengths"
                value={swot.strengths}
                onChange={(e) => setSwot({ ...swot, strengths: e.target.value })}
                placeholder={"Liste suas forças e pontos fortes...\n\nEx:\n• 10 anos de experiência em gestão\n• Excelente relacionamento com stakeholders\n• Domínio de metodologias ágeis"}
                rows={8}
                className="premium-input text-sm resize-none"
                style={{ borderColor: 'rgba(16,185,129,0.15)' }}
              />
            </div>
          </motion.div>

          {/* Weaknesses — top-right */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-none overflow-hidden"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div
              className="px-4 py-3 flex items-center gap-2"
              style={{ background: 'rgba(239,68,68,0.06)', borderLeft: '3px solid #ef4444' }}
            >
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#ef4444' }}>
                Fraquezas · Weaknesses
              </p>
            </div>
            <div className="p-4">
              <p className="text-xs text-white/35 mb-3">O que precisa melhorar? Quais suas limitações?</p>
              <Textarea
                id="weaknesses"
                value={swot.weaknesses}
                onChange={(e) => setSwot({ ...swot, weaknesses: e.target.value })}
                placeholder={"Liste suas fraquezas e áreas de melhoria...\n\nEx:\n• Falta de certificações internacionais\n• Inglês técnico limitado\n• Pouca experiência em cloud"}
                rows={8}
                className="premium-input text-sm resize-none"
                style={{ borderColor: 'rgba(239,68,68,0.15)' }}
              />
            </div>
          </motion.div>

          {/* Opportunities — bottom-left */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-none overflow-hidden"
            style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div
              className="px-4 py-3 flex items-center gap-2"
              style={{ background: 'rgba(14,165,233,0.06)', borderLeft: '3px solid #0ea5e9' }}
            >
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#0ea5e9' }}>
                Oportunidades · Opportunities
              </p>
            </div>
            <div className="p-4">
              <p className="text-xs text-white/35 mb-3">Que oportunidades existem no mercado?</p>
              <Textarea
                id="opportunities"
                value={swot.opportunities}
                onChange={(e) => setSwot({ ...swot, opportunities: e.target.value })}
                placeholder={"Liste oportunidades no mercado...\n\nEx:\n• Crescimento do mercado de AI\n• Empresas buscando líderes digitais\n• Vagas remotas internacionais"}
                rows={8}
                className="premium-input text-sm resize-none"
                style={{ borderColor: 'rgba(14,165,233,0.15)' }}
              />
            </div>
          </motion.div>

          {/* Threats — bottom-right */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-none overflow-hidden"
          >
            <div
              className="px-4 py-3 flex items-center gap-2"
              style={{ background: 'rgba(245,158,11,0.06)', borderLeft: '3px solid #f59e0b' }}
            >
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#f59e0b' }}>
                Ameaças · Threats
              </p>
            </div>
            <div className="p-4">
              <p className="text-xs text-white/35 mb-3">Que ameaças ou desafios externos existem?</p>
              <Textarea
                id="threats"
                value={swot.threats}
                onChange={(e) => setSwot({ ...swot, threats: e.target.value })}
                placeholder={"Liste ameaças e desafios externos...\n\nEx:\n• Automação substituindo cargos\n• Competição internacional\n• Recessão econômica"}
                rows={8}
                className="premium-input text-sm resize-none"
                style={{ borderColor: 'rgba(245,158,11,0.15)' }}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Estratégias section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div
          className="px-5 py-3.5 flex items-center gap-3"
          style={{ background: 'rgba(99,102,241,0.07)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: 'rgba(99,102,241,1)' }} />
          <Lightbulb className="w-3.5 h-3.5 text-indigo-400" />
          <p className="text-sm font-bold text-white/80">Estratégias</p>
          <span className="ml-auto text-xs text-white/30">como transformar análise em ação</span>
        </div>

        <div className="divide-y divide-white/[0.04]" style={{ background: 'rgba(255,255,255,0.015)' }}>
          {/* Strategy 1 */}
          <div className="px-5 py-5">
            <Label htmlFor="useStrengths" className="text-sm font-semibold text-white/60 block mb-3">
              Como usar suas forças para aproveitar as oportunidades?
            </Label>
            <Textarea
              id="useStrengths"
              value={swot.useStrengthsForOpportunities}
              onChange={(e) => setSwot({ ...swot, useStrengthsForOpportunities: e.target.value })}
              placeholder="Ex: Usar minha experiência em gestão para liderar projetos de transformação digital que estão em alta demanda..."
              rows={4}
              className="premium-input text-sm resize-none"
            />
          </div>

          {/* Strategy 2 */}
          <div className="px-5 py-5">
            <Label htmlFor="reduceWeaknesses" className="text-sm font-semibold text-white/60 block mb-3">
              Como reduzir fraquezas e evitar ameaças?
            </Label>
            <Textarea
              id="reduceWeaknesses"
              value={swot.reduceWeaknessesAvoidThreats}
              onChange={(e) => setSwot({ ...swot, reduceWeaknessesAvoidThreats: e.target.value })}
              placeholder="Ex: Fazer certificação AWS para compensar falta de experiência em cloud e me proteger da automação..."
              rows={4}
              className="premium-input text-sm resize-none"
            />
          </div>
        </div>
      </motion.div>

      {/* Footer navigation */}
      <div className="flex justify-between items-center pt-2">
        <Button
          variant="outline"
          onClick={() => router.push('/step3')}
          className="h-11 px-6 rounded-xl text-sm text-white/50 hover:text-white border-white/10 hover:border-white/20 hover:bg-white/5"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Skills
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={isLoading || saveSuccess}
          className="premium-button h-11 px-8 rounded-xl text-sm font-semibold group"
        >
          {isLoading ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando...</>
          ) : saveSuccess ? (
            <><CheckCircle2 className="w-4 h-4 mr-2" /> Completo!</>
          ) : (
            <>Concluir Etapa 3 <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" /></>
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
            style={{
              background: 'rgba(6,13,24,0.97)',
              border: '1px solid rgba(16,185,129,0.3)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-white/90">Mapeamento completo!</p>
              <p className="text-xs text-white/45">Indo para Destino (OKRs)...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
