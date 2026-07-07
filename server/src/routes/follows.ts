import { Router } from 'express';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { notifications, userFollows, users } from '../db/schema.js';
import { AuthRequest, requireAuth } from '../middleware/auth.js';
import { serializeUser } from '../utils/serialize.js';

const router = Router();

router.post('/:id/follow', requireAuth, async (req: AuthRequest, res) => {
  try {
    const followingId = String(req.params.id);
    const followerId = req.userId!;

    if (followerId === followingId) {
      res.status(400).json({ error: 'Cannot follow yourself' });
      return;
    }

    const [target] = await db.select().from(users).where(eq(users.id, followingId));
    if (!target) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const [existing] = await db
      .select()
      .from(userFollows)
      .where(
        and(
          eq(userFollows.followerId, followerId),
          eq(userFollows.followingId, followingId)
        )
      );

    if (existing) {
      res.json({ success: true, following: true });
      return;
    }

    await db.insert(userFollows).values({ followerId, followingId });

    const follower = await serializeUser(followerId);
    await db.insert(notifications).values({
      userId: followingId,
      type: 'follower',
      title: 'New follower',
      description: `${follower?.name || 'Someone'} started following you`,
      metadata: { followerId },
    });

    res.status(201).json({ success: true, following: true });
  } catch (err) {
    console.error('Follow error:', err);
    res.status(500).json({ error: 'Failed to follow user' });
  }
});

router.delete('/:id/follow', requireAuth, async (req: AuthRequest, res) => {
  try {
    const followingId = String(req.params.id);
    await db
      .delete(userFollows)
      .where(
        and(
          eq(userFollows.followerId, req.userId!),
          eq(userFollows.followingId, followingId)
        )
      );
    res.json({ success: true, following: false });
  } catch (err) {
    res.status(500).json({ error: 'Failed to unfollow user' });
  }
});

router.get('/:id/followers', requireAuth, async (req, res) => {
  try {
    const userId = String(req.params.id);
    const rows = await db
      .select({
        userId: userFollows.followerId,
        name: users.name,
        avatar: users.avatar,
        phone: users.phone,
        createdAt: userFollows.createdAt,
      })
      .from(userFollows)
      .innerJoin(users, eq(userFollows.followerId, users.id))
      .where(eq(userFollows.followingId, userId))
      .orderBy(desc(userFollows.createdAt));

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load followers' });
  }
});

router.get('/:id/following', requireAuth, async (req, res) => {
  try {
    const userId = String(req.params.id);
    const rows = await db
      .select({
        userId: userFollows.followingId,
        name: users.name,
        avatar: users.avatar,
        phone: users.phone,
        createdAt: userFollows.createdAt,
      })
      .from(userFollows)
      .innerJoin(users, eq(userFollows.followingId, users.id))
      .where(eq(userFollows.followerId, userId))
      .orderBy(desc(userFollows.createdAt));

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load following' });
  }
});

export default router;
