import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { db } from '@/lib/db';
import { forgotPasswordSchema } from '@/lib/validations';
import { sendPasswordResetEmail } from '@/lib/email';
import { ZodError } from 'zod';

const GENERIC_MESSAGE =
  'Se existir uma conta com este e-mail, enviaremos um link para redefinir a senha.';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = forgotPasswordSchema.parse(body);
    const normalized = email.trim().toLowerCase();

    const user = await db.user.findFirst({
      where: { email: { equals: normalized, mode: 'insensitive' } },
    });

    if (user) {
      await db.passwordResetToken.deleteMany({ where: { userId: user.id } });

      const token = randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      await db.passwordResetToken.create({
        data: {
          userId: user.id,
          token,
          expiresAt,
        },
      });

      const base = process.env.NEXTAUTH_URL || process.env.VERCEL_URL;
      const origin = base?.startsWith('http') ? base : base ? `https://${base}` : 'http://localhost:3000';
      const resetUrl = `${origin.replace(/\/$/, '')}/reset-password?token=${encodeURIComponent(token)}`;

      const emailResult = await sendPasswordResetEmail({
        to: user.email,
        name: user.name,
        resetUrl,
      });

      if (!emailResult.ok) {
        await db.passwordResetToken.deleteMany({ where: { token } });
        console.error('[forgot-password] e-mail não enviado:', emailResult.error);
      }
    }

    return NextResponse.json({ message: GENERIC_MESSAGE });
  } catch (error) {
    if (error instanceof ZodError) {
      const first = error.issues[0];
      return NextResponse.json(
        { error: first?.message ?? 'Dados inválidos' },
        { status: 400 }
      );
    }
    console.error('forgot-password:', error);
    return NextResponse.json({ error: 'Erro ao processar pedido' }, { status: 500 });
  }
}
