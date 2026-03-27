'use client';

import { useEffect, useState } from 'react';
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
import { Pencil, Loader2, CheckCircle2, GraduationCap, Shield } from 'lucide-react';

export type EditUserPayload = {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'ADMIN';
};

interface EditUserDialogProps {
  user: EditUserPayload;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditUserDialog({ user, open, onOpenChange }: EditUserDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    password: '',
    role: user.role,
  });

  useEffect(() => {
    if (open) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
      });
      setError('');
      setSuccess(false);
    }
  }, [open, user.id, user.name, user.email, user.role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    if (formData.password && formData.password.length > 0 && formData.password.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          password: formData.password || '',
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Erro ao atualizar');
      } else {
        setSuccess(true);
        router.refresh();
        setTimeout(() => {
          onOpenChange(false);
          setSuccess(false);
        }, 1200);
      }
    } catch {
      setError('Erro ao atualizar. Tente novamente.');
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
              <Pencil className="w-5 h-5 text-teal-400" />
              Editar usuário
            </DialogTitle>
            <DialogDescription>
              Altere nome, email, perfil ou defina uma nova senha (opcional).
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-role">Perfil de acesso</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: (value as 'STUDENT' | 'ADMIN') || 'STUDENT' })
                }
              >
                <SelectTrigger id="edit-role" className="premium-input w-full">
                  <SelectValue placeholder="Perfil" />
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
              <Label htmlFor="edit-name">Nome completo</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="premium-input"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="premium-input"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-password">Nova senha (opcional)</Label>
              <Input
                id="edit-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Deixe em branco para manter a atual"
                className="premium-input"
                autoComplete="new-password"
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            {success && (
              <p className="text-sm text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Usuário atualizado!
              </p>
            )}
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading || success} className="premium-button flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Salvo
                  </>
                ) : (
                  <>
                    <Pencil className="w-4 h-4 mr-2" />
                    Salvar
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
