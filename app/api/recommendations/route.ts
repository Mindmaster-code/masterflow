import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const skill = searchParams.get('skill')?.trim();

    if (!skill) {
      return NextResponse.json(
        { error: 'Parâmetro skill é obrigatório' },
        { status: 400 }
      );
    }

    const n = normalize(skill);

    const categories = await db.recCategory.findMany({
      include: {
        recs: { orderBy: { order: 'asc' } },
      },
    });

    for (const cat of categories) {
      const keywords = cat.keywords.map(normalize);
      if (keywords.some((kw) => n.includes(kw) || kw.includes(n))) {
        const recs = cat.recs.map((r) => ({
          type: r.type.toLowerCase() as 'book' | 'movie',
          title: r.title,
          creator: r.creator ?? '',
          coverUrl: r.coverUrl ?? '',
          why: r.why,
        }));
        return NextResponse.json(recs);
      }
    }

    // Fallback: recomendações padrão (categoria "Padrão")
    const defaultCat = await db.recCategory.findFirst({
      where: { name: 'Padrão' },
      include: { recs: { orderBy: { order: 'asc' } } },
    });

    if (defaultCat?.recs.length) {
      const recs = defaultCat.recs.map((r) => ({
        type: r.type.toLowerCase() as 'book' | 'movie',
        title: r.title,
        creator: r.creator ?? '',
        coverUrl: r.coverUrl ?? '',
        why: r.why,
      }));
      return NextResponse.json(recs);
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar recomendações' },
      { status: 500 }
    );
  }
}
