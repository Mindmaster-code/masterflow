'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core';
import { Calendar, CheckCircle, PlayCircle, Square, GripVertical, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Initiative {
  id: string;
  title: string;
  description: string;
  status: 'BACKLOG' | 'SPRINT' | 'TODO' | 'DOING' | 'DONE';
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

interface KanbanBoardProps {
  sprints: Sprint[];
  initiatives: Initiative[];
  onInitiativeUpdate: () => void;
}

function DraggableInitiative({ initiative }: { initiative: Initiative }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: initiative.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const getQuadrantInfo = (quadrant: number | null) => {
    const map: Record<number, { color: string; emoji: string }> = {
      1: { color: 'from-red-500/20 to-orange-500/20', emoji: '🔥' },
      2: { color: 'from-blue-500/20 to-cyan-500/20', emoji: '📅' },
      3: { color: 'from-yellow-500/20 to-orange-500/20', emoji: '👥' },
      4: { color: 'from-gray-500/20 to-gray-600/20', emoji: '🗑️' },
    };
    return map[quadrant || 1] || map[1];
  };

  const quadrantInfo = getQuadrantInfo(initiative.quadrant);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`p-5 rounded-xl glass-premium border-2 border-white/20 bg-gradient-to-br ${quadrantInfo.color} hover:border-primary/40 transition-colors cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-0' : 'hover:shadow-lg'}`}
    >
      <div className="flex items-start gap-3">
        <GripVertical className="w-5 h-5 text-foreground/40 flex-shrink-0 mt-1" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{quadrantInfo.emoji}</span>
            <h4 className="font-bold text-base leading-tight">{initiative.title}</h4>
          </div>
          <p className="text-sm text-foreground/70 leading-relaxed">{initiative.description}</p>
          {(initiative.startDate || initiative.endDate) && (
            <div className="flex items-center gap-2 mt-2 text-xs text-foreground/50">
              <Clock className="w-3 h-3" />
              {initiative.startDate && new Date(initiative.startDate).toLocaleDateString('pt-BR')}
              {initiative.startDate && initiative.endDate && ' - '}
              {initiative.endDate && new Date(initiative.endDate).toLocaleDateString('pt-BR')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DroppableColumn({ 
  id, 
  title, 
  color, 
  icon: Icon, 
  items, 
  isOver 
}: { 
  id: string; 
  title: string; 
  color: string; 
  icon: any; 
  items: Initiative[];
  isOver: boolean;
}) {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <Card 
      ref={setNodeRef}
      className={`premium-card border-2 transition-all ${
        isOver ? 'border-primary ring-4 ring-primary/30 scale-[1.01]' : 'border-white/10'
      }`}
    >
      <CardHeader className={`pb-4 bg-gradient-to-r ${color} rounded-t-2xl`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className="w-7 h-7 text-white drop-shadow-lg" />
            <CardTitle className="text-white text-xl font-bold drop-shadow-lg">{title}</CardTitle>
          </div>
          <Badge className="bg-white/30 backdrop-blur-sm text-white text-lg px-4 py-1.5 border-0 font-bold">
            {items.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-5 pb-5 min-h-[500px]">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Icon className="w-16 h-16 mb-3 text-foreground/20" />
            <p className="text-foreground/40 text-sm">
              {id === 'TODO' && 'Arraste iniciativas aqui'}
              {id === 'DOING' && 'Em andamento'}
              {id === 'DONE' && '🎉 Concluídas'}
            </p>
          </div>
        ) : (
          items.map((initiative) => (
            <DraggableInitiative key={initiative.id} initiative={initiative} />
          ))
        )}
      </CardContent>
    </Card>
  );
}

export function KanbanBoard({ sprints, initiatives, onInitiativeUpdate }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const activeSprint = sprints.find(s => s.status === 'ACTIVE');
  
  if (!activeSprint) {
    return (
      <Card className="premium-card">
        <CardContent className="text-center py-24">
          <Calendar className="w-24 h-24 mx-auto mb-6 text-foreground/20" />
          <p className="text-foreground/60 text-2xl font-semibold mb-3">Nenhum sprint ativo</p>
          <p className="text-foreground/40 text-lg">Crie um sprint no Planejamento primeiro</p>
        </CardContent>
      </Card>
    );
  }

  const sprintInitiatives = initiatives.filter(i => 
    activeSprint.initiativeIds?.includes(i.id) || 
    ['TODO', 'DOING', 'DONE'].includes(i.status)
  );
  
  const todoInitiatives = sprintInitiatives.filter(i => i.status === 'TODO');
  const doingInitiatives = sprintInitiatives.filter(i => i.status === 'DOING');
  const doneInitiatives = sprintInitiatives.filter(i => i.status === 'DONE');

  const checkSprintCompletion = async () => {
    const allDone = sprintInitiatives.length > 0 && sprintInitiatives.every(i => i.status === 'DONE');
    const dateReached = new Date() >= activeSprint.endDate;
    
    if (allDone || dateReached) {
      try {
        await fetch(`/api/sprints/${activeSprint.id}/complete`, {
          method: 'POST',
        });
        onInitiativeUpdate();
      } catch (error) {
        console.error('Error completing sprint:', error);
      }
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: any) => {
    const { over } = event;
    if (over && ['TODO', 'DOING', 'DONE'].includes(over.id)) {
      setOverId(over.id as string);
    } else {
      setOverId(null);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);

    if (!over || !['TODO', 'DOING', 'DONE'].includes(over.id as string)) {
      return;
    }

    const initiativeId = active.id as string;
    const newStatus = over.id as 'TODO' | 'DOING' | 'DONE';

    const initiative = sprintInitiatives.find(i => i.id === initiativeId);
    if (!initiative || initiative.status === newStatus) {
      return;
    }

    try {
      const response = await fetch(`/api/initiatives/${initiativeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        onInitiativeUpdate();
        
        if (newStatus === 'DONE') {
          setTimeout(() => {
            confetti({
              particleCount: 150,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'],
              scalar: 1.2,
              gravity: 1,
              drift: 0,
            });
            
            setTimeout(() => {
              confetti({
                particleCount: 100,
                spread: 60,
                origin: { y: 0.7 },
                colors: ['#fff', '#ffd700'],
              });
            }, 200);
          }, 300);
          
          setTimeout(() => {
            checkSprintCompletion();
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Error updating initiative:', error);
      alert('Erro ao mover iniciativa');
    }
  };

  const [isCompleting, setIsCompleting] = useState(false);

  const activeInitiative = sprintInitiatives.find(i => i.id === activeId);

  const completeSprint = async () => {
    if (!confirm('Tem certeza que deseja concluir este sprint?')) {
      return;
    }

    setIsCompleting(true);
    try {
      const response = await fetch(`/api/sprints/${activeSprint.id}/complete`, {
        method: 'POST',
      });

      if (response.ok) {
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'],
          scalar: 1.5,
        });
        
        setTimeout(() => {
          onInitiativeUpdate();
        }, 1000);
      }
    } catch (error) {
      console.error('Error completing sprint:', error);
      alert('Erro ao concluir sprint');
    } finally {
      setIsCompleting(false);
    }
  };

  const columnConfig = [
    { id: 'TODO', title: 'A Fazer', color: 'from-gray-500 to-gray-600', icon: Square, items: todoInitiatives },
    { id: 'DOING', title: 'Fazendo', color: 'from-blue-500 to-cyan-500', icon: PlayCircle, items: doingInitiatives },
    { id: 'DONE', title: 'Feito', color: 'from-green-500 to-emerald-500', icon: CheckCircle, items: doneInitiatives },
  ];

  return (
    <div className="space-y-6">
      <Card className="premium-card border-blue-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">{activeSprint.name}</CardTitle>
              <p className="text-base text-foreground/60 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {new Date(activeSprint.startDate).toLocaleDateString('pt-BR')} - {new Date(activeSprint.endDate).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-base text-foreground/60 mb-2">Progresso</p>
                <p className="text-5xl font-bold premium-gradient-text">
                  {sprintInitiatives.length > 0 
                    ? Math.round((doneInitiatives.length / sprintInitiatives.length) * 100)
                    : 0}%
                </p>
              </div>
              <Button
                onClick={completeSprint}
                disabled={isCompleting}
                className="premium-button h-14 px-8 text-base rounded-xl"
              >
                {isCompleting ? (
                  <>
                    <Calendar className="w-5 h-5 mr-2 animate-spin" />
                    Concluindo...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Concluir Sprint
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
            <p className="text-base text-center">
              👉 <strong>Arraste os cards</strong> entre as colunas para atualizar o status
            </p>
          </div>
        </CardContent>
      </Card>

      <DndContext 
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid md:grid-cols-3 gap-5">
          {columnConfig.map((column) => (
            <DroppableColumn
              key={column.id}
              id={column.id}
              title={column.title}
              color={column.color}
              icon={column.icon}
              items={column.items}
              isOver={overId === column.id}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={null}>
          {activeInitiative && (
            <div className="rotate-2 scale-105 opacity-80 shadow-2xl">
              <DraggableInitiative initiative={activeInitiative} />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
