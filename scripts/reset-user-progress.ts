import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'denispedro@mindmaster.com.br';
  
  console.log('🔍 Buscando usuário:', email);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.log('❌ Usuário não encontrado!');
    return;
  }

  console.log('✅ Usuário encontrado:', user.name);
  console.log('\n🧹 Limpando dados antigos (isso vai permitir refazer a jornada)...\n');

  // Deletar sprints (vai deletar retrospectives e sprint reviews em cascata)
  const deletedSprints = await prisma.sprint.deleteMany({ 
    where: { userId: user.id } 
  });
  console.log(`✓ ${deletedSprints.count} sprints deletados`);

  // Deletar initiatives (vai deletar sprint reviews em cascata)
  const deletedInitiatives = await prisma.initiative.deleteMany({ 
    where: { keyResult: { objective: { userId: user.id } } } 
  });
  console.log(`✓ ${deletedInitiatives.count} initiatives deletadas`);

  // Deletar key results
  const deletedKRs = await prisma.keyResult.deleteMany({ 
    where: { objective: { userId: user.id } } 
  });
  console.log(`✓ ${deletedKRs.count} key results deletados`);

  // Deletar objectives
  const deletedObjectives = await prisma.objective.deleteMany({ 
    where: { userId: user.id } 
  });
  console.log(`✓ ${deletedObjectives.count} objectives deletados`);

  // Deletar SWOT
  const deletedSwot = await prisma.swotAnalysis.deleteMany({ 
    where: { userId: user.id } 
  });
  console.log(`✓ ${deletedSwot.count} SWOT analysis deletadas`);

  // Deletar skills
  const deletedSkills = await prisma.skill.deleteMany({ 
    where: { userId: user.id } 
  });
  console.log(`✓ ${deletedSkills.count} skills deletadas`);

  // Deletar qualification needs
  const deletedQualNeeds = await prisma.qualificationNeeds.deleteMany({ 
    where: { userId: user.id } 
  });
  console.log(`✓ ${deletedQualNeeds.count} qualification needs deletadas`);

  // Deletar career goals
  const deletedGoals = await prisma.careerGoals.deleteMany({ 
    where: { userId: user.id } 
  });
  console.log(`✓ ${deletedGoals.count} career goals deletados`);

  // Deletar current challenges
  const deletedChallenges = await prisma.currentChallenges.deleteMany({ 
    where: { userId: user.id } 
  });
  console.log(`✓ ${deletedChallenges.count} current challenges deletados`);

  // Deletar qualifications
  const deletedQuals = await prisma.qualification.deleteMany({ 
    where: { userId: user.id } 
  });
  console.log(`✓ ${deletedQuals.count} qualifications deletadas`);

  // Deletar profile
  const deletedProfile = await prisma.profile.deleteMany({ 
    where: { userId: user.id } 
  });
  console.log(`✓ ${deletedProfile.count} profiles deletados`);

  // Resetar progresso
  await prisma.journeyProgress.update({
    where: { userId: user.id },
    data: {
      currentStep: 1,
      step1Completed: false,
      step2Completed: false,
      step3Completed: false,
      step4Completed: false,
      step5Completed: false,
      overallProgress: 0,
    },
  });

  console.log('\n✅ Progresso resetado para Etapa 1');
  console.log('\n🎯 Jornada limpa! Agora você pode começar do zero e ver todas as correções.');
  console.log('📧 Faça login com:', email);
  console.log('🌐 Acesse: http://localhost:3001');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Erro:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
