import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PDFParse } from 'pdf-parse';

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

    const buffer = Buffer.from(await file.arrayBuffer());
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();
    const text = (result?.text || '').trim().slice(0, 12000);

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
