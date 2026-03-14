# ⚡ Início Rápido - MasterFlow

## 🚀 3 Passos para Rodar o App

### 1. Configure a DATABASE_URL no `.env`

Você tem 2 opções:

#### Opção A: Usar banco local (Mais Rápido para Testar) ✅

O `.env` já vem configurado com um banco local do Prisma. Apenas execute:

```bash
npm run db:push
```

#### Opção B: Usar Vercel Postgres (Para Produção)

1. Acesse: https://vercel.com/dashboard
2. Clique em "Storage" → "Create Database" → "Postgres"
3. Copie a connection string
4. No arquivo `.env`, substitua o `DATABASE_URL` pela sua string

Exemplo:
```
DATABASE_URL="postgres://default:abc123@ep-xyz.us-east-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require"
```

Depois execute:
```bash
npm run db:push
```

### 2. Crie Usuários de Teste

```bash
npm run db:seed
```

Isso cria:
- **Admin**: `admin@masterflow.com` / `admin123`
- **Aluno**: `aluno@masterflow.com` / `student123`

### 3. Inicie o Servidor

```bash
npm run dev
```

Abra: **http://localhost:3000**

---

## 🎯 Pronto!

Você pode agora:
1. Fazer login com as credenciais criadas
2. Explorar o dashboard
3. Começar a jornada de desenvolvimento de carreira

---

## 📦 Comandos Úteis

```bash
# Ver dados no banco (abre interface visual)
npm run db:studio

# Resetar tudo e recomeçar
npx prisma migrate reset

# Build para produção
npm run build

# Ver logs de desenvolvimento
npm run dev
```

---

## 🌐 Deploy na Vercel (Opcional)

```bash
# 1. Instalar CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. No dashboard da Vercel, adicione as variáveis de ambiente:
# - DATABASE_URL (do Vercel Postgres)
# - NEXTAUTH_SECRET (gere com: openssl rand -base64 32)
# - NEXTAUTH_URL (https://seu-app.vercel.app)
```

---

**Precisa de ajuda?** Veja o arquivo `SETUP.md` para instruções detalhadas.
