'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Mail, Trash2, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

type Props = {
  userId: string;
  userName: string;
  userEmail: string;
  currentAdminId: string;
};

export function UserDangerActions({ userId, userName, userEmail, currentAdminId }: Props) {
  const router = useRouter();
  const [resendOpen, setResendOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  const canDelete = userId !== currentAdminId;

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFeedback('');
    try {
      const res = await fetch(`/api/admin/users/${userId}/send-access`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Erro ao enviar');
        return;
      }
      setFeedback(
        data.emailSent
          ? 'Senha atualizada e e-mail enviado.'
          : `Senha atualizada. E-mail: ${data.emailWarning || 'não enviado'}.`
      );
      setPassword('');
      router.refresh();
      setTimeout(() => {
        setResendOpen(false);
        setFeedback('');
      }, 2500);
    } catch {
      setError('Erro de rede. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Erro ao excluir');
        setLoading(false);
        return;
      }
      router.push('/admin/students');
      router.refresh();
    } catch {
      setError('Erro de rede.');
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" className="border-teal-500/30" onClick={() => { setResendOpen(true); setError(''); setFeedback(''); }}>
          <Mail className="w-4 h-4 mr-2" />
          Reenviar acesso
        </Button>
        {canDelete && (
          <Button
            type="button"
            variant="outline"
            className="border-red-500/40 text-red-400 hover:bg-red-500/10"
            onClick={() => { setDeleteOpen(true); setError(''); }}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir usuário
          </Button>
        )}
      </div>

      <Dialog open={resendOpen} onOpenChange={setResendOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reenviar acesso</DialogTitle>
            <DialogDescription>
              Gera uma nova senha (ou defina abaixo), atualiza o usuário e envia e-mail com link, login e senha.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleResend} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="resend-pw">Nova senha (opcional)</Label>
              <Input
                id="resend-pw"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Em branco = gerar senha automática"
                className="premium-input"
                autoComplete="new-password"
              />
              <p className="text-xs text-foreground/50">Mínimo 6 caracteres se preencher.</p>
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            {feedback && (
              <p className="text-sm text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {feedback}
              </p>
            )}
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setResendOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="premium-button">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enviar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              Excluir usuário
            </DialogTitle>
            <DialogDescription>
              Isso remove <strong>{userName}</strong> ({userEmail}) e os dados vinculados a esta conta. Não dá para desfazer.
            </DialogDescription>
          </DialogHeader>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Excluir definitivamente'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
