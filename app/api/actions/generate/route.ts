import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

interface GeneratedAction {
  title: string;
  description: string;
  quadrant: number;
  order: number;
}

function generatePlanFromData(data: {
  profile: any;
  careerGoals: any;
  qualificationNeeds: any;
  skills: any[];
  swotAnalysis: any;
}): GeneratedAction[] {
  const actions: GeneratedAction[] = [];
  let order = 0;

  const add = (title: string, description: string, quadrant: number) => {
    actions.push({ title, description, quadrant, order: 0 });
    order++;
  };

  const { profile, careerGoals, qualificationNeeds, skills, swotAnalysis } = data;

  const lowSkills = skills
    .filter((s: { score: number }) => s.score < 6)
    .sort((a: { score: number }, b: { score: number }) => a.score - b.score)
    .slice(0, 3);

  const skillsToDevelop = swotAnalysis?.skillsToDevelop ?? [];
  const coursesNeeded = qualificationNeeds?.coursesNeeded ?? [];
  const certifications = careerGoals?.requiredCertifications ?? [];
  const knowledgeNeeded = qualificationNeeds?.knowledgeNeeded ?? [];
  const skillsNeeded = qualificationNeeds?.skillsNeeded ?? [];

  if (careerGoals?.desiredRole) {
    add(
      `Preparar para cargo de ${careerGoals.desiredRole}`,
      'Definir metas mensais e acompanhar evolução em direção ao cargo desejado.',
      2
    );
  }

  const isAgileRelated = (name: string) =>
    /scrum|kanban|okr|design thinking|gestão ágil|gestao agil|lean|backlog|estimativa|agilidade/i.test(name.toLowerCase());

  lowSkills.forEach((skill: { name: string; score: number }, i: number) => {
    const q = i < 2 ? 1 : i < 4 ? 2 : 3;
    const desc = isAgileRelated(skill.name)
      ? `Sua nota atual é ${skill.score}/10. Pratique por 30 min/dia. Consulte os cursos da MindMaster Treinamentos para ${skill.name}.`
      : `Sua nota atual é ${skill.score}/10. Pratique por 30 min/dia ou busque conteúdos de qualidade sobre o tema.`;
    add(`Desenvolver habilidade: ${skill.name}`, desc, q);
  });

  skillsToDevelop.slice(0, 1).forEach((skill: string) => {
    if (!lowSkills.some((s: { name: string }) => s.name === skill)) {
      const desc = isAgileRelated(skill)
        ? `Consulte os cursos da MindMaster Treinamentos para desenvolver ${skill}. Inclua na lista de prioridades do próximo mês.`
        : 'Inclua na lista de prioridades do próximo mês. Busque projetos práticos ou feedback de colegas.';
      add(`Melhorar: ${skill}`, desc, 2);
    }
  });

  coursesNeeded.slice(0, 2).forEach((course: string) => {
    const desc = isAgileRelated(course)
      ? `Consulte os cursos da MindMaster Treinamentos em "${course}". Defina um prazo e dedique pelo menos 5h por semana.`
      : 'Defina um prazo realista e dedique pelo menos 5h por semana. Busque conteúdos de qualidade sobre o tema.';
    add(`Fazer curso: ${course}`, desc, 1);
  });

  certifications.slice(0, 1).forEach((cert: string) => {
    add(
      `Obter certificação: ${cert}`,
      'Verifique requisitos e agende a prova.',
      1
    );
  });

  knowledgeNeeded.slice(0, 2).forEach((k: string) => {
    add(
      `Aprender: ${k}`,
      'Busque livros, artigos ou vídeos sobre o tema.',
      2
    );
  });

  skillsNeeded.slice(0, 2).forEach((s: string) => {
    if (!actions.some((a) => a.title.includes(s))) {
      const desc = isAgileRelated(s)
        ? `Consulte os cursos da MindMaster Treinamentos em "${s}". Pratique em projetos ou peça feedback a colegas.`
        : 'Pratique em projetos ou peça feedback a colegas. Busque conteúdos de qualidade sobre o tema.';
      add(`Desenvolver competência: ${s}`, desc, 2);
    }
  });

  add(
    'Atualizar perfil no LinkedIn',
    'Revise resumo, experiências e habilidades para refletir seus objetivos de carreira.',
    2
  );

  add(
    'Publicar 1 artigo no LinkedIn por semana',
    'Compartilhe insights da sua área. Conteúdo relevante aumenta sua visibilidade e autoridade.',
    2
  );

  add(
    'Conectar com 5 pessoas da área por semana',
    'Envie mensagens personalizadas ao solicitar conexão. Networking ativo abre portas.',
    1
  );

  add(
    'Procurar vagas no LinkedIn diariamente',
    'Use filtros por cargo, localização e empresa. Salve vagas de interesse.',
    1
  );

  add(
    'Enviar pelo menos 15 currículos por dia',
    'Meta diária para aumentar chances. Adapte o currículo para cada vaga.',
    1
  );

  add(
    'Participar de grupos e discussões no LinkedIn',
    'Comente em posts relevantes e participe de grupos da sua área.',
    2
  );

  add(
    'Participar de evento de networking',
    'Presencial ou online. Conecte-se com recrutadores e profissionais da área.',
    2
  );

  if (swotAnalysis?.reduceWeaknessesAvoidThreats) {
    add(
      'Trabalhar estratégia de fraquezas',
      swotAnalysis.reduceWeaknessesAvoidThreats.slice(0, 150) + '...',
      2
    );
  }

  if (actions.length < 5) {
    add(
      'Definir mentor ou mentora',
      'Busque alguém que já alcançou o cargo que você deseja.',
      2
    );
    add(
      'Participar de evento da área',
      'Networking e aprendizado em eventos presenciais ou online.',
      3
    );
  }

  return actions.slice(0, 20).map((a, i) => ({ ...a, order: i } as GeneratedAction));
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const userId = session.user.id;

    const existing = await db.action.count({ where: { userId } });
    if (existing > 0) {
      return NextResponse.json(
        { message: 'Plano já gerado', count: existing },
        { status: 200 }
      );
    }

    const [profile, careerGoals, qualificationNeeds, skills, swotAnalysis] =
      await Promise.all([
        db.profile.findUnique({ where: { userId } }),
        db.careerGoals.findUnique({ where: { userId } }),
        db.qualificationNeeds.findUnique({ where: { userId } }),
        db.skill.findMany({ where: { userId }, orderBy: { score: 'asc' } }),
        db.swotAnalysis.findUnique({ where: { userId } }),
      ]);

    const generated = generatePlanFromData({
      profile,
      careerGoals,
      qualificationNeeds,
      skills: skills ?? [],
      swotAnalysis,
    });

    const created = await db.action.createMany({
      data: generated.map((a) => ({
        userId,
        title: a.title,
        description: a.description,
        quadrant: a.quadrant,
        status: 'TODO',
        order: a.order,
      })),
    });

    return NextResponse.json({
      message: 'Plano gerado com sucesso',
      count: created.count,
    });
  } catch (error) {
    console.error('Error generating plan:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar plano' },
      { status: 500 }
    );
  }
}
