import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Verificando usuário...\n');

  const user = await prisma.user.findUnique({
    where: { email: 'aluno@masterflow.com' },
  });

  if (!user) {
    console.log('❌ Usuário NÃO encontrado no banco!');
    console.log('Executando seed novamente...\n');
    
    const hashedPassword = await bcrypt.hash('senha123', 10);
    
    const newUser = await prisma.user.create({
      data: {
        email: 'aluno@masterflow.com',
        password: hashedPassword,
        name: 'Aluno Teste',
        role: 'STUDENT',
        journeyProgress: {
          create: {
            currentStep: 1,
            overallProgress: 0,
          },
        },
      },
    });
    
    console.log('✅ Usuário criado:', newUser.email);
  } else {
    console.log('✅ Usuário encontrado:', user.email);
    console.log('Nome:', user.name);
    console.log('Role:', user.role);
    
    const testPassword = await bcrypt.compare('senha123', user.password);
    console.log('\n🔐 Teste de senha "senha123":', testPassword ? '✅ CORRETA' : '❌ INCORRETA');
    
    if (!testPassword) {
      console.log('\n🔧 Atualizando senha para "senha123"...');
      const newHash = await bcrypt.hash('senha123', 10);
      await prisma.user.update({
        where: { email: 'aluno@masterflow.com' },
        data: { password: newHash },
      });
      console.log('✅ Senha atualizada!');
    }
  }
  
  console.log('\n📧 Use: aluno@masterflow.com / senha123');
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
