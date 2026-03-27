import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp, Eye, ArrowRight, Shield } from 'lucide-react';
import { CreateStudentButton } from '@/components/admin/create-student-button';
import { EditUserButton } from '@/components/admin/edit-user-button';

export default async function AdminStudentsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user?.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const users = await db.user.findMany({
    include: {
      profile: true,
      journeyProgress: true,
      _count: {
        select: {
          objectives: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const studentsOnly = users.filter((u) => u.role === 'STUDENT');
  const totalStudents = studentsOnly.length;
  const averageProgress =
    studentsOnly.length > 0
      ? Math.round(
          studentsOnly.reduce((sum, s) => sum + (s.journeyProgress?.overallProgress || 0), 0) /
            studentsOnly.length
        )
      : 0;

  const activeStudents = studentsOnly.filter(
    (s) => s.journeyProgress && s.journeyProgress.currentStep > 1
  ).length;

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
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-2xl">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Gestão de Usuários</h1>
              <p className="text-lg text-foreground/60">Alunos e administradores — edite perfis e acessos</p>
            </div>
          </div>
          <CreateStudentButton />
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
          <CardTitle className="text-2xl">Lista de usuários</CardTitle>
          <CardDescription className="text-base">
            Clique na linha para ver detalhes ou use Editar para alterar dados e perfil
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-16 h-16 mx-auto mb-4 text-foreground/20" />
              <p className="text-foreground/60 mb-6">Nenhum usuário cadastrado ainda</p>
              <CreateStudentButton />
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((student) => (
                <div key={student.id} className="animate-fade-in">
                  <div className="premium-card p-6 hover:scale-[1.01] transition-all group border-primary/20 hover:border-primary/40 flex flex-col sm:flex-row sm:items-center gap-4">
                    <Link href={`/admin/students/${student.id}`} className="flex items-center gap-6 flex-1 min-w-0 cursor-pointer">
                      <div className="w-16 h-16 rounded-2xl premium-gradient flex items-center justify-center text-white font-bold text-xl shadow-lg shrink-0">
                        {student.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold">{student.name}</h3>
                          {student.role === 'ADMIN' ? (
                            <Badge className="bg-purple-500/20 border-purple-500/40 text-purple-300 text-xs gap-1">
                              <Shield className="w-3 h-3" />
                              Admin
                            </Badge>
                          ) : (
                            <Badge className="bg-teal-500/15 border-teal-500/30 text-teal-400 text-xs">Aluno</Badge>
                          )}
                          <Badge className="bg-blue-500/20 border-blue-500/40 text-blue-400 text-xs truncate max-w-[220px]">
                            {student.email}
                          </Badge>
                        </div>

                        {student.role === 'STUDENT' ? (
                          <>
                            <div className="flex flex-wrap items-center gap-4">
                              <div className={`px-4 py-1.5 rounded-lg bg-gradient-to-r ${getStepColor(student.journeyProgress?.currentStep || 0)} text-white text-sm font-semibold shadow-lg`}>
                                Etapa {student.journeyProgress?.currentStep || 0}: {getStepName(student.journeyProgress?.currentStep || 0)}
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-sm text-foreground/60">Progresso:</span>
                                <span className="text-2xl font-bold premium-gradient-text">
                                  {student.journeyProgress?.overallProgress || 0}%
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-6 mt-3 text-sm text-foreground/60">
                              <div>
                                <span className="font-semibold text-primary">{student._count.objectives}</span> Objetivos
                              </div>
                              <div>
                                Última atividade:{' '}
                                <span className="text-foreground/80">
                                  {new Date(student.updatedAt).toLocaleDateString('pt-BR')}
                                </span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <p className="text-sm text-foreground/50">
                            Administrador · última atividade:{' '}
                            {new Date(student.updatedAt).toLocaleDateString('pt-BR')}
                          </p>
                        )}
                      </div>
                    </Link>

                    <div className="flex items-center gap-2 shrink-0 sm:flex-col sm:items-end">
                      <EditUserButton
                        user={{
                          id: student.id,
                          name: student.name,
                          email: student.email,
                          role: student.role,
                        }}
                        stopPropagation
                      />
                      <Link href={`/admin/students/${student.id}`}>
                        <Button className="premium-button rounded-xl w-full sm:w-auto" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Detalhes
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
