import { Router } from 'express';
import { and, desc, eq, ne, sql } from 'drizzle-orm';
import { db } from '../db/index.js';
import {
  chatParticipants,
  chats,
  messages,
} from '../db/schema.js';
import { AuthRequest, requireAuth } from '../middleware/auth.js';
import { serializeUser } from '../utils/serialize.js';
import { timeAgo } from '../utils/format.js';
import { broadcastChatMessage } from '../ws.js';
import { param } from '../utils/params.js';

const router = Router();

router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const myChats = await db
      .select({ chatId: chatParticipants.chatId })
      .from(chatParticipants)
      .where(eq(chatParticipants.userId, req.userId!));

    const result = await Promise.all(
      myChats.map(async ({ chatId }) => {
        const participants = await db
          .select()
          .from(chatParticipants)
          .where(eq(chatParticipants.chatId, chatId));

        const otherParticipant = participants.find((p) => p.userId !== req.userId);
        const otherUser = otherParticipant
          ? await serializeUser(otherParticipant.userId)
          : null;

        const [lastMsg] = await db
          .select()
          .from(messages)
          .where(eq(messages.chatId, chatId))
          .orderBy(desc(messages.createdAt))
          .limit(1);

        const unread = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(messages)
          .where(
            and(
              eq(messages.chatId, chatId),
              eq(messages.isRead, false),
              ne(messages.senderId, req.userId!)
            )
          );

        return {
          id: chatId,
          user: otherUser,
          lastMessage: lastMsg?.text || '',
          unreadCount: unread[0]?.count ?? 0,
          timestamp: lastMsg ? timeAgo(lastMsg.createdAt) : '',
        };
      })
    );

    res.json(result.filter((c) => c.user));
  } catch (err) {
    console.error('List chats error:', err);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
});

router.get('/:id/messages', requireAuth, async (req: AuthRequest, res) => {
  try {
    const chatId = param(req, 'id');
    const msgs = await db
      .select()
      .from(messages)
      .where(eq(messages.chatId, chatId))
      .orderBy(messages.createdAt);

    await db
      .update(messages)
      .set({ isRead: true })
      .where(
        and(
          eq(messages.chatId, chatId),
          ne(messages.senderId, req.userId!)
        )
      );

    res.json(
      msgs.map((m) => ({
        id: m.id,
        senderId: m.senderId,
        text: m.text,
        imageUrl: m.imageUrl,
        timestamp: timeAgo(m.createdAt),
        isRead: m.isRead,
      }))
    );
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

router.post('/:id/messages', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { text, imageUrl } = req.body;
    if (!text?.trim()) {
      res.status(400).json({ error: 'Message text is required' });
      return;
    }

    const [msg] = await db
      .insert(messages)
      .values({
        chatId: param(req, 'id'),
        senderId: req.userId!,
        text: text.trim(),
        imageUrl: imageUrl || null,
      })
      .returning();

    const participants = await db
      .select()
      .from(chatParticipants)
      .where(eq(chatParticipants.chatId, param(req, 'id')));

    const payload = {
      id: msg.id,
      senderId: msg.senderId,
      text: msg.text,
      imageUrl: msg.imageUrl,
      timestamp: 'just now',
      isRead: false,
    };

    broadcastChatMessage(
      param(req, 'id'),
      participants.map((p) => p.userId),
      payload
    );

    res.status(201).json(payload);
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

router.post('/start', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { userId: otherUserId } = req.body;
    if (!otherUserId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    const myChats = await db
      .select({ chatId: chatParticipants.chatId })
      .from(chatParticipants)
      .where(eq(chatParticipants.userId, req.userId!));

    for (const { chatId } of myChats) {
      const participants = await db
        .select()
        .from(chatParticipants)
        .where(eq(chatParticipants.chatId, chatId));

      if (
        participants.length === 2 &&
        participants.some((p) => p.userId === otherUserId)
      ) {
        res.json({ chatId });
        return;
      }
    }

    const [chat] = await db.insert(chats).values({}).returning();
    await db.insert(chatParticipants).values([
      { chatId: chat.id, userId: req.userId! },
      { chatId: chat.id, userId: otherUserId },
    ]);

    res.status(201).json({ chatId: chat.id });
  } catch (err) {
    console.error('Start chat error:', err);
    res.status(500).json({ error: 'Failed to start chat' });
  }
});

export default router;
