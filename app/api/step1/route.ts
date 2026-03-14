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
    const { profile, qualifications, challenges } = await req.json();

    await db.$transaction([
      db.profile.upsert({
        where: { userId },
        update: profile,
        create: { ...profile, userId },
      }),
      db.qualification.upsert({
        where: { userId },
        update: qualifications,
        create: { ...qualifications, userId },
      }),
      db.currentChallenges.upsert({
        where: { userId },
        update: challenges,
        create: { ...challenges, userId },
      }),
      db.journeyProgress.update({
        where: { userId },
        data: {
          step1Completed: true,
          currentStep: 2,
          overallProgress: 20,
          lastActivityAt: new Date(),
        },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving step 1:', error);
    return NextResponse.json(
      { error: 'Erro ao salvar dados' },
      { status: 500 }
    );
  }
}
