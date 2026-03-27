'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lock, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

function ResetPasswordFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    if (password !== confirm) {
      setError('As senhas não coincidem');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, confirmPassword: confirm }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Erro ao redefinir');
        return;
      }
      setDone(true);
      setTimeout(() => router.push('/login'), 2500);
    } catch {
      setError('Erro de rede. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="premium-card p-6 md:p-8 text-center">
        <p className="text-white/70 text-sm mb-4">Link inválido ou incompleto. Use o link enviado por e-mail ou solicite um novo em &quot;Esqueci minha senha&quot;.</p>
        <Link href="/forgot-password">
          <Button className="premium-button rounded-xl">Esqueci minha senha</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="premium-card p-6 md:p-8">
      {done ? (
        <div className="text-center space-y-4 py-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <p className="text-white/90 font-medium">Senha alterada!</p>
          <p className="text-white/50 text-sm">Redirecionando para o login...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl brand-gradient flex items-center justify-center" style={{ boxShadow: '0 6px 16px rgba(0,151,167,0.3)' }}>
              <Lock className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white/90">Nova senha</h2>
              <p className="text-xs text-white/35">Mínimo 6 caracteres</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm font-semibold text-white/65">
              Nova senha
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="premium-input h-12 rounded-xl"
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm" className="text-sm font-semibold text-white/65">
              Confirmar senha
            </Label>
            <Input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="premium-input h-12 rounded-xl"
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 p-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </p>
          )}

          <Button type="submit" disabled={isLoading} className="premium-button w-full h-12 rounded-xl">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar nova senha'
            )}
          </Button>
        </form>
      )}
    </div>
  );
}

export function ResetPasswordForm() {
  return (
    <Suspense
      fallback={
        <div className="premium-card p-8 text-center text-white/50 text-sm">Carregando...</div>
      }
    >
      <ResetPasswordFormInner />
    </Suspense>
  );
}
