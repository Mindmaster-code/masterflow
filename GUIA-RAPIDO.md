# 🚀 Guia Rápido - MasterFlow

## 📱 Acesso

**URL**: http://localhost:3001

### 👤 Credenciais de Teste

**Aluno:**
- Email: `aluno@masterflow.com`
- Senha: `senha123`

**Admin:**
- Email: `admin@masterflow.com`
- Senha: `admin123`

## 🎯 Jornada Completa (5 Etapas)

### 1️⃣ Ponto de Partida
📍 **O que fazer:**
- Preencha seu perfil (nome, cargo, empresa, tempo, salário)
- Adicione suas qualificações em 5 categorias
- Descreva seus desafios e motivações
- Liste atitudes para vencer desafios

💡 **Dicas:**
- Use Enter para adicionar badges rapidamente
- Clique no X para remover items
- Mínimo 3 atitudes recomendado

### 2️⃣ Auto-Conhecimento
🧠 **O que fazer:**
- Defina cargo e salário desejado
- Liste requisitos do cargo alvo
- Adicione empresas que deseja trabalhar
- Identifique conhecimentos e skills necessários

💡 **Dicas:**
- Seja específico no cargo desejado
- Pesquise empresas reais do mercado
- Liste pelo menos 5 skills a desenvolver

### 3️⃣ Mapeamento de Habilidades
📊 **O que fazer:**
- Avalie 16 skills profissionais (1-10)
- Use as tabs para navegar entre categorias
- Veja o Radar Chart com suas skills
- Selecione pelo menos 4 skills para desenvolver
- Preencha Análise SWOT completa (4 quadrantes)
- Defina estratégias SWOT

💡 **Dicas:**
- Seja honesto na auto-avaliação
- Skills < 5 aparecem no destaque vermelho
- Foque em desenvolver suas fraquezas

### 4️⃣ Destino - OKRs
🎯 **O que fazer:**
- Crie Objetivos (Q1, Q2, Q3, Q4)
- Adicione 3-5 Key Results por objetivo
- Para cada KR, crie Iniciativas no Backlog 2D
- Use a Matriz de Eisenhower para priorizar

💡 **Matriz 2D:**
- 🔥 **Fazer Agora** - Alta urgência + Alto impacto
- 📅 **Planejar** - Baixa urgência + Alto impacto
- 👥 **Delegar** - Alta urgência + Baixo impacto
- 🗑️ **Eliminar** - Baixa urgência + Baixo impacto

### 5️⃣ Plano de Ação - Sprints
🚀 **O que fazer:**

**Planning:**
1. Veja todas as iniciativas do backlog
2. Selecione 3-8 iniciativas para o sprint
3. Defina nome, data início e fim
4. Clique em "Iniciar Sprint"

**Kanban:**
1. Arraste iniciativas entre colunas
2. A Fazer → Fazendo → Feito
3. **Celebração automática** ao concluir! 🎉
4. Acompanhe contadores por coluna

**Review:**
1. Selecione sprint concluído
2. Avalie cada iniciativa (5 níveis)
3. Adicione notas e observações
4. Salve as avaliações

**Retrospectiva:**
1. Selecione sprint concluído
2. Liste o que foi bom (badges verdes)
3. Liste o que pode melhorar (badges vermelhos)
4. Defina ações para próximo sprint (badges azuis)
5. Salve a retrospectiva

## 👨‍💼 Área Admin

**Acesso**: `/admin/students` (apenas para admin)

**Funcionalidades:**
- Dashboard com métricas gerais
- Lista de todos os alunos
- Progresso individual por aluno
- Clique em um aluno para ver:
  - Jornada completa (5 etapas)
  - Perfil profissional
  - Metas de carreira
  - Objetivos e iniciativas
  - Histórico de sprints

## 🎨 Recursos Visuais Premium

### Cores por Etapa
- **Etapa 1**: Azul → Ciano (Início)
- **Etapa 2**: Roxo → Azul (Conhecimento)
- **Etapa 3**: Rosa → Roxo (Análise)
- **Etapa 4**: Laranja → Rosa (Objetivos)
- **Etapa 5**: Verde → Esmeralda (Ação)

### Animações
- **Fade In**: Entrada suave de páginas
- **Scale In**: Zoom suave em cards
- **Slide In**: Entrada lateral
- **Float**: Flutuação contínua
- **Glow**: Pulsação de brilho
- **Confetti**: Celebração ao concluir 🎊

### Feedbacks Visuais
- **Loading**: Spinner + texto "Salvando..."
- **Sucesso**: Check verde + toast animado
- **Erro**: Borda vermelha + mensagem
- **Hover**: Elevação + brilho + transição

## 💾 Banco de Dados

Todas as etapas salvam automaticamente no **Vercel Postgres** via Prisma:
- Profile, Qualifications, Challenges
- Career Goals, Qualification Needs
- Skills (16), SWOT Analysis
- Objectives, Key Results, Initiatives
- Sprints, Reviews, Retrospectives
- Journey Progress (tracker de etapas)

## 🔐 Segurança

- NextAuth.js com CredentialsProvider
- Senhas com bcrypt
- Middleware protegendo rotas
- Validação com Zod
- CSRF protection
- Session JWT

## 📱 Responsividade

- Mobile First
- Breakpoints: sm, md, lg
- Grid adaptativo
- Navegação mobile friendly
- Touch gestures no Kanban

## ⚡ Performance

- Server Components por padrão
- Client Components apenas quando necessário
- Lazy loading de imagens
- Otimização Turbopack
- Build otimizado (< 3MB)

## 🎓 Metodologias Aplicadas

- **OKR** (Objectives & Key Results)
- **SWOT** (Strengths, Weaknesses, Opportunities, Threats)
- **Scrum** (Sprints, Kanban, Review, Retro)
- **Eisenhower Matrix** (Backlog 2D)
- **Self-Assessment** (Skills 1-10)

---

## 🎉 Tudo Está Funcionando!

✅ Design premium executivo (nível Tesla)
✅ 5 etapas com funcionalidade completa
✅ Jornada interconectada e fluida
✅ Salvamento automático
✅ Feedback visual em todas as ações
✅ Admin com visão completa
✅ Build sem erros
✅ Pronto para produção

**Explore o app e aproveite sua jornada de desenvolvimento profissional! 🚀**
