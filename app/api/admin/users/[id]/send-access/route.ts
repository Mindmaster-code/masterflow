import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import bcrypt from 'bcrypt';
import { db } from '@/lib/db';
import { adminSendAccessSchema } from '@/lib/validations';
import { sendNewUserWelcomeEmail } from '@/lib/email';
import { ZodError } from 'zod';
import { randomBytes } from 'crypto';

function generateTempPassword(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let out = '';
  const buf = randomBytes(12);
  for (let i = 0; i < 12; i++) {
    out += chars[buf[i]! % chars.length];
  }
  return out;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const parsed = adminSendAccessSchema.parse(body);

    const user = await db.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    let plainPassword: string;
    const p = parsed.password?.trim();
    if (!p) {
      plainPassword = generateTempPassword();
    } else if (p.length >= 6) {
      plainPassword = p;
    } else {
      return NextResponse.json(
        { error: 'Senha deve ter pelo menos 6 caracteres ou deixe em branco para gerar automaticamente.' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    await db.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    const roleLabel = user.role === 'ADMIN' ? 'Administrador' : 'Aluno';
    const emailResult = await sendNewUserWelcomeEmail({
      to: user.email,
      name: user.name,
      loginEmail: user.email,
      plainPassword,
      roleLabel,
    });

    console.log('[send-access] email result', {
      userId: id,
      emailSent: emailResult.ok,
      error: emailResult.ok ? undefined : emailResult.error,
    });

    return NextResponse.json({
      message: emailResult.ok ? 'E-mail enviado' : 'Senha atualizada; falha ao enviar e-mail',
      emailSent: emailResult.ok,
      ...(emailResult.ok ? {} : { emailWarning: emailResult.error }),
    });
  } catch (error) {
    if (error instanceof ZodError) {
      const first = error.issues[0];
      return NextResponse.json(
        { error: first?.message ?? 'Dados inválidos' },
        { status: 400 }
      );
    }
    console.error('Admin send-access:', error);
    return NextResponse.json({ error: 'Erro ao reenviar acesso' }, { status: 500 });
  }
}
