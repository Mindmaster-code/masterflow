import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { db } from '@/lib/db';
import { resetPasswordSchema } from '@/lib/validations';
import { ZodError } from 'zod';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, password } = resetPasswordSchema.parse(body);

    const record = await db.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!record || record.usedAt) {
      return NextResponse.json(
        { error: 'Link inválido ou já utilizado. Solicite um novo em "Esqueci minha senha".' },
        { status: 400 }
      );
    }

    if (record.expiresAt < new Date()) {
      await db.passwordResetToken.delete({ where: { id: record.id } });
      return NextResponse.json(
        { error: 'Este link expirou. Solicite um novo em "Esqueci minha senha".' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.$transaction([
      db.user.update({
        where: { id: record.userId },
        data: { password: hashedPassword },
      }),
      db.passwordResetToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return NextResponse.json({ message: 'Senha alterada com sucesso. Você já pode entrar.' });
  } catch (error) {
    if (error instanceof ZodError) {
      const first = error.issues[0];
      return NextResponse.json(
        { error: first?.message ?? 'Dados inválidos' },
        { status: 400 }
      );
    }
    console.error('reset-password:', error);
    return NextResponse.json({ error: 'Erro ao redefinir senha' }, { status: 500 });
  }
}
