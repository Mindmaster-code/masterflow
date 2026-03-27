import Link from 'next/link';
import Image from 'next/image';
import { ResetPasswordForm } from './reset-password-form';
import { ArrowLeft } from 'lucide-react';

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: '#060d18' }}>
      <div className="absolute inset-0 hero-bg" />
      <div className="orb orb-teal w-80 h-80 top-0 left-[-80px] animate-float" />
      <div className="orb orb-cyan w-64 h-64 bottom-0 right-[-60px] animate-float-delayed" />

      <div className="w-full max-w-md relative z-10">
        <Link href="/login" className="inline-flex items-center gap-2 text-white/35 hover:text-white/70 transition-colors text-sm mb-8">
          <ArrowLeft className="w-4 h-4" />
          Voltar ao login
        </Link>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image src="/mindmaster-logo.png" alt="MasterFlow" width={140} height={75} className="h-12 w-auto" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1.5">Redefinir senha</h1>
          <p className="text-white/40 text-sm">Defina uma nova senha para sua conta</p>
        </div>

        <ResetPasswordForm />
      </div>
    </div>
  );
}
