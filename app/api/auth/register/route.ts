import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import bcrypt from 'bcrypt';
import { db } from '@/lib/db';
import { registerSchema } from '@/lib/validations';
import { sendNewUserWelcomeEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Apenas administradores podem criar contas' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, email, password, role } = registerSchema.parse(body);

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        ...(role === 'STUDENT'
          ? {
              journeyProgress: {
                create: {
                  currentStep: 1,
                  overallProgress: 0,
                },
              },
            }
          : {}),
      },
    });

    const roleLabel = role === 'ADMIN' ? 'Administrador' : 'Aluno';
    const emailResult = await sendNewUserWelcomeEmail({
      to: email,
      name,
      loginEmail: email,
      plainPassword: password,
      roleLabel,
    });

    console.log('[register] email result', {
      to: email,
      emailSent: emailResult.ok,
      error: emailResult.ok ? undefined : emailResult.error,
    });

    return NextResponse.json(
      {
        message: 'Usuário criado com sucesso',
        userId: user.id,
        emailSent: emailResult.ok,
        ...(emailResult.ok ? {} : { emailWarning: emailResult.error }),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Erro ao criar usuário' },
      { status: 500 }
    );
  }
}
