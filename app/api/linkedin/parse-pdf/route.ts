import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { extractText, getDocumentProxy } from 'unpdf';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('pdf') as File | null;

    if (!file || file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Envie um arquivo PDF válido.' },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'O arquivo deve ter no máximo 5MB.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocumentProxy(new Uint8Array(arrayBuffer));
    const { text: extractedText } = await extractText(pdf, { mergePages: true });
    const text = (extractedText || '').trim().slice(0, 12000);

    if (text.length < 50) {
      return NextResponse.json(
        { error: 'Não foi possível extrair texto suficiente do PDF. Verifique se é um PDF do perfil LinkedIn.' },
        { status: 400 }
      );
    }

    return NextResponse.json({ text });
  } catch (e) {
    console.error('PDF parse error:', e);
    return NextResponse.json(
      { error: 'Erro ao processar PDF. Verifique se o arquivo é válido.' },
      { status: 500 }
    );
  }
}
