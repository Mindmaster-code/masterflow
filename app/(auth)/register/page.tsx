'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { UserPlus, Loader2, Mail, Lock, User, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      setIsLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Erro ao criar conta');
      } else {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 2000);
      }
    } catch {
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: '#060d18' }}>
      <div className="absolute inset-0 hero-bg" />
      <div className="orb orb-teal w-80 h-80 top-0 right-[-80px] animate-float" />
      <div className="orb orb-cyan w-64 h-64 bottom-0 left-[-60px] animate-float-delayed" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <Link href="/" className="inline-flex items-center gap-2 text-white/35 hover:text-white/70 transition-colors text-sm mb-8">
          <ArrowLeft className="w-4 h-4" />
          Voltar ao início
        </Link>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image src="/mindmaster-logo.svg" alt="MindMaster" width={140} height={35} className="h-9 w-auto" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1.5">
            Criar conta no <span className="brand-gradient-text">MasterFlow</span>
          </h1>
          <p className="text-white/40 text-sm">Comece sua jornada profissional</p>
        </div>

        <div className="premium-card p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl brand-gradient flex items-center justify-center" style={{ boxShadow: '0 6px 16px rgba(13,148,136,0.3)' }}>
              <UserPlus className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white/90">Criar Nova Conta</h2>
              <p className="text-xs text-white/35">Preencha os dados abaixo</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { id: 'name', type: 'text', icon: User, label: 'Nome Completo', placeholder: 'Seu nome completo', field: 'name' as const },
              { id: 'email', type: 'email', icon: Mail, label: 'Email', placeholder: 'seu@email.com', field: 'email' as const },
              { id: 'password', type: 'password', icon: Lock, label: 'Senha', placeholder: 'Mínimo 6 caracteres', field: 'password' as const },
              { id: 'confirmPassword', type: 'password', icon: Lock, label: 'Confirmar Senha', placeholder: 'Digite a senha novamente', field: 'confirmPassword' as const },
            ].map(({ id, type, icon: Icon, label, placeholder, field }) => (
              <div key={id} className="space-y-1.5">
                <Label htmlFor={id} className="text-sm font-semibold text-white/65 flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-teal-400" />
                  {label}
                </Label>
                <Input
                  id={id}
                  type={type}
                  value={formData[field]}
                  onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                  placeholder={placeholder}
                  className="premium-input h-12 rounded-xl"
                  required
                />
              </div>
            ))}

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

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl text-sm text-emerald-400 flex items-center gap-2"
                style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}
              >
                <CheckCircle2 className="w-4 h-4" />
                Conta criada! Redirecionando...
              </motion.div>
            )}

            <Button type="submit" disabled={isLoading || success} className="premium-button w-full h-12 rounded-xl text-sm font-semibold mt-2">
              {isLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Criando conta...</>
              ) : success ? (
                <><CheckCircle2 className="w-4 h-4 mr-2" /> Conta criada!</>
              ) : (
                <><UserPlus className="w-4 h-4 mr-2" /> Criar Conta</>
              )}
            </Button>

            <p className="text-center text-sm text-white/40 pt-1">
              Já tem uma conta?{' '}
              <Link href="/login" className="text-teal-400 font-semibold hover:text-teal-300 transition-colors">
                Fazer login
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
