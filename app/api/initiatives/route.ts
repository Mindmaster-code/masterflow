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

    const { title, description, keyResultId, quadrant, priority } = await req.json();

    const initiative = await db.initiative.create({
      data: {
        keyResultId,
        title,
        description,
        quadrant,
        priority: priority || 0,
        status: 'BACKLOG',
      },
    });

    return NextResponse.json(initiative);
  } catch (error) {
    console.error('Error creating initiative:', error);
    return NextResponse.json(
      { error: 'Erro ao criar iniciativa' },
      { status: 500 }
    );
  }
}
