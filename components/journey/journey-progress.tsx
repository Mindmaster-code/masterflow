'use client';

import { JOURNEY_STEPS } from '@/lib/constants';
import { Check, Lock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface JourneyProgressProps {
  currentStep: number;
  step1Completed: boolean;
  step2Completed: boolean;
  step3Completed: boolean;
  step4Completed: boolean;
  step5Completed: boolean;
  overallProgress: number;
}

const stepConfig = [
  { gradient: 'from-[#0097A7] to-[#00ACC1]', glow: 'rgba(0,151,167,0.4)', activeRing: 'rgba(0,151,167,0.25)' },
  { gradient: 'from-[#0097A7] to-[#9E9E9E]', glow: 'rgba(0,151,167,0.4)', activeRing: 'rgba(0,151,167,0.25)' },
  { gradient: 'from-[#9E9E9E] to-[#0097A7]', glow: 'rgba(158,158,158,0.4)', activeRing: 'rgba(158,158,158,0.25)' },
  { gradient: 'from-[#0097A7] to-[#4DD0E1]', glow: 'rgba(0,151,167,0.4)', activeRing: 'rgba(0,151,167,0.25)' },
];

export function JourneyProgress({
  currentStep,
  step1Completed,
  step2Completed,
  step3Completed,
  step4Completed,
  step5Completed,
  overallProgress,
}: JourneyProgressProps) {
  const completionStatus = [step1Completed, step2Completed, step3Completed, step5Completed];
  const completedCount = completionStatus.filter(Boolean).length;

  return (
    <div className="premium-card p-6 md:p-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white/90 mb-0.5">Sua Jornada Profissional</h2>
          <p className="text-sm text-white/40">Desenvolvimento de carreira executiva</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-2xl font-bold brand-gradient-text">{overallProgress}%</p>
          <p className="text-xs text-white/35 mt-0.5">{completedCount} de 4 etapas</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="relative h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <motion.div
            className="h-full rounded-full progress-bar-teal"
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between mt-1.5 text-xs text-white/25">
          <span>Início</span>
          <span>Completo</span>
        </div>
      </div>

      {/* Steps */}
      <div className="relative">
        {/* Connector line */}
        <div className="journey-step-line" />

        <div className="relative grid grid-cols-4 gap-3">
          {JOURNEY_STEPS.map((step, index) => {
            const isCompleted = completionStatus[index];
            const isCurrent = currentStep === step.id;
            const isLocked = index + 1 > currentStep;
            const cfg = stepConfig[index];

            return (
              <motion.div
                key={step.id}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Icon circle */}
                <div
                  className={`
                    relative z-10 w-16 h-16 md:w-18 md:h-18 rounded-2xl flex items-center justify-center
                    transition-all duration-500 mb-3
                    ${isCompleted
                      ? `bg-gradient-to-br from-[#0097A7] to-[#9E9E9E]`
                      : isCurrent
                      ? `bg-gradient-to-br ${cfg.gradient}`
                      : isLocked
                      ? 'opacity-35'
                      : `bg-gradient-to-br ${cfg.gradient} opacity-60`
                    }
                  `}
                  style={{
                    boxShadow: isCompleted
                      ? '0 8px 24px rgba(0,151,167,0.4)'
                      : isCurrent
                      ? `0 8px 24px ${cfg.glow}, 0 0 0 4px ${cfg.activeRing}`
                      : undefined,
                    background: isLocked ? 'rgba(255,255,255,0.04)' : undefined,
                    border: isLocked ? '1px solid rgba(255,255,255,0.06)' : undefined,
                  }}
                >
                  {isCompleted ? (
                    <Check className="w-8 h-8 text-white" strokeWidth={2.5} />
                  ) : isLocked ? (
                    <Lock className="w-6 h-6 text-white/30" />
                  ) : (
                    <span className="text-2xl font-bold text-white">{step.id}</span>
                  )}

                  {/* Current pulse ring */}
                  {isCurrent && (
                    <span className="absolute inset-0 rounded-2xl animate-teal-glow" />
                  )}
                </div>

                {/* Label */}
                <div className="text-center">
                  <p className={`text-xs md:text-sm font-semibold leading-tight mb-1.5
                    ${isCurrent ? 'text-[#0097A7]' : isCompleted ? 'text-white/70' : 'text-white/30'}
                  `}>
                    {step.shortLabel}
                  </p>

                  {isCurrent && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="px-2.5 py-1 rounded-full text-xs font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, #0097A7, #9E9E9E)' }}
                    >
                      ATUAL
                    </motion.div>
                  )}
                  {isCompleted && !isCurrent && (
                    <div className="px-2.5 py-1 rounded-full text-xs font-semibold text-[#0097A7] bg-[#0097A7]/10 border border-[#0097A7]/20">
                      ✓ Completo
                    </div>
                  )}
                  {isLocked && (
                    <div className="px-2.5 py-1 rounded-full text-xs font-medium text-white/25 bg-white/3">
                      Bloqueado
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer stats */}
      <div className="mt-8 pt-6 border-t grid grid-cols-3 gap-4 text-center" style={{ borderColor: 'rgba(0,151,167,0.12)' }}>
        {[
                  { value: completedCount, label: 'Concluídas', color: 'text-[#0097A7]' },
          { value: currentStep,    label: 'Etapa Atual', color: 'text-[#0097A7]'  },
          { value: 4 - completedCount, label: 'Restantes', color: 'text-[#9E9E9E]' },
        ].map(({ value, label, color }) => (
          <div key={label}>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-white/35 mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
