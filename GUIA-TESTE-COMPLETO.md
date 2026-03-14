# 🎯 Guia Completo de Teste - MasterFlow

## 🔑 Seu Login

**URL**: http://localhost:3001  
**Email**: denispedro@mindmaster.com.br  
**Senha**: (sua senha atual)

**✅ Seu progresso foi RESETADO para a Etapa 1**  
Você pode agora testar toda a jornada do início!

---

## 📋 Checklist de Teste

### ✅ ETAPA 1 - Wizard Sequencial (3 Sub-etapas)

**O que mudou**: Era tudo numa tela só. Agora é sequencial.

#### Sub-etapa 1: Quem Sou Eu 👤
- [ ] Veja a **barra de progresso** no topo (33%)
- [ ] Digite seu **nome completo**
- [ ] Digite cargo e empresa
- [ ] **TESTE**: Clique em uma **faixa salarial** → deve:
  - Borda azul brilhante
  - Fundo com gradiente
  - Ícone de check ✓ aparecer
  - Card crescer (scale-105)
  - Texto "Selecionado" destacado
- [ ] Clique em **"Próximo"**

#### Sub-etapa 2: Qualificação 💼
- [ ] Barra de progresso em **66%**
- [ ] Digite formações e pressione Enter
- [ ] Veja badges sendo adicionados
- [ ] Remova com X
- [ ] Adicione cursos, tecnologias, certificações
- [ ] Clique em **"Próximo"**

#### Sub-etapa 3: Desafios 🎯
- [ ] Barra de progresso em **100%**
- [ ] Preencha "O que te incomoda"
- [ ] Preencha "Sua motivação"
- [ ] Adicione atitudes
- [ ] Clique em **"Concluir Etapa 1"**
- [ ] Veja toast verde de sucesso
- [ ] Deve redirecionar para Step 2

**✓ Navegação**: Use "Voltar" para testar retrocesso entre sub-etapas

---

### ✅ ETAPA 3 - Skills Centralizadas

**O que mudou**: Layout era impossível de usar. Agora está centralizado.

#### Tela 1: Avaliação de Skills
- [ ] Veja **tabs no topo** (Estratégica | Técnica | Comunicação)
- [ ] **TESTE cada tab** - deve trocar o conteúdo
- [ ] **Skills centralizadas** (não nas laterais!)
- [ ] **Arraste cada slider** de 1 a 10:
  - [ ] Emoji muda (🔴 🟡 🟢)
  - [ ] Número gigante muda ao lado
  - [ ] Cor do gradiente muda
- [ ] **Dê nota baixa (1-4)** em algumas skills
- [ ] Veja aparecer no card **"Skills que Precisam Atenção"** (vermelho)
- [ ] Veja **Radar Chart** atualizar em tempo real
- [ ] Clique em **"Salvar e Continuar para SWOT"**

**16 Skills**: Pensamento Estratégico, Análise de Dados, Gestão de Riscos, Gestão Financeira, Análise de Indicadores, Gestão OKR, Scrum & Kanban, Design Thinking, Lean, Gestão de Backlog, Estimativas de Esforço, Inteligência Artificial, Liderança, Comunicação Eficaz, Inteligência Emocional, Gestão de Pessoas

#### Tela 2: SWOT (página separada)
- [ ] Preencha **Forças** (verde)
- [ ] Preencha **Fraquezas** (vermelho)
- [ ] Preencha **Oportunidades** (azul)
- [ ] Preencha **Ameaças** (laranja)
- [ ] Preencha estratégias
- [ ] Clique em **"Concluir Etapa 3"**

---

### ✅ ETAPA 4 - Formulários Inline (SEM Dialog)

**O que mudou**: Dialog aparecia na base da tela e era impossível digitar. Agora é tela inteira.

#### Criar Objetivo
- [ ] Clique em **"Novo Objetivo"**
- [ ] **VEJA**: Tela muda para formulário (não é modal flutuante!)
- [ ] **Digite livremente** o título
- [ ] Selecione Q1, Q2, Q3 ou Q4 (botões visuais)
- [ ] Digite ano
- [ ] Clique em **"Criar Objetivo"**
- [ ] Volta para lista de objetivos

#### Criar Key Result
- [ ] Clique em **"Adicionar KR"** em um objetivo
- [ ] **VEJA**: Tela muda para formulário de KR
- [ ] **Digite livremente** todos os campos
- [ ] Crie o KR
- [ ] Volta para lista

#### Criar Iniciativas (Backlog 2D)
- [ ] Em cada KR, clique em **"Nova Iniciativa"**
- [ ] Selecione quadrante visual
- [ ] Preencha dados
- [ ] Adicione iniciativas

#### Avançar
- [ ] Clique em **"Concluir Etapa 4"**
- [ ] Deve ir para Step 5

---

### ✅ ETAPA 5 - Tabs Organizadas (4 Áreas)

**O que mudou**: Estava dando exception. Agora funciona com tabs claras.

#### Tab 1: 🚀 Planejamento
- [ ] Veja lista de iniciativas do backlog
- [ ] **Marque checkboxes** para selecionar 3-5 iniciativas
- [ ] Veja contador de selecionadas
- [ ] Clique em **"Avançar para Criar Sprint"**
- [ ] Tela muda para configuração do sprint
- [ ] Preencha nome e datas
- [ ] Clique em **"Criar e Iniciar Sprint"**

#### Tab 2: 📅 Kanban (Drag & Drop)
- [ ] Selecione o sprint ativo
- [ ] **Arraste** iniciativa de "A Fazer" para "Fazendo"
- [ ] **Arraste** de "Fazendo" para "Feito"
- [ ] **VEJA**: 🎉 **Confetti explode** ao chegar em "Feito"!
- [ ] Veja progresso do sprint atualizar

#### Tab 3: ✅ Review
- [ ] Selecione um sprint concluído
- [ ] Para cada iniciativa:
  - [ ] Clique em emoji de avaliação (1-5)
  - [ ] Veja destaque visual
  - [ ] Adicione observações
- [ ] Clique em **"Salvar Review"**

#### Tab 4: 💡 Retrospectiva
- [ ] Selecione um sprint
- [ ] Digite itens e pressione Enter
- [ ] Veja badges coloridos
- [ ] Remova com X
- [ ] Salve retrospectiva

---

## 🔍 Se Ainda Não Ver as Mudanças

### 1. Limpe o Cache do Navegador
**Chrome/Edge**:
- Pressione `Cmd + Shift + R` (Mac) ou `Ctrl + Shift + R` (Windows)
- Ou: DevTools (F12) → Network tab → marque "Disable cache"

**Safari**:
- Pressione `Cmd + Option + R`

### 2. Abra em Anônimo/Privado
- Abra uma janela anônima
- Acesse http://localhost:3001
- Faça login

### 3. Verifique se está na versão correta
- Pressione F12 (DevTools)
- Vá em "Elements" ou "Inspetor"
- Procure por `currentSubStep` no código
- Se não achar, o cache ainda está ativo

---

## 📊 Resumo das Correções

| Etapa | O que foi corrigido | Status |
|-------|---------------------|--------|
| Step 1 | Wizard de 3 sub-etapas + faixa salarial visual | ✅ Build OK |
| Step 3 | Skills centralizadas + layout usável | ✅ Build OK |
| Step 4 | Formulários inline (sem dialog quebrado) | ✅ Build OK |
| Step 5 | Exception corrigida + tabs funcionais | ✅ Build OK |

---

## 🚀 Servidor

**Status**: ✅ Rodando em http://localhost:3001  
**Build**: ✅ Completo sem erros  
**Cache**: ✅ Limpo (`.next` removido)

---

**Limpe o cache do navegador com Cmd+Shift+R e teste novamente!** 🎉
