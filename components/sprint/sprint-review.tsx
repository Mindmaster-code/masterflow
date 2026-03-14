'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, Calendar, Star, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Initiative {
  id: string;
  title: string;
  description: string;
  status: string;
}

interface Sprint {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: string;
}

interface SprintReviewData {
  initiativeId: string;
  evaluation: number;
  notes: string | null;
}

interface SprintReviewProps {
  sprints: Sprint[];
  initiatives: Initiative[];
  onReviewSaved: () => void;
}

export function SprintReview({ sprints, initiatives, onReviewSaved }: SprintReviewProps) {
  const [selectedSprintId, setSelectedSprintId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [reviews, setReviews] = useState<Record<string, SprintReviewData>>({});

  const completedSprints = sprints.filter(s => s.status === 'COMPLETED');
  const selectedSprint = completedSprints.find(s => s.id === selectedSprintId);
  const doneInitiatives = selectedSprint
    ? initiatives.filter(i => i.status === 'DONE')
    : [];

  const updateReview = (initiativeId: string, field: 'evaluation' | 'notes', value: number | string) => {
    setReviews({
      ...reviews,
      [initiativeId]: {
        ...(reviews[initiativeId] || { initiativeId, evaluation: 0, notes: '' }),
        [field]: value,
      },
    });
  };

  const saveReview = async () => {
    if (!selectedSprintId) {
      alert('Selecione um sprint');
      return;
    }

    const reviewData = Object.values(reviews).filter(r => r.evaluation > 0);
    if (reviewData.length === 0) {
      alert('Avalie pelo menos uma iniciativa');
      return;
    }

    setIsLoading(true);
    setSaveSuccess(false);

    try {
      const response = await fetch('/api/sprint-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sprintId: selectedSprintId,
          reviews: reviewData,
        }),
      });

      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
          setReviews({});
        }, 2000);
        onReviewSaved();
      }
    } catch (error) {
      console.error('Error saving review:', error);
      alert('Erro ao salvar review. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="premium-card border-green-500/30">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Sprint Review</CardTitle>
              <CardDescription className="text-base">Avalie as iniciativas concluídas</CardDescription>
            </div>
          </div>

          {completedSprints.length > 0 && (
            <div className="space-y-3 pt-4">
              <Label className="text-base font-semibold">Sprint a Revisar</Label>
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
            <CheckCircle2 className="w-20 h-20 mx-auto mb-6 text-foreground/20" />
            <p className="text-foreground/60 text-xl font-semibold mb-2">Nenhum sprint concluído ainda</p>
            <p className="text-foreground/40 text-base">Complete um sprint para fazer a review</p>
          </CardContent>
        ) : !selectedSprintId ? (
          <CardContent className="text-center py-20">
            <Star className="w-20 h-20 mx-auto mb-6 text-foreground/20" />
            <p className="text-foreground/60 text-xl font-semibold">Selecione um sprint acima</p>
          </CardContent>
        ) : doneInitiatives.length === 0 ? (
          <CardContent className="text-center py-20">
            <p className="text-foreground/60 text-xl font-semibold">Nenhuma iniciativa concluída neste sprint</p>
          </CardContent>
        ) : (
          <CardContent className="space-y-8 pt-6">
            {doneInitiatives.map((initiative, index) => (
              <motion.div
                key={initiative.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-2xl glass-premium border-2 border-green-500/30"
              >
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                    <h4 className="font-bold text-xl">{initiative.title}</h4>
                  </div>
                  <p className="text-base text-foreground/70 ml-9">{initiative.description}</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-lg font-bold text-primary flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      Como você avalia esta iniciativa?
                    </Label>
                    <div className="flex gap-3">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => updateReview(initiative.id, 'evaluation', rating)}
                          className={`flex-1 p-6 rounded-xl border-2 transition-all text-center ${
                            reviews[initiative.id]?.evaluation === rating
                              ? 'border-primary bg-gradient-to-br from-primary/30 to-accent/30 shadow-2xl scale-110'
                              : 'border-white/10 bg-white/5 hover:border-primary/40 hover:scale-105'
                          }`}
                        >
                          <div className="text-4xl mb-2">
                            {rating === 1 && '😞'}
                            {rating === 2 && '😐'}
                            {rating === 3 && '😊'}
                            {rating === 4 && '😄'}
                            {rating === 5 && '🤩'}
                          </div>
                          <p className={`text-sm font-bold ${reviews[initiative.id]?.evaluation === rating ? 'text-primary' : 'text-foreground/60'}`}>
                            {rating}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Observações / Aprendizados</Label>
                    <Textarea
                      value={reviews[initiative.id]?.notes || ''}
                      onChange={(e) => updateReview(initiative.id, 'notes', e.target.value)}
                      placeholder="O que aprendeu? O que poderia ter sido feito diferente?"
                      rows={4}
                      className="premium-input text-base resize-none"
                    />
                  </div>
                </div>
              </motion.div>
            ))}

            <div className="flex justify-end pt-6">
              <Button 
                onClick={saveReview} 
                disabled={isLoading || Object.keys(reviews).length === 0}
                size="lg"
                className="premium-button text-lg px-12 h-16 rounded-xl"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                    Salvando Review...
                  </>
                ) : saveSuccess ? (
                  <>
                    <CheckCircle2 className="w-6 h-6 mr-3" />
                    Review Salva!
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-6 h-6 mr-3" />
                    Salvar Review
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
