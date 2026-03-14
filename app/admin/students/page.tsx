import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp, Eye, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default async function AdminStudentsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const students = await db.user.findMany({
    where: { role: 'STUDENT' },
    include: {
      profile: true,
      journeyProgress: true,
      _count: {
        select: {
          objectives: true,
          sprints: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const totalStudents = students.length;
  const averageProgress = students.length > 0
    ? Math.round(students.reduce((sum, s) => sum + (s.journeyProgress?.overallProgress || 0), 0) / students.length)
    : 0;

  const activeStudents = students.filter(s => s.journeyProgress && s.journeyProgress.currentStep > 1).length;

  const getStepName = (step: number) => {
    const steps = ['', 'Ponto de Partida', 'Auto-Conhecimento', 'Mapeamento', 'Destino', 'Plano de Ação'];
    return steps[step] || 'Não iniciado';
  };

  const getStepColor = (step: number) => {
    const colors = [
      'from-gray-500 to-gray-600',
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-blue-500',
      'from-pink-500 to-purple-500',
      'from-orange-500 to-pink-500',
      'from-green-500 to-emerald-500',
    ];
    return colors[step] || colors[0];
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-2xl">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Gestão de Alunos</h1>
            <p className="text-lg text-foreground/60">Acompanhe o progresso de todos os estudantes</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="premium-card border-blue-500/30">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-base">Total de Alunos</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-400">{totalStudents}</p>
              <p className="text-sm text-foreground/60 mt-1">cadastrados na plataforma</p>
            </CardContent>
          </Card>

          <Card className="premium-card border-green-500/30">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-base">Progresso Médio</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold premium-gradient-text">{averageProgress}%</p>
              <p className="text-sm text-foreground/60 mt-1">de conclusão da jornada</p>
            </CardContent>
          </Card>

          <Card className="premium-card border-purple-500/30">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-base">Alunos Ativos</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-purple-400">{activeStudents}</p>
              <p className="text-sm text-foreground/60 mt-1">com progresso iniciado</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="text-2xl">Lista de Alunos</CardTitle>
          <CardDescription className="text-base">Clique em um aluno para ver detalhes completos</CardDescription>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-16 h-16 mx-auto mb-4 text-foreground/20" />
              <p className="text-foreground/60">Nenhum aluno cadastrado ainda</p>
            </div>
          ) : (
            <div className="space-y-4">
              {students.map((student, index) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/admin/students/${student.id}`}>
                    <div className="premium-card p-6 hover:scale-[1.01] transition-all group cursor-pointer border-primary/20 hover:border-primary/40">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 flex-1">
                          <div className="w-16 h-16 rounded-2xl premium-gradient flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            {student.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold">{student.name}</h3>
                              <Badge className="bg-blue-500/20 border-blue-500/40 text-blue-400 text-xs">
                                {student.email}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className={`px-4 py-1.5 rounded-lg bg-gradient-to-r ${getStepColor(student.journeyProgress?.currentStep || 0)} text-white text-sm font-semibold shadow-lg`}>
                                Etapa {student.journeyProgress?.currentStep || 0}: {getStepName(student.journeyProgress?.currentStep || 0)}
                              </div>

                              <div className="flex items-center gap-2">
                                <div className="text-sm text-foreground/60">Progresso:</div>
                                <div className="text-2xl font-bold premium-gradient-text">
                                  {student.journeyProgress?.overallProgress || 0}%
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-6 mt-3 text-sm text-foreground/60">
                              <div>
                                <span className="font-semibold text-primary">{student._count.objectives}</span> Objetivos
                              </div>
                              <div>
                                <span className="font-semibold text-purple-400">{student._count.sprints}</span> Sprints
                              </div>
                              <div>
                                Última atividade: <span className="text-foreground/80">
                                  {new Date(student.updatedAt).toLocaleDateString('pt-BR')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <Button 
                          className="premium-button rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalhes
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
