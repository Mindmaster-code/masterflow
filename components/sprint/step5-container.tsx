'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Rocket, Calendar, CheckCircle, Lightbulb, ArrowRight, ArrowLeft } from 'lucide-react';
import { SprintPlanning } from './sprint-planning';
import { KanbanBoard } from './kanban-board';
import { SprintReview } from './sprint-review';
import { Retrospective } from './retrospective';
import { motion, AnimatePresence } from 'framer-motion';

interface InitiativeData {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: number;
  quadrant: number | null;
  startDate: string | null;
  endDate: string | null;
}

interface SprintData {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  initiativeIds: string[];
}

interface Step5ContainerProps {
  initiativesData: InitiativeData[];
  sprintsData: SprintData[];
}

type FlowStep = 'backlog' | 'sprint-planning' | 'kanban' | 'review' | 'retrospective';

export function Step5Container({ initiativesData, sprintsData }: Step5ContainerProps) {
  const router = useRouter();
  const [currentFlow, setCurrentFlow] = useState<FlowStep>('backlog');

  const initiatives = initiativesData.map(i => ({
    ...i,
    status: i.status as 'BACKLOG' | 'SPRINT' | 'TODO' | 'DOING' | 'DONE',
    startDate: i.startDate ? new Date(i.startDate) : null,
    endDate: i.endDate ? new Date(i.endDate) : null,
  }));

  const sprints = sprintsData.map(s => ({
    ...s,
    startDate: new Date(s.startDate),
    endDate: new Date(s.endDate),
  }));

  const backlogInitiatives = initiatives.filter(i => i.status === 'BACKLOG');
  const sprintInitiatives = initiatives.filter(i => 
    i.status === 'TODO' || i.status === 'DOING' || i.status === 'DONE'
  );

  const activeSprint = sprints.find(s => s.status === 'ACTIVE');
  const hasActiveSprint = !!activeSprint;
  const hasCompletedInitiatives = sprintInitiatives.some(i => i.status === 'DONE');

  useEffect(() => {
    if (hasActiveSprint) {
      setCurrentFlow('kanban');
    }
  }, [hasActiveSprint]);

  const handleRefresh = () => {
    router.refresh();
  };

  const flowSteps = [
    { id: 'backlog', label: 'Backlog', icon: Rocket, enabled: true },
    { id: 'sprint-planning', label: 'Criar Sprint', icon: Calendar, enabled: backlogInitiatives.length > 0 },
    { id: 'kanban', label: 'Kanban', icon: Calendar, enabled: hasActiveSprint },
    { id: 'review', label: 'Review', icon: CheckCircle, enabled: hasCompletedInitiatives },
    { id: 'retrospective', label: 'Retrospectiva', icon: Lightbulb, enabled: hasCompletedInitiatives },
  ];

  return (
    <div className="space-y-8">
      <Card className="premium-card border-primary/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {flowSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentFlow === step.id;
              const isEnabled = step.enabled;
              
              return (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => isEnabled && setCurrentFlow(step.id as FlowStep)}
                    disabled={!isEnabled}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                      isActive 
                        ? 'premium-gradient text-white scale-110 shadow-2xl' 
                        : isEnabled 
                          ? 'glass-premium hover:bg-white/10 cursor-pointer'
                          : 'opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-sm font-bold">{step.label}</span>
                  </button>
                  {index < flowSteps.length - 1 && (
                    <ArrowRight className="w-6 h-6 mx-3 text-foreground/30" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentFlow}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentFlow === 'backlog' && (
            <Card className="premium-card border-blue-500/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-3xl mb-2">Backlog de Iniciativas</CardTitle>
                    <CardDescription className="text-base">
                      {backlogInitiatives.length} iniciativas disponíveis
                    </CardDescription>
                  </div>
                  {backlogInitiatives.length > 0 && (
                    <Button 
                      className="premium-button rounded-xl h-14 px-8 text-base"
                      onClick={() => setCurrentFlow('sprint-planning')}
                    >
                      <Rocket className="w-5 h-5 mr-2" />
                      Criar Sprint
                    </Button>
                  )}
                </div>
              </CardHeader>
              {backlogInitiatives.length === 0 ? (
                <CardContent className="text-center py-24">
                  <Rocket className="w-24 h-24 mx-auto mb-6 text-foreground/20" />
                  <p className="text-foreground/60 text-2xl font-semibold mb-3">Nenhuma iniciativa no backlog</p>
                  <p className="text-foreground/40 text-lg mb-6">Complete o Mapeamento para gerar ações</p>
                  <Button 
                    variant="outline" 
                    onClick={() => router.push('/step3-swot')}
                    className="glass-premium h-12 px-6"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Voltar para Mapeamento
                  </Button>
                </CardContent>
              ) : (
                <CardContent className="pb-8">
                  <div className="space-y-4">
                    {backlogInitiatives.map((initiative, index) => {
                      const getQuadrantInfo = (quadrant: number | null) => {
                        const map: Record<number, { color: string; label: string; emoji: string }> = {
                          1: { color: 'from-red-500 to-orange-500', label: 'Crítico', emoji: '🔥' },
                          2: { color: 'from-blue-500 to-cyan-500', label: 'Importante', emoji: '📅' },
                          3: { color: 'from-yellow-500 to-orange-500', label: 'Urgente', emoji: '👥' },
                          4: { color: 'from-gray-500 to-gray-600', label: 'Baixa', emoji: '🗑️' },
                        };
                        return map[quadrant || 1] || map[1];
                      };
                      
                      const quadrantInfo = getQuadrantInfo(initiative.quadrant);
                      
                      return (
                        <motion.div
                          key={initiative.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="p-6 rounded-xl glass-premium border-2 border-white/10"
                        >
                          <div className="flex items-start gap-4">
                            <Badge className={`bg-gradient-to-r ${quadrantInfo.color} text-sm px-3 py-1.5 font-bold border-0`}>
                              {quadrantInfo.emoji} {quadrantInfo.label}
                            </Badge>
                            <div className="flex-1">
                              <h4 className="font-bold text-xl mb-2">{initiative.title}</h4>
                              <p className="text-base text-foreground/70">{initiative.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              )}
            </Card>
          )}

          {currentFlow === 'sprint-planning' && (
            <SprintPlanning 
              backlogInitiatives={backlogInitiatives}
              existingSprints={sprints}
              onSprintCreated={() => {
                handleRefresh();
                setTimeout(() => setCurrentFlow('kanban'), 500);
              }}
              onCancel={() => setCurrentFlow('backlog')}
            />
          )}

          {currentFlow === 'kanban' && (
            <div className="space-y-6">
              <KanbanBoard 
                sprints={sprints}
                initiatives={sprintInitiatives}
                onInitiativeUpdate={handleRefresh}
              />
              {hasCompletedInitiatives && (
                <div className="flex justify-end">
                  <Button 
                    className="premium-button rounded-xl h-14 px-10 text-base"
                    onClick={() => setCurrentFlow('review')}
                  >
                    Ir para Review
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {currentFlow === 'review' && (
            <div className="space-y-6">
              <SprintReview 
                sprints={sprints}
                initiatives={sprintInitiatives}
                onReviewSaved={handleRefresh}
              />
              <div className="flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentFlow('kanban')}
                  className="glass-premium h-12 px-6"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Voltar ao Kanban
                </Button>
                <Button 
                  className="premium-button rounded-xl h-14 px-10 text-base"
                  onClick={() => setCurrentFlow('retrospective')}
                >
                  Ir para Retrospectiva
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {currentFlow === 'retrospective' && (
            <div className="space-y-6">
              <Retrospective 
                sprints={sprints}
                onRetrospectiveSaved={handleRefresh}
              />
              <div className="flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentFlow('review')}
                  className="glass-premium h-12 px-6"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Voltar ao Review
                </Button>
                <Button 
                  className="premium-button rounded-xl h-14 px-10 text-base"
                  onClick={() => router.push('/dashboard')}
                >
                  Concluir Jornada
                  <CheckCircle className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
