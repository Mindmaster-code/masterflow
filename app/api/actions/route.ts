import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const actions = await db.action.findMany({
      where: { userId: session.user.id },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });

    return NextResponse.json(actions);
  } catch (error) {
    console.error('Error fetching actions:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar ações' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { title, description, quadrant } = await req.json();
    const titleNorm = (title || 'Nova ação').trim();

    // Prevent duplicates: if action with same title exists, return it
    const existing = await db.action.findFirst({
      where: {
        userId: session.user.id,
        title: titleNorm,
      },
    });
    if (existing) {
      return NextResponse.json(existing);
    }

    const count = await db.action.count({
      where: { userId: session.user.id },
    });

    const action = await db.action.create({
      data: {
        userId: session.user.id,
        title: titleNorm,
        description: description || '',
        quadrant: quadrant ?? 1,
        order: count,
      },
    });

    return NextResponse.json(action);
  } catch (error) {
    console.error('Error creating action:', error);
    return NextResponse.json(
      { error: 'Erro ao criar ação' },
      { status: 500 }
    );
  }
}
