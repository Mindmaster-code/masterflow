import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const userId = session.user.id;
    const { skills, swot } = await req.json();

    if (skills) {
      await db.skill.deleteMany({
        where: { userId },
      });

      const skillEntries = Object.entries(skills).map(([name, score]) => ({
        userId,
        name,
        score: score as number,
        category: Object.entries({
          STRATEGIC: ['Pensamento Estratégico', 'Visão de Negócio', 'Tomada de Decisão', 'Gestão de Projetos', 'Liderança', 'Gestão de Pessoas'],
          TECHNICAL: ['Domínio Técnico', 'Inovação', 'Análise de Dados', 'Solução de Problemas', 'Gestão de Processos'],
          COMMUNICATION: ['Comunicação', 'Negociação', 'Networking', 'Trabalho em Equipe', 'Inteligência Emocional'],
        }).find(([cat, list]) => list.includes(name))?.[0] as any || 'STRATEGIC',
      }));

      await db.skill.createMany({
        data: skillEntries,
      });
    }

    if (swot) {
      await db.swotAnalysis.upsert({
        where: { userId },
        update: {
          strengths: swot.strengths,
          weaknesses: swot.weaknesses,
          opportunities: swot.opportunities,
          threats: swot.threats,
          lowScoreSkills: swot.lowScoreSkills,
          skillsToDevelop: swot.skillsToDevelop,
          useStrengthsForOpportunities: swot.useStrengthsForOpportunities,
          reduceWeaknessesAvoidThreats: swot.reduceWeaknessesAvoidThreats,
        },
        create: {
          userId,
          strengths: swot.strengths,
          weaknesses: swot.weaknesses,
          opportunities: swot.opportunities,
          threats: swot.threats,
          lowScoreSkills: swot.lowScoreSkills,
          skillsToDevelop: swot.skillsToDevelop,
          useStrengthsForOpportunities: swot.useStrengthsForOpportunities,
          reduceWeaknessesAvoidThreats: swot.reduceWeaknessesAvoidThreats,
        },
      });

      await db.journeyProgress.update({
        where: { userId },
        data: {
          step3Completed: true,
          step4Completed: true,
          currentStep: 4,
          overallProgress: 80,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving step 3:', error);
    return NextResponse.json(
      { error: 'Erro ao salvar dados' },
      { status: 500 }
    );
  }
}
