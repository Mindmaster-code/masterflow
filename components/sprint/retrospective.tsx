'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, Calendar, Lightbulb, TrendingUp, Target, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Sprint {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: string;
}

interface RetrospectiveProps {
  sprints: Sprint[];
  onRetrospectiveSaved: () => void;
}

export function Retrospective({ sprints, onRetrospectiveSaved }: RetrospectiveProps) {
  const [selectedSprintId, setSelectedSprintId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [retro, setRetro] = useState({
    whatWentWell: [] as string[],
    whatToImprove: [] as string[],
    actionItems: [] as string[],
  });

  const [newItems, setNewItems] = useState({
    whatWentWell: '',
    whatToImprove: '',
    actionItems: '',
  });

  const addItem = (field: keyof typeof retro) => {
    const value = newItems[field].trim();
    if (!value) return;

    setRetro({
      ...retro,
      [field]: [...retro[field], value],
    });

    setNewItems({ ...newItems, [field]: '' });
  };

  const removeItem = (field: keyof typeof retro, index: number) => {
    setRetro({
      ...retro,
      [field]: retro[field].filter((_: string, i: number) => i !== index),
    });
  };

  const saveRetrospective = async () => {
    if (!selectedSprintId) {
      alert('Selecione um sprint');
      return;
    }

    const hasContent = retro.whatWentWell.length > 0 || retro.whatToImprove.length > 0 || retro.actionItems.length > 0;
    if (!hasContent) {
      alert('Adicione pelo menos um item em alguma categoria');
      return;
    }

    setIsLoading(true);
    setSaveSuccess(false);

    try {
      const response = await fetch('/api/retrospectives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sprintId: selectedSprintId,
          ...retro,
        }),
      });

      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
        }, 2000);
        onRetrospectiveSaved();
      }
    } catch (error) {
      console.error('Error saving retrospective:', error);
      alert('Erro ao salvar retrospectiva. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const completedSprints = sprints.filter(s => s.status === 'COMPLETED');

  return (
    <div className="space-y-6">
      <Card className="premium-card border-purple-500/30">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Sprint Retrospectiva</CardTitle>
              <CardDescription className="text-base">Reflexão sobre o sprint e aprendizados</CardDescription>
            </div>
          </div>

          {completedSprints.length > 0 && (
            <div className="space-y-3 pt-4">
              <Label className="text-base font-semibold">Sprint para Retrospectiva</Label>
              <Select value={selectedSprintId} onValueChange={(value) => setSelectedSprintId(value || '')}>
                <SelectTrigger className="premium-input h-14 text-base">
                  <SelectValue placeholder="Selecione um sprint concluído" />
                </SelectTrigger>
                <SelectContent className="premium-card">
                  {completedSprints.map(sprint => (
                    <SelectItem key={sprint.id} value={sprint.id} className="text-base cursor-pointer">
                      <div className="flex items-center gap-3 py-1">
                        <Calendar className="w-4 h-4" />
                        <span>{sprint.name}</span>
                        <span className="text-xs text-foreground/50">
                          ({new Date(sprint.startDate).toLocaleDateString('pt-BR')} - {new Date(sprint.endDate).toLocaleDateString('pt-BR')})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardHeader>

        {completedSprints.length === 0 ? (
          <CardContent className="text-center py-20">
            <Lightbulb className="w-20 h-20 mx-auto mb-6 text-foreground/20" />
            <p className="text-foreground/60 text-xl font-semibold mb-2">Nenhum sprint concluído ainda</p>
            <p className="text-foreground/40 text-base">Complete um sprint para fazer a retrospectiva</p>
          </CardContent>
        ) : !selectedSprintId ? (
          <CardContent className="text-center py-20">
            <Target className="w-20 h-20 mx-auto mb-6 text-foreground/20" />
            <p className="text-foreground/60 text-xl font-semibold">Selecione um sprint acima</p>
          </CardContent>
        ) : (
          <CardContent className="space-y-8 pt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/30"
            >
              <Label className="text-xl font-bold text-green-400 flex items-center gap-2 mb-6">
                <span className="text-3xl">😊</span>
                O que foi Bom? (Continue fazendo)
              </Label>
              <div className="flex gap-3 mb-6">
                <Input
                  value={newItems.whatWentWell}
                  onChange={(e) => setNewItems({ ...newItems, whatWentWell: e.target.value })}
                  placeholder="Ex: Boa comunicação com o time"
                  className="premium-input h-14 text-base"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addItem('whatWentWell');
                    }
                  }}
                />
                <Button 
                  type="button" 
                  onClick={() => addItem('whatWentWell')} 
                  size="icon"
                  className="h-14 w-14 premium-button rounded-xl"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-3 min-h-[40px]">
                {retro.whatWentWell.map((item, index) => (
                  <Badge 
                    key={index} 
                    className="text-sm px-4 py-2.5 bg-green-500/20 border border-green-500/40 hover:border-green-500/60 transition-all"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => removeItem('whatWentWell', index)}
                      className="ml-2 hover:text-destructive transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </Badge>
                ))}
                {retro.whatWentWell.length === 0 && (
                  <p className="text-sm text-foreground/40 italic">Adicione pelo menos 3 itens positivos</p>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30"
            >
              <Label className="text-xl font-bold text-yellow-400 flex items-center gap-2 mb-6">
                <span className="text-3xl">💡</span>
                O que pode Melhorar? (Oportunidades)
              </Label>
              <div className="flex gap-3 mb-6">
                <Input
                  value={newItems.whatToImprove}
                  onChange={(e) => setNewItems({ ...newItems, whatToImprove: e.target.value })}
                  placeholder="Ex: Melhorar planejamento de tarefas"
                  className="premium-input h-14 text-base"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addItem('whatToImprove');
                    }
                  }}
                />
                <Button 
                  type="button" 
                  onClick={() => addItem('whatToImprove')} 
                  size="icon"
                  className="h-14 w-14 premium-button rounded-xl"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-3 min-h-[40px]">
                {retro.whatToImprove.map((item, index) => (
                  <Badge 
                    key={index} 
                    className="text-sm px-4 py-2.5 bg-yellow-500/20 border border-yellow-500/40 hover:border-yellow-500/60 transition-all"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => removeItem('whatToImprove', index)}
                      className="ml-2 hover:text-destructive transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </Badge>
                ))}
                {retro.whatToImprove.length === 0 && (
                  <p className="text-sm text-foreground/40 italic">Seja honesto sobre pontos de melhoria</p>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-2 border-blue-500/30"
            >
              <Label className="text-xl font-bold text-blue-400 flex items-center gap-2 mb-6">
                <span className="text-3xl">🎯</span>
                Ações para o Próximo Sprint (Action Items)
              </Label>
              <div className="flex gap-3 mb-6">
                <Input
                  value={newItems.actionItems}
                  onChange={(e) => setNewItems({ ...newItems, actionItems: e.target.value })}
                  placeholder="Ex: Realizar daily standup diário às 9h"
                  className="premium-input h-14 text-base"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addItem('actionItems');
                    }
                  }}
                />
                <Button 
                  type="button" 
                  onClick={() => addItem('actionItems')} 
                  size="icon"
                  className="h-14 w-14 premium-button rounded-xl"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-3 min-h-[40px]">
                {retro.actionItems.map((item, index) => (
                  <Badge 
                    key={index} 
                    className="text-sm px-4 py-2.5 bg-blue-500/20 border border-blue-500/40 hover:border-blue-500/60 transition-all"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => removeItem('actionItems', index)}
                      className="ml-2 hover:text-destructive transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </Badge>
                ))}
                {retro.actionItems.length === 0 && (
                  <p className="text-sm text-foreground/40 italic">Defina ações concretas para melhoria contínua</p>
                )}
              </div>
            </motion.div>

            <div className="flex justify-end pt-6">
              <Button 
                onClick={saveRetrospective} 
                disabled={isLoading || (retro.whatWentWell.length === 0 && retro.whatToImprove.length === 0 && retro.actionItems.length === 0)}
                size="lg"
                className="premium-button text-lg px-12 h-16 rounded-xl"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                    Salvando...
                  </>
                ) : saveSuccess ? (
                  <>
                    <CheckCircle2 className="w-6 h-6 mr-3" />
                    Retrospectiva Salva!
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-6 h-6 mr-3" />
                    Salvar Retrospectiva
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
