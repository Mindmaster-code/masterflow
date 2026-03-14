import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import OpenAI from 'openai';

function stripHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 12000);
}

async function fetchLinkedInProfile(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
      },
    });
    if (!res.ok) return null;
    const html = await res.text();
    return stripHtml(html);
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const linkedinUrl = body.linkedinUrl?.trim();
    const profileContent = body.profileContent?.trim();
    const cargo = body.cargo?.trim() || undefined;

    let content = profileContent;

    if (!content && linkedinUrl) {
      const validUrl = linkedinUrl.startsWith('http') ? linkedinUrl : `https://${linkedinUrl}`;
      if (!validUrl.includes('linkedin.com/in/')) {
        return NextResponse.json(
          { error: 'URL inválida. Use um link do perfil LinkedIn (ex: linkedin.com/in/seu-usuario)' },
          { status: 400 }
        );
      }
      content = await fetchLinkedInProfile(validUrl);
      if (!content || content.length < 100) {
        return NextResponse.json(
          {
            error: 'Não foi possível acessar o perfil. Copie o conteúdo do seu perfil (About, Experiência, Skills) e cole no campo de texto abaixo.',
            needsFallback: true,
          },
          { status: 400 }
        );
      }
    }

    if (!content || content.length < 50) {
      return NextResponse.json(
        { error: 'Informe o link do LinkedIn ou cole o conteúdo do seu perfil.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Serviço de análise não configurado. Contate o administrador.' },
        { status: 503 }
      );
    }

    const openai = new OpenAI({ apiKey });
    const roleContext = cargo
      ? `O aluno está se preparando para o cargo de: ${cargo}. Adapte a análise e recomendações para esse cargo específico.`
      : 'Faça uma análise geral de boas práticas para perfil LinkedIn profissional.';

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Você é um especialista em carreira e recrutamento. Analise perfis do LinkedIn e forneça feedback estruturado em português brasileiro.
Responda em JSON com a estrutura exata:
{
  "pontosFortes": ["item1", "item2", "item3"],
  "pontosMelhoria": ["item1", "item2", "item3"],
  "recomendacoes": [
    { "titulo": "string", "descricao": "string", "prioridade": "alta" | "media" | "baixa" }
  ],
  "resumo": "string com 2-3 frases"
}
Seja objetivo e acionável. Priorize 3-5 itens em cada lista.`,
        },
        {
          role: 'user',
          content: `${roleContext}\n\nConteúdo do perfil LinkedIn:\n\n${content.slice(0, 10000)}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.5,
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      return NextResponse.json({ error: 'Erro ao gerar análise.' }, { status: 500 });
    }

    const analysis = JSON.parse(raw);

    await db.linkedInAnalysis.upsert({
      where: { userId: session.user.id! },
      create: {
        userId: session.user.id!,
        cargo: cargo || null,
        resumo: analysis.resumo || '',
        pontosFortes: analysis.pontosFortes || [],
        pontosMelhoria: analysis.pontosMelhoria || [],
        recomendacoes: analysis.recomendacoes || [],
      },
      update: {
        cargo: cargo || null,
        resumo: analysis.resumo || '',
        pontosFortes: analysis.pontosFortes || [],
        pontosMelhoria: analysis.pontosMelhoria || [],
        recomendacoes: analysis.recomendacoes || [],
      },
    });

    return NextResponse.json(analysis);
  } catch (e) {
    console.error('LinkedIn analyze error:', e);
    return NextResponse.json(
      { error: 'Erro ao analisar perfil. Tente novamente.' },
      { status: 500 }
    );
  }
}
