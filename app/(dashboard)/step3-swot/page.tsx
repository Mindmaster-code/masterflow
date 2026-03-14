import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { Step3SwotForm } from '@/components/journey/step3-swot-form';
import { Badge } from '@/components/ui/badge';
import { Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function Step3SwotPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  const progress = await db.journeyProgress.findUnique({
    where: { userId: session.user.id },
  });

  if (!progress || progress.currentStep < 3) {
    redirect('/step3');
  }

  const skills = await db.skill.findMany({
    where: { userId: session.user.id },
  });

  if (skills.length === 0) {
    redirect('/step3');
  }

  const swotAnalysis = await db.swotAnalysis.findUnique({
    where: { userId: session.user.id },
  });

  const lowScoreSkills = skills
    .filter(s => s.score <= 4)
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(s => s.name);

  return (
    <div className="container mx-auto p-6 max-w-6xl animate-fade-in">
      <div className="mb-8 space-y-4">
        <Link href="/dashboard">
          <Button variant="outline" size="sm" className="glass-premium rounded-lg mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Dashboard
          </Button>
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-2xl animate-float">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-pink-500/20 border-pink-500/40 text-pink-400 text-sm px-3 py-1">
                ETAPA 3 DE 5 - PARTE 2
              </Badge>
              <Badge className="bg-green-500/20 border-green-500/40 text-green-400 text-sm px-3 py-1">
                {swotAnalysis ? '✓ PREENCHIDA' : '○ PENDENTE'}
              </Badge>
            </div>
            <h1 className="text-4xl font-bold mb-2">Análise SWOT de Carreira</h1>
            <p className="text-lg text-foreground/60">Forças, Fraquezas, Oportunidades e Ameaças</p>
          </div>
        </div>
      </div>

      <Step3SwotForm
        initialSwotAnalysis={swotAnalysis}
        lowScoreSkills={lowScoreSkills}
        userId={session.user.id}
      />
    </div>
  );
}
