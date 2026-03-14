'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { LogIn, Loader2, Mail, Lock, ArrowLeft, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });
      if (result?.error) {
        setError('Email ou senha inválidos');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: '#060d18' }}>
      {/* Background */}
      <div className="absolute inset-0 hero-bg" />
      <div className="orb orb-teal w-80 h-80 top-0 left-[-80px] animate-float" />
      <div className="orb orb-cyan w-64 h-64 bottom-0 right-[-60px] animate-float-delayed" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-2 text-white/35 hover:text-white/70 transition-colors text-sm mb-8">
          <ArrowLeft className="w-4 h-4" />
          Voltar ao início
        </Link>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image src="/mindmaster-logo.svg" alt="MindMaster" width={140} height={35} className="h-9 w-auto" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1.5">
            Bem-vindo ao <span className="brand-gradient-text">MasterFlow</span>
          </h1>
          <p className="text-white/40 text-sm">Acesse sua jornada profissional</p>
        </div>

        {/* Card */}
        <div className="premium-card p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl brand-gradient flex items-center justify-center" style={{ boxShadow: '0 6px 16px rgba(13,148,136,0.3)' }}>
              <LogIn className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white/90">Entrar na Plataforma</h2>
              <p className="text-xs text-white/35">Digite suas credenciais</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-semibold text-white/65 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-teal-400" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="seu@email.com"
                className="premium-input h-12 rounded-xl"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-semibold text-white/65 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-teal-400" />
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="premium-input h-12 rounded-xl"
                required
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl text-sm text-red-400"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                {error}
              </motion.div>
            )}

            <Button type="submit" disabled={isLoading} className="premium-button w-full h-12 rounded-xl text-sm font-semibold">
              {isLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Entrando...</>
              ) : (
                <><LogIn className="w-4 h-4 mr-2" /> Entrar</>
              )}
            </Button>

            <p className="text-center text-sm text-white/40">
              Ainda não tem conta?{' '}
              <Link href="/register" className="text-teal-400 font-semibold hover:text-teal-300 transition-colors">
                Criar conta
              </Link>
            </p>
          </form>
        </div>

        {/* Hint */}
        <div className="mt-4 p-4 rounded-2xl glass-teal">
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-teal-300 mb-1">Primeiro acesso?</p>
              <p className="text-xs text-white/45 leading-relaxed">
                Use o email que você recebeu da <span className="text-white/70 font-medium">MindMaster</span> para acessar a plataforma.
              </p>
              <p className="text-xs text-white/30 mt-2 pt-2 border-t border-white/5">
                Teste: aluno@masterflow.com · senha123
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
