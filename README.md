# SkillNet South Africa

Production-ready skilled-trades platform for South Africa — video portfolio, local jobs, messaging, and wallet.

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, TypeScript, Tailwind, TanStack Query |
| Backend | Express, Drizzle ORM, JWT auth |
| Database | Neon PostgreSQL |

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Neon database

1. Create a free database at [neon.tech](https://neon.tech)
2. Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

```env
DATABASE_URL=postgresql://user:password@host/skillnet?sslmode=require
JWT_SECRET=your-long-random-secret
PORT=3001
CLIENT_URL=http://localhost:5173
```

### 3. Push schema and seed demo data

```bash
npm run db:push
npm run db:seed
```

### 4. Run the app

```bash
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:3001

## Demo Accounts

After seeding, sign in with:

| Role | Phone | Password |
|------|-------|----------|
| Worker | +27821234567 | password123 |
| Employer | +27831112233 | password123 |
| Employer | +27721234567 | password123 |

Sign in with country code **+27** (South Africa). Example: select +27 and enter `821234567`.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/users/me` | Current user profile |
| GET | `/api/jobs` | List jobs |
| POST | `/api/jobs` | Post a job |
| POST | `/api/jobs/:id/apply` | Apply to job |
| GET | `/api/wallet` | Wallet balance & transactions |
| POST | `/api/wallet/add` | Add funds |
| POST | `/api/wallet/send` | Send money |
| GET | `/api/chats` | List conversations |
| GET | `/api/notifications` | Notifications |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run frontend + API together |
| `npm run dev:client` | Frontend only |
| `npm run dev:server` | API only |
| `npm run build` | Build frontend for production |
| `npm run build:server` | Compile API TypeScript |
| `npm start` | Run production API |
| `npm run db:push` | Push schema to Neon |
| `npm run db:seed` | Seed demo data |
| `npm run db:ensure-admin` | Create admin user + default programs |
| `npm test` | Run unit and API tests |

## Phone OTP Login

Passwordless sign-in via SMS code:

```bash
POST /api/auth/otp/send      { "phone": "+27821234567", "purpose": "login" }
POST /api/auth/otp/login     { "phone": "+27821234567", "code": "123456" }
POST /api/auth/otp/register  { "phone": "+27...", "code": "123456", "name": "...", "password": "..." }
```

In development, OTP codes are printed to the API console. Set `SMS_WEBHOOK_URL` to deliver codes via your SMS provider in production.

**Password policy:** minimum 8 characters, at least one letter and one number.

## Deployment

**Render** (app + API) · **Neon** (database)

One Render service serves the React app and Express API on the same URL. Neon holds PostgreSQL.

### 1. Neon database

1. Create a project at [neon.tech](https://neon.tech)
2. Copy the connection string (with `?sslmode=require`)

### 2. Render

1. [render.com](https://render.com) → **New Blueprint** → connect this repo
2. Uses `render.yaml` automatically
3. Set these env vars when prompted:

| Variable | Value |
|----------|--------|
| `DATABASE_URL` | Your Neon connection string |
| `JWT_SECRET` | Long random string (48+ chars) |
| `CLIENT_URL` | Your Render URL, e.g. `https://skillnet.onrender.com` |

`NODE_ENV=production` is set automatically.

4. After first deploy, push schema and seed from your machine:

```bash
# Use the same DATABASE_URL in a local .env file
npm run db:push
npm run db:seed
npm run db:ensure-admin
```

### Verify

- `https://your-app.onrender.com` — app loads
- `https://your-app.onrender.com/api/health` — `{"status":"ok"}`
- Sign in: `+27821234567` / `password123`
- Admin: `/admin` with `+27800000001` / `password123`

WebSockets use the same host at `/ws` — no extra config.

### Docker (optional)

```bash
docker build -t skillnet .
docker run -p 3001:3001 \
  -e DATABASE_URL=... \
  -e JWT_SECRET=... \
  -e NODE_ENV=production \
  -e CLIENT_URL=http://localhost:3001 \
  skillnet
```

**Notes:**
- `POST /api/wallet/add` is disabled in production (use Paystack when configured)
- Paystack and Cloudinary env vars are optional

## Admin Dashboard

After `npm run db:ensure-admin`:

| Role | Phone | Password |
|------|-------|----------|
| Admin | +27800000001 | password123 |

Open `/admin` in the browser.

## What's Production-Ready

- JWT authentication with bcrypt password hashing
- Helmet, rate limiting, production env guards
- PostgreSQL persistence via Neon
- Real job marketplace (list, post, apply, save)
- Wallet with Paystack top-up (dev-only manual add)
- Chat messaging + WebSockets
- Video engagement (like, comment, share, follow)
- Admin dashboard with moderation
- Government programs API
- GitHub Actions CI (frontend + server build)
