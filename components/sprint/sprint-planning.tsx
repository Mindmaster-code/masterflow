'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Calendar, CheckSquare, Rocket, Loader2, Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Initiative {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: number;
  quadrant: number | null;
  startDate: Date | null;
  endDate: Date | null;
}

interface Sprint {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: string;
  initiativeIds?: string[];
}

interface SprintPlanningProps {
  backlogInitiatives: Initiative[];
  existingSprints: Sprint[];
  onSprintCreated: () => void;
  onCancel?: () => void;
}

export function SprintPlanning({ backlogInitiatives, existingSprints, onSprintCreated, onCancel }: SprintPlanningProps) {
  const [currentView, setCurrentView] = useState<'backlog' | 'create'>('backlog');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInitiatives, setSelectedInitiatives] = useState<string[]>([]);
  
  const [newSprint, setNewSprint] = useState({
    name: `Sprint ${existingSprints.length + 1}`,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const toggleInitiative = (id: string) => {
    setSelectedInitiatives(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const createSprint = async () => {
    if (selectedInitiatives.length === 0) {
      alert('Selecione pelo menos uma iniciativa');
      return;
    }

    if (!newSprint.name.trim()) {
      alert('Digite um nome para o sprint');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/sprints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newSprint,
          initiativeIds: selectedInitiatives,
        }),
      });

      if (response.ok) {
        setSelectedInitiatives([]);
        setCurrentView('backlog');
        setNewSprint({
          name: `Sprint ${existingSprints.length + 2}`,
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        });
        onSprintCreated();
      }
    } catch (error) {
      alert('Erro ao criar sprint');
    } finally {
      setIsLoading(false);
    }
  };

  const getQuadrantInfo = (quadrant: number | null) => {
    const map: Record<number, { color: string; label: string; emoji: string }> = {
      1: { color: 'from-red-500 to-orange-500', label: 'Crítico', emoji: '🔥' },
      2: { color: 'from-blue-500 to-cyan-500', label: 'Importante', emoji: '📅' },
      3: { color: 'from-yellow-500 to-orange-500', label: 'Urgente', emoji: '👥' },
      4: { color: 'from-gray-500 to-gray-600', label: 'Baixa', emoji: '🗑️' },
    };
    return map[quadrant || 1] || map[1];
  };

  if (currentView === 'create') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-5xl mx-auto"
      >
        <Card className="premium-card border-green-500/30">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold">Configurar Novo Sprint</CardTitle>
                <CardDescription className="text-lg mt-2">{selectedInitiatives.length} iniciativas selecionadas</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 pb-8">
            <div className="p-8 rounded-2xl bg-blue-500/10 border-2 border-blue-500/30">
              <h4 className="font-bold text-2xl mb-6 text-primary">Iniciativas do Sprint:</h4>
              <div className="flex flex-wrap gap-3">
                {backlogInitiatives
                  .filter(i => selectedInitiatives.includes(i.id))
                  .map(i => {
                    const info = getQuadrantInfo(i.quadrant);
                    return (
                      <Badge key={i.id} className={`text-base px-5 py-2.5 bg-gradient-to-r ${info.color} border-white/20 font-bold`}>
                        {info.emoji} {i.title}
                      </Badge>
                    );
                  })}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-xl font-semibold">Nome do Sprint *</Label>
              <Input
                value={newSprint.name}
                onChange={(e) => setNewSprint({ ...newSprint, name: e.target.value })}
                placeholder="Ex: Sprint 1 - Foco em Certificações"
                className="premium-input h-16 text-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <Label className="text-xl font-semibold">Data de Início *</Label>
                <Input
                  type="date"
                  value={newSprint.startDate}
                  onChange={(e) => setNewSprint({ ...newSprint, startDate: e.target.value })}
                  className="premium-input h-16 text-xl"
                />
              </div>
              <div className="space-y-4">
                <Label className="text-xl font-semibold">Data de Término *</Label>
                <Input
                  type="date"
                  value={newSprint.endDate}
                  onChange={(e) => setNewSprint({ ...newSprint, endDate: e.target.value })}
                  className="premium-input h-16 text-xl"
                />
              </div>
            </div>

            <div className="flex gap-6 pt-8">
              <Button 
                variant="outline"
                size="lg"
                onClick={() => {
                  setCurrentView('backlog');
                  onCancel?.();
                }}
                className="flex-1 h-16 text-lg rounded-xl glass-premium"
              >
                <X className="w-6 h-6 mr-2" />
                Cancelar
              </Button>
              <Button 
                onClick={createSprint} 
                disabled={isLoading}
                className="flex-1 premium-button h-16 text-lg rounded-xl"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                    Criando Sprint...
                  </>
                ) : (
                  <>
                    <Rocket className="w-6 h-6 mr-2" />
                    Criar e Iniciar Sprint
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="premium-card border-blue-500/30">
        <CardHeader>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl">Backlog de Iniciativas</CardTitle>
                <CardDescription className="text-lg mt-2">Selecione 3-8 iniciativas para o próximo sprint</CardDescription>
              </div>
            </div>
          </div>

          {backlogInitiatives.length > 0 && (
            <div className="p-8 rounded-2xl bg-purple-500/10 border-2 border-purple-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold mb-2">
                    📊 {backlogInitiatives.length} iniciativas disponíveis
                  </p>
                  <p className="text-base text-foreground/60">
                    Recomendado: 3-8 iniciativas por sprint de 2 semanas
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-7xl font-bold premium-gradient-text">{selectedInitiatives.length}</p>
                  <p className="text-base text-foreground/60 font-semibold">selecionadas</p>
                </div>
              </div>
            </div>
          )}
        </CardHeader>

        {backlogInitiatives.length === 0 ? (
          <CardContent className="text-center py-24">
            <Calendar className="w-24 h-24 mx-auto mb-6 text-foreground/20" />
            <p className="text-foreground/60 text-2xl font-semibold mb-3">Nenhuma iniciativa no backlog</p>
            <p className="text-foreground/40 text-lg">Crie iniciativas na Etapa 4 (Destino - OKRs)</p>
          </CardContent>
        ) : (
          <CardContent className="pb-8">
            <div className="space-y-5">
              {backlogInitiatives
                .sort((a, b) => (a.quadrant || 1) - (b.quadrant || 1))
                .map((initiative, index) => {
                  const quadrantInfo = getQuadrantInfo(initiative.quadrant);
                  const isSelected = selectedInitiatives.includes(initiative.id);

                  return (
                    <motion.div
                      key={initiative.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => toggleInitiative(initiative.id)}
                      className={`p-8 rounded-2xl glass-premium border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-primary bg-gradient-to-r from-primary/20 to-accent/20 shadow-2xl shadow-primary/40 scale-[1.02]'
                          : 'border-white/10 hover:border-primary/30 hover:bg-white/5 hover:scale-[1.01]'
                      }`}
                    >
                      <div className="flex items-start gap-6">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleInitiative(initiative.id)}
                          className="mt-2 w-7 h-7"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-4">
                            <Badge className={`bg-gradient-to-r ${quadrantInfo.color} text-base px-5 py-2 font-bold border-0`}>
                              {quadrantInfo.emoji} {quadrantInfo.label}
                            </Badge>
                            <h4 className="font-bold text-2xl break-words">{initiative.title}</h4>
                          </div>
                          <p className="text-lg text-foreground/70 mb-4 leading-relaxed break-words">{initiative.description}</p>
                          {(initiative.startDate || initiative.endDate) && (
                            <div className="flex items-center gap-2 text-base text-foreground/50">
                              <Clock className="w-5 h-5" />
                              {initiative.startDate && new Date(initiative.startDate).toLocaleDateString('pt-BR')}
                              {initiative.startDate && initiative.endDate && ' - '}
                              {initiative.endDate && new Date(initiative.endDate).toLocaleDateString('pt-BR')}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </div>

            <div className="flex justify-end pt-10">
              <Button
                disabled={selectedInitiatives.length === 0}
                onClick={() => setCurrentView('create')}
                size="lg"
                className="premium-button text-xl px-16 h-20 rounded-2xl"
              >
                <Rocket className="w-7 h-7 mr-3" />
                Avançar para Criar Sprint ({selectedInitiatives.length})
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      <AnimatePresence>
        {selectedInitiatives.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 right-8 p-8 premium-card border-primary/50 bg-primary/10 shadow-2xl z-50 max-w-md"
          >
            <div className="flex items-start gap-4">
              <CheckSquare className="w-12 h-12 text-primary flex-shrink-0" />
              <div>
                <p className="font-bold text-2xl mb-2">{selectedInitiatives.length} iniciativas</p>
                <p className="text-base text-foreground/70">Clique em "Avançar" para configurar o sprint</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
