import { Resend } from 'resend';

function getBaseUrl(): string {
  const url = process.env.NEXTAUTH_URL || process.env.VERCEL_URL;
  if (!url) return 'http://localhost:3000';
  if (url.startsWith('http')) return url;
  return `https://${url}`;
}

export type SendWelcomeEmailParams = {
  to: string;
  name: string;
  loginEmail: string;
  plainPassword: string;
  roleLabel: string;
};

/** Aceita só o e-mail (ex.: onboarding@resend.dev) ou o formato completo "Nome <email>". */
function normalizeEmailFrom(raw: string): string {
  const s = raw.trim();
  if (/<[^>]+>/.test(s)) return s;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) {
    return `MasterFlow <${s}>`;
  }
  return s;
}

function formatResendError(err: unknown): string {
  if (err == null) return 'Falha ao enviar e-mail';
  if (typeof err === 'string') return err;
  if (typeof err === 'object' && 'message' in err && (err as { message: unknown }).message != null) {
    return String((err as { message: unknown }).message);
  }
  try {
    return JSON.stringify(err);
  } catch {
    return 'Falha ao enviar e-mail';
  }
}

export async function sendNewUserWelcomeEmail(params: SendWelcomeEmailParams): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromRaw = process.env.EMAIL_FROM?.trim();
  const from = fromRaw ? normalizeEmailFrom(fromRaw) : '';

  if (!apiKey || !fromRaw) {
    console.warn('[email] RESEND_API_KEY ou EMAIL_FROM não configurados — e-mail não enviado.');
    return { ok: false, error: 'Email não configurado no servidor' };
  }

  const loginUrl = `${getBaseUrl().replace(/\/$/, '')}/login`;

  const resend = new Resend(apiKey);

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="utf-8" /></head>
<body style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #0f172a; max-width: 560px; margin: 0 auto; padding: 24px;">
  <p>Olá, <strong>${escapeHtml(params.name)}</strong>,</p>
  <p>Sua conta na plataforma <strong>MasterFlow</strong> (${escapeHtml(params.roleLabel)}) foi criada.</p>
  <p>Use os dados abaixo para o primeiro acesso:</p>
  <ul style="padding-left: 1.25rem;">
    <li><strong>Link de acesso:</strong> <a href="${escapeHtml(loginUrl)}">${escapeHtml(loginUrl)}</a></li>
    <li><strong>Login (e-mail):</strong> ${escapeHtml(params.loginEmail)}</li>
    <li><strong>Senha:</strong> ${escapeHtml(params.plainPassword)}</li>
  </ul>
  <p style="margin-top: 1.5rem; padding: 12px 16px; background: #f0fdfa; border-radius: 8px; border: 1px solid #99f6e4;">
    Depois de entrar, você pode <strong>alterar sua senha</strong> em <strong>Configurações</strong> no menu da plataforma.
  </p>
  <p style="color: #64748b; font-size: 14px; margin-top: 24px;">— Equipe MindMaster / MasterFlow</p>
</body>
</html>`;

  const text = [
    `Olá, ${params.name},`,
    '',
    `Sua conta na plataforma MasterFlow (${params.roleLabel}) foi criada.`,
    '',
    'Dados para o primeiro acesso:',
    `Link: ${loginUrl}`,
    `Login (e-mail): ${params.loginEmail}`,
    `Senha: ${params.plainPassword}`,
    '',
    'Depois de entrar, você pode alterar sua senha em Configurações no menu da plataforma.',
    '',
    '— Equipe MindMaster / MasterFlow',
  ].join('\n');

  try {
    const { data, error } = await resend.emails.send({
      from,
      to: params.to,
      subject: 'Sua conta MasterFlow — dados de acesso',
      html,
      text,
    });

    if (error) {
      const msg = formatResendError(error);
      console.error('[email] Resend error:', error);
      return { ok: false, error: msg };
    }

    if (!data?.id) {
      console.warn('[email] Resend retornou sem id de mensagem:', { data });
    }

    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Erro ao enviar e-mail';
    console.error('[email]', e);
    return { ok: false, error: message };
  }
}

export type SendPasswordResetEmailParams = {
  to: string;
  name: string;
  resetUrl: string;
};

export async function sendPasswordResetEmail(
  params: SendPasswordResetEmailParams
): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromRaw = process.env.EMAIL_FROM?.trim();
  const from = fromRaw ? normalizeEmailFrom(fromRaw) : '';

  if (!apiKey || !fromRaw) {
    console.warn('[email] RESEND_API_KEY ou EMAIL_FROM não configurados — e-mail de recuperação não enviado.');
    return { ok: false, error: 'Email não configurado no servidor' };
  }

  const resend = new Resend(apiKey);

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="utf-8" /></head>
<body style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #0f172a; max-width: 560px; margin: 0 auto; padding: 24px;">
  <p>Olá, <strong>${escapeHtml(params.name)}</strong>,</p>
  <p>Recebemos um pedido para <strong>redefinir a senha</strong> da sua conta MasterFlow.</p>
  <p><a href="${escapeHtml(params.resetUrl)}" style="display:inline-block;padding:12px 20px;background:#0097A7;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">Redefinir senha</a></p>
  <p style="font-size:14px;color:#64748b;">Ou copie o link: ${escapeHtml(params.resetUrl)}</p>
  <p style="font-size:14px;color:#64748b;">O link expira em <strong>1 hora</strong>. Se você não pediu isso, ignore este e-mail.</p>
  <p style="color: #64748b; font-size: 14px; margin-top: 24px;">— Equipe MindMaster / MasterFlow</p>
</body>
</html>`;

  const text = [
    `Olá, ${params.name},`,
    '',
    'Para redefinir sua senha MasterFlow, acesse:',
    params.resetUrl,
    '',
    'O link expira em 1 hora. Se você não pediu, ignore este e-mail.',
    '',
    '— Equipe MindMaster / MasterFlow',
  ].join('\n');

  try {
    const { data, error } = await resend.emails.send({
      from,
      to: params.to,
      subject: 'MasterFlow — redefinir senha',
      html,
      text,
    });

    if (error) {
      const msg = formatResendError(error);
      console.error('[email] Resend (reset):', error);
      return { ok: false, error: msg };
    }

    if (!data?.id) {
      console.warn('[email] Resend reset sem id:', { data });
    }

    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Erro ao enviar e-mail';
    console.error('[email] reset', e);
    return { ok: false, error: message };
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
