# 📘 Instruções de Uso - MasterFlow

## 🎯 Para Começar AGORA

### 1. Configure o Banco de Dados

**Opção Rápida - Use o banco local do Prisma:**

```bash
# O Prisma já vem configurado com um banco local
# Apenas execute:
npm run db:push
```

Isso irá criar todas as tabelas automaticamente no banco local do Prisma!

### 2. Criar Usuários Iniciais

```bash
npm run db:seed
```

Isso cria:
- **Admin**: `admin@masterflow.com` / `admin123`
- **Aluno**: `aluno@masterflow.com` / `student123`

### 3. Iniciar o App

```bash
npm run dev
```

Abra: http://localhost:3000

## 🎓 Como Usar como Aluno

### 1️⃣ Criar Conta
- Acesse `/register`
- Preencha: Nome, Email, Senha
- Faça login

### 2️⃣ Dashboard Inicial
- Veja seu progresso na jornada (0% no início)
- Clique em "Continuar Jornada" para ir para Etapa 1

### 3️⃣ Etapa 1 - Ponto de Partida
Preencha 3 seções:

**Quem Sou Eu:**
- Nome, Cargo Atual, Empresa
- Selecione Faixa Salarial

**Qualificação Profissional:**
- Adicione: Formações, Cursos, Tecnologias, Certificações
- Use Enter ou botão + para adicionar
- Clique no X para remover

**Desafios Atuais:**
- O que te incomoda na carreira
- Sua motivação
- Atitudes para vencer

Clique em **"Salvar e Continuar"** → vai para Etapa 2

### 4️⃣ Etapa 2 - Auto-Conhecimento

**Onde Quero Chegar:**
- Cargo Desejado
- Salário Desejado
- Requisitos, Empresas-alvo, Certificações

**Preciso me Qualificar em:**
- Conhecimentos necessários
- Habilidades necessárias
- Cursos necessários

Clique em **"Salvar e Continuar"** → vai para Etapa 3

### 5️⃣ Etapa 3 - Mapeamento de Habilidades

**Avaliar Skills:**
- Abas: Estratégica, Técnica, Comunicação
- Cada skill: slider de 1 a 10
- 🔴 1-3: Teórico
- 🟡 4-6: Prático
- 🟢 7-10: Domínio

**Análise Automática:**
- Sistema identifica 4 skills com menor pontuação
- Selecione quais skills irá desenvolver (mínimo 4)

**SWOT Analysis:**
- Preencha os 4 quadrantes (Forças, Fraquezas, Oportunidades, Ameaças)
- Planos de ação (usar forças, reduzir fraquezas)

Clique em **"Salvar e Continuar"** → vai para Etapa 4

### 6️⃣ Etapa 4 - Destino (OKRs)

**Criar Objetivo:**
1. Clique em "Novo Objetivo"
2. Título (ex: "Tornar-me Diretor de TI")
3. Trimestre e Ano
4. Criar

**Adicionar Key Results (KRs):**
1. No card do objetivo, clique "Adicionar KR"
2. Título (ex: "Aumentar salário em 30%")
3. Descrição
4. Meta (ex: "R$ 15.000")

**Backlog 2D - Iniciativas:**
Para cada KR, você verá 4 quadrantes:
- **Q1**: Urgente e Importante
- **Q2**: Importante, Não Urgente
- **Q3**: Urgente, Não Importante
- **Q4**: Nem Urgente, Nem Importante

Adicione iniciativas em cada quadrante com:
- Título (ex: "Fazer MBA")
- Detalhamento completo

Clique em **"Continuar para Plano de Ação"** → vai para Etapa 5

### 7️⃣ Etapa 5 - Plano de Ação

#### Tab 1: Planning
**Criar Sprint:**
1. Nome do Sprint (ex: "Sprint #1 - Q1 2026")
2. Data início e fim
3. Arraste iniciativas para priorizar (drag & drop)
4. Marque checkbox das iniciativas para o sprint
5. Clique "Criar Sprint"

#### Tab 2: Kanban
**Executar Sprint:**
- Arraste iniciativas entre colunas:
  - 📋 A Fazer → 🔄 Fazendo → ✅ Feito
- Ao mover para "Feito": **CELEBRAÇÃO COM CONFETTI!** 🎉

#### Tab 3: Review
**Avaliar Iniciativas:**
- Selecione o sprint
- Avalie cada iniciativa concluída
- Adicione notas

#### Tab 4: Retrospectiva
**Refletir sobre o Sprint:**
- O que funcionou bem? ✅
- O que pode melhorar? 🔄
- Ações para próximo sprint 🎯

Ao salvar a retrospectiva, o sprint é marcado como COMPLETED.

## 👨‍💼 Como Usar como Admin

### Acessar Área Admin
- Login com conta admin
- Menu: "Alunos" ou `/admin/students`

### Dashboard Admin
**Visão Geral:**
- Total de alunos
- Quantos concluíram a jornada
- Progresso médio

**Tabela de Alunos:**
- Nome, Email, Etapa Atual
- Barra de progresso (0-100%)
- Última atividade
- Botão "Ver Detalhes"

**Detalhes do Aluno:**
- Gráfico completo da jornada
- Perfil profissional
- Meta de carreira
- Objetivos e KRs
- Sprints executados

## 🎨 Design Premium

### Tema Dark
O app usa tema escuro por padrão (estilo Tesla/premium).

### Cores
- **Background**: Preto profundo (#0a0a0a)
- **Primária**: Azul elétrico (#3b82f6)
- **Gradiente**: Azul → Roxo

### Animações
- Fade in ao carregar páginas
- Scale in em cards
- Slide in em listas
- Confetti ao concluir iniciativas

## 🔄 Edição e Exclusão

**Todos os dados podem ser editados ou excluídos:**

- **Skills**: Ajuste o slider
- **Tags/Badges**: Clique no X
- **Iniciativas**: Botões Editar/Excluir (aparecem no hover)
- **OKRs**: Botões de ação nos cards

## 📊 Progresso Automático

O sistema atualiza automaticamente:
- **Etapa 1 completa** → 20% de progresso
- **Etapa 2 completa** → 40% de progresso
- **Etapa 3 completa** → 60% de progresso
- **Etapa 4 completa** → 80% de progresso
- **Etapa 5 completa** → 100% de progresso

## 🎯 Relacionamentos

```
Objetivo
  └─ Key Result (1 a 3 recomendados)
      └─ Iniciativa (múltiplas)
          └─ Sprint (uma por vez)
```

**Regra**: Não pode deletar Objetivo se tiver KRs. Não pode deletar KR se tiver Iniciativas.

## 🚨 Dicas

1. **Salve frequentemente**: O sistema não tem auto-save (ainda)
2. **Use Enter**: Ao adicionar tags, aperte Enter
3. **Drag & Drop**: Segure e arraste (não clique rápido)
4. **Mobile**: Funciona, mas desktop é melhor para drag & drop
5. **Navegação**: Use o menu superior ou botões de navegação

## 🐛 Problemas Comuns

### "Erro ao salvar dados"
- Verifique se o banco está conectado
- Execute `npm run db:push` novamente

### "Não autorizado"
- Faça logout e login novamente
- Limpe cookies do navegador

### Iniciativa não move no Kanban
- Clique e segure por 1 segundo antes de arrastar
- Use mouse (no touch pode ser instável)

---

**Aproveite sua jornada no MasterFlow!** 🚀
