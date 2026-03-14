import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, User, Briefcase, Target, Flag, Rocket, CheckCircle2, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default async function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const { id } = await params;

  const student = await db.user.findUnique({
    where: { id },
    include: {
      profile: true,
      journeyProgress: true,
      qualifications: true,
      currentChallenges: true,
      careerGoals: true,
      qualificationNeeds: true,
      skills: true,
      swotAnalysis: true,
      actions: true,
    },
  });

  if (!student) {
    redirect('/admin/students');
  }

  const totalInitiatives = student.actions?.length ?? 0;
  const completedInitiatives = student.actions?.filter(a => a.status === 'DONE').length ?? 0;

  const completionSteps = [
    { id: 1, name: 'Ponto de Partida', completed: student.journeyProgress?.step1Completed, icon: User },
    { id: 2, name: 'Auto-Conhecimento', completed: student.journeyProgress?.step2Completed, icon: Briefcase },
    { id: 3, name: 'Mapeamento', completed: student.journeyProgress?.step3Completed, icon: Target },
    { id: 4, name: 'Plano de Ação', completed: student.journeyProgress?.step5Completed, icon: Rocket },
  ];

  return (
    <div className="container mx-auto p-6 max-w-7xl animate-fade-in">
      <div className="mb-8">
        <Link href="/admin/students">
          <Button variant="outline" size="sm" className="glass-premium rounded-lg mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Lista de Alunos
          </Button>
        </Link>

        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl premium-gradient flex items-center justify-center text-white font-bold text-2xl shadow-2xl">
            {student.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">{student.name}</h1>
            <p className="text-lg text-foreground/60">{student.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-blue-500/20 border-blue-500/40 text-blue-400">
                Cadastrado em {new Date(student.createdAt).toLocaleDateString('pt-BR')}
              </Badge>
              <Badge className="bg-purple-500/20 border-purple-500/40 text-purple-400">
                Última atividade: {new Date(student.updatedAt).toLocaleDateString('pt-BR')}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="premium-card border-blue-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Progresso Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold premium-gradient-text">
              {student.journeyProgress?.overallProgress || 0}%
            </p>
          </CardContent>
        </Card>

        <Card className="premium-card border-purple-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Ações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-400">{totalInitiatives}</p>
          </CardContent>
        </Card>

        <Card className="premium-card border-green-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Concluídas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-400">
              {completedInitiatives}/{totalInitiatives}
            </p>
          </CardContent>
        </Card>

        <Card className="premium-card border-orange-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Taxa</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-400">
              {totalInitiatives > 0 ? Math.round((completedInitiatives / totalInitiatives) * 100) : 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="premium-card mb-8">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            Progresso na Jornada
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold">Etapa Atual: {student.journeyProgress?.currentStep || 0} de 4</span>
              <span className="text-2xl font-bold premium-gradient-text">
                {student.journeyProgress?.overallProgress || 0}%
              </span>
            </div>
            <Progress value={student.journeyProgress?.overallProgress || 0} className="h-3" />

            <div className="grid md:grid-cols-4 gap-4 mt-8">
              {completionSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.id}
                    className={`p-4 rounded-xl text-center transition-all ${
                      step.completed
                        ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/40'
                        : 'bg-white/5 border border-white/10'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${
                        step.completed
                          ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                          : 'bg-gradient-to-br from-gray-600 to-gray-700'
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      ) : (
                        <Icon className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <p className="text-sm font-bold mb-1">Etapa {step.id}</p>
                    <p className="text-xs text-foreground/60">{step.name}</p>
                    {step.completed && (
                      <Badge className="mt-2 bg-green-500/20 border-green-500/40 text-green-400 text-xs">
                        ✓ Completo
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {student.profile && (
        <Card className="premium-card border-blue-500/30 mb-8">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <User className="w-5 h-5 text-blue-400" />
              Perfil Profissional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-foreground/60 mb-1">Cargo Atual</p>
                <p className="font-semibold text-lg">{student.profile.currentRole || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-sm text-foreground/60 mb-1">Empresa</p>
                <p className="font-semibold text-lg">{student.profile.currentCompany || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-sm text-foreground/60 mb-1">Tempo na Empresa</p>
                <p className="font-semibold text-lg">{student.profile.timeInCompany || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-sm text-foreground/60 mb-1">Faixa Salarial</p>
                <Badge className="bg-primary/20 border-primary/40 text-primary">
                  {student.profile.salaryRange}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {student.careerGoals && (
        <Card className="premium-card border-purple-500/30 mb-8">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" />
              Metas de Carreira
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-foreground/60 mb-1">Cargo Desejado</p>
                <p className="font-semibold text-lg">{student.careerGoals.desiredRole || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-sm text-foreground/60 mb-1">Salário Desejado</p>
                <p className="font-semibold text-lg text-green-400">{student.careerGoals.desiredSalary || 'Não informado'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {student.actions && student.actions.length > 0 && (
        <Card className="premium-card border-orange-500/30">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Flag className="w-5 h-5 text-orange-400" />
              Plano de Ação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {student.actions.map((action) => (
                <div key={action.id} className="p-4 rounded-xl glass-premium border border-orange-500/20">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{action.title}</p>
                      {action.description && (
                        <p className="text-sm text-foreground/60">{action.description}</p>
                      )}
                    </div>
                    <Badge
                      className={`text-xs ${
                        action.status === 'DONE'
                          ? 'bg-green-500/20 border-green-500/40 text-green-400'
                          : action.status === 'DOING'
                          ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400'
                          : 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                      }`}
                    >
                      {action.status === 'DONE' && '✓ '}
                      {action.status === 'TODO' ? 'A Fazer' : action.status === 'DOING' ? 'Em Progresso' : 'Concluída'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
