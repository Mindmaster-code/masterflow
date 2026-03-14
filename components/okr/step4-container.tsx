'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Target, Trash2, CheckCircle2, Loader2, ArrowRight, X, Edit } from 'lucide-react';
import { Backlog2D } from './backlog-2d';
import { TooltipHelp } from '@/components/ui/tooltip-help';
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
  initiatives: any[];
}

interface Step4ContainerProps {
  initialObjectives: Objective[];
  userId: string;
}

type ViewMode = 'list' | 'add-objective' | 'add-kr' | 'edit-objective';

export function Step4Container({ initialObjectives, userId }: Step4ContainerProps) {
  const router = useRouter();
  const [objectives, setObjectives] = useState<Objective[]>(initialObjectives);
  const [currentView, setCurrentView] = useState<ViewMode>('list');
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

    setIsSaving(true);
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
      alert('Erro ao criar objetivo');
    } finally {
      setIsSaving(false);
    }
  };

  const createKR = async () => {
    if (!newKR.title.trim() || !selectedObjectiveId) {
      alert('Preencha o título do Key Result');
      return;
    }

    setIsSaving(true);
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
      alert('Erro ao criar KR');
    } finally {
      setIsSaving(false);
    }
  };

  const completeStep4 = async () => {
    if (objectives.length === 0) {
      alert('Crie pelo menos um objetivo');
      return;
    }

    const hasKRs = objectives.some(obj => obj.keyResults.length > 0);
    if (!hasKRs) {
      alert('Adicione pelo menos um Key Result');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/step4/complete', {
        method: 'POST',
      });

      if (response.ok) {
        setTimeout(() => {
          router.push('/step5');
          router.refresh();
        }, 500);
      }
    } catch (error) {
      alert('Erro ao finalizar');
    } finally {
      setIsLoading(false);
    }
  };

  // Form para adicionar objetivo
  if (currentView === 'add-objective') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="premium-card border-primary/40">
          <CardHeader className="pb-8">
            <div className="flex items-center gap-3 mb-3">
              <CardTitle className="text-4xl font-bold premium-gradient-text">Criar Novo Objetivo</CardTitle>
              <TooltipHelp 
                title="O que é um Objetivo?"
                text="Um Objetivo é uma meta clara que você quer alcançar na sua carreira. Exemplo: 'Tornar-me líder de equipe até o final do ano' ou 'Migrar para área de Gestão de Projetos'."
              />
            </div>
            <CardDescription className="text-lg">Defina aonde quer chegar na sua carreira</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="p-5 rounded-xl bg-blue-500/10 border border-blue-500/30">
              <p className="text-sm text-foreground/80">
                💡 <strong>Dica:</strong> Um bom objetivo é específico e alcançável. 
                Exemplo: "Conseguir promoção para cargo sênior" ou "Mudar de área para Gestão de Produtos"
              </p>
            </div>

            <div className="space-y-4">
              <Label className="text-xl font-semibold">Título do Objetivo *</Label>
              <Input
                value={newObjective.title}
                onChange={(e) => setNewObjective({ ...newObjective, title: e.target.value })}
                placeholder="Ex: Alcançar posição de liderança sênior"
                className="premium-input h-16 text-xl"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <Label className="text-xl font-semibold">Trimestre</Label>
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setNewObjective({ ...newObjective, quarter: q })}
                      className={`p-8 rounded-2xl border-2 font-bold text-3xl transition-all ${
                        newObjective.quarter === q
                          ? 'border-primary bg-gradient-to-br from-primary/30 to-primary/20 shadow-2xl scale-105 text-primary'
                          : 'border-white/10 bg-white/5 hover:border-primary/40'
                      }`}
                    >
                      Q{q}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <Label className="text-xl font-semibold">Ano</Label>
                <Input
                  type="number"
                  value={newObjective.year}
                  onChange={(e) => setNewObjective({ ...newObjective, year: Number(e.target.value) })}
                  className="premium-input h-16 text-2xl text-center font-bold"
                />
              </div>
            </div>

            <div className="flex gap-6 pt-8">
              <Button 
                variant="outline"
                size="lg"
                onClick={() => {
                  setCurrentView('list');
                  setNewObjective({ title: '', quarter: 1, year: new Date().getFullYear() });
                }}
                className="flex-1 h-16 text-lg rounded-xl glass-premium"
              >
                <X className="w-6 h-6 mr-2" />
                Cancelar
              </Button>
              <Button 
                onClick={createObjective}
                disabled={isSaving}
                className="flex-1 premium-button h-16 text-lg rounded-xl"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    <Plus className="w-6 h-6 mr-2" />
                    Criar Objetivo
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Form para adicionar KR
  if (currentView === 'add-kr') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="premium-card border-primary/40">
          <CardHeader className="pb-8">
            <div className="flex items-center gap-3 mb-3">
              <CardTitle className="text-4xl font-bold premium-gradient-text">Novo Key Result</CardTitle>
              <TooltipHelp 
                title="O que é Key Result?"
                text="Key Result (Resultado-Chave) é COMO você vai medir se alcançou o objetivo. Deve ser mensurável e ter um número. Exemplo: 'Aumentar conexões no LinkedIn de 200 para 500' ou 'Concluir 3 certificações'."
              />
            </div>
            <CardDescription className="text-lg">Como você vai medir o progresso deste objetivo?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="p-5 rounded-xl bg-purple-500/10 border border-purple-500/30">
              <p className="text-sm text-foreground/80">
                💡 <strong>Dica:</strong> Key Results são números ou porcentagens. 
                Exemplo: "Fazer 3 cursos de liderança" ou "Conseguir 90% de aprovação da equipe"
              </p>
            </div>

            <div className="space-y-4">
              <Label className="text-xl font-semibold">Título do KR *</Label>
              <Input
                value={newKR.title}
                onChange={(e) => setNewKR({ ...newKR, title: e.target.value })}
                placeholder="Ex: Aumentar conexões no LinkedIn de 200 para 500"
                className="premium-input h-16 text-xl"
                autoFocus
              />
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-semibold">Descrição / Como Medir</Label>
              <Input
                value={newKR.description}
                onChange={(e) => setNewKR({ ...newKR, description: e.target.value })}
                placeholder="Ex: Alcançar 500 conexões relevantes na área"
                className="premium-input h-14 text-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Valor Atual</Label>
                <Input
                  value={newKR.currentValue}
                  onChange={(e) => setNewKR({ ...newKR, currentValue: e.target.value })}
                  placeholder="Ex: 200"
                  className="premium-input h-16 text-2xl text-center font-bold"
                />
              </div>
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Meta / Valor Alvo</Label>
                <Input
                  value={newKR.targetValue}
                  onChange={(e) => setNewKR({ ...newKR, targetValue: e.target.value })}
                  placeholder="Ex: 500"
                  className="premium-input h-16 text-2xl text-center font-bold text-green-400"
                />
              </div>
            </div>

            <div className="flex gap-6 pt-8">
              <Button 
                variant="outline"
                size="lg"
                onClick={() => {
                  setCurrentView('list');
                  setNewKR({ title: '', description: '', currentValue: '0', targetValue: '100' });
                  setSelectedObjectiveId(null);
                }}
                className="flex-1 h-16 text-lg rounded-xl glass-premium"
              >
                <X className="w-6 h-6 mr-2" />
                Cancelar
              </Button>
              <Button 
                onClick={createKR}
                disabled={isSaving}
                className="flex-1 premium-button h-16 text-lg rounded-xl"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    <Plus className="w-6 h-6 mr-2" />
                    Criar Key Result
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Lista de objetivos
  return (
    <div className="space-y-8">
      <Card className="premium-card border-blue-500/30">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <CardTitle className="text-2xl">Seus Objetivos (OKRs)</CardTitle>
                  <TooltipHelp 
                    title="O que é OKR?"
                    text="OKR = Objectives and Key Results (Objetivos e Resultados-Chave). É um método simples: você define ONDE quer chegar (Objetivo) e COMO vai medir o progresso (Key Results). Exemplo: Objetivo = 'Virar gerente', Key Result = 'Liderar 2 projetos grandes'."
                  />
                </div>
                <CardDescription className="text-base">
                  {objectives.length === 0 ? 'Defina suas metas de carreira' : `${objectives.length} objetivos criados`}
                </CardDescription>
              </div>
            </div>
            <Button 
              className="premium-button rounded-xl h-14 px-8 text-base"
              onClick={() => setCurrentView('add-objective')}
            >
              <Plus className="w-5 h-5 mr-2" />
              Novo Objetivo
            </Button>
          </div>
        </CardHeader>

        {objectives.length === 0 ? (
          <CardContent className="text-center py-24">
            <Target className="w-24 h-24 mx-auto mb-6 text-foreground/20" />
            <p className="text-foreground/60 text-2xl font-semibold mb-3">Nenhum objetivo criado</p>
            <p className="text-foreground/40 text-lg mb-8">Defina seus objetivos de carreira para este trimestre</p>
            <Button 
              className="premium-button rounded-xl h-16 px-10 text-lg"
              onClick={() => setCurrentView('add-objective')}
            >
              <Plus className="w-6 h-6 mr-2" />
              Criar Primeiro Objetivo
            </Button>
          </CardContent>
        ) : (
          <CardContent className="space-y-8 pb-8">
            {objectives.map((objective, objIndex) => (
              <motion.div
                key={objective.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: objIndex * 0.1 }}
                className="p-8 rounded-2xl glass-premium border-2 border-blue-500/30"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-lg px-5 py-2 font-bold">
                        Q{objective.quarter} {objective.year}
                      </Badge>
                      <h3 className="text-3xl font-bold">{objective.title}</h3>
                    </div>
                    <p className="text-base text-foreground/60">
                      {objective.keyResults.length} Key Results • {objective.keyResults.reduce((acc, kr) => acc + kr.initiatives.length, 0)} Iniciativas
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={async () => {
                      if (!confirm('Excluir este objetivo e todos seus KRs?')) return;
                      try {
                        const response = await fetch(`/api/objectives/${objective.id}`, { method: 'DELETE' });
                        if (response.ok) {
                          setObjectives(objectives.filter(obj => obj.id !== objective.id));
                        }
                      } catch (error) {
                        alert('Erro ao excluir');
                      }
                    }}
                    className="ml-6 hover:bg-red-500/20 hover:border-red-500/50 w-12 h-12"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <Label className="text-2xl font-bold text-primary">Key Results</Label>
                    <Button 
                      size="sm" 
                      className="premium-button rounded-xl h-12 px-6"
                      onClick={() => {
                        setSelectedObjectiveId(objective.id);
                        setCurrentView('add-kr');
                      }}
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Adicionar KR
                    </Button>
                  </div>

                  {objective.keyResults.length === 0 ? (
                    <div className="text-center py-12 px-6 rounded-xl bg-primary/5 border-2 border-dashed border-primary/20">
                      <p className="text-foreground/50 text-lg mb-4">Nenhum Key Result definido</p>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setSelectedObjectiveId(objective.id);
                          setCurrentView('add-kr');
                        }}
                        className="glass-premium h-12 px-6"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Adicionar Primeiro KR
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {objective.keyResults.map((kr, krIndex) => (
                        <div 
                          key={kr.id}
                          className="p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30"
                        >
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <Badge className="bg-purple-500/30 border-purple-500/50 text-base px-4 py-2 font-bold">
                                  KR {krIndex + 1}
                                </Badge>
                                <p className="font-bold text-2xl">{kr.title}</p>
                              </div>
                              {kr.description && (
                                <p className="text-base text-foreground/70 mb-4">{kr.description}</p>
                              )}
                              <div className="flex items-center gap-4 text-lg">
                                <span className="font-semibold text-foreground/60">
                                  Atual: <span className="text-blue-400 font-bold">{kr.currentValue}</span>
                                </span>
                                <span className="text-2xl text-foreground/40">→</span>
                                <span className="font-semibold text-foreground/60">
                                  Meta: <span className="text-green-400 font-bold text-2xl">{kr.targetValue}</span>
                                </span>
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
          </CardContent>
        )}
      </Card>

      <div className="flex justify-between items-center p-6 glass-premium rounded-2xl">
        <Button 
          variant="outline" 
          size="lg"
          onClick={() => router.push('/step3-swot')}
          className="text-base px-8 h-14 rounded-xl glass-premium"
        >
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
              Finalizando...
            </>
          ) : (
            <>
              Concluir Etapa 4
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
