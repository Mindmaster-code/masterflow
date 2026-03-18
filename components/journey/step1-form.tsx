'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { X, Plus, ArrowRight, ArrowLeft, User, Briefcase, Target, Loader2, CheckCircle2 } from 'lucide-react';
import { SALARY_RANGES } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';

interface Step1FormProps {
  initialProfile: any;
  initialQualifications: any;
  initialChallenges: any;
  userId: string;
}

export function Step1Form({
  initialProfile,
  initialQualifications,
  initialChallenges,
  userId,
}: Step1FormProps) {
  const router = useRouter();
  const [currentSubStep, setCurrentSubStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [profile, setProfile] = useState({
    name: initialProfile?.name || '',
    currentRole: initialProfile?.currentRole || '',
    currentCompany: initialProfile?.currentCompany || '',
    timeInCompany: initialProfile?.timeInCompany || '',
    salaryRange: initialProfile?.salaryRange || 'BELOW_6K',
  });

  const [qualifications, setQualifications] = useState({
    academicFormation: initialQualifications?.academicFormation || [],
    formationCourses: initialQualifications?.formationCourses || [],
    techDomains: initialQualifications?.techDomains || [],
    certifications: initialQualifications?.certifications || [],
    otherRecognitions: initialQualifications?.otherRecognitions || [],
  });

  const [challenges, setChallenges] = useState({
    whatBothersMe: initialChallenges?.whatBothersMe || '',
    myMotivation: initialChallenges?.myMotivation || '',
    attitudesToWin: initialChallenges?.attitudesToWin || [],
  });

  const [newItems, setNewItems] = useState({
    academicFormation: '',
    formationCourses: '',
    techDomains: '',
    certifications: '',
    otherRecognitions: '',
    attitudesToWin: '',
  });

  const addItem = (field: keyof typeof qualifications | 'attitudesToWin') => {
    const value = newItems[field].trim();
    if (!value) return;

    if (field === 'attitudesToWin') {
      setChallenges((prev) => ({
        ...prev,
        attitudesToWin: [...prev.attitudesToWin, value],
      }));
    } else {
      setQualifications((prev) => ({
        ...prev,
        [field]: [...prev[field], value],
      }));
    }

    setNewItems((prev) => ({ ...prev, [field]: '' }));
  };

  const removeItem = (field: keyof typeof qualifications | 'attitudesToWin', index: number) => {
    if (field === 'attitudesToWin') {
      setChallenges((prev) => ({
        ...prev,
        attitudesToWin: prev.attitudesToWin.filter((_: any, i: number) => i !== index),
      }));
    } else {
      setQualifications((prev) => ({
        ...prev,
        [field]: prev[field].filter((_: any, i: number) => i !== index),
      }));
    }
  };

  const canProceedToNext = () => {
    if (currentSubStep === 1) {
      return profile.name && profile.currentRole && profile.salaryRange;
    }
    if (currentSubStep === 2) {
      return qualifications.academicFormation.length > 0 ||
             qualifications.formationCourses.length > 0 ||
             qualifications.techDomains.length > 0;
    }
    return challenges.whatBothersMe && challenges.myMotivation;
  };

  const handleNext = () => {
    if (currentSubStep < 3) {
      setCurrentSubStep(currentSubStep + 1);
    }
  };

  const handleBack = () => {
    if (currentSubStep > 1) {
      setCurrentSubStep(currentSubStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setSaveSuccess(false);

    try {
      const response = await fetch('/api/step1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          qualifications,
          challenges,
        }),
      });

      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => {
          router.push('/step2');
          router.refresh();
        }, 1000);
      }
    } catch (error) {
      console.error('Error saving step 1:', error);
      alert('Erro ao salvar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const subSteps = [
    { number: 1, label: 'Perfil Atual', icon: User },
    { number: 2, label: 'Qualificação', icon: Briefcase },
    { number: 3, label: 'Desafios', icon: Target },
  ];

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
            color: 'rgb(0,151,167)',
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

      {/* Sub-step pill tabs */}
      <div className="flex gap-2">
        {subSteps.map((step) => {
          const isActive = currentSubStep === step.number;
          const isCompleted = currentSubStep > step.number;
          return (
            <div
              key={step.number}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all"
              style={
                isActive
                  ? { background: 'rgba(0,151,167,0.15)', border: '1px solid rgba(0,151,167,0.3)', color: 'rgb(0,151,167)' }
                  : isCompleted
                  ? { background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: 'rgba(52,211,153,0.8)' }
                  : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.25)' }
              }
            >
              {isCompleted ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <span>{step.number}.</span>
              )}
              {step.label}
            </div>
          );
        })}
      </div>

      {/* Sub-step content */}
      <AnimatePresence mode="wait">

        {/* Sub-step 1: Perfil Atual */}
        {currentSubStep === 1 && (
          <motion.div
            key="substep1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            {/* Personal info section */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.015)' }}
            >
              <div
                className="px-5 py-3.5 flex items-center gap-3"
                style={{ background: 'rgba(0,151,167,0.07)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div className="w-2 h-2 rounded-full" style={{ background: 'rgba(20,184,166,1)' }} />
                <p className="text-sm font-bold text-white/80">Informações Pessoais</p>
              </div>

              <div className="px-5 py-5 space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-white/60">Nome Completo *</Label>
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Seu nome completo"
                    className="premium-input h-11"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-semibold text-white/60">Cargo Atual *</Label>
                    <Input
                      value={profile.currentRole}
                      onChange={(e) => setProfile((prev) => ({ ...prev, currentRole: e.target.value }))}
                      placeholder="Ex: Gerente de Projetos"
                      className="premium-input h-11"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-semibold text-white/60">Empresa Atual</Label>
                    <Input
                      value={profile.currentCompany}
                      onChange={(e) => setProfile((prev) => ({ ...prev, currentCompany: e.target.value }))}
                      placeholder="Nome da empresa"
                      className="premium-input h-11"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-white/60">Tempo na Empresa</Label>
                  <Input
                    value={profile.timeInCompany}
                    onChange={(e) => setProfile((prev) => ({ ...prev, timeInCompany: e.target.value }))}
                    placeholder="Ex: 2 anos e 6 meses"
                    className="premium-input h-11"
                  />
                </div>
              </div>
            </div>

            {/* Salary section */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.015)' }}
            >
              <div
                className="px-5 py-3.5 flex items-center gap-3"
                style={{ background: 'rgba(0,151,167,0.07)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div className="w-2 h-2 rounded-full" style={{ background: 'rgba(20,184,166,1)' }} />
                <p className="text-sm font-bold text-white/80">Faixa Salarial Atual *</p>
              </div>

              <div className="px-5 py-5">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {SALARY_RANGES.map((range) => {
                    const isSelected = profile.salaryRange === range.value;
                    return (
                      <button
                        key={range.value}
                        type="button"
                        onClick={() => setProfile((prev) => ({ ...prev, salaryRange: range.value as any }))}
                        className="rounded-xl p-4 text-sm font-semibold text-left transition-all"
                        style={
                          isSelected
                            ? {
                                border: '1px solid rgba(0,151,167,0.4)',
                                background: 'rgba(0,151,167,0.1)',
                                color: 'rgb(0,151,167)',
                              }
                            : {
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: 'transparent',
                                color: 'rgba(255,255,255,0.6)',
                              }
                        }
                      >
                        {range.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Sub-step 2: Qualificação */}
        {currentSubStep === 2 && (
          <motion.div
            key="substep2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.015)' }}
            >
              <div
                className="px-5 py-3.5 flex items-center gap-3"
                style={{ background: 'rgba(0,151,167,0.07)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div className="w-2 h-2 rounded-full" style={{ background: 'rgba(20,184,166,1)' }} />
                <p className="text-sm font-bold text-white/80">Qualificação Profissional</p>
              </div>

              <div className="px-5 py-5 space-y-6">
                {[
                  { key: 'academicFormation' as const, label: 'Formação Acadêmica', placeholder: 'Ex: MBA em Gestão Empresarial' },
                  { key: 'formationCourses' as const, label: 'Cursos de Formação', placeholder: 'Ex: Liderança Executiva' },
                  { key: 'techDomains' as const, label: 'Domínio Tecnológico', placeholder: 'Ex: Python, AWS, Docker' },
                  { key: 'certifications' as const, label: 'Certificações', placeholder: 'Ex: PMP, Scrum Master' },
                  { key: 'otherRecognitions' as const, label: 'Reconhecimentos', placeholder: 'Ex: Prêmio Inovação 2025' },
                ].map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label className="text-sm font-semibold text-white/60">{field.label}</Label>
                    <TagField
                      fieldKey={field.key}
                      items={qualifications[field.key]}
                      placeholder={field.placeholder}
                      onAdd={() => addItem(field.key)}
                      onRemove={(i) => removeItem(field.key, i)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Sub-step 3: Desafios */}
        {currentSubStep === 3 && (
          <motion.div
            key="substep3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            {/* Textareas section */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.015)' }}
            >
              <div
                className="px-5 py-3.5 flex items-center gap-3"
                style={{ background: 'rgba(0,151,167,0.07)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div className="w-2 h-2 rounded-full" style={{ background: 'rgba(20,184,166,1)' }} />
                <p className="text-sm font-bold text-white/80">Contexto e Motivação</p>
              </div>

              <div className="px-5 py-5 space-y-5">
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-white/60">
                    O que mais te incomoda na carreira atual? *
                  </Label>
                  <Textarea
                    value={challenges.whatBothersMe}
                    onChange={(e) => setChallenges((prev) => ({ ...prev, whatBothersMe: e.target.value }))}
                    placeholder="Descreva seus principais desafios e o que te incomoda na sua carreira atual..."
                    rows={5}
                    className="premium-input resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-white/60">
                    Qual sua motivação para esta jornada? *
                  </Label>
                  <Textarea
                    value={challenges.myMotivation}
                    onChange={(e) => setChallenges((prev) => ({ ...prev, myMotivation: e.target.value }))}
                    placeholder="O que te motiva a buscar desenvolvimento profissional agora..."
                    rows={5}
                    className="premium-input resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Attitudes section */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.015)' }}
            >
              <div
                className="px-5 py-3.5 flex items-center gap-3"
                style={{ background: 'rgba(0,151,167,0.07)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div className="w-2 h-2 rounded-full" style={{ background: 'rgba(20,184,166,1)' }} />
                <p className="text-sm font-bold text-white/80">Atitudes para vencer os desafios</p>
              </div>

              <div className="px-5 py-5 space-y-2">
                <Label className="text-sm font-semibold text-white/60">Atitudes para vencer os desafios</Label>
                <TagField
                  fieldKey="attitudesToWin"
                  items={challenges.attitudesToWin}
                  placeholder="Ex: Dedicar 2h por dia aos estudos"
                  onAdd={() => addItem('attitudesToWin')}
                  onRemove={(i) => removeItem('attitudesToWin', i)}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer nav */}
      <div className="flex justify-between items-center pt-2">
        <Button
          variant="outline"
          onClick={currentSubStep === 1 ? () => router.push('/dashboard') : handleBack}
          className="h-11 px-6 rounded-xl text-sm text-white/50 hover:text-white border-white/10 hover:border-white/20 hover:bg-white/5"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {currentSubStep === 1 ? 'Dashboard' : 'Voltar'}
        </Button>

        {currentSubStep < 3 ? (
          <Button
            onClick={handleNext}
            disabled={!canProceedToNext()}
            className="premium-button h-11 px-8 rounded-xl text-sm font-semibold group"
          >
            Próximo
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !canProceedToNext()}
            className="premium-button h-11 px-8 rounded-xl text-sm font-semibold group"
          >
            {isLoading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando...</>
            ) : saveSuccess ? (
              <><CheckCircle2 className="w-4 h-4 mr-2" /> Salvo!</>
            ) : (
              <>Concluir Etapa 1 <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" /></>
            )}
          </Button>
        )}
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
              <p className="text-sm font-bold text-white/90">Ponto de Partida concluído</p>
              <p className="text-xs text-white/45">Indo para Auto-Conhecimento...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
