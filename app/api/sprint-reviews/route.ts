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

    const { sprintId, initiativeId, evaluation, notes } = await req.json();

    const review = await db.sprintReview.upsert({
      where: {
        sprintId_initiativeId: {
          sprintId,
          initiativeId,
        },
      },
      update: {
        evaluation,
        notes,
      },
      create: {
        sprintId,
        initiativeId,
        evaluation,
        notes,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error('Error saving sprint review:', error);
    return NextResponse.json(
      { error: 'Erro ao salvar avaliação' },
      { status: 500 }
    );
  }
}
