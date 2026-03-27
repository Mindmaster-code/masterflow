import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * Diagnóstico: confirma se RESEND_API_KEY e EMAIL_FROM existem no runtime (sem expor segredos).
 * GET — apenas admin, logado na mesma origem.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
  }

  const key = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim();

  return NextResponse.json({
    resendConfigured: Boolean(key && from),
    resendKeyPresent: Boolean(key),
    resendKeyStartsWithRe: Boolean(key?.startsWith('re_')),
    emailFromPresent: Boolean(from),
    nextAuthUrlPresent: Boolean(process.env.NEXTAUTH_URL?.trim()),
  });
}
