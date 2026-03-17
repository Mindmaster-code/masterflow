import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { Step5Simplified } from '@/components/sprint/step5-simplified';
import { Rocket, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function Step5Page() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  const progress = await db.journeyProgress.findUnique({
    where: { userId: session.user.id },
  });

  if (!progress || progress.currentStep < 4) {
    redirect('/step3-swot');
  }

  const [actions0, careerGoalsCtx] = await Promise.all([
    db.action.findMany({
      where: { userId: session.user.id },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    }),
    db.careerGoals.findUnique({ where: { userId: session.user.id } }),
  ]);

  let actions = actions0;

  if (actions.length === 0 && progress.step3Completed) {
    const [profile, careerGoals, qualificationNeeds, skills, swotAnalysis] =
      await Promise.all([
        db.profile.findUnique({ where: { userId: session.user.id } }),
        db.careerGoals.findUnique({ where: { userId: session.user.id } }),
        db.qualificationNeeds.findUnique({ where: { userId: session.user.id } }),
        db.skill.findMany({ where: { userId: session.user.id }, orderBy: { score: 'asc' } }),
        db.swotAnalysis.findUnique({ where: { userId: session.user.id } }),
      ]);

    const lowSkills = (skills ?? []).filter((s) => s.score < 6).slice(0, 3);
    const coursesNeeded = qualificationNeeds?.coursesNeeded ?? [];
    const certifications = careerGoals?.requiredCertifications ?? [];
    const skillsToDevelop = swotAnalysis?.skillsToDevelop ?? [];
    const desiredRole = careerGoals?.desiredRole ?? '';
    const currentRole = profile?.currentRole ?? '';

    const toCreate: { title: string; description: string; quadrant: number }[] = [];

    // 1. Role-specific strategic action
    if (desiredRole) {
      toCreate.push({
        title: `Criar plano de transição para ${desiredRole}`,
        description: `Defina marcos mensais de evolução. Liste as principais lacunas entre seu perfil atual (${currentRole || 'atual'}) e a vaga alvo, e priorize as 3 mais críticas para atacar primeiro.`,
        quadrant: 1,
      });
    }

    const isAgileRelated = (name: string) => {
      const n = name.toLowerCase();
      return /scrum|kanban|okr|design thinking|gestão ágil|gestao agil|lean|backlog|estimativa|agilidade/i.test(n);
    };

    // 2. Skill development — specific and actionable
    lowSkills.forEach((skill, i) => {
      const targetScore = Math.min(skill.score + 3, 10);
      const desc = isAgileRelated(skill.name)
        ? `Reserve 30 min/dia para praticar ${skill.name}. Consulte os cursos e conteúdos da MindMaster Treinamentos — especialistas em metodologias ágeis. Em 4 semanas reavalie sua nota.`
        : `Reserve 30 min/dia para praticar ${skill.name}. Busque livros, artigos e prática em projetos. Em 4 semanas reavalie sua nota.`;
      toCreate.push({
        title: `Elevar ${skill.name}: ${skill.score} → ${targetScore}/10`,
        description: desc,
        quadrant: i === 0 ? 1 : 2,
      });
    });

    // 3. Courses needed
    coursesNeeded.slice(0, 2).forEach((c) => {
      const desc = isAgileRelated(c)
        ? `Consulte os cursos da MindMaster Treinamentos em "${c}". Defina uma data de término e bloqueie na agenda. Dedique pelo menos 5h por semana.`
        : `Defina uma data de término para "${c}" e bloqueie na agenda. Dedique pelo menos 5h por semana. Busque conteúdos de qualidade sobre o tema.`;
      toCreate.push({
        title: `Concluir curso: ${c}`,
        description: desc,
        quadrant: 1,
      });
    });

    // 4. Certifications
    certifications.slice(0, 1).forEach((cert) => {
      toCreate.push({
        title: `Obter certificação: ${cert}`,
        description: `Verifique no site oficial os pré-requisitos e custo. Agende a prova com pelo menos 6 semanas de antecedência para preparar. Compre um simulado.`,
        quadrant: 1,
      });
    });

    // 5. SWOT skills to develop
    skillsToDevelop.slice(0, 1).forEach((s) => {
      if (!toCreate.some((a) => a.title.toLowerCase().includes(s.toLowerCase()))) {
        toCreate.push({
          title: `Desenvolver: ${s}`,
          description: `Inclua ${s} na sua rotina de estudos semanal. Busque projetos práticos ou voluntariado para ganhar experiência real nessa competência.`,
          quadrant: 2,
        });
      }
    });

    // 6. LinkedIn profile — practical, specific
    toCreate.push(
      {
        title: 'Otimizar perfil LinkedIn para recrutadores',
        description: `Atualize o headline com palavras-chave de "${desiredRole || 'sua área'}" (ex: "[Cargo] | [Habilidade 1] | [Habilidade 2]"). Escreva o "Sobre" em 1ª pessoa focado em resultados. Adicione experiências com métricas concretas.`,
        quadrant: 1,
      },
      {
        title: 'Ativar modo "Aberto a oportunidades" no LinkedIn',
        description: `Vá em Perfil > Quadro de empregos > "Aberto a oportunidades". Selecione "${desiredRole || 'cargos de interesse'}", locais e tipo de trabalho. Isso aumenta sua visibilidade para recrutadores em até 40%.`,
        quadrant: 1,
      },
      {
        title: 'Publicar conteúdo semanal no LinkedIn',
        description: `Escreva 1 post por semana sobre ${desiredRole ? `sua jornada rumo a ${desiredRole}` : 'sua área'}. Formatos que engajam: "aprendi X hoje", "erro que cometi e a lição", "ferramenta que mudou meu trabalho". Consuma antes de criar — siga 10 profissionais da área.`,
        quadrant: 2,
      },
      {
        title: 'Conectar com 5 profissionais da área por semana',
        description: `Filtre no LinkedIn por "${desiredRole || 'cargo alvo'}" na sua cidade. Ao conectar, escreva mensagem personalizada: "Olá [Nome], admiro seu trabalho em [empresa/área]. Estou em transição para [cargo] e seria ótimo trocar experiências." Não peça emprego na 1ª mensagem.`,
        quadrant: 2,
      },
      {
        title: 'Configurar alertas de vagas no LinkedIn e Indeed',
        description: `No LinkedIn: Empregos > pesquise "${desiredRole || 'cargo alvo'}" > "Criar alerta". No Indeed: faça o mesmo. Configure para receber alertas diários. Isso garante que você veja as vagas nas primeiras horas — candidatos nas primeiras 24h têm 3x mais chances.`,
        quadrant: 1,
      },
      {
        title: 'Candidatar-se a pelo menos 5 vagas por dia',
        description: `Defina um bloco fixo na agenda: 30 min manhã + 30 min tarde para candidaturas. Para cada vaga, adapte o resumo do currículo com as palavras-chave do anúncio. Use LinkedIn Easy Apply para vagas rápidas, mas personalize para as vagas dos sonho.`,
        quadrant: 1,
      },
      {
        title: 'Preparar respostas para entrevistas comportamentais',
        description: `Liste 5 situações profissionais marcantes (desafio, conflito, erro, liderança, resultado). Use o método STAR: Situação, Tarefa, Ação, Resultado. Pratique em voz alta por 10 min/dia. Grave-se e reveja para melhorar postura e clareza.`,
        quadrant: 2,
      },
      {
        title: 'Participar de evento de networking presencial ou online',
        description: `Pesquise no Sympla, Eventbrite ou LinkedIn Events por eventos de "${desiredRole || 'sua área'}" nos próximos 30 dias. Prepare sua apresentação de 30 segundos: "Sou [nome], atuo em [área] e estou em transição para [cargo]. Busco [objetivo]." Leve ou compartilhe seu LinkedIn.`,
        quadrant: 2,
      }
    );

    const unique = toCreate.slice(0, 18);
    for (let i = 0; i < unique.length; i++) {
      await db.action.create({
        data: {
          userId: session.user.id,
          title: unique[i].title,
          description: unique[i].description,
          quadrant: unique[i].quadrant,
          status: 'TODO',
          order: i,
        },
      });
    }

    actions = await db.action.findMany({
      where: { userId: session.user.id },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
  }

  const initiativesData = actions.map((a) => ({
    id: a.id,
    title: a.title,
    description: a.description,
    status: a.status as 'BACKLOG' | 'SPRINT' | 'TODO' | 'DOING' | 'DONE',
    priority: a.order,
    quadrant: a.quadrant,
    startDate: null,
    endDate: null,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="text-white/40 hover:text-white hover:bg-white/5 rounded-xl gap-2 mb-5 -ml-2">
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Button>
        </Link>

        <div className="flex items-start gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-2xl animate-float"
            style={{ boxShadow: '0 12px 32px rgba(0,151,167,0.35)' }}>
            <Rocket className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="pill-badge text-xs">Etapa 4 de 4</div>
              <div className={`pill-badge text-xs ${progress.step5Completed ? 'text-emerald-400' : ''}`}
                style={progress.step5Completed ? { background: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.25)' } : {}}>
                {progress.step5Completed ? '✓ Concluída' : '● Em progresso'}
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
              Plano de <span className="brand-gradient-text">Ação</span>
            </h1>
            <p className="text-white/45">Suas ações sugeridas com base na jornada. Arraste para organizar!</p>
          </div>
        </div>
      </div>

      <div className="gradient-line mb-8" />

      <Step5Simplified
        initiatives={initiativesData}
        userId={session.user.id}
        useActionsApi
        context={{
          desiredRole: careerGoalsCtx?.desiredRole ?? '',
          step5Completed: progress.step5Completed,
          userName: session.user.name?.split(' ')[0] ?? '',
        }}
      />
    </div>
  );

}
