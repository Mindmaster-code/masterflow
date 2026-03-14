'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Target, Trash2, CheckCircle2, Loader2, ArrowRight, X, ArrowLeft } from 'lucide-react';
import { Backlog2D } from './backlog-2d';
import { motion, AnimatePresence } from 'framer-motion';

interface Objective {
  id: string;
  title: string;
  quarter: number;
  year: number;
  keyResults: KeyResult[];
}

interface KeyResult {
  id: string;
  title: string;
  description: string;
  currentValue: string;
  targetValue: string;
  initiatives: Initiative[];
}

interface Initiative {
  id: string;
  title: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  status: string;
  priority: number;
  quadrant: number | null;
}

interface Step4FormProps {
  initialObjectives: Objective[];
  userId: string;
}

export function Step4Form({ initialObjectives, userId }: Step4FormProps) {
  const router = useRouter();
  const [objectives, setObjectives] = useState<Objective[]>(initialObjectives);
  const [currentView, setCurrentView] = useState<'list' | 'add-objective' | 'add-kr'>('list');
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [newObjective, setNewObjective] = useState({
    title: '',
    quarter: 1,
    year: new Date().getFullYear(),
  });

  const [newKR, setNewKR] = useState({
    title: '',
    description: '',
    currentValue: '0',
    targetValue: '100',
  });

  const createObjective = async () => {
    if (!newObjective.title.trim()) {
      alert('Digite um título para o objetivo');
      return;
    }

    try {
      const response = await fetch('/api/objectives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newObjective),
      });

      if (response.ok) {
        const data = await response.json();
        setObjectives([...objectives, { ...data, keyResults: [] }]);
        setNewObjective({ title: '', quarter: 1, year: new Date().getFullYear() });
        setCurrentView('list');
      }
    } catch (error) {
      console.error('Error creating objective:', error);
      alert('Erro ao criar objetivo. Tente novamente.');
    }
  };

  const createKR = async () => {
    if (!newKR.title.trim() || !selectedObjectiveId) {
      alert('Digite um título para o Key Result');
      return;
    }

    try {
      const response = await fetch('/api/key-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newKR, objectiveId: selectedObjectiveId }),
      });

      if (response.ok) {
        const data = await response.json();
        setObjectives(objectives.map(obj => 
          obj.id === selectedObjectiveId 
            ? { ...obj, keyResults: [...obj.keyResults, { ...data, initiatives: [] }] }
            : obj
        ));
        setNewKR({ title: '', description: '', currentValue: '0', targetValue: '100' });
        setCurrentView('list');
        setSelectedObjectiveId(null);
      }
    } catch (error) {
      console.error('Error creating KR:', error);
      alert('Erro ao criar KR. Tente novamente.');
    }
  };

  const deleteObjective = async (id: string) => {
    if (!confirm('Deseja realmente excluir este objetivo e todos seus KRs?')) return;

    try {
      const response = await fetch(`/api/objectives/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setObjectives(objectives.filter(obj => obj.id !== id));
      }
    } catch (error) {
      console.error('Error deleting objective:', error);
    }
  };

  const completeStep4 = async () => {
    if (objectives.length === 0) {
      alert('Crie pelo menos um objetivo antes de avançar');
      return;
    }

    const hasKRs = objectives.some(obj => obj.keyResults.length > 0);
    if (!hasKRs) {
      alert('Adicione pelo menos um Key Result aos seus objetivos');
      return;
    }

    setIsLoading(true);
    setSaveSuccess(false);
    
    try {
      const response = await fetch('/api/step4/complete', {
        method: 'POST',
      });

      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => {
          router.push('/step5');
          router.refresh();
        }, 1000);
      }
    } catch (error) {
      console.error('Error completing step 4:', error);
      alert('Erro ao finalizar etapa. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (currentView === 'add-objective') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl mx-auto"
      >
        <Card className="premium-card border-primary/40">
          <CardHeader>
            <CardTitle className="text-3xl font-bold premium-gradient-text">Criar Novo Objetivo</CardTitle>
            <CardDescription className="text-base">Defina um objetivo estratégico para sua carreira</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="space-y-3">
              <Label className="text-lg font-semibold">Título do Objetivo *</Label>
              <Input
                value={newObjective.title}
                onChange={(e) => setNewObjective({ ...newObjective, title: e.target.value })}
                placeholder="Ex: Alcançar posição de liderança sênior"
                className="premium-input h-14 text-lg"
                autoFocus
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">Trimestre</Label>
              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setNewObjective({ ...newObjective, quarter: q })}
                    className={`p-5 rounded-xl border-2 font-bold text-xl transition-all ${
                      newObjective.quarter === q
                        ? 'border-primary bg-gradient-to-br from-primary/30 to-primary/20 shadow-xl scale-105'
                        : 'border-white/10 bg-white/5 hover:border-primary/40'
                    }`}
                  >
                    Q{q}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">Ano</Label>
              <Input
                type="number"
                value={newObjective.year}
                onChange={(e) => setNewObjective({ ...newObjective, year: Number(e.target.value) })}
                className="premium-input h-14 text-lg"
              />
            </div>

            <div className="flex gap-4 pt-6">
              <Button 
                variant="outline"
                size="lg"
                onClick={() => {
                  setCurrentView('list');
                  setNewObjective({ title: '', quarter: 1, year: new Date().getFullYear() });
                }}
                className="flex-1 h-14 text-base rounded-xl glass-premium"
              >
                <X className="w-5 h-5 mr-2" />
                Cancelar
              </Button>
              <Button 
                onClick={createObjective}
                className="flex-1 premium-button h-14 text-base rounded-xl"
              >
                <Plus className="w-5 h-5 mr-2" />
                Criar Objetivo
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (currentView === 'add-kr') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl mx-auto"
      >
        <Card className="premium-card border-primary/40">
          <CardHeader>
            <CardTitle className="text-3xl font-bold premium-gradient-text">Novo Key Result</CardTitle>
            <CardDescription className="text-base">Defina um resultado-chave mensurável</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="space-y-3">
              <Label className="text-lg font-semibold">Título do KR *</Label>
              <Input
                value={newKR.title}
                onChange={(e) => setNewKR({ ...newKR, title: e.target.value })}
                placeholder="Ex: Expandir rede profissional no LinkedIn"
                className="premium-input h-14 text-lg"
                autoFocus
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">Descrição / Métrica</Label>
              <Input
                value={newKR.description}
                onChange={(e) => setNewKR({ ...newKR, description: e.target.value })}
                placeholder="Ex: Alcançar 500 conexões relevantes"
                className="premium-input h-14 text-base"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-base font-semibold">Valor Atual</Label>
                <Input
                  value={newKR.currentValue}
                  onChange={(e) => setNewKR({ ...newKR, currentValue: e.target.value })}
                  placeholder="Ex: 200"
                  className="premium-input h-14 text-lg"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-base font-semibold">Meta / Valor Alvo</Label>
                <Input
                  value={newKR.targetValue}
                  onChange={(e) => setNewKR({ ...newKR, targetValue: e.target.value })}
                  placeholder="Ex: 500"
                  className="premium-input h-14 text-lg"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button 
                variant="outline"
                size="lg"
                onClick={() => {
                  setCurrentView('list');
                  setNewKR({ title: '', description: '', currentValue: '0', targetValue: '100' });
                  setSelectedObjectiveId(null);
                }}
                className="flex-1 h-14 text-base rounded-xl glass-premium"
              >
                <X className="w-5 h-5 mr-2" />
                Cancelar
              </Button>
              <Button 
                onClick={createKR}
                className="flex-1 premium-button h-14 text-base rounded-xl"
              >
                <Plus className="w-5 h-5 mr-2" />
                Criar Key Result
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="premium-card border-blue-500/30">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Objetivos de Carreira (OKRs)</CardTitle>
                  <CardDescription className="text-base">Defina objetivos e resultados-chave mensuráveis</CardDescription>
                </div>
              </div>
              <Button 
                className="premium-button rounded-xl h-12 px-6"
                onClick={() => setCurrentView('add-objective')}
              >
                <Plus className="w-5 h-5 mr-2" />
                Novo Objetivo
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {objectives.length === 0 ? (
              <div className="text-center py-20">
                <Target className="w-20 h-20 mx-auto mb-6 text-foreground/20" />
                <p className="text-foreground/60 text-xl font-semibold mb-2">Nenhum objetivo criado ainda</p>
                <p className="text-foreground/40 text-base mb-6">Clique em "Novo Objetivo" para começar</p>
                <Button 
                  className="premium-button rounded-xl h-14 px-8 text-base"
                  onClick={() => setCurrentView('add-objective')}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Criar Primeiro Objetivo
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                {objectives.map((objective, objIndex) => (
                  <motion.div
                    key={objective.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: objIndex * 0.1 }}
                    className="p-8 rounded-2xl glass-premium border-2 border-blue-500/30"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-base px-4 py-1.5">
                            Q{objective.quarter} {objective.year}
                          </Badge>
                          <h3 className="text-2xl font-bold">{objective.title}</h3>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => deleteObjective(objective.id)}
                        className="ml-4 hover:bg-red-500/20 hover:border-red-500/50"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <Label className="text-xl font-bold text-primary">Key Results</Label>
                        <Button 
                          size="sm" 
                          className="premium-button rounded-lg h-10"
                          onClick={() => {
                            setSelectedObjectiveId(objective.id);
                            setCurrentView('add-kr');
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Adicionar KR
                        </Button>
                      </div>

                      {objective.keyResults.length === 0 ? (
                        <p className="text-foreground/40 text-center py-8 text-base">
                          Adicione pelo menos 3 Key Results para este objetivo
                        </p>
                      ) : (
                        <div className="space-y-6">
                          {objective.keyResults.map((kr, krIndex) => (
                            <div 
                              key={kr.id}
                              className="p-6 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30"
                            >
                              <div className="flex items-start justify-between mb-6">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <Badge className="bg-purple-500/30 border-purple-500/50 text-base px-3 py-1">
                                      KR {krIndex + 1}
                                    </Badge>
                                    <p className="font-bold text-xl">{kr.title}</p>
                                  </div>
                                  <p className="text-base text-foreground/70 mb-3">{kr.description}</p>
                                  <div className="flex items-center gap-3 text-base">
                                    <span className="font-semibold text-foreground/60">Atual: <span className="text-blue-400">{kr.currentValue}</span></span>
                                    <span className="text-foreground/40">→</span>
                                    <span className="font-semibold text-foreground/60">Meta: <span className="text-green-400 font-bold text-xl">{kr.targetValue}</span></span>
                                  </div>
                                </div>
                              </div>

                              <Backlog2D keyResultId={kr.id} existingInitiatives={kr.initiatives} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-between items-center p-6 glass-premium rounded-2xl"
      >
        <Button 
          variant="outline" 
          size="lg"
          onClick={() => router.push('/step3-swot')}
          className="text-base px-8 h-14 rounded-xl glass-premium"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar
        </Button>
        
        <Button 
          onClick={completeStep4} 
          disabled={isLoading || objectives.length === 0}
          size="lg"
          className="premium-button text-base px-10 h-14 rounded-xl group"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Salvando...
            </>
          ) : saveSuccess ? (
            <>
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Completo!
            </>
          ) : (
            <>
              Concluir Etapa 4
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </motion.div>

      {saveSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-8 right-8 p-6 premium-card border-green-500/50 bg-green-500/10 z-50"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-400" />
            <div>
              <p className="font-bold">OKRs definidos!</p>
              <p className="text-sm text-foreground/60">Indo para Plano de Ação...</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
