'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Loader2, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Erro ao enviar');
        return;
      }
      setDone(true);
    } catch {
      setError('Erro de rede. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: '#060d18' }}>
      <div className="absolute inset-0 hero-bg" />
      <div className="orb orb-teal w-80 h-80 top-0 left-[-80px] animate-float" />
      <div className="orb orb-cyan w-64 h-64 bottom-0 right-[-60px] animate-float-delayed" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <Link href="/login" className="inline-flex items-center gap-2 text-white/35 hover:text-white/70 transition-colors text-sm mb-8">
          <ArrowLeft className="w-4 h-4" />
          Voltar ao login
        </Link>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image src="/mindmaster-logo.png" alt="MasterFlow" width={140} height={75} className="h-12 w-auto" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1.5">Esqueci minha senha</h1>
          <p className="text-white/40 text-sm">Enviaremos um link para redefinir no seu e-mail</p>
        </div>

        <div className="premium-card p-6 md:p-8">
          {done ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-xl brand-gradient flex items-center justify-center mx-auto">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <p className="text-white/80 text-sm leading-relaxed">
                Se existir uma conta com este e-mail, você receberá instruções para redefinir a senha. Verifique também a caixa de spam.
              </p>
              <Link href="/login">
                <Button variant="outline" className="w-full rounded-xl">
                  Voltar ao login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl brand-gradient flex items-center justify-center" style={{ boxShadow: '0 6px 16px rgba(0,151,167,0.3)' }}>
                  <KeyRound className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-white/90">Recuperação</h2>
                  <p className="text-xs text-white/35">Use o e-mail da sua conta</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-semibold text-white/65 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-teal-400" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="premium-input h-12 rounded-xl"
                  required
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
                    Enviando...
                  </>
                ) : (
                  'Enviar link'
                )}
              </Button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
