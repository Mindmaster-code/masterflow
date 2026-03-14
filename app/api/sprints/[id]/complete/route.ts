import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = await params;

    const sprint = await db.sprint.update({
      where: { id },
      data: { status: 'COMPLETED' },
    });

    return NextResponse.json(sprint);
  } catch (error) {
    console.error('Error completing sprint:', error);
    return NextResponse.json(
      { error: 'Erro ao completar sprint' },
      { status: 500 }
    );
  }
}
