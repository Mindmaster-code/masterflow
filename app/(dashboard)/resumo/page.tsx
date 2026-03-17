import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { ResumoVisual } from '@/components/resumo/resumo-visual';
import { ArrowLeft, TrendingUp, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function ResumoPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  const [progress, profile, qualification, careerGoals, skills, swotAnalysis, qualificationNeeds, actions] = await Promise.all([
    db.journeyProgress.findUnique({ where: { userId: session.user.id } }),
    db.profile.findUnique({ where: { userId: session.user.id } }),
    db.qualification.findUnique({ where: { userId: session.user.id } }),
    db.careerGoals.findUnique({ where: { userId: session.user.id } }),
    db.skill.findMany({ where: { userId: session.user.id }, orderBy: { score: 'asc' } }),
    db.swotAnalysis.findUnique({ where: { userId: session.user.id } }),
    db.qualificationNeeds.findUnique({ where: { userId: session.user.id } }),
    db.action.findMany({ where: { userId: session.user.id } }),
  ]);

  const totalInitiatives = actions.length;
  const completedInitiatives = actions.filter(a => a.status === 'DONE').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">

      {/* ── Page Header ── */}
      <div className="mb-8">
        <Link href="/dashboard">
          <Button
            variant="ghost"
            size="sm"
            className="text-white/45 hover:text-white hover:bg-white/5 rounded-xl mb-5 -ml-2 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Button>
        </Link>

        <div className="flex items-start gap-5">
          <div
            className="w-14 h-14 rounded-2xl brand-gradient flex items-center justify-center flex-shrink-0 shadow-2xl animate-float"
            style={{ boxShadow: '0 12px 32px rgba(0,151,167,0.35)' }}
          >
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="pill-badge text-xs">
                <Sparkles className="w-3 h-3" />
                Visão Geral
              </div>
              {progress && (
                <div className="pill-badge text-xs">
                  {progress.overallProgress}% concluído
                </div>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
              Resumo da <span className="brand-gradient-text">Jornada</span>
            </h1>
            <p className="text-white/45">
              Gráficos, análise SWOT, gap de skills e consultoria personalizada
            </p>
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="gradient-line mb-8" />

      <ResumoVisual
        progress={progress}
        profile={profile}
        qualification={qualification}
        careerGoals={careerGoals}
        qualificationNeeds={qualificationNeeds}
        skills={skills}
        swotAnalysis={swotAnalysis}
        objectives={[]}
        sprints={[]}
        totalInitiatives={totalInitiatives}
        completedInitiatives={completedInitiatives}
      />
    </div>
  );
}
