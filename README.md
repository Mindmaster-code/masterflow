# MasterFlow - Mentoria de Carreira Executiva

Plataforma premium de desenvolvimento de carreira para executivos, baseada em metodologias OKR, SWOT e Scrum.

## 🚀 Tecnologias

- **Frontend**: Next.js 15 + TypeScript
- **UI**: shadcn/ui + Tailwind CSS
- **Banco de Dados**: Vercel Postgres + Prisma ORM
- **Autenticação**: NextAuth.js
- **Drag & Drop**: @dnd-kit
- **Animações**: Framer Motion + canvas-confetti
- **Gráficos**: Recharts

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env e adicione sua connection string do Vercel Postgres

# Executar migrations do Prisma
npx prisma migrate dev --name init

# Gerar Prisma Client
npx prisma generate

# Iniciar servidor de desenvolvimento
npm run dev
```

## 🗃️ Configuração do Banco de Dados

### Vercel Postgres

1. Acesse [Vercel Dashboard](https://vercel.com/dashboard)
2. Crie um novo Postgres database
3. Copie a connection string (formato: `postgres://...`)
4. Cole no arquivo `.env` na variável `DATABASE_URL`

### Executar Migrations

```bash
npx prisma migrate dev
```

## 🎯 Funcionalidades

### 5 Etapas da Jornada

1. **Ponto de Partida**
   - Perfil profissional (quem sou eu)
   - Qualificações (formação, cursos, certificações)
   - Desafios atuais

2. **Auto-Conhecimento**
   - Onde quero chegar (cargo, salário desejado)
   - O que preciso para chegar lá

3. **Mapeamento de Habilidades**
   - Avaliação de 16 skills (1-10)
   - Identificação de skills de baixa pontuação
   - Análise SWOT de carreira

4. **Destino**
   - Criação de OKRs (Objetivos e Key Results)
   - Backlog 2D de iniciativas (matriz Eisenhower)

5. **Plano de Ação**
   - Sprint Planning (priorização de iniciativas)
   - Kanban Board (A Fazer, Fazendo, Feito)
   - Sprint Review (avaliação)
   - Retrospectiva

### Área Administrativa

- Dashboard com todos os alunos
- Visualização do progresso de cada aluno
- Detalhes completos da jornada

## 🎨 Design Premium

- Tema dark por padrão (estilo Tesla)
- Animações suaves e micro-interações
- Glassmorphism e gradientes
- Celebração animada ao concluir iniciativas (confetti)

## 📱 Estrutura do Projeto

```
masterflow/
├── app/
│   ├── (auth)/              # Autenticação
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/         # Dashboard protegido
│   │   ├── dashboard/       # Página principal
│   │   ├── step1/          # Etapa 1
│   │   ├── step2/          # Etapa 2
│   │   ├── step3/          # Etapa 3
│   │   ├── step4/          # Etapa 4
│   │   └── step5/          # Etapa 5
│   ├── admin/              # Área administrativa
│   └── api/                # API routes
├── components/
│   ├── journey/            # Componentes da jornada
│   ├── okr/                # Componentes de OKR
│   ├── sprint/             # Componentes de sprint
│   └── ui/                 # Componentes shadcn/ui
├── lib/
│   ├── db.ts               # Prisma client
│   ├── auth.ts             # Configuração NextAuth
│   ├── validations.ts      # Schemas Zod
│   └── constants.ts        # Constantes
└── prisma/
    └── schema.prisma       # Schema do banco
```

## 🔐 Usuários

### Criar Usuário Admin

```bash
# Via Prisma Studio
npx prisma studio

# Ou via script SQL
# UPDATE users SET role = 'ADMIN' WHERE email = 'admin@email.com';
```

## 🎓 Metodologias Implementadas

- **OKR**: Objectives and Key Results
- **SWOT**: Análise de Forças, Fraquezas, Oportunidades e Ameaças
- **Scrum**: Sprint Planning, Kanban, Review e Retrospectiva
- **Matriz Eisenhower**: Backlog 2D (Urgente/Importante)

## 📊 Fluxo de Dados

```
User
  └─ JourneyProgress (progresso geral)
  └─ Profile (etapa 1)
  └─ Qualifications (etapa 1)
  └─ CurrentChallenges (etapa 1)
  └─ CareerGoals (etapa 2)
  └─ QualificationNeeds (etapa 2)
  └─ Skills (etapa 3)
  └─ SwotAnalysis (etapa 3)
  └─ Objectives (etapa 4)
      └─ KeyResults
          └─ Initiatives
              └─ Sprint
                  └─ SprintReview
                  └─ Retrospective
```

## 🚀 Deploy

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configurar variáveis de ambiente no dashboard da Vercel
# - DATABASE_URL
# - NEXTAUTH_SECRET
# - NEXTAUTH_URL (https://masterflow-flame.vercel.app)
```

## 📝 Scripts

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Prisma Studio (visualizar banco)
npx prisma studio

# Migrations
npx prisma migrate dev

# Reset do banco (cuidado!)
npx prisma migrate reset
```

## 🎯 Próximos Passos

- [ ] Gráfico radar de skills
- [ ] Exportação de PDF do plano de carreira
- [ ] Notificações de progresso
- [ ] Analytics de tempo por etapa
- [ ] Templates de OKR por área
- [ ] Gamificação (badges, conquistas)

## 📄 Licença

Propriedade da MindMaster - Mentoria de Carreira Executiva

---

Desenvolvido com Next.js e Vercel
