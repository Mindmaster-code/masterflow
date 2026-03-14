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

    const { sprintId, whatWentWell, whatToImprove, actionItems } = await req.json();

    const retrospective = await db.retrospective.upsert({
      where: { sprintId },
      update: {
        whatWentWell,
        whatToImprove,
        actionItems,
      },
      create: {
        sprintId,
        whatWentWell,
        whatToImprove,
        actionItems,
      },
    });

    await db.sprint.update({
      where: { id: sprintId },
      data: { status: 'COMPLETED' },
    });

    return NextResponse.json(retrospective);
  } catch (error) {
    console.error('Error saving retrospective:', error);
    return NextResponse.json(
      { error: 'Erro ao salvar retrospectiva' },
      { status: 500 }
    );
  }
}
