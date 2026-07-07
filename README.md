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

## Deployment

### API (Docker / Render / Railway)

1. Set production env vars: `DATABASE_URL`, `JWT_SECRET`, `CLIENT_URL`, `NODE_ENV=production`
2. Optional: `PAYSTACK_SECRET_KEY`, Cloudinary vars for uploads
3. Build and run:

```bash
npm ci
npm run build:server
node server/dist/index.js
```

Or use the included `Dockerfile` / `render.yaml`.

**Notes:**
- `POST /api/wallet/add` is disabled in production (use Paystack top-up)
- `JWT_SECRET` is required when `NODE_ENV=production`
- Set `CLIENT_URL` to your frontend origin (comma-separated for multiple)

### Frontend (Vercel / Netlify)

1. `npm run build` → deploy `dist/`
2. Point `VITE_API_URL` at your API, or configure proxy rewrites in `vercel.json`
3. Set `VITE_WS_URL` for WebSocket if not on same host

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
