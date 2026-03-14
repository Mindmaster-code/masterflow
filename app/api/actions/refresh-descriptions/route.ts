import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

function isAgileRelated(name: string): boolean {
  const n = name.toLowerCase();
  return /scrum|kanban|okr|design thinking|gestão ágil|gestao agil|lean|backlog|estimativa|agilidade/i.test(n);
}

const YOUTUBE_COURSERA_UDEMY = /YouTube|Coursera|Udemy|youtube|coursera|udemy/i;

function getNewDescription(action: { title: string; description: string }): string | null {
  if (action.title.startsWith('Elevar ')) {
    const match = action.title.match(/Elevar (.+): (\d+) → (\d+)\/10/);
    if (match) {
      const skillName = match[1].trim();
      return isAgileRelated(skillName)
        ? `Reserve 30 min/dia para praticar ${skillName}. Consulte os cursos e conteúdos da MindMaster Treinamentos — especialistas em metodologias ágeis. Em 4 semanas reavalie sua nota.`
        : `Reserve 30 min/dia para praticar ${skillName}. Busque livros, artigos e prática em projetos. Em 4 semanas reavalie sua nota.`;
    }
  }
  if (action.title.startsWith('Concluir curso: ')) {
    const course = action.title.replace('Concluir curso: ', '').trim();
    return isAgileRelated(course)
      ? `Consulte os cursos da MindMaster Treinamentos em "${course}". Defina uma data de término e bloqueie na agenda. Dedique pelo menos 5h por semana.`
      : `Defina uma data de término para "${course}" e bloqueie na agenda. Dedique pelo menos 5h por semana. Busque conteúdos de qualidade sobre o tema.`;
  }
  // Fallback: remove YouTube/Coursera/Udemy de qualquer descrição que os mencione
  if (YOUTUBE_COURSERA_UDEMY.test(action.description)) {
    const cleaned = action.description
      .replace(/\s*Procure no YouTube, Coursera ou Udemy[^.]*\./gi, '')
      .replace(/\s*Busque no YouTube, Coursera ou Udemy[^.]*\./gi, '')
      .replace(/\s*[Pp]rocure (no |em )?YouTube, Coursera ou Udemy[^.]*\./gi, '')
      .replace(/\s*[Bb]usque (no |em )?YouTube, Coursera ou Udemy[^.]*\./gi, '')
      .trim()
      .replace(/\s{2,}/g, ' ')
      .replace(/\.\s*\./g, '.');
    return cleaned.length > 0 ? cleaned : null;
  }
  return null;
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const actions = await db.action.findMany({
      where: { userId: session.user.id },
    });

    let updated = 0;
    for (const action of actions) {
      const newDesc = getNewDescription(action);
      if (newDesc && newDesc !== action.description) {
        await db.action.update({
          where: { id: action.id },
          data: { description: newDesc },
        });
        updated++;
      }
    }

    return NextResponse.json({ message: 'Descrições atualizadas', updated });
  } catch (error) {
    console.error('Error refreshing descriptions:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar descrições' },
      { status: 500 }
    );
  }
}
