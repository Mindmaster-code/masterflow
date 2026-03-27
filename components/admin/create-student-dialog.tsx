'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { UserPlus, Loader2, CheckCircle2, GraduationCap, Shield } from 'lucide-react';

interface CreateStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateStudentDialog({ open, onOpenChange }: CreateStudentDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState<boolean | null>(null);
  const [emailWarning, setEmailWarning] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT' as 'STUDENT' | 'ADMIN',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);
    setEmailSent(null);
    setEmailWarning('');
    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Erro ao criar conta');
      } else {
        setSuccess(true);
        setEmailSent(data.emailSent === true);
        if (data.emailSent === false && data.emailWarning) {
          setEmailWarning(data.emailWarning);
        }
        setFormData({ name: '', email: '', password: '', role: 'STUDENT' });
        router.refresh();
        const closeDelay = data.emailSent === false && data.emailWarning ? 4000 : 2000;
        setTimeout(() => {
          onOpenChange(false);
          setSuccess(false);
          setEmailSent(null);
          setEmailWarning('');
        }, closeDelay);
      }
    } catch {
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <div className="premium-card rounded-xl -m-4 p-4">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-teal-400" />
            Cadastrar usuário
          </DialogTitle>
          <DialogDescription>
            Escolha o perfil e preencha os dados. Se o e-mail estiver configurado no servidor, enviamos automaticamente o link de login e a senha.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="role">Perfil de acesso</Label>
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData({ ...formData, role: (value as 'STUDENT' | 'ADMIN') || 'STUDENT' })
              }
            >
              <SelectTrigger id="role" className="premium-input w-full">
                <SelectValue placeholder="Selecione o perfil" />
              </SelectTrigger>
              <SelectContent className="premium-card max-w-[min(100vw-2rem,28rem)]">
                <SelectItem value="STUDENT" className="cursor-pointer">
                  <span className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 shrink-0 text-teal-400" />
                    Aluno (jornada e dashboard)
                  </span>
                </SelectItem>
                <SelectItem value="ADMIN" className="cursor-pointer">
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4 shrink-0 text-purple-400" />
                    Administrador (gestão de alunos)
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nome completo"
              className="premium-input"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="aluno@email.com"
              className="premium-input"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha (mín. 6 caracteres)</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="premium-input"
              required
              minLength={6}
            />
          </div>
          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}
          {success && emailSent === true && (
            <p className="text-sm text-emerald-400 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              Conta criada! Enviamos um e-mail com o link, login e senha (e lembrete para trocar a senha em Configurações).
            </p>
          )}
          {success && emailSent === false && (
            <div className="text-sm space-y-1">
              <p className="text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Conta criada.
              </p>
              <p className="text-amber-400/90">
                {emailWarning
                  ? `E-mail não enviado: ${emailWarning}. Envie o link e as credenciais manualmente.`
                  : 'E-mail não enviado (servidor sem Resend). Envie o link e as credenciais manualmente.'}
              </p>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || success}
              className="premium-button flex-1"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Criando...</>
              ) : success ? (
                <><CheckCircle2 className="w-4 h-4 mr-2" /> Criado!</>
              ) : (
                <><UserPlus className="w-4 h-4 mr-2" /> Criar conta</>
              )}
            </Button>
          </div>
        </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
