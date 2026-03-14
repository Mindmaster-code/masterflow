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

    const analysis = await db.linkedInAnalysis.findUnique({
      where: { userId: session.user.id },
    });

    if (!analysis) {
      return NextResponse.json(null);
    }

    return NextResponse.json({
      pontosFortes: analysis.pontosFortes as string[],
      pontosMelhoria: analysis.pontosMelhoria as string[],
      recomendacoes: analysis.recomendacoes as { titulo: string; descricao: string; prioridade: string }[],
      resumo: analysis.resumo,
      cargo: analysis.cargo,
      createdAt: analysis.createdAt,
    });
  } catch (e) {
    console.error('LinkedIn analysis fetch error:', e);
    return NextResponse.json(
      { error: 'Erro ao buscar análise.' },
      { status: 500 }
    );
  }
}
