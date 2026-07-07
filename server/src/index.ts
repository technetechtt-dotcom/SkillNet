import 'dotenv/config';
import http from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import jobRoutes from './routes/jobs.js';
import videoRoutes from './routes/videos.js';
import notificationRoutes from './routes/notifications.js';
import walletRoutes from './routes/wallet.js';
import chatRoutes from './routes/chats.js';
import invoiceRoutes from './routes/invoices.js';
import storyRoutes from './routes/stories.js';
import challengeRoutes from './routes/challenges.js';
import exploreRoutes from './routes/explore.js';
import workerRoutes from './routes/workers.js';
import followRoutes from './routes/follows.js';
import adminRoutes from './routes/admin.js';
import adminModerationRoutes from './routes/adminModeration.js';
import programRoutes from './routes/programs.js';
import { setupWebSocket } from './ws.js';
import { isProduction, requireProductionEnv } from './utils/env.js';

requireProductionEnv('JWT_SECRET');

const app = express();
const PORT = process.env.PORT || 3001;

const clientOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(
  cors({
    origin: clientOrigins.length === 1 ? clientOrigins[0] : clientOrigins,
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 30 : 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many auth attempts, try again later' },
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: isProduction ? 120 : 600,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, slow down' },
});

app.use('/api', apiLimiter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'skillnet-api' });
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', followRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/explore', exploreRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminModerationRoutes);
app.use('/api/programs', programRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const server = http.createServer(app);
setupWebSocket(server);

server.listen(PORT, () => {
  console.log(`SkillNet API running on http://localhost:${PORT}`);
  console.log(`WebSocket available at ws://localhost:${PORT}/ws`);
});
