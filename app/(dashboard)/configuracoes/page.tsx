import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ChangePasswordForm } from '@/components/settings/change-password-form';
import { Settings, KeyRound } from 'lucide-react';

export default async function ConfiguracoesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  return (
    <div className="container mx-auto p-6 max-w-2xl animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 shadow-2xl">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Configurações</h1>
            <p className="text-lg text-foreground/60">Gerencie sua conta e preferências</p>
          </div>
        </div>
      </div>

      <div className="premium-card p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500">
            <KeyRound className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Alterar senha</h2>
            <p className="text-sm text-foreground/60">Use uma senha forte e mantenha-a em segredo</p>
          </div>
        </div>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
