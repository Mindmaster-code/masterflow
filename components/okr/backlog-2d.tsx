'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, AlertCircle, Zap } from 'lucide-react';
import { TooltipHelp } from '@/components/ui/tooltip-help';
import { motion } from 'framer-motion';

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

interface Backlog2DProps {
  keyResultId: string;
  existingInitiatives: Initiative[];
}

const QUADRANTS = [
  { quadrant: 1, urgency: 'HIGH' as const, impact: 'HIGH' as const, title: 'Fazer Agora', emoji: '🔥', color: 'from-red-500 to-orange-500', desc: 'Urgente e Importante' },
  { quadrant: 2, urgency: 'LOW' as const, impact: 'HIGH' as const, title: 'Planejar', emoji: '📅', color: 'from-blue-500 to-cyan-500', desc: 'Importante, não urgente' },
  { quadrant: 3, urgency: 'HIGH' as const, impact: 'LOW' as const, title: 'Delegar', emoji: '👥', color: 'from-yellow-500 to-orange-500', desc: 'Urgente, menos importante' },
  { quadrant: 4, urgency: 'LOW' as const, impact: 'LOW' as const, title: 'Eliminar', emoji: '🗑️', color: 'from-gray-500 to-gray-600', desc: 'Nem urgente, nem importante' },
];

export function Backlog2D({ keyResultId, existingInitiatives }: Backlog2DProps) {
  const [initiatives, setInitiatives] = useState<Initiative[]>(existingInitiatives);
  const [isAdding, setIsAdding] = useState(false);
  const [editingInitiative, setEditingInitiative] = useState<Initiative | null>(null);

  const [newInitiative, setNewInitiative] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    quadrant: 1,
  });

  const createInitiative = async () => {
    if (!newInitiative.title.trim()) return;

    try {
      const response = await fetch('/api/initiatives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newInitiative, keyResultId }),
      });

      if (response.ok) {
        const data = await response.json();
        setInitiatives([...initiatives, data]);
        setNewInitiative({
          title: '',
          description: '',
          startDate: '',
          endDate: '',
          quadrant: 1,
        });
        setIsAdding(false);
      }
    } catch (error) {
      console.error('Error creating initiative:', error);
    }
  };

  const updateInitiative = async () => {
    if (!editingInitiative) return;

    try {
      const response = await fetch(`/api/initiatives/${editingInitiative.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingInitiative),
      });

      if (response.ok) {
        const data = await response.json();
        setInitiatives(initiatives.map(i => i.id === data.id ? data : i));
        setEditingInitiative(null);
      }
    } catch (error) {
      console.error('Error updating initiative:', error);
    }
  };

  const deleteInitiative = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta iniciativa?')) return;

    try {
      const response = await fetch(`/api/initiatives/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setInitiatives(initiatives.filter(i => i.id !== id));
      }
    } catch (error) {
      console.error('Error deleting initiative:', error);
    }
  };

  const getInitiativeQuadrant = (initiative: Initiative): number => {
    return initiative.quadrant || 1;
  };

  const getUrgencyImpact = (quadrant: number): { urgency: 'HIGH' | 'LOW'; impact: 'HIGH' | 'LOW' } => {
    const map: Record<number, { urgency: 'HIGH' | 'LOW'; impact: 'HIGH' | 'LOW' }> = {
      1: { urgency: 'HIGH', impact: 'HIGH' },
      2: { urgency: 'LOW', impact: 'HIGH' },
      3: { urgency: 'HIGH', impact: 'LOW' },
      4: { urgency: 'LOW', impact: 'LOW' },
    };
    return map[quadrant] || map[1];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label className="text-base font-bold text-primary">📋 Backlog 2D - Matriz de Eisenhower</Label>
        <Dialog open={isAdding} onOpenChange={setIsAdding}>
          <DialogTrigger>
            <Button size="sm" className="premium-button rounded-lg">
              <Plus className="w-4 h-4 mr-1" />
              Nova Iniciativa
            </Button>
          </DialogTrigger>
          <DialogContent className="premium-card border-green-500/30 max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl">Criar Iniciativa</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-base font-semibold">Título da Iniciativa</Label>
                <Input
                  value={newInitiative.title}
                  onChange={(e) => setNewInitiative({ ...newInitiative, title: e.target.value })}
                  placeholder="Ex: Fazer curso de AWS Solutions Architect"
                  className="premium-input h-12 text-base"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-base font-semibold">Descrição Detalhada</Label>
                <Textarea
                  value={newInitiative.description}
                  onChange={(e) => setNewInitiative({ ...newInitiative, description: e.target.value })}
                  placeholder="Detalhes da iniciativa..."
                  rows={4}
                  className="premium-input text-base"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label className="text-sm">Data Início (Estimada)</Label>
                  <Input
                    type="date"
                    value={newInitiative.startDate}
                    onChange={(e) => setNewInitiative({ ...newInitiative, startDate: e.target.value })}
                    className="premium-input h-12"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-sm">Data Fim (Estimada)</Label>
                  <Input
                    type="date"
                    value={newInitiative.endDate}
                    onChange={(e) => setNewInitiative({ ...newInitiative, endDate: e.target.value })}
                    className="premium-input h-12"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label className="text-base font-semibold">Quando fazer esta iniciativa?</Label>
                  <TooltipHelp 
                    title="Priorização Simples"
                    text="🔥 Urgente = Fazer nas próximas 2 semanas | 📅 Importante = Fazer no próximo mês | 👥 Médio = Fazer nos próximos 3 meses | 📌 Baixo = Quando tiver tempo"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {QUADRANTS.map((q) => (
                    <button
                      key={q.quadrant}
                      type="button"
                      onClick={() => setNewInitiative({ ...newInitiative, quadrant: q.quadrant })}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        newInitiative.quadrant === q.quadrant
                          ? `border-primary bg-gradient-to-r ${q.color} bg-opacity-20 shadow-lg`
                          : 'border-white/10 bg-white/5 hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{q.emoji}</span>
                        <div className="text-sm font-bold">{q.title}</div>
                      </div>
                      <div className="text-xs text-foreground/60">{q.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={createInitiative} className="w-full premium-button h-12 text-base rounded-xl">
                Criar Iniciativa
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {QUADRANTS.map((quadrantDef) => {
          const quadrantInitiatives = initiatives.filter(
            i => (i.quadrant || 1) === quadrantDef.quadrant
          );

          return (
            <div
              key={quadrantDef.quadrant}
              className="min-h-[300px] p-6 rounded-2xl border-2 border-dashed border-white/10 bg-white/5 hover:bg-white/10 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${quadrantDef.color} shadow-lg`}>
                  <span className="text-2xl">{quadrantDef.emoji}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg">{quadrantDef.title}</h4>
                  <p className="text-xs text-foreground/50">{quadrantDef.desc}</p>
                </div>
                <Badge className="bg-white/10 border-white/20">
                  {quadrantInitiatives.length}
                </Badge>
              </div>

              <div className="space-y-3">
                {quadrantInitiatives.map((initiative) => (
                  <motion.div
                    key={initiative.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-xl glass-premium border border-white/10 cursor-move hover:border-primary/50 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-semibold text-sm flex-1">{initiative.title}</p>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Dialog>
                          <DialogTrigger>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-7 w-7 rounded-lg"
                              onClick={() => setEditingInitiative(initiative)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="premium-card max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Editar Iniciativa</DialogTitle>
                            </DialogHeader>
                            {editingInitiative && (
                              <div className="space-y-6">
                                <div className="space-y-3">
                                  <Label>Título</Label>
                                  <Input
                                    value={editingInitiative.title}
                                    onChange={(e) => setEditingInitiative({ ...editingInitiative, title: e.target.value })}
                                    className="premium-input h-12 text-base"
                                  />
                                </div>
                                <div className="space-y-3">
                                  <Label>Descrição</Label>
                                  <Textarea
                                    value={editingInitiative.description}
                                    onChange={(e) => setEditingInitiative({ ...editingInitiative, description: e.target.value })}
                                    rows={4}
                                    className="premium-input text-base"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-3">
                                    <Label>Data Início</Label>
                                    <Input
                                      type="date"
                                      value={editingInitiative.startDate ? new Date(editingInitiative.startDate).toISOString().split('T')[0] : ''}
                                      onChange={(e) => setEditingInitiative({ ...editingInitiative, startDate: e.target.value ? new Date(e.target.value) : null })}
                                      className="premium-input"
                                    />
                                  </div>
                                  <div className="space-y-3">
                                    <Label>Data Fim</Label>
                                    <Input
                                      type="date"
                                      value={editingInitiative.endDate ? new Date(editingInitiative.endDate).toISOString().split('T')[0] : ''}
                                      onChange={(e) => setEditingInitiative({ ...editingInitiative, endDate: e.target.value ? new Date(e.target.value) : null })}
                                      className="premium-input"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-3">
                                  <Label>Quadrante (Prioridade)</Label>
                                  <select
                                    value={editingInitiative.quadrant || 1}
                                    onChange={(e) => setEditingInitiative({ ...editingInitiative, quadrant: Number(e.target.value) })}
                                    className="w-full p-3 rounded-lg premium-input"
                                  >
                                    {QUADRANTS.map((q) => (
                                      <option key={q.quadrant} value={q.quadrant}>
                                        {q.emoji} {q.title} - {q.desc}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <Button onClick={updateInitiative} className="w-full premium-button h-12 text-base rounded-xl">
                                  Salvar Alterações
                                </Button>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7 rounded-lg hover:bg-red-500/20 hover:border-red-500/50"
                          onClick={() => deleteInitiative(initiative.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-foreground/50 line-clamp-2">{initiative.description}</p>
                    {(initiative.startDate || initiative.endDate) && (
                      <div className="mt-2 text-xs text-foreground/40">
                        {initiative.startDate && new Date(initiative.startDate).toLocaleDateString('pt-BR')}
                        {initiative.startDate && initiative.endDate && ' → '}
                        {initiative.endDate && new Date(initiative.endDate).toLocaleDateString('pt-BR')}
                      </div>
                    )}
                  </motion.div>
                ))}

                {quadrantInitiatives.length === 0 && (
                  <div className="text-center py-8 text-foreground/30 text-sm">
                    Arraste iniciativas aqui ou<br />clique em "Nova Iniciativa"
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {initiatives.length > 0 && (
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
          <p className="text-sm text-foreground/80">
            💡 <strong>Dica:</strong> Use a matriz para priorizar suas iniciativas. 
            Foque primeiro no quadrante <strong className="text-red-400">"Fazer Agora"</strong> (Alto Impacto + Alta Urgência).
          </p>
        </div>
      )}
    </div>
  );
}
