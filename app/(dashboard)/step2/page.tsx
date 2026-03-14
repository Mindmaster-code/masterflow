import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { Step2Form } from '@/components/journey/step2-form';
import { Badge } from '@/components/ui/badge';
import { Brain, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function Step2Page() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  const progress = await db.journeyProgress.findUnique({
    where: { userId: session.user.id },
  });

  if (!progress || progress.currentStep < 2) {
    redirect('/step1');
  }

  const careerGoals = await db.careerGoals.findUnique({
    where: { userId: session.user.id },
  });

  const qualificationNeeds = await db.qualificationNeeds.findUnique({
    where: { userId: session.user.id },
  });

  return (
    <div className="container mx-auto p-6 max-w-6xl animate-fade-in">
      <div className="mb-8 space-y-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="text-white/40 hover:text-white hover:bg-white/5 rounded-xl gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Dashboard
          </Button>
        </Link>

        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-500 shadow-2xl animate-float">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-cyan-500/20 border-cyan-500/40 text-cyan-400 text-sm px-3 py-1">
                ETAPA 2 DE 5
              </Badge>
              <Badge className="bg-green-500/20 border-green-500/40 text-green-400 text-sm px-3 py-1">
                {careerGoals ? '✓ PREENCHIDA' : '○ NÃO INICIADA'}
              </Badge>
            </div>
            <h1 className="text-4xl font-bold mb-2">Auto-Conhecimento</h1>
            <p className="text-lg text-foreground/60">Onde você quer chegar e o que precisa para isso</p>
          </div>
        </div>
      </div>

      <Step2Form
        initialCareerGoals={careerGoals}
        initialQualificationNeeds={qualificationNeeds}
        userId={session.user.id}
      />
    </div>
  );
}
