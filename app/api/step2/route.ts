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
    const { careerGoals, qualificationNeeds } = await req.json();

    await db.$transaction([
      db.careerGoals.upsert({
        where: { userId },
        update: careerGoals,
        create: { ...careerGoals, userId },
      }),
      db.qualificationNeeds.upsert({
        where: { userId },
        update: qualificationNeeds,
        create: { ...qualificationNeeds, userId },
      }),
      db.journeyProgress.update({
        where: { userId },
        data: {
          step2Completed: true,
          currentStep: 3,
          overallProgress: 40,
          lastActivityAt: new Date(),
        },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving step 2:', error);
    return NextResponse.json(
      { error: 'Erro ao salvar dados' },
      { status: 500 }
    );
  }
}
