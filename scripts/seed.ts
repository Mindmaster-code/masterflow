import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@masterflow.com' },
    update: {},
    create: {
      name: 'Admin MasterFlow',
      email: 'admin@masterflow.com',
      password: hashedPassword,
      role: 'ADMIN',
      journeyProgress: {
        create: {
          currentStep: 1,
          overallProgress: 0,
        },
      },
    },
  });

  console.log('✅ Admin criado:', admin.email);

  const studentPassword = await bcrypt.hash('senha123', 10);

  const student = await prisma.user.upsert({
    where: { email: 'aluno@masterflow.com' },
    update: {},
    create: {
      name: 'Aluno Teste',
      email: 'aluno@masterflow.com',
      password: studentPassword,
      role: 'STUDENT',
      journeyProgress: {
        create: {
          currentStep: 1,
          overallProgress: 0,
        },
      },
    },
  });

  console.log('✅ Aluno criado:', student.email);
  console.log('\n📧 Credenciais:');
  console.log('Admin: admin@masterflow.com / admin123');
  console.log('Aluno: aluno@masterflow.com / senha123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
