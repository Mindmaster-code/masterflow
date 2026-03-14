# 🚀 Setup do MasterFlow

Guia passo a passo para configurar o projeto pela primeira vez.

## Pré-requisitos

- Node.js 18+
- Conta na Vercel (para o banco de dados)
- npm ou yarn

## 1️⃣ Instalar Dependências

```bash
npm install
```

## 2️⃣ Configurar Banco de Dados Vercel Postgres

### Opção A: Usar Vercel Dashboard (Recomendado)

1. Acesse https://vercel.com/dashboard
2. Vá em **Storage** > **Create Database**
3. Selecione **Postgres**
4. Copie a connection string que aparece em **`.env.local` tab**
5. Cole no arquivo `.env` na variável `DATABASE_URL`

### Opção B: Banco Local (Desenvolvimento)

Se preferir usar um banco PostgreSQL local:

```bash
# Instalar PostgreSQL (macOS)
brew install postgresql@15
brew services start postgresql@15

# Criar banco
createdb masterflow

# No .env, use:
# DATABASE_URL="postgresql://seu_usuario@localhost:5432/masterflow"
```

## 3️⃣ Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar .env e preencher:
# - DATABASE_URL (do Vercel ou local)
# - NEXTAUTH_SECRET (gere com: openssl rand -base64 32)
# - NEXTAUTH_URL (http://localhost:3000 em dev)
```

### Gerar NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

## 4️⃣ Criar Tabelas no Banco

```bash
# Enviar schema para o banco (cria as tabelas)
npm run db:push
```

## 5️⃣ Popular com Dados Iniciais (Opcional)

```bash
# Criar usuário admin e aluno de teste
npm run db:seed
```

**Credenciais criadas:**
- **Admin**: `admin@masterflow.com` / `admin123`
- **Aluno**: `aluno@masterflow.com` / `student123`

## 6️⃣ Iniciar Servidor de Desenvolvimento

```bash
npm run dev
```

Abra http://localhost:3000 no navegador.

## 7️⃣ Visualizar Banco de Dados (Opcional)

```bash
# Abre o Prisma Studio
npm run db:studio
```

## ✅ Pronto!

Agora você pode:
1. Acessar http://localhost:3000
2. Fazer login com as credenciais
3. Começar a usar o MasterFlow

## 🔧 Comandos Úteis

```bash
# Ver dados no banco
npm run db:studio

# Atualizar schema do banco após mudanças
npm run db:push

# Build para produção
npm run build

# Executar em produção
npm start
```

## 🚨 Troubleshooting

### Erro de conexão com banco

```bash
# Verifique se o DATABASE_URL está correto
cat .env | grep DATABASE_URL

# Teste a conexão
npx prisma db pull
```

### Erro no Prisma Client

```bash
# Regerar o client
npx prisma generate
```

### Port 3000 já em uso

```bash
# Usar outra porta
PORT=3001 npm run dev
```

## 📦 Deploy na Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configurar variáveis no dashboard:
# - DATABASE_URL
# - NEXTAUTH_SECRET
# - NEXTAUTH_URL (https://seu-app.vercel.app)
```

---

**Dúvidas?** Consulte o README.md principal.
