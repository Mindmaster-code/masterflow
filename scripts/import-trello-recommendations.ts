/**
 * Importa recomendações a partir de um export JSON do Trello.
 * Uso: npx tsx scripts/import-trello-recommendations.ts path/to/trello-export.json
 *
 * Estrutura esperada do Trello:
 * - lists: array de { id, name }
 * - cards: array de { id, name, desc, url, idList, attachments?: [{ url }] }
 *   OU cards dentro de actions
 */
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function extractKeywordsFromListName(listName: string): string[] {
  const parts = listName
    .replace(/^Soft Skill:\s*/i, '')
    .replace(/^Tech Skill:\s*/i, '')
    .replace(/^Skill:\s*/i, '')
    .trim();
  const base = normalize(parts);
  const keywords = [parts, base];
  if (base.includes(' ')) {
    keywords.push(...base.split(/\s+/).filter((w) => w.length > 2));
  }
  return [...new Set(keywords)];
}

function inferType(name: string, desc: string): 'BOOK' | 'MOVIE' {
  const text = `${name} ${desc}`.toLowerCase();
  if (
    /\b(filme|movie|documentário|documentario|diretor|ano \d{4})\b/.test(text) ||
    /\b\d{4}\b.*\b(filme|movie)\b/.test(text)
  ) {
    return 'MOVIE';
  }
  return 'BOOK';
}

interface TrelloList {
  id: string;
  name: string;
}

interface TrelloCard {
  id: string;
  name: string;
  desc?: string;
  url?: string;
  idList?: string;
  attachments?: Array<{ url?: string }>;
}

interface TrelloBoard {
  lists?: TrelloList[];
  cards?: TrelloCard[];
  actions?: Array<{ data?: { card?: TrelloCard; list?: TrelloList } }>;
}

async function main() {
  const jsonPath = process.argv[2];
  if (!jsonPath) {
    console.error('Uso: npx tsx scripts/import-trello-recommendations.ts <path-to-trello-export.json>');
    process.exit(1);
  }

  const fullPath = path.resolve(process.cwd(), jsonPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`Arquivo não encontrado: ${fullPath}`);
    process.exit(1);
  }

  console.log(`📂 Lendo ${fullPath}...`);
  const raw = fs.readFileSync(fullPath, 'utf-8');
  const board: TrelloBoard = JSON.parse(raw);

  const lists = board.lists ?? [];
  const cards = board.cards ?? [];

  if (lists.length === 0 && cards.length === 0) {
    console.error('Nenhuma list ou card encontrado no JSON.');
    process.exit(1);
  }

  const listMap = new Map<string, TrelloList>();
  for (const list of lists) {
    listMap.set(list.id, list);
  }

  const cardsByList = new Map<string, TrelloCard[]>();
  for (const card of cards) {
    const listId = card.idList ?? 'unknown';
    if (!cardsByList.has(listId)) {
      cardsByList.set(listId, []);
    }
    cardsByList.get(listId)!.push(card);
  }

  console.log(`📚 Encontradas ${lists.length} listas e ${cards.length} cards.`);

  await prisma.recommendation.deleteMany({});
  await prisma.recCategory.deleteMany({});

  let totalRecs = 0;

  for (const list of lists) {
    const listCards = cardsByList.get(list.id) ?? [];
    if (listCards.length === 0) continue;

    const keywords = extractKeywordsFromListName(list.name);

    const recs = listCards.map((card, i) => {
      const type = inferType(card.name, card.desc ?? '');
      const coverUrl =
        card.attachments?.find((a) => a.url && /\.(jpg|jpeg|png|webp|gif)$/i.test(a.url))?.url ?? '';

      return {
        type,
        title: card.name.trim(),
        creator: '',
        coverUrl: coverUrl || undefined,
        why: (card.desc || card.name).trim().slice(0, 2000),
        url: card.url ?? undefined,
        order: i,
      };
    });

    await prisma.recCategory.create({
      data: {
        name: list.name,
        keywords,
        recs: { create: recs },
      },
    });

    totalRecs += recs.length;
    console.log(`  ✅ ${list.name}: ${recs.length} recomendações`);
  }

  const padrao = await prisma.recCategory.findFirst({ where: { name: 'Padrão' } });
  if (!padrao) {
    await prisma.recCategory.create({
      data: {
        name: 'Padrão',
        keywords: ['padrão', 'default'],
        recs: {
          create: [
            {
              type: 'BOOK',
              title: 'Mindset: A Nova Psicologia do Sucesso',
              creator: 'Carol S. Dweck',
              coverUrl: 'https://covers.openlibrary.org/b/isbn/9788543108742-M.jpg',
              why: 'A mentalidade de crescimento é o combustível de todo desenvolvimento de carreira.',
              order: 0,
            },
            {
              type: 'MOVIE',
              title: 'Em Busca da Felicidade',
              creator: 'Gabriele Muccino • 2006',
              coverUrl: 'https://image.tmdb.org/t/p/w185/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg',
              why: 'Chris Gardner vai de sem-teto a corretor de sucesso com determinação.',
              order: 1,
            },
          ],
        },
      },
    });
    console.log('  ✅ Padrão: 2 recomendações (fallback)');
  }

  console.log(`\n📚 Importação concluída: ${totalRecs} recomendações.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
