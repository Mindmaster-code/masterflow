/**
 * Seed das recomendações de livros e filmes.
 * Migra os dados do SKILL_DB para o banco.
 * Para importar do Trello: npm run db:seed-trello -- path/to/trello-export.json
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SKILL_DB: Array<{
  keywords: string[];
  recs: Array<{
    type: 'BOOK' | 'MOVIE';
    title: string;
    creator: string;
    coverUrl: string;
    why: string;
  }>;
}> = [
  {
    keywords: ['gestão okr', 'gestao okr', 'okr', 'objectives and key results'],
    recs: [
      {
        type: 'BOOK',
        title: 'Avalie o que Importa',
        creator: 'John Doerr',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788550804552-M.jpg',
        why: 'O livro definitivo sobre OKRs. John Doerr mostra como Google, Intel e a Fundação Gates usam objetivos e resultados-chave para alinhar equipes e alcançar metas ambiciosas. Leitura obrigatória para quem quer dominar a metodologia.',
      },
      {
        type: 'MOVIE',
        title: 'Moneyball',
        creator: 'Bennett Miller • 2011',
        coverUrl: 'https://image.tmdb.org/t/p/w185/3oAa8mJJ97CH9AeGEY6vjAxqcvZ.jpg',
        why: 'Billy Beane usa métricas e objetivos claros para transformar um time. Mostra como definir o que importa e medir o que realmente gera resultado — a essência do pensamento OKR.',
      },
    ],
  },
  {
    keywords: ['scrum', 'kanban', 'scrum & kanban', 'gestão ágil', 'gestao agil', 'agile', 'metodologia ágil'],
    recs: [
      {
        type: 'BOOK',
        title: 'Scrum: O Dobro do Trabalho na Metade do Tempo',
        creator: 'Jeff Sutherland',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788543107165-M.jpg',
        why: 'O criador do Scrum explica a metodologia que revolucionou o desenvolvimento de produtos. Aprenda sprints, daily standups e como entregar valor de forma iterativa — essencial para qualquer profissional em ambientes ágeis.',
      },
      {
        type: 'MOVIE',
        title: 'A Rede Social',
        creator: 'David Fincher • 2010',
        coverUrl: 'https://image.tmdb.org/t/p/w185/n0ybibhJtQ5icDqTp8eRytcIHJx.jpg',
        why: 'A criação do Facebook em sprints intensos. Mostra velocidade de execução, iteração constante e foco no usuário — princípios centrais do Scrum e do pensamento ágil.',
      },
    ],
  },
  {
    keywords: ['design thinking', 'design sprint', 'inovação', 'inovacao'],
    recs: [
      {
        type: 'BOOK',
        title: 'Sprint: O Método Usado no Google para Testar e Aplicar Novas Ideias em Apenas Cinco Dias',
        creator: 'Jake Knapp',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788550801486-M.jpg',
        why: 'O Design Sprint do Google em formato prático. Aprenda a prototipar e validar ideias em 5 dias — metodologia que combina Design Thinking com execução ágil.',
      },
      {
        type: 'MOVIE',
        title: 'Steve Jobs',
        creator: 'Danny Boyle • 2015',
        coverUrl: 'https://image.tmdb.org/t/p/w185/7b19Sh0Aef5vGa0OFtvJxLe2SKQ.jpg',
        why: 'A obsessão de Jobs por produto, experiência do usuário e iteração. Mostra o pensamento centrado no usuário que define o Design Thinking.',
      },
    ],
  },
  {
    keywords: ['liderança', 'lideranca', 'lider', 'gestão de pessoas', 'gestao de pessoas', 'people management', 'equipe', 'team lead'],
    recs: [
      {
        type: 'BOOK',
        title: 'O Monge e o Executivo',
        creator: 'James C. Hunter',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788575420164-M.jpg',
        why: 'Ensina que liderança real vem do caráter, não do cargo. Com uma narrativa envolvente, mostra como construir autoridade genuína e motivar pessoas — essencial para quem está em transição para posições de gestão.',
      },
      {
        type: 'BOOK',
        title: 'Os 7 Hábitos das Pessoas Altamente Eficazes',
        creator: 'Stephen R. Covey',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788576840626-M.jpg',
        why: 'Liderança começa de dentro para fora. Covey mostra como construir a base de integridade e visão que separa gestores comuns de líderes que as pessoas realmente seguem.',
      },
    ],
  },
  {
    keywords: ['comunicação', 'comunicacao', 'oratoria', 'oratória', 'apresentação', 'apresentacao', 'falar em público', 'public speaking', 'expressão'],
    recs: [
      {
        type: 'BOOK',
        title: 'Como Fazer Amigos e Influenciar Pessoas',
        creator: 'Dale Carnegie',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788504018028-M.jpg',
        why: 'O clássico atemporal da comunicação interpessoal. Carnegie ensina a conectar genuinamente com qualquer pessoa — habilidade indispensável para networking, liderança e entrevistas.',
      },
      {
        type: 'MOVIE',
        title: 'O Discurso do Rei',
        creator: 'Tom Hooper • 2010',
        coverUrl: 'https://image.tmdb.org/t/p/w185/bIBrRoMDvOFJekW5W2v8IW28Pj2.jpg',
        why: 'Um rei supera uma gagueira severa para liderar um país em guerra. Mostra que comunicação poderosa não nasce da perfeição, mas da coragem de se expressar com autenticidade — mesmo com medo.',
      },
    ],
  },
  {
    keywords: ['negociação', 'negociacao', 'negociar', 'influência', 'influencia', 'persuasão', 'persuasao', 'convencer'],
    recs: [
      {
        type: 'BOOK',
        title: 'Como Chegar ao Sim',
        creator: 'Roger Fisher & William Ury',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788575422618-M.jpg',
        why: 'O método de negociação baseada em princípios de Harvard. Você aprende a separar pessoas de problemas e focar em interesses reais — resultado: acordos melhores, relacionamentos preservados.',
      },
      {
        type: 'MOVIE',
        title: 'Fome de Poder',
        creator: 'John Lee Hancock • 2016',
        coverUrl: 'https://image.tmdb.org/t/p/w185/oG9nGZDQ5W6RTHPDvEFI63RjuWj.jpg',
        why: 'Ray Kroc negocia cada oportunidade com persistência e visão estratégica. Mostra como entender o que a outra parte realmente quer é o segredo de qualquer negociação bem-sucedida.',
      },
    ],
  },
  {
    keywords: ['inteligência emocional', 'inteligencia emocional', 'autoconhecimento', 'autogestão', 'autogestao', 'emocional', 'resiliência', 'resiliencia'],
    recs: [
      {
        type: 'BOOK',
        title: 'Inteligência Emocional',
        creator: 'Daniel Goleman',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788539004485-M.jpg',
        why: 'O QI abre portas, mas a inteligência emocional determina quem prospera. Goleman mostra com pesquisa sólida como desenvolver autoconsciência, empatia e autocontrole — qualidades que definem líderes de alto nível.',
      },
      {
        type: 'BOOK',
        title: 'Mindset: A Nova Psicologia do Sucesso',
        creator: 'Carol S. Dweck',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788543108742-M.jpg',
        why: 'Entender se você tem mentalidade fixa ou de crescimento muda tudo. Dweck mostra com décadas de pesquisa como cultivar a resiliência para aprender com erros e crescer em qualquer área.',
      },
    ],
  },
  {
    keywords: ['produtividade', 'organização', 'organizacao', 'gestão do tempo', 'gestao do tempo', 'foco', 'prioridade', 'procrastinação', 'procrastinacao'],
    recs: [
      {
        type: 'BOOK',
        title: 'Essencialismo',
        creator: 'Greg McKeown',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788543102269-M.jpg',
        why: 'Fazer mais não é a resposta — é fazer o que importa. McKeown ensina a eliminar o trivial e concentrar energia no que gera impacto real. Para executivos, isso é diferencial competitivo.',
      },
      {
        type: 'MOVIE',
        title: 'O Jogo da Imitação',
        creator: 'Morten Tyldum • 2014',
        coverUrl: 'https://image.tmdb.org/t/p/w185/zSqJ1qFq8NXFfi7JeIYMlZHm0up.jpg',
        why: 'Alan Turing decifra o indecifrável com foco absoluto e pensamento diferente. Inspira a atacar seus objetivos de desenvolvimento com disciplina, criatividade e persistência inabalável.',
      },
    ],
  },
  {
    keywords: ['dados', 'analytics', 'excel', 'análise', 'analise', 'data', 'bi', 'power bi', 'sql', 'tableau', 'planilha', 'métricas', 'metricas'],
    recs: [
      {
        type: 'BOOK',
        title: 'Storytelling com Dados',
        creator: 'Cole Nussbaumer Knaflic',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788550804514-M.jpg',
        why: 'Ter dados é uma coisa. Comunicar insights de forma clara é outra — e mais rara. Este livro ensina a transformar números em histórias que convencem líderes e clientes.',
      },
      {
        type: 'MOVIE',
        title: 'Moneyball',
        creator: 'Bennett Miller • 2011',
        coverUrl: 'https://image.tmdb.org/t/p/w185/3oAa8mJJ97CH9AeGEY6vjAxqcvZ.jpg',
        why: 'Billy Beane usa análise de dados para vencer equipes com 4x mais orçamento. Mostra como o pensamento analítico transforma decisões e cria vantagem competitiva em qualquer área.',
      },
    ],
  },
  {
    keywords: ['vendas', 'venda', 'comercial', 'sales', 'prospecção', 'prospeccao', 'cliente', 'crm', 'receita'],
    recs: [
      {
        type: 'BOOK',
        title: 'SPIN Selling',
        creator: 'Neil Rackham',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788576843207-M.jpg',
        why: 'Baseado em pesquisa com 35.000 ligações de vendas reais, este livro revela que as melhores vendas não começam com um pitch — começam com as perguntas certas. Obrigatório para qualquer profissional comercial.',
      },
      {
        type: 'MOVIE',
        title: 'Em Busca da Felicidade',
        creator: 'Gabriele Muccino • 2006',
        coverUrl: 'https://image.tmdb.org/t/p/w185/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg',
        why: 'Chris Gardner vai de sem-teto a corretor de sucesso usando determinação e criatividade em vendas. Quando bater a dúvida, assista a esse filme — ele lembra que persistência bate talento.',
      },
    ],
  },
  {
    keywords: ['finanças', 'financas', 'financeiro', 'contabilidade', 'controladoria', 'custos', 'orçamento', 'orcamento', 'fluxo de caixa', 'investimento'],
    recs: [
      {
        type: 'BOOK',
        title: 'Pai Rico, Pai Pobre',
        creator: 'Robert T. Kiyosaki',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788528614459-M.jpg',
        why: 'Muda a forma como você pensa sobre dinheiro e ativos. Para executivos, entender a linguagem das finanças é fundamental — e Kiyosaki torna os conceitos acessíveis e práticos para qualquer pessoa.',
      },
      {
        type: 'MOVIE',
        title: 'A Grande Aposta',
        creator: 'Adam McKay • 2015',
        coverUrl: 'https://image.tmdb.org/t/p/w185/bWkfHyfUnpqgqUn6HKO3rSyI1kL.jpg',
        why: 'Mostra como entender instrumentos financeiros complexos pode ser uma vantagem competitiva enorme. A narrativa transforma conceitos difíceis em situações surpreendentemente claras e memoráveis.',
      },
    ],
  },
  {
    keywords: ['marketing', 'marca', 'branding', 'digital', 'mídia', 'midia', 'redes sociais', 'conteúdo', 'conteudo', 'inbound', 'growth'],
    recs: [
      {
        type: 'BOOK',
        title: 'A Vaca Roxa',
        creator: 'Seth Godin',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788576840992-M.jpg',
        why: 'Em um oceano de profissionais iguais, só o diferente se destaca. Godin explica por que ser "remarcável" é a única estratégia que funciona — inclusive para posicionar a sua própria carreira.',
      },
      {
        type: 'MOVIE',
        title: 'O Diabo Veste Prada',
        creator: 'David Frankel • 2006',
        coverUrl: 'https://image.tmdb.org/t/p/w185/nHjBDX1OAiHbXRvFCGkJjNYFkBm.jpg',
        why: 'Mostra o universo de marca, imagem e expectativa do cliente de um ângulo real e humano. A personagem de Anne Hathaway aprende que entender o que o cliente quer é o centro de qualquer trabalho de marketing.',
      },
    ],
  },
  {
    keywords: ['tecnologia', 'tech', 'inovação', 'inovacao', 'transformação digital', 'agile', 'scrum', 'software', 'produto', 'startup', 'desenvolvimento'],
    recs: [
      {
        type: 'BOOK',
        title: 'A Startup Enxuta',
        creator: 'Eric Ries',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788581780849-M.jpg',
        why: 'O manifesto do pensamento ágil. Validar, aprender, iterar — mesmo fora de startups, esse método é a forma mais eficiente de implementar mudanças, reduzir desperdício e entregar valor real.',
      },
      {
        type: 'MOVIE',
        title: 'A Rede Social',
        creator: 'David Fincher • 2010',
        coverUrl: 'https://image.tmdb.org/t/p/w185/n0ybibhJtQ5icDqTp8eRytcIHJx.jpg',
        why: 'A criação do Facebook mostra que velocidade de execução e foco obsessivo no usuário constroem produtos que mudam o mundo. A mentalidade é aplicável em qualquer setor.',
      },
    ],
  },
  {
    keywords: ['gestão de riscos', 'gestao de riscos', 'risk management', 'riscos', 'análise de riscos', 'analise de riscos'],
    recs: [
      {
        type: 'BOOK',
        title: 'O Cisne Negro',
        creator: 'Nassim Nicholas Taleb',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788576840008-M.jpg',
        why: 'Taleb mostra como eventos improváveis moldam o mundo e por que a gestão de riscos tradicional falha. Essencial para entender incerteza, probabilidade e como se preparar para o inesperado.',
      },
      {
        type: 'MOVIE',
        title: 'Margin Call',
        creator: 'J.C. Chandor • 2011',
        coverUrl: 'https://image.tmdb.org/t/p/w185/5S3x2t6w1L2z6QEpP9iO6F2LEZ8.jpg',
        why: 'Uma firma de investimentos descobre riscos catastróficos em plena crise. Mostra como identificar, comunicar e mitigar riscos em tempo real — decisões que separam sobrevivência de colapso.',
      },
    ],
  },
  {
    keywords: ['estratégia', 'estrategia', 'planejamento estratégico', 'planejamento estrategico', 'business strategy', 'posicionamento'],
    recs: [
      {
        type: 'BOOK',
        title: 'Jogando para Vencer',
        creator: 'A.G. Lafley & Roger Martin',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788543102382-M.jpg',
        why: 'O framework de estratégia mais usado em MBAs: "Onde jogar, como vencer". Baseado em casos reais da P&G, transforma estratégia de conceito abstrato em decisões concretas e executáveis.',
      },
    ],
  },
  {
    keywords: ['gestão de projetos', 'gestao de projetos', 'project management', 'pmp', 'pmbok', 'cronograma', 'entrega'],
    recs: [
      {
        type: 'BOOK',
        title: 'Essencialismo',
        creator: 'Greg McKeown',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9788543102269-M.jpg',
        why: 'Projetos falham quando tentamos fazer tudo ao mesmo tempo. Essencialismo ensina a identificar o que realmente move o projeto e concentrar energia no que gera impacto — habilidade central para gestores de projeto.',
      },
      {
        type: 'MOVIE',
        title: 'Estrelas Além do Tempo',
        creator: 'Theodore Melfi • 2016',
        coverUrl: 'https://image.tmdb.org/t/p/w185/yFeN0bZkMTZPNVHdCAOVpV8pCbp.jpg',
        why: 'As matemáticas da NASA gerenciam projetos críticos sob pressão extrema. Mostra como organização, precisão e trabalho em equipe constroem resultados impossíveis dentro de prazos impossíveis.',
      },
    ],
  },
];

const DEFAULT_RECS = [
  {
    type: 'BOOK' as const,
    title: 'Mindset: A Nova Psicologia do Sucesso',
    creator: 'Carol S. Dweck',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9788543108742-M.jpg',
    why: 'A mentalidade de crescimento é o combustível de todo desenvolvimento de carreira. Dweck mostra com pesquisa sólida como cultivar a resiliência para aprender qualquer habilidade nova e crescer continuamente.',
  },
  {
    type: 'MOVIE' as const,
    title: 'Em Busca da Felicidade',
    creator: 'Gabriele Muccino • 2006',
    coverUrl: 'https://image.tmdb.org/t/p/w185/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg',
    why: 'Chris Gardner vai de sem-teto a corretor de sucesso com zero de recursos e 100% de determinação. Nos momentos difíceis do seu plano de desenvolvimento, assista a esse filme.',
  },
];

export async function seedRecommendations() {
  console.log('📚 Seedando recomendações de livros e filmes...');

  await prisma.recommendation.deleteMany({});
  await prisma.recCategory.deleteMany({});

  for (const { keywords, recs } of SKILL_DB) {
    const cat = await prisma.recCategory.create({
      data: {
        name: keywords[0],
        keywords,
        recs: {
          create: recs.map((r, i) => ({
            type: r.type,
            title: r.title,
            creator: r.creator,
            coverUrl: r.coverUrl,
            why: r.why,
            order: i,
          })),
        },
      },
    });
    console.log(`  ✅ ${cat.name}: ${recs.length} recomendações`);
  }

  const padrao = await prisma.recCategory.create({
    data: {
      name: 'Padrão',
      keywords: ['padrão', 'default'],
      recs: {
        create: DEFAULT_RECS.map((r, i) => ({
          type: r.type,
          title: r.title,
          creator: r.creator,
          coverUrl: r.coverUrl,
          why: r.why,
          order: i,
        })),
      },
    },
  });
  console.log(`  ✅ ${padrao.name}: ${DEFAULT_RECS.length} recomendações (fallback)`);

  console.log('📚 Recomendações seedadas com sucesso!');
}
