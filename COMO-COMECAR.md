# 🚀 Como Começar - Guia Super Simples

## Você tem 2 banco de dados na Vercel?

### Se SIM - Conectar ao seu banco Vercel:

#### 1. Abra o Vercel Dashboard
https://vercel.com/dashboard

#### 2. Vá em Storage (menu lateral esquerdo)

#### 3. Clique no seu banco Postgres

#### 4. Vá na aba ".env.local"

#### 5. Copie a linha que começa com `POSTGRES_URL=`

Vai ser algo assim:
```
postgres://default:abc123xyz@ep-cool-name-123456.us-east-1.postgres.vercel-storage.com:5432/verceldb
```

#### 6. Cole no arquivo `.env` do projeto

Abra o arquivo `.env` na raiz do projeto e substitua a linha `DATABASE_URL=` pela que você copiou.

Exemplo final no `.env`:
```
DATABASE_URL="postgres://default:abc123xyz@ep-cool-name-123456.us-east-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require"
```

#### 7. Execute no terminal:
```bash
npm run db:push
```

#### 8. Crie os usuários:
```bash
npm run db:seed
```

#### 9. Rode o app:
```bash
npm run dev
```

#### 10. Abra no navegador:
http://localhost:3000

---

### Se NÃO - Criar banco Vercel novo:

#### 1. Acesse: https://vercel.com/new

#### 2. No dashboard, clique em "Storage" (menu lateral)

#### 3. Clique em "Create Database"

#### 4. Escolha "Postgres"

#### 5. Dê um nome: `masterflow-db`

#### 6. Escolha a região: `US East` (mais rápido)

#### 7. Clique em "Create"

#### 8. Copie a connection string da aba ".env.local"

#### 9. Cole no arquivo `.env` do projeto

#### 10. Execute:
```bash
npm run db:push
npm run db:seed
npm run dev
```

---

## ✅ Credenciais para Login

Depois do seed, use:

**Admin:**
- Email: `admin@masterflow.com`
- Senha: `admin123`

**Aluno:**
- Email: `aluno@masterflow.com`
- Senha: `student123`

---

## 🆘 Está com Dificuldade?

Me avise e eu te ajudo! Apenas me diga em qual passo você está travado.
