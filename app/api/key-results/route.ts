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

    const { title, description, targetValue, objectiveId } = await req.json();

    const keyResult = await db.keyResult.create({
      data: {
        objectiveId,
        title,
        description,
        targetValue,
      },
      include: {
        initiatives: true,
      },
    });

    return NextResponse.json(keyResult);
  } catch (error) {
    console.error('Error creating key result:', error);
    return NextResponse.json(
      { error: 'Erro ao criar resultado-chave' },
      { status: 500 }
    );
  }
}
