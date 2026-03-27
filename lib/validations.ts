import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  role: z.enum(['STUDENT', 'ADMIN']).default('STUDENT'),
});

export const adminUpdateUserSchema = z
  .object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    role: z.enum(['STUDENT', 'ADMIN']),
    password: z.string().optional(),
  })
  .refine(
    (data) => !data.password || data.password.length === 0 || data.password.length >= 6,
    { message: 'Nova senha deve ter pelo menos 6 caracteres', path: ['password'] }
  );

export const adminSendAccessSchema = z.object({
  /** Se vazio ou omitido, o servidor gera uma senha temporária e atualiza o usuário. */
  password: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Link inválido'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z.string().min(6, 'Nova senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(1, 'Confirme a nova senha'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

export const profileSchema = z.object({
  name: z.string().min(2),
  currentRole: z.string().min(2),
  currentCompany: z.string().min(2),
  timeInCompany: z.string().min(1),
  salaryRange: z.enum(['BELOW_6K', 'RANGE_6K_7K', 'RANGE_7K_8K', 'RANGE_8K_10K', 'ABOVE_10K']),
});

export const qualificationSchema = z.object({
  academicFormation: z.array(z.string()),
  formationCourses: z.array(z.string()),
  techDomains: z.array(z.string()),
  certifications: z.array(z.string()),
  otherRecognitions: z.array(z.string()),
});

export const currentChallengesSchema = z.object({
  whatBothersMe: z.string().min(10),
  myMotivation: z.string().min(10),
  attitudesToWin: z.array(z.string()),
});

export const careerGoalsSchema = z.object({
  desiredRole: z.string().min(2),
  desiredSalary: z.string().min(1),
  roleRequirements: z.array(z.string()),
  targetCompanies: z.array(z.string()),
  requiredCertifications: z.array(z.string()),
});

export const skillSchema = z.object({
  name: z.string(),
  category: z.enum(['STRATEGIC', 'TECHNICAL', 'COMMUNICATION']),
  score: z.number().min(1).max(10),
});

export const swotSchema = z.object({
  strengths: z.string().min(10),
  weaknesses: z.string().min(10),
  opportunities: z.string().min(10),
  threats: z.string().min(10),
  lowScoreSkills: z.array(z.string()),
  skillsToDevelop: z.array(z.string()),
  useStrengthsForOpportunities: z.string().min(10),
  reduceWeaknessesAvoidThreats: z.string().min(10),
});

export const objectiveSchema = z.object({
  title: z.string().min(5),
  quarter: z.number().min(1).max(4),
  year: z.number().min(2024),
});

export const keyResultSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  targetValue: z.string().min(1),
  currentValue: z.string().optional(),
});

export const initiativeSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  quadrant: z.number().min(1).max(4).optional(),
});
