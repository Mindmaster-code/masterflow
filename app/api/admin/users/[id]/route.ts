import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import bcrypt from 'bcrypt';
import { db } from '@/lib/db';
import { adminUpdateUserSchema } from '@/lib/validations';
import { ZodError } from 'zod';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = adminUpdateUserSchema.parse(body);

    const target = await db.user.findUnique({ where: { id } });
    if (!target) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    if (parsed.email !== target.email) {
      const taken = await db.user.findUnique({ where: { email: parsed.email } });
      if (taken) {
        return NextResponse.json({ error: 'Email já cadastrado' }, { status: 400 });
      }
    }

    if (target.role === 'ADMIN' && parsed.role === 'STUDENT') {
      const adminCount = await db.user.count({ where: { role: 'ADMIN' } });
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: 'Não é possível remover o último administrador da plataforma.' },
          { status: 400 }
        );
      }
    }

    const hashedPassword =
      parsed.password && parsed.password.length >= 6
        ? await bcrypt.hash(parsed.password, 10)
        : null;

    await db.$transaction(async (tx) => {
      await tx.user.update({
        where: { id },
        data: {
          name: parsed.name,
          email: parsed.email,
          role: parsed.role,
          ...(hashedPassword ? { password: hashedPassword } : {}),
        },
      });

      if (parsed.role === 'STUDENT') {
        const jp = await tx.journeyProgress.findUnique({ where: { userId: id } });
        if (!jp) {
          await tx.journeyProgress.create({
            data: {
              userId: id,
              currentStep: 1,
              overallProgress: 0,
            },
          });
        }
      }
    });

    return NextResponse.json({ message: 'Usuário atualizado' });
  } catch (error) {
    if (error instanceof ZodError) {
      const first = error.issues[0];
      return NextResponse.json(
        { error: first?.message ?? 'Dados inválidos' },
        { status: 400 }
      );
    }
    console.error('Admin update user:', error);
    return NextResponse.json({ error: 'Erro ao atualizar usuário' }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }

    const { id } = await params;

    if (id === session.user.id) {
      return NextResponse.json(
        { error: 'Não é possível excluir a própria conta.' },
        { status: 400 }
      );
    }

    const target = await db.user.findUnique({ where: { id } });
    if (!target) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    if (target.role === 'ADMIN') {
      const adminCount = await db.user.count({ where: { role: 'ADMIN' } });
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: 'Não é possível excluir o último administrador.' },
          { status: 400 }
        );
      }
    }

    await db.user.delete({ where: { id } });

    return NextResponse.json({ message: 'Usuário excluído' });
  } catch (error) {
    console.error('Admin delete user:', error);
    return NextResponse.json({ error: 'Erro ao excluir usuário' }, { status: 500 });
  }
}
