import 'dotenv/config';
import http from 'http';
import express from 'express';
import cors from 'cors';
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
import { setupWebSocket } from './ws.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'skillnet-api' });
});

app.use('/api/auth', authRoutes);
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

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const server = http.createServer(app);
setupWebSocket(server);

server.listen(PORT, () => {
  console.log(`SkillNet API running on http://localhost:${PORT}`);
  console.log(`WebSocket available at ws://localhost:${PORT}/ws`);
});
