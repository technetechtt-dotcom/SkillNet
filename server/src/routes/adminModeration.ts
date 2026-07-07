import { Router } from 'express';
import { and, desc, eq, ne, sql } from 'drizzle-orm';
import { db } from '../db/index.js';
import {
  chatParticipants,
  messages,
  moderationLogs,
  stories,
  users,
  videoComments,
  videoLikes,
  videoShares,
  videos,
} from '../db/schema.js';
import { AdminRequest, requireAdmin } from '../middleware/admin.js';
import { logModerationAction } from '../utils/moderation.js';
import { serializeUser } from '../utils/serialize.js';
import { timeAgo } from '../utils/format.js';

const router = Router();
router.use(requireAdmin);

function parseBlockUntil(duration?: string, customUntil?: string): Date | null {
  if (customUntil) return new Date(customUntil);
  if (!duration || duration === 'permanent') return null;
  const now = Date.now();
  const map: Record<string, number> = {
    '1h': 3600000,
    '24h': 86400000,
    '7d': 7 * 86400000,
    '30d': 30 * 86400000,
    '90d': 90 * 86400000,
  };
  const ms = map[duration];
  return ms ? new Date(now + ms) : null;
}

router.patch('/users/:id/block', async (req: AdminRequest, res) => {
  try {
    const id = String(req.params.id);
    const { reason, duration, blockedUntil } = req.body as {
      reason?: string;
      duration?: string;
      blockedUntil?: string;
    };

    if (id === req.userId) {
      res.status(400).json({ error: 'Cannot block your own account' });
      return;
    }

    const until = parseBlockUntil(duration, blockedUntil);

    await db
      .update(users)
      .set({
        accountStatus: 'blocked',
        blockReason: reason || 'Violated platform rules',
        blockedUntil: until,
        blockedAt: new Date(),
        isOnline: false,
      })
      .where(eq(users.id, id));

    await logModerationAction({
      adminId: req.userId!,
      targetType: 'user',
      targetId: id,
      action: until ? 'temp_block' : 'block',
      reason: reason || undefined,
      metadata: until ? { blockedUntil: until.toISOString() } : undefined,
    });

    const user = await serializeUser(id);
    res.json(user);
  } catch (err) {
    console.error('Block user error:', err);
    res.status(500).json({ error: 'Failed to block user' });
  }
});

router.patch('/users/:id/unblock', async (req: AdminRequest, res) => {
  try {
    const id = String(req.params.id);
    await db
      .update(users)
      .set({
        accountStatus: 'active',
        blockReason: null,
        blockedUntil: null,
        blockedAt: null,
      })
      .where(eq(users.id, id));

    await logModerationAction({
      adminId: req.userId!,
      targetType: 'user',
      targetId: id,
      action: 'unblock',
    });

    const user = await serializeUser(id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to unblock user' });
  }
});

router.patch('/videos/:id/moderate', async (req: AdminRequest, res) => {
  try {
    const id = String(req.params.id);
    const { status, reason } = req.body as {
      status: 'active' | 'blocked' | 'removed';
      reason?: string;
    };

    if (!['active', 'blocked', 'removed'].includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }

    const [video] = await db
      .update(videos)
      .set({
        status,
        moderationReason: reason || null,
        moderatedAt: new Date(),
      })
      .where(eq(videos.id, id))
      .returning();

    if (!video) {
      res.status(404).json({ error: 'Video not found' });
      return;
    }

    await logModerationAction({
      adminId: req.userId!,
      targetType: 'video',
      targetId: id,
      action: status,
      reason,
    });

    res.json(video);
  } catch (err) {
    res.status(500).json({ error: 'Failed to moderate video' });
  }
});

router.patch('/stories/:id/moderate', async (req: AdminRequest, res) => {
  try {
    const id = String(req.params.id);
    const { status, reason } = req.body as {
      status: 'active' | 'blocked' | 'removed';
      reason?: string;
    };

    const [story] = await db
      .update(stories)
      .set({
        status,
        moderationReason: reason || null,
        moderatedAt: new Date(),
      })
      .where(eq(stories.id, id))
      .returning();

    if (!story) {
      res.status(404).json({ error: 'Story not found' });
      return;
    }

    await logModerationAction({
      adminId: req.userId!,
      targetType: 'story',
      targetId: id,
      action: status,
      reason,
    });

    res.json(story);
  } catch (err) {
    res.status(500).json({ error: 'Failed to moderate story' });
  }
});

router.patch('/comments/:id/moderate', async (req: AdminRequest, res) => {
  try {
    const id = String(req.params.id);
    const { status, reason } = req.body as {
      status: 'active' | 'blocked' | 'removed';
      reason?: string;
    };

    const [comment] = await db
      .update(videoComments)
      .set({ status })
      .where(eq(videoComments.id, id))
      .returning();

    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    await logModerationAction({
      adminId: req.userId!,
      targetType: 'comment',
      targetId: id,
      action: status,
      reason,
    });

    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to moderate comment' });
  }
});

router.get('/videos/:id/engagement', async (req, res) => {
  try {
    const id = String(req.params.id);

    const likes = await db
      .select({
        userId: videoLikes.userId,
        userName: users.name,
        userAvatar: users.avatar,
        reaction: videoLikes.reaction,
        createdAt: videoLikes.createdAt,
      })
      .from(videoLikes)
      .leftJoin(users, eq(videoLikes.userId, users.id))
      .where(eq(videoLikes.videoId, id))
      .orderBy(desc(videoLikes.createdAt));

    const comments = await db
      .select({
        id: videoComments.id,
        userId: videoComments.userId,
        userName: users.name,
        userAvatar: users.avatar,
        text: videoComments.text,
        status: videoComments.status,
        createdAt: videoComments.createdAt,
      })
      .from(videoComments)
      .leftJoin(users, eq(videoComments.userId, users.id))
      .where(eq(videoComments.videoId, id))
      .orderBy(desc(videoComments.createdAt));

    const shares = await db
      .select({
        id: videoShares.id,
        userId: videoShares.userId,
        userName: users.name,
        userAvatar: users.avatar,
        createdAt: videoShares.createdAt,
      })
      .from(videoShares)
      .leftJoin(users, eq(videoShares.userId, users.id))
      .where(eq(videoShares.videoId, id))
      .orderBy(desc(videoShares.createdAt));

    res.json({ likes, comments, shares });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load engagement' });
  }
});

router.get('/messages', async (_req, res) => {
  try {
    const allChats = await db
      .select()
      .from(chatParticipants)
      .orderBy(desc(sql`1`));

    const chatIds = [...new Set(allChats.map((c) => c.chatId))];

    const result = await Promise.all(
      chatIds.map(async (chatId) => {
        const participants = await db
          .select({
            userId: chatParticipants.userId,
            name: users.name,
            phone: users.phone,
            avatar: users.avatar,
          })
          .from(chatParticipants)
          .leftJoin(users, eq(chatParticipants.userId, users.id))
          .where(eq(chatParticipants.chatId, chatId));

        const [lastMsg] = await db
          .select({
            id: messages.id,
            text: messages.text,
            senderId: messages.senderId,
            senderName: users.name,
            createdAt: messages.createdAt,
          })
          .from(messages)
          .leftJoin(users, eq(messages.senderId, users.id))
          .where(eq(messages.chatId, chatId))
          .orderBy(desc(messages.createdAt))
          .limit(1);

        const [msgCount] = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(messages)
          .where(eq(messages.chatId, chatId));

        return {
          chatId,
          participants,
          lastMessage: lastMsg
            ? {
                text: lastMsg.text,
                senderId: lastMsg.senderId,
                senderName: lastMsg.senderName,
                createdAt: lastMsg.createdAt,
                timeAgo: timeAgo(lastMsg.createdAt),
              }
            : null,
          messageCount: msgCount?.count ?? 0,
        };
      })
    );

    res.json(
      result.sort(
        (a, b) =>
          (b.lastMessage?.createdAt?.getTime() || 0) -
          (a.lastMessage?.createdAt?.getTime() || 0)
      )
    );
  } catch (err) {
    console.error('Admin list messages error:', err);
    res.status(500).json({ error: 'Failed to list messages' });
  }
});

router.get('/messages/:chatId', async (req, res) => {
  try {
    const chatId = String(req.params.chatId);

    const participants = await db
      .select({
        userId: chatParticipants.userId,
        name: users.name,
        phone: users.phone,
        avatar: users.avatar,
      })
      .from(chatParticipants)
      .leftJoin(users, eq(chatParticipants.userId, users.id))
      .where(eq(chatParticipants.chatId, chatId));

    const msgs = await db
      .select({
        id: messages.id,
        senderId: messages.senderId,
        senderName: users.name,
        senderAvatar: users.avatar,
        text: messages.text,
        imageUrl: messages.imageUrl,
        isRead: messages.isRead,
        createdAt: messages.createdAt,
      })
      .from(messages)
      .leftJoin(users, eq(messages.senderId, users.id))
      .where(eq(messages.chatId, chatId))
      .orderBy(messages.createdAt);

    res.json({
      chatId,
      participants,
      messages: msgs.map((m) => ({
        ...m,
        timeAgo: timeAgo(m.createdAt),
      })),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load chat' });
  }
});

router.get('/moderation/logs', async (_req, res) => {
  try {
    const logs = await db
      .select({
        id: moderationLogs.id,
        targetType: moderationLogs.targetType,
        targetId: moderationLogs.targetId,
        action: moderationLogs.action,
        reason: moderationLogs.reason,
        createdAt: moderationLogs.createdAt,
        adminName: users.name,
      })
      .from(moderationLogs)
      .leftJoin(users, eq(moderationLogs.adminId, users.id))
      .orderBy(desc(moderationLogs.createdAt))
      .limit(100);

    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load moderation logs' });
  }
});

export default router;
