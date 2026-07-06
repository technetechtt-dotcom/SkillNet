import { WebSocketServer, WebSocket } from 'ws';
import type { Server } from 'http';
import jwt from 'jsonwebtoken';

interface WsClient {
  ws: WebSocket;
  userId: string;
}

const clients = new Map<WebSocket, WsClient>();

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws, req) => {
    const url = new URL(req.url || '', 'http://localhost');
    const token = url.searchParams.get('token');

    if (!token) {
      ws.close(4001, 'Unauthorized');
      return;
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
      };
      clients.set(ws, { ws, userId: payload.userId });

      ws.send(JSON.stringify({ type: 'connected', userId: payload.userId }));

      ws.on('close', () => clients.delete(ws));
    } catch {
      ws.close(4001, 'Unauthorized');
    }
  });

  return wss;
}

export function broadcastToUsers(userIds: string[], event: object) {
  const payload = JSON.stringify(event);
  for (const client of clients.values()) {
    if (userIds.includes(client.userId) && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(payload);
    }
  }
}

export function broadcastChatMessage(
  chatId: string,
  participantIds: string[],
  message: object
) {
  broadcastToUsers(participantIds, {
    type: 'message:new',
    chatId,
    message,
  });
}
