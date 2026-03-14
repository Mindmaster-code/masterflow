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
    const { title, quarter, year } = await req.json();

    const objective = await db.objective.create({
      data: {
        userId,
        title,
        quarter,
        year,
      },
      include: {
        keyResults: true,
      },
    });

    return NextResponse.json(objective);
  } catch (error) {
    console.error('Error creating objective:', error);
    return NextResponse.json(
      { error: 'Erro ao criar objetivo' },
      { status: 500 }
    );
  }
}
