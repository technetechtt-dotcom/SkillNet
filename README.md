# SkillNet Africa

Production-ready skilled-trades platform for Africa — video portfolio, local jobs, messaging, and wallet.

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
| Worker | +233201234567 | password123 |
| Employer | +2348012345678 | password123 |
| Employer | +254712345678 | password123 |

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
| `npm run db:push` | Push schema to Neon |
| `npm run db:seed` | Seed demo data |

## What's Production-Ready

- JWT authentication with bcrypt password hashing
- PostgreSQL persistence via Neon
- Real job marketplace (list, post, apply, save)
- Wallet with add/send/withdraw transactions
- Chat messaging API
- Notifications on job applications
- Protected API routes

## Still UI-Only (future work)

- Video upload to cloud storage (S3/Cloudinary)
- WebRTC voice/video calls
- Real-time chat (WebSockets)
- URL routing (react-router)
- Mobile money integrations (M-Pesa, Paystack)
- Push notifications
