import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const userId = session.user.id;

    await db.journeyProgress.update({
      where: { userId },
      data: {
        step4Completed: true,
        currentStep: 5,
        overallProgress: 80,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error completing step 4:', error);
    return NextResponse.json(
      { error: 'Erro ao completar etapa' },
      { status: 500 }
    );
  }
}
