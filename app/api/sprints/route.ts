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
    const { name, startDate, endDate, initiativeIds } = await req.json();

    const sprintCount = await db.sprint.count({ where: { userId } });

    const sprint = await db.sprint.create({
      data: {
        userId,
        name,
        number: sprintCount + 1,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: 'ACTIVE',
      },
    });

    if (initiativeIds && initiativeIds.length > 0) {
      await db.initiative.updateMany({
        where: { id: { in: initiativeIds } },
        data: {
          sprintId: sprint.id,
          status: 'TODO',
        },
      });
    }

    return NextResponse.json(sprint);
  } catch (error) {
    console.error('Error creating sprint:', error);
    return NextResponse.json(
      { error: 'Erro ao criar sprint' },
      { status: 500 }
    );
  }
}
