'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X, Plus, ArrowRight, ArrowLeft, TrendingUp, BookOpen, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Step2FormProps {
  initialCareerGoals: any;
  initialQualificationNeeds: any;
  userId: string;
}

export function Step2Form({
  initialCareerGoals,
  initialQualificationNeeds,
  userId,
}: Step2FormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [careerGoals, setCareerGoals] = useState({
    desiredRole: initialCareerGoals?.desiredRole || '',
    desiredSalary: initialCareerGoals?.desiredSalary || '',
    roleRequirements: initialCareerGoals?.roleRequirements || [],
    targetCompanies: initialCareerGoals?.targetCompanies || [],
    requiredCertifications: initialCareerGoals?.requiredCertifications || [],
  });

  const [qualificationNeeds, setQualificationNeeds] = useState({
    knowledgeNeeded: initialQualificationNeeds?.knowledgeNeeded || [],
    skillsNeeded: initialQualificationNeeds?.skillsNeeded || [],
    coursesNeeded: initialQualificationNeeds?.coursesNeeded || [],
  });

  const [newItems, setNewItems] = useState({
    roleRequirements: '',
    targetCompanies: '',
    requiredCertifications: '',
    knowledgeNeeded: '',
    skillsNeeded: '',
    coursesNeeded: '',
  });

  const addGoalItem = (field: 'roleRequirements' | 'targetCompanies' | 'requiredCertifications') => {
    const value = newItems[field].trim();
    if (!value) return;

    setCareerGoals((prev) => ({
      ...prev,
      [field]: [...prev[field], value],
    }));
    setNewItems((prev) => ({ ...prev, [field]: '' }));
  };

  const addNeedItem = (field: keyof typeof qualificationNeeds) => {
    const value = newItems[field].trim();
    if (!value) return;

    setQualificationNeeds((prev) => ({
      ...prev,
      [field]: [...prev[field], value],
    }));
    setNewItems((prev) => ({ ...prev, [field]: '' }));
  };

  const removeGoalItem = (field: 'roleRequirements' | 'targetCompanies' | 'requiredCertifications', index: number) => {
    setCareerGoals((prev) => ({
      ...prev,
      [field]: prev[field].filter((_: any, i: number) => i !== index),
    }));
  };

  const removeNeedItem = (field: keyof typeof qualificationNeeds, index: number) => {
    setQualificationNeeds((prev) => ({
      ...prev,
      [field]: prev[field].filter((_: any, i: number) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setSaveSuccess(false);

    try {
      const response = await fetch('/api/step2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          careerGoals,
          qualificationNeeds,
        }),
      });

      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => {
          router.push('/step3');
          router.refresh();
        }, 1000);
      }
    } catch (error) {
      console.error('Error saving step 2:', error);
      alert('Erro ao salvar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reusable tag field renderer
  const TagField = ({
    fieldKey,
    items,
    placeholder,
    onAdd,
    onRemove,
  }: {
    fieldKey: string;
    items: string[];
    placeholder: string;
    onAdd: () => void;
    onRemove: (i: number) => void;
  }) => (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={newItems[fieldKey as keyof typeof newItems]}
          onChange={(e) => setNewItems((prev) => ({ ...prev, [fieldKey]: e.target.value }))}
          placeholder={placeholder}
          className="premium-input h-11 flex-1"
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); onAdd(); }
          }}
        />
        <button
          type="button"
          onClick={onAdd}
          className="h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all hover:opacity-80"
          style={{
            background: 'rgba(0,151,167,0.15)',
            border: '1px solid rgba(0,151,167,0.25)',
            color: 'rgb(20,184,166)',
          }}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      {items.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item: string, index: number) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold"
              style={{
                background: 'rgba(0,151,167,0.1)',
                border: '1px solid rgba(0,151,167,0.2)',
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              {item}
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="transition-colors text-white/30 hover:text-white/70"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-white/30 italic">Pressione Enter ou + para adicionar</p>
      )}
    </div>
  );

  return (
    <div className="space-y-6">

      {/* Section 1: Objetivo de Carreira */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.015)' }}
      >
        {/* Section header */}
        <div
          className="px-5 py-3.5 flex items-center gap-3"
          style={{ background: 'rgba(0,151,167,0.07)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="w-2 h-2 rounded-full" style={{ background: 'rgba(20,184,166,1)' }} />
          <p className="text-sm font-bold text-white/80">Objetivo de Carreira</p>
          <TrendingUp className="w-3.5 h-3.5 text-white/30 ml-auto" />
        </div>

        <div className="px-5 py-5 space-y-5">
          {/* Desired role + salary */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-white/60">Cargo Desejado</Label>
              <Input
                value={careerGoals.desiredRole}
                onChange={(e) => setCareerGoals((prev) => ({ ...prev, desiredRole: e.target.value }))}
                placeholder="Ex: Diretor de TI"
                className="premium-input h-11"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-white/60">Salário Desejado</Label>
              <Input
                value={careerGoals.desiredSalary}
                onChange={(e) => setCareerGoals((prev) => ({ ...prev, desiredSalary: e.target.value }))}
                placeholder="Ex: R$ 20.000"
                className="premium-input h-11"
              />
            </div>
          </div>

          {/* Tag fields */}
          {[
            {
              key: 'roleRequirements' as const,
              label: 'Requisitos do Cargo',
              placeholder: 'Ex: Experiência em gestão de equipes',
            },
            {
              key: 'targetCompanies' as const,
              label: 'Empresas com este Cargo',
              placeholder: 'Ex: Google, Amazon, Microsoft',
            },
            {
              key: 'requiredCertifications' as const,
              label: 'Formações ou Certificações do Cargo',
              placeholder: 'Ex: MBA, PMP',
            },
          ].map((field) => (
            <div key={field.key} className="space-y-2">
              <Label className="text-sm font-semibold text-white/60">{field.label}</Label>
              <TagField
                fieldKey={field.key}
                items={careerGoals[field.key]}
                placeholder={field.placeholder}
                onAdd={() => addGoalItem(field.key)}
                onRemove={(i) => removeGoalItem(field.key, i)}
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Section 2: O que Preciso Aprender */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.08 }}
        className="rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.015)' }}
      >
        {/* Section header */}
        <div
          className="px-5 py-3.5 flex items-center gap-3"
          style={{ background: 'rgba(0,151,167,0.07)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="w-2 h-2 rounded-full" style={{ background: 'rgba(20,184,166,1)' }} />
          <p className="text-sm font-bold text-white/80">O que Preciso Aprender</p>
          <BookOpen className="w-3.5 h-3.5 text-white/30 ml-auto" />
        </div>

        <div className="px-5 py-5 space-y-5">
          {[
            {
              key: 'knowledgeNeeded' as const,
              label: 'Conhecimentos que preciso',
              placeholder: 'Ex: Cloud Computing, AI/ML',
            },
            {
              key: 'skillsNeeded' as const,
              label: 'Habilidades que preciso',
              placeholder: 'Ex: Negociação, Liderança de Times',
            },
            {
              key: 'coursesNeeded' as const,
              label: 'Cursos ou Certificações',
              placeholder: 'Ex: AWS Solutions Architect',
            },
          ].map((field) => (
            <div key={field.key} className="space-y-2">
              <Label className="text-sm font-semibold text-white/60">{field.label}</Label>
              <TagField
                fieldKey={field.key}
                items={qualificationNeeds[field.key]}
                placeholder={field.placeholder}
                onAdd={() => addNeedItem(field.key)}
                onRemove={(i) => removeNeedItem(field.key, i)}
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Footer nav */}
      <div className="flex justify-between items-center pt-2">
        <Button
          variant="outline"
          onClick={() => router.push('/step1')}
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
            <>Salvar e Continuar <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" /></>
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
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-sm font-bold text-white/90">Etapa 2 concluída</p>
              <p className="text-xs text-white/45">Indo para Mapeamento de Habilidades...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
