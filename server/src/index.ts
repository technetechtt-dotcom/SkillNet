import 'dotenv/config';
import http from 'http';
import { app } from './app.js';
import { setupWebSocket } from './ws.js';
import { initSentry } from './utils/sentry.js';

initSentry();

const PORT = process.env.PORT || 3001;
const server = http.createServer(app);
setupWebSocket(server);

server.listen(PORT, () => {
  console.log(`SkillNet API running on http://localhost:${PORT}`);
  console.log(`WebSocket available at ws://localhost:${PORT}/ws`);
});
