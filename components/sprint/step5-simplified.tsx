'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  ArrowLeft,
  Rocket,
  MoreVertical,
  PartyPopper,
  Calendar,
  Pencil,
  Trash2,
  Plus,
  TrendingUp,
  LayoutDashboard,
  RefreshCw,
  Info,
  ChevronRight,
} from 'lucide-react';
import { TooltipHelp } from '@/components/ui/tooltip-help';
import { SkillRecommendationsPanel } from '@/components/sprint/skill-recommendations';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  DragOverlay,
} from '@dnd-kit/core';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

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

interface KanbanContext {
  desiredRole?: string;
  step5Completed?: boolean;
  userName?: string;
}

interface Step5SimplifiedProps {
  initiatives: Initiative[];
  userId: string;
  useActionsApi?: boolean;
  context?: KanbanContext;
}

function DraggableCard({ 
  initiative, 
  onStatusChange, 
  onEdit, 
  onDelete,
  useActionsApi,
}: { 
  initiative: Initiative; 
  onStatusChange: (id: string, status: string) => void;
  onEdit?: (initiative: Initiative) => void;
  onDelete?: (id: string) => void;
  useActionsApi?: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: initiative.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const getQuadrantInfo = (quadrant: number | null) => {
    const map: Record<number, { color: string; emoji: string; label: string }> = {
      1: { color: 'from-red-500/20 to-orange-500/20', emoji: '🔥', label: 'Urgente' },
      2: { color: 'from-blue-500/20 to-cyan-500/20', emoji: '📅', label: 'Importante' },
      3: { color: 'from-yellow-500/20 to-orange-500/20', emoji: '👥', label: 'Médio' },
      4: { color: 'from-gray-500/20 to-gray-600/20', emoji: '📌', label: 'Baixo' },
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
      className={`group relative p-5 rounded-xl glass-premium border-2 border-white/20 bg-gradient-to-br ${quadrantInfo.color} hover:border-primary/40 transition-colors cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-0' : 'hover:shadow-lg'}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{quadrantInfo.emoji}</span>
          <h4 className="font-bold text-base leading-tight">{initiative.title}</h4>
        </div>
        
        <DropdownMenu open={menuOpen} onOpenChange={(open) => setMenuOpen(open)}>
          <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-8 w-8 transition-opacity ${menuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="premium-card w-56">
            <DropdownMenuItem onClick={() => onStatusChange(initiative.id, 'TODO')} className="cursor-pointer">
              📋 Mover para A Fazer
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange(initiative.id, 'DOING')} className="cursor-pointer">
              🏃 Mover para Fazendo
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange(initiative.id, 'DONE')} className="cursor-pointer">
              ✅ Mover para Concluído
            </DropdownMenuItem>
            {useActionsApi && onEdit && (
              <DropdownMenuItem onClick={() => onEdit(initiative)} className="cursor-pointer">
                <Pencil className="w-4 h-4 mr-2" />
                Editar
              </DropdownMenuItem>
            )}
            {useActionsApi && onDelete && (
              <DropdownMenuItem 
                onClick={() => onDelete(initiative.id)} 
                className="cursor-pointer text-red-400 focus:text-red-400"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <p className="text-sm text-foreground/70 leading-relaxed mb-3">{initiative.description}</p>

      <Badge className={`bg-gradient-to-r ${quadrantInfo.color.replace('/20', '/40')} text-xs px-2 py-1 font-semibold border-0`}>
        {quadrantInfo.label}
      </Badge>

      {/* Skill recommendations — only for "Elevar:" and "Desenvolver:" tasks */}
      {(() => {
        let skillName = '';
        if (initiative.title.startsWith('Elevar ')) {
          skillName = initiative.title.replace('Elevar ', '').split(':')[0].trim();
        } else if (initiative.title.startsWith('Desenvolver:')) {
          skillName = initiative.title.replace('Desenvolver:', '').trim();
        }
        return skillName ? <SkillRecommendationsPanel skillName={skillName} /> : null;
      })()}
    </div>
  );
}

function DroppableColumn({ 
  id, 
  title, 
  color, 
  emoji,
  items, 
  isOver,
  onStatusChange,
  onEdit,
  onDelete,
  useActionsApi,
  onAddTask,
}: { 
  id: string; 
  title: string; 
  color: string; 
  emoji: string;
  items: Initiative[];
  isOver: boolean;
  onStatusChange: (id: string, status: string) => void;
  onEdit?: (initiative: Initiative) => void;
  onDelete?: (id: string) => void;
  useActionsApi?: boolean;
  onAddTask?: () => void;
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
            <span className="text-3xl">{emoji}</span>
            <CardTitle className="text-white text-xl font-bold drop-shadow-lg">{title}</CardTitle>
          </div>
          <Badge className="bg-white/30 backdrop-blur-sm text-white text-lg px-4 py-1.5 border-0 font-bold">
            {items.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-5 pb-5 min-h-[450px]">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-6xl mb-4 opacity-20">{emoji}</span>
            <p className="text-foreground/40 text-sm mb-4">
              {id === 'TODO' && 'Suas iniciativas aparecerão aqui'}
              {id === 'DOING' && 'Arraste iniciativas em andamento'}
              {id === 'DONE' && '🎉 Iniciativas concluídas'}
            </p>
            {id === 'TODO' && useActionsApi && onAddTask && (
              <Button
                variant="outline"
                className="border-dashed border-2 border-white/20 hover:border-primary/50 hover:bg-primary/10 h-12 rounded-xl"
                onClick={onAddTask}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar tarefa
              </Button>
            )}
          </div>
        ) : (
          <>
            {items.map((initiative) => (
              <DraggableCard 
                key={initiative.id} 
                initiative={initiative} 
                onStatusChange={onStatusChange}
                onEdit={onEdit}
                onDelete={onDelete}
                useActionsApi={useActionsApi}
              />
            ))}
            {id === 'TODO' && useActionsApi && onAddTask && (
              <Button
                variant="outline"
                className="w-full mt-3 border-dashed border-2 border-white/20 hover:border-primary/50 hover:bg-primary/10 h-14 rounded-xl"
                onClick={onAddTask}
              >
                <Plus className="w-5 h-5 mr-2" />
                Adicionar tarefa
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export function Step5Simplified({ initiatives, userId, useActionsApi, context }: Step5SimplifiedProps) {
  const router = useRouter();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingInitiative, setEditingInitiative] = useState<Initiative | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addTitle, setAddTitle] = useState('');
  const [addDescription, setAddDescription] = useState('');
  const [reflection, setReflection] = useState({
    whatWorked: '',
    whatWasDifficult: '',
    nextSteps: '',
  });
  const [linkedInOpen, setLinkedInOpen] = useState(true);
  const [linkedInCopied, setLinkedInCopied] = useState(false);
  const [postTemplateIdx, setPostTemplateIdx] = useState(0);
  const [refreshingDescriptions, setRefreshingDescriptions] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 1 } })
  );

  const [localItems, setLocalItems] = useState(initiatives);
  useEffect(() => { setLocalItems(initiatives); }, [initiatives]);

  const todoInitiatives = localItems.filter(i => i.status === 'TODO' || i.status === 'BACKLOG');
  const doingInitiatives = localItems.filter(i => i.status === 'DOING');
  const doneInitiatives = localItems.filter(i => i.status === 'DONE');

  const totalTasks = localItems.length;
  const completedTasks = doneInitiatives.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Extract top skill names from "Elevar X:" tasks for LinkedIn post
  const topSkills = localItems
    .filter(i => i.title.startsWith('Elevar '))
    .slice(0, 2)
    .map(i => i.title.replace('Elevar ', '').split(':')[0].trim());

  const role = context?.desiredRole ?? '';
  const roleTag = role ? ` #${role.replace(/[\s/]+/g, '').replace(/[^a-zA-ZÀ-ÿ0-9]/g, '')}` : '';
  const s1 = topSkills[0] ?? 'Liderança';
  const s2 = topSkills[1] ?? 'Comunicação';

  const POST_TEMPLATES = [
    // Template 1 — Plano público
    [
      `🎯 Decidi tornar minha jornada de desenvolvimento profissional pública.`,
      ``,
      `Estou me preparando${role ? ` para a posição de ${role}` : ''} e estruturei um plano de ação concreto com minhas prioridades.`,
      ``,
      `Esta semana estou focado em:`,
      `→ Elevar minha habilidade em ${s1}`,
      `→ Avançar em ${s2}`,
      `→ Expandir minha rede com profissionais da área`,
      `→ Fortalecer minha presença aqui no LinkedIn`,
      ``,
      `Se você está em uma jornada similar${role ? ` ou tem experiência em ${role}` : ''}, adoraria trocar experiências!`,
      ``,
      `Vamos nos conectar? 🤝`,
      ``,
      `#DesenvolvimentoProfissional #Carreira${roleTag} #GestãoDeCarreira`,
    ],
    // Template 2 — Aprendizado vulnerável
    [
      `📖 Algo que aprendi ao mapear minhas habilidades esta semana:`,
      ``,
      `Identifiquei que preciso evoluir muito em ${s1} e ${s2}.`,
      ``,
      `A maioria das pessoas evita esse tipo de autoavaliação — eu decidi encará-la de frente.`,
      ``,
      `Porque só quando você sabe onde está é que consegue planejar onde quer chegar${role ? ` — no meu caso, ${role}` : ''}.`,
      ``,
      `Qual habilidade você está desenvolvendo agora? Me conta nos comentários. 👇`,
      ``,
      `#DesenvolvimentoProfissional #Autoconhecimento${roleTag} #Carreira`,
    ],
    // Template 3 — Resultados e compromisso
    [
      `🚀 Compromisso público: em 90 dias quero estar mais perto de${role ? ` ${role}` : ' meu próximo desafio profissional'}.`,
      ``,
      `Para isso, estou trabalhando em:`,
      ``,
      `📌 ${s1} — minha maior lacuna de competência hoje`,
      `📌 ${s2} — habilidade que todo executivo precisa dominar`,
      `📌 Networking ativo — conectar com quem já chegou onde quero chegar`,
      ``,
      `Vou compartilhar o progresso aqui. Accountability pública funciona.`,
      ``,
      `Você tem alguma dica sobre como desenvolver ${s1}? Adoraria ouvir! 🙏`,
      ``,
      `#Carreira #DesenvolvimentoPessoal${roleTag} #Liderança`,
    ],
    // Template 4 — Insight do processo
    [
      `💡 Percebi algo importante ao estruturar meu plano de carreira:`,
      ``,
      `A distância entre onde estou e onde quero estar${role ? ` (${role})` : ''} não é tão grande quanto parecia.`,
      ``,
      `É uma lista de habilidades, uma lista de conexões e uma lista de ações concretas.`,
      ``,
      `Estou trabalhando em ${s1} e ${s2} esta semana.`,
      ``,
      `Às vezes a transformação de carreira parece um salto. Na prática, é uma sequência de passos pequenos e consistentes.`,
      ``,
      `Qual passo você está dando hoje? 👇`,
      ``,
      `#Carreira #DesenvolvimentoProfissional${roleTag} #Mindset`,
    ],
    // Template 5 — Networking direto
    [
      `👋 Me apresentando para quem ainda não me conhece:`,
      ``,
      `Sou${role ? ` um profissional em transição para ${role}` : ' um profissional em desenvolvimento de carreira'}, atualmente desenvolvendo ${s1} e ${s2}.`,
      ``,
      `Estou aqui no LinkedIn para:`,
      `→ Aprender com quem já chegou onde quero chegar`,
      `→ Compartilhar minha jornada de desenvolvimento`,
      `→ Construir conexões genuínas na minha área`,
      ``,
      `Se você trabalha com${role ? ` ${role} ou áreas correlatas` : ' liderança, carreira ou desenvolvimento profissional'}, vamos nos conectar!`,
      ``,
      `#Networking #Carreira${roleTag} #DesenvolvimentoProfissional`,
    ],
  ];

  const linkedInPost = POST_TEMPLATES[postTemplateIdx % POST_TEMPLATES.length].join('\n');

  const handleCopyLinkedIn = async () => {
    await navigator.clipboard.writeText(linkedInPost);
    setLinkedInCopied(true);
    setTimeout(() => setLinkedInCopied(false), 2500);
  };

  const handleNewPost = () => {
    setPostTemplateIdx(i => i + 1);
    setLinkedInCopied(false);
  };

  const handleEdit = (initiative: Initiative) => {
    setEditingInitiative(initiative);
    setEditTitle(initiative.title);
    setEditDescription(initiative.description);
    setShowEditDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!editingInitiative || !useActionsApi) return;
    const prevItems = [...localItems];
    setLocalItems(items =>
      items.map(i => i.id === editingInitiative.id 
        ? { ...i, title: editTitle, description: editDescription } 
        : i
      )
    );
    try {
      const res = await fetch(`/api/actions/${editingInitiative.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, description: editDescription }),
      });
      if (res.ok) {
        setShowEditDialog(false);
        setEditingInitiative(null);
        router.refresh();
      } else {
        setLocalItems(prevItems);
        alert('Erro ao salvar. Tente novamente.');
      }
    } catch (e) {
      setLocalItems(prevItems);
      alert('Erro ao salvar. Tente novamente.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!useActionsApi || !confirm('Excluir esta ação?')) return;
    const prevItems = [...localItems];
    setLocalItems(items => items.filter(i => i.id !== id));
    try {
      const res = await fetch(`/api/actions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.refresh();
      } else {
        setLocalItems(prevItems);
        alert('Erro ao excluir. Tente novamente.');
      }
    } catch (e) {
      setLocalItems(prevItems);
      alert('Erro ao excluir. Tente novamente.');
    }
  };

  const handleAddTask = () => {
    setShowAddDialog(true);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  };

  const handleSaveAddTask = async () => {
    if (!addTitle.trim() || !useActionsApi) return;
    try {
      const res = await fetch('/api/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: addTitle.trim(), description: addDescription.trim(), quadrant: 2 }),
      });
      if (res.ok) {
        const created = await res.json();
        setLocalItems(items => [...items, {
          id: created.id,
          title: created.title,
          description: created.description ?? '',
          status: (created.status || 'TODO') as Initiative['status'],
          priority: created.order ?? items.length,
          quadrant: created.quadrant ?? 2,
          startDate: null,
          endDate: null,
        }]);
        setAddTitle('');
        setAddDescription('');
        setShowAddDialog(false);
        router.refresh();
      } else {
        alert('Erro ao criar tarefa. Tente novamente.');
      }
    } catch (e) {
      alert('Erro ao criar tarefa. Tente novamente.');
    }
  };

  const handleRefreshDescriptions = async () => {
    if (!useActionsApi || refreshingDescriptions) return;
    setRefreshingDescriptions(true);
    try {
      const res = await fetch('/api/actions/refresh-descriptions', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        if (data.updated > 0) {
          router.refresh();
        }
      } else {
        alert(data.error || 'Erro ao atualizar descrições.');
      }
    } catch (e) {
      alert('Erro ao atualizar descrições. Tente novamente.');
    } finally {
      setRefreshingDescriptions(false);
    }
  };

  const updateStatus = async (initiativeId: string, newStatus: string) => {
    const prevItems = [...localItems];
    setLocalItems(items =>
      items.map(i => (i.id === initiativeId ? { ...i, status: newStatus as any } : i))
    );

    const apiUrl = useActionsApi
      ? `/api/actions/${initiativeId}`
      : `/api/initiatives/${initiativeId}`;
    try {
      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        if (newStatus === 'DONE') {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981'],
          });
          const newDoneCount = prevItems.filter(i => i.status === 'DONE').length + 1;
          if (newDoneCount >= totalTasks && totalTasks > 0) {
            setTimeout(() => {
              confetti({
                particleCount: 200,
                spread: 100,
                origin: { y: 0.5 },
                colors: ['#FFD700', '#FFA500', '#FF69B4'],
                scalar: 1.5,
              });
            }, 300);
          }
        }
        router.refresh();
      } else {
        setLocalItems(prevItems);
        alert('Erro ao atualizar. Tente novamente.');
      }
    } catch (error) {
      console.error('Error updating initiative:', error);
      setLocalItems(prevItems);
      alert('Erro ao atualizar. Tente novamente.');
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);
    if (!over || !['TODO', 'DOING', 'DONE'].includes(over.id as string)) return;
    updateStatus(active.id as string, over.id as string);
  };

  const saveReflection = async () => {
    try {
      await fetch('/api/step5/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reflection),
      });
      
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      console.error('Error saving reflection:', error);
      alert('Erro ao salvar. Indo para o dashboard...');
      router.push('/dashboard');
    }
  };

  const activeInitiative = localItems.find(i => i.id === activeId);

  const columns = [
    { id: 'TODO', title: 'A Fazer', color: 'from-slate-600 to-slate-700', emoji: '📋', items: todoInitiatives },
    { id: 'DOING', title: 'Em Execução', color: 'from-teal-600 to-cyan-600', emoji: '🏃', items: doingInitiatives },
    { id: 'DONE', title: 'Concluído', color: 'from-emerald-600 to-teal-600', emoji: '✅', items: doneInitiatives },
  ];

  const isFirstVisit = doingInitiatives.length === 0 && doneInitiatives.length === 0;
  const isCompleted = context?.step5Completed || (completedTasks === totalTasks && totalTasks > 0);

  return (
    <div className="space-y-6">

      {/* Completion banner */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-6"
            style={{ background: 'linear-gradient(135deg, rgba(0,151,167,0.15) 0%, rgba(158,158,158,0.10) 100%)', border: '1px solid rgba(0,151,167,0.3)' }}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
              <div className="text-5xl flex-shrink-0">🎉</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">
                  {context?.userName ? `${context.userName}, sua` : 'Sua'} jornada foi concluída!
                </h3>
                <p className="text-white/60 text-sm">
                  Você completou todas as etapas do MasterFlow
                  {context?.desiredRole ? ` rumo a ${context.desiredRole}` : ''}.
                  Continue executando seu plano de ação e revise seu progresso no Resumo.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <button
                  onClick={() => router.push('/resumo')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #0097A7, #00ACC1)', boxShadow: '0 6px 20px rgba(0,151,167,0.35)' }}
                >
                  <TrendingUp className="w-4 h-4" />
                  Ver Resumo
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white/70 hover:text-white transition-colors"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcome / onboarding banner (first visit) */}
      <AnimatePresence>
        {isFirstVisit && !isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-6"
            style={{ background: 'rgba(0,151,167,0.07)', border: '1px solid rgba(0,151,167,0.18)' }}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
                style={{ background: 'rgba(0,151,167,0.15)' }}>
                <Info className="w-5 h-5 text-teal-400" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-white mb-2">
                  {context?.desiredRole
                    ? `Seu plano de ação para ${context.desiredRole} está pronto!`
                    : 'Seu plano de ação personalizado está pronto!'}
                </p>
                <p className="text-white/60 text-sm leading-relaxed mb-4">
                  As tarefas abaixo foram criadas com base na sua jornada — habilidades a desenvolver, cursos, certificações e estratégias de visibilidade profissional. Veja como usar:
                </p>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { step: '1', icon: '📋', text: 'Leia as tarefas e escolha por onde começar' },
                    { step: '2', icon: '🏃', text: 'Arraste para "Fazendo" as que está executando agora' },
                    { step: '3', icon: '✅', text: 'Mova para "Concluído" ao finalizar cada uma' },
                  ].map(({ step, icon, text }) => (
                    <div key={step} className="flex items-start gap-2.5 p-3 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <span className="text-xl">{icon}</span>
                      <p className="text-xs text-white/60 leading-relaxed">{text}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-white/35 mt-3 flex items-center gap-1.5">
                  <RefreshCw className="w-3 h-3" />
                  Você pode editar, excluir e adicionar tarefas usando o menu ••• de cada card
                </p>
                {useActionsApi && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefreshDescriptions}
                    disabled={refreshingDescriptions}
                    className="mt-4 flex items-center gap-2 text-xs h-9 rounded-lg border-white/15 hover:border-teal-500/40 hover:text-teal-400"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${refreshingDescriptions ? 'animate-spin' : ''}`} />
                    {refreshingDescriptions ? 'Atualizando...' : 'Atualizar descrições antigas'}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LinkedIn post suggestion */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(10,102,194,0.3)' }}>
        <button
          className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors hover:bg-white/[0.02]"
          style={{ background: 'rgba(10,102,194,0.08)' }}
          onClick={() => setLinkedInOpen(v => !v)}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(10,102,194,0.2)' }}>
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#0A66C2]">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-white/85">⚡ Sua 1ª Publicação no LinkedIn — pronta para copiar</p>
              <p className="text-xs text-white/40">Clique para ver o post sugerido e ganhe sua primeira vitória hoje</p>
            </div>
          </div>
          {linkedInOpen
            ? <ChevronRight className="w-4 h-4 text-white/30 rotate-90 transition-transform flex-shrink-0" />
            : <ChevronRight className="w-4 h-4 text-white/30 transition-transform flex-shrink-0" />}
        </button>

        <AnimatePresence>
          {linkedInOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              style={{ overflow: 'hidden' }}
            >
              <div className="px-5 pb-5 pt-4" style={{ background: 'rgba(10,102,194,0.04)' }}>
                <p className="text-xs text-white/50 mb-3 leading-relaxed">
                  Publicar sobre sua jornada de desenvolvimento é a forma mais rápida de ganhar visibilidade com recrutadores.
                  Este post foi criado com base no seu plano — edite à vontade e cole direto no LinkedIn:
                </p>

                {/* Post preview */}
                <div className="relative rounded-xl p-4 mb-3 font-mono text-xs leading-relaxed whitespace-pre-wrap text-white/75"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {linkedInPost}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={handleCopyLinkedIn}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all"
                    style={{
                      background: linkedInCopied ? 'rgba(16,185,129,0.2)' : 'rgba(10,102,194,0.3)',
                      border: linkedInCopied ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(10,102,194,0.4)',
                    }}
                  >
                    {linkedInCopied ? (
                      <>✓ Copiado!</>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                        Copiar post
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleNewPost}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Gerar outro post
                  </button>
                  <p className="text-xs text-white/25 w-full mt-0.5">
                    Post {(postTemplateIdx % 5) + 1} de 5 · Cole no LinkedIn e ajuste à vontade. Primeira vitória! 🏆
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div className="rounded-2xl px-6 py-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2 text-white/50 text-sm">
            <Calendar className="w-4 h-4" />
            <span>{totalTasks} {totalTasks === 1 ? 'tarefa' : 'tarefas'} no plano</span>
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/50">Progresso geral</span>
              <span className="text-lg font-bold brand-gradient-text">{progressPercent}%</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
              <motion.div
                className="h-full progress-bar-teal rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-white/40">{completedTasks} concluídas</span>
            {completedTasks < totalTasks && (
              <span className="text-white/40">{totalTasks - completedTasks} restantes</span>
            )}
          </div>
        </div>
      </div>

      <DndContext 
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid md:grid-cols-3 gap-5">
          {columns.map((column) => (
            <DroppableColumn
              key={column.id}
              id={column.id}
              title={column.title}
              color={column.color}
              emoji={column.emoji}
              items={column.items}
              isOver={overId === column.id}
              onStatusChange={updateStatus}
              onEdit={useActionsApi ? handleEdit : undefined}
              onDelete={useActionsApi ? handleDelete : undefined}
              useActionsApi={useActionsApi}
              onAddTask={useActionsApi ? handleAddTask : undefined}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={null}>
          {activeInitiative && (
            <div className="rotate-2 scale-105 opacity-80 shadow-2xl">
              <DraggableCard initiative={activeInitiative} onStatusChange={() => {}} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {localItems.length === 0 && (
        <Card className="premium-card">
          <CardContent className="text-center py-24">
            <Rocket className="w-24 h-24 mx-auto mb-6 text-foreground/20" />
            <p className="text-foreground/60 text-2xl font-semibold mb-3">Nenhuma ação no plano</p>
            <p className="text-foreground/40 text-lg mb-8">Complete as etapas anteriores para gerar seu plano de ação</p>
            <Button 
              onClick={() => router.push('/step3-swot')}
              className="premium-button h-14 px-8 rounded-xl"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Ir para Etapa 4
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            {completedTasks > 0 && completedTasks < totalTasks && (
              <p className="text-white/50 text-sm">
                🎯 Ótimo progresso! Você concluiu <strong className="text-teal-400">{completedTasks} de {totalTasks}</strong> tarefas. Continue assim!
              </p>
            )}
            {completedTasks === 0 && totalTasks > 0 && (
              <p className="text-white/40 text-sm">
                Comece movendo uma tarefa para "Em Execução" e depois para "Concluído" quando terminar.
              </p>
            )}
            {completedTasks === totalTasks && totalTasks > 0 && (
              <p className="text-emerald-400 text-sm font-semibold">
                🏆 Todas as tarefas concluídas! Hora de celebrar e refletir sobre sua jornada.
              </p>
            )}
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 flex-wrap">
            {useActionsApi && localItems.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshDescriptions}
                disabled={refreshingDescriptions}
                className="text-xs h-9 px-4 rounded-xl text-white/40 hover:text-teal-400 border-white/10 hover:border-teal-500/30"
              >
                <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${refreshingDescriptions ? 'animate-spin' : ''}`} />
                {refreshingDescriptions ? 'Atualizando...' : 'Atualizar descrições'}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => router.push('/step3-swot')}
              className="text-sm h-10 px-5 rounded-xl text-white/50 hover:text-white border-white/10 hover:border-white/20 hover:bg-white/5"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Etapa anterior
            </Button>
            {completedTasks === totalTasks && totalTasks > 0 && (
              <Button
                onClick={() => setShowCelebration(true)}
                className="premium-button text-sm h-10 px-6 rounded-xl"
              >
                <PartyPopper className="w-4 h-4 mr-1.5" />
                Avaliar e Concluir
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Next steps guidance (mid-progress) */}
      {progressPercent >= 30 && progressPercent < 100 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl p-5"
          style={{ background: 'rgba(0,151,167,0.05)', border: '1px solid rgba(0,151,167,0.15)' }}
        >
          <p className="text-teal-400 font-semibold text-sm mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Próximos passos enquanto executa seu plano
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { icon: '👤', text: 'Otimize seu perfil LinkedIn com as habilidades que está desenvolvendo' },
              { icon: '📊', text: 'Acompanhe seu progresso geral no Resumo da Jornada', href: '/resumo' },
              { icon: '🤝', text: 'Conecte-se semanalmente com profissionais da sua área-alvo' },
              { icon: '📝', text: 'Adapte e adicione tarefas conforme sua situação evoluir' },
            ].map(({ icon, text, href }) => (
              <div key={text}
                className="flex items-start gap-2.5 text-sm text-white/50 cursor-default"
                onClick={href ? () => router.push(href) : undefined}
                style={href ? { cursor: 'pointer' } : undefined}
              >
                <span className="text-base flex-shrink-0">{icon}</span>
                <span className={href ? 'hover:text-teal-400 transition-colors' : ''}>{text}
                  {href && <ChevronRight className="w-3 h-3 inline ml-1 opacity-50" />}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <Dialog open={showEditDialog} onOpenChange={(v) => { setShowEditDialog(v); if (!v) setEditingInitiative(null); }}>
        <DialogContent className="premium-card max-w-md">
          <DialogHeader>
            <DialogTitle>Editar ação</DialogTitle>
            <DialogDescription>Altere o título e a descrição da ação.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Título</Label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="mt-2"
                placeholder="Título da ação"
              />
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="mt-2 min-h-20"
                placeholder="Descrição (opcional)"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowEditDialog(false)} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit} className="flex-1 premium-button">
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="premium-card max-w-md !fixed !top-[50%] !left-[50%] !-translate-x-1/2 !-translate-y-1/2 !z-[100] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova tarefa</DialogTitle>
            <DialogDescription>Adicione uma tarefa ao seu plano de ação.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Título *</Label>
              <Input
                value={addTitle}
                onChange={(e) => setAddTitle(e.target.value)}
                className="mt-2"
                placeholder="Ex: Enviar 15 currículos hoje"
              />
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea
                value={addDescription}
                onChange={(e) => setAddDescription(e.target.value)}
                className="mt-2 min-h-20"
                placeholder="Detalhes (opcional)"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowAddDialog(false)} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleSaveAddTask} disabled={!addTitle.trim()} className="flex-1 premium-button">
              Adicionar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCelebration} onOpenChange={setShowCelebration}>
        <DialogContent className="premium-card max-w-3xl sm:max-w-3xl !top-[5vh] !-translate-y-0 max-h-[90vh] flex flex-col overflow-hidden p-6">
          <DialogHeader className="shrink-0">
            <DialogTitle className="text-2xl md:text-3xl mb-2 flex items-center gap-3">
              <span className="text-4xl">🎉</span>
              Parabéns! Você Concluiu Todas as Iniciativas!
            </DialogTitle>
            <DialogDescription className="text-base">
              Antes de finalizar, reflita sobre sua execução. Isso vai te ajudar a melhorar cada vez mais!
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 min-h-0 overflow-y-auto mt-4 -mx-2 px-2 space-y-6">
            <div className="space-y-3">
              <Label className="text-lg font-semibold flex items-center gap-2">
                ✅ O que você conseguiu fazer bem?
              </Label>
              <Textarea
                value={reflection.whatWorked}
                onChange={(e) => setReflection({ ...reflection, whatWorked: e.target.value })}
                placeholder="Ex: Consegui concluir as certificações no prazo, melhorei minha rede no LinkedIn..."
                className="premium-input min-h-20 text-base resize-none"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-lg font-semibold flex items-center gap-2">
                ⚠️ O que foi difícil ou te impediu?
              </Label>
              <Textarea
                value={reflection.whatWasDifficult}
                onChange={(e) => setReflection({ ...reflection, whatWasDifficult: e.target.value })}
                placeholder="Ex: Faltou tempo, algumas habilidades eram mais complexas que imaginei..."
                className="premium-input min-h-20 text-base resize-none"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-lg font-semibold flex items-center gap-2">
                🚀 O que vai fazer diferente da próxima vez?
              </Label>
              <Textarea
                value={reflection.nextSteps}
                onChange={(e) => setReflection({ ...reflection, nextSteps: e.target.value })}
                placeholder="Ex: Vou reservar 2h por dia para estudar, buscar um mentor na área..."
                className="premium-input min-h-20 text-base resize-none"
              />
            </div>
          </div>

          <div className="shrink-0 border-t border-white/10 pt-5 mt-2 space-y-3">
            <Button
              onClick={saveReflection}
              className="w-full premium-button h-12 text-base rounded-xl"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Salvar Reflexão e Concluir Jornada
            </Button>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => { setShowCelebration(false); router.push('/resumo'); }}
                className="flex-1 h-10 text-sm rounded-xl text-white/60 border-white/10 hover:border-teal-500/30 hover:text-teal-400"
              >
                <TrendingUp className="w-4 h-4 mr-1.5" />
                Ver Resumo
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCelebration(false)}
                className="flex-1 h-10 text-sm rounded-xl text-white/40 border-white/10 hover:border-white/20"
              >
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
