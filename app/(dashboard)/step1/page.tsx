import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { Step1Form } from '@/components/journey/step1-form';
import { MapPin, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function Step1Page() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  const profile = await db.profile.findUnique({
    where: { userId: session.user.id },
  });

  const qualification = await db.qualification.findUnique({
    where: { userId: session.user.id },
  });

  const challenges = await db.currentChallenges.findUnique({
    where: { userId: session.user.id },
  });

  const filled = !!(profile || qualification || challenges);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <Link href="/dashboard">
          <Button
            variant="ghost"
            size="sm"
            className="text-white/40 hover:text-white hover:bg-white/5 rounded-xl gap-2 mb-5 -ml-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Button>
        </Link>

        <div className="flex items-start gap-5">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(0,151,167,0.2) 0%, rgba(158,158,158,0.2) 100%)',
              border: '1px solid rgba(0,151,167,0.25)',
              boxShadow: '0 8px 24px rgba(0,151,167,0.12)',
            }}
          >
            <MapPin className="w-6 h-6 text-teal-400" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="pill-badge text-xs">Etapa 1 de 4</div>
              <div
                className={`pill-badge text-xs ${filled ? 'text-emerald-400' : 'text-white/40'}`}
                style={filled ? { background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.2)' } : {}}
              >
                {filled ? '✓ Preenchida' : '● Não iniciada'}
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
              Ponto de <span className="brand-gradient-text">Partida</span>
            </h1>
            <p className="text-white/45 text-sm">
              Perfil profissional, qualificações e motivações
            </p>
          </div>
        </div>
      </div>

      <div className="gradient-line mb-8" />

      <Step1Form
        initialProfile={profile}
        initialQualifications={qualification}
        initialChallenges={challenges}
        userId={session.user.id}
      />
    </div>
  );
}
