import { Router } from 'express';
import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from '../db/index.js';
import {
  challengeParticipants,
  challengeWinners,
  challenges,
} from '../db/schema.js';
import { AuthRequest, requireAuth } from '../middleware/auth.js';

const router = Router();

function daysLeft(endsAt: Date) {
  return Math.max(0, Math.ceil((endsAt.getTime() - Date.now()) / 86400000));
}

function daysUntil(startsAt: Date) {
  return Math.max(0, Math.ceil((startsAt.getTime() - Date.now()) / 86400000));
}

async function serializeChallenge(
  ch: typeof challenges.$inferSelect,
  userId?: string
) {
  const [countRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(challengeParticipants)
    .where(eq(challengeParticipants.challengeId, ch.id));

  const winners = await db
    .select()
    .from(challengeWinners)
    .where(eq(challengeWinners.challengeId, ch.id))
    .orderBy(challengeWinners.rank);

  let joined = false;
  if (userId) {
    const [p] = await db
      .select()
      .from(challengeParticipants)
      .where(
        and(
          eq(challengeParticipants.challengeId, ch.id),
          eq(challengeParticipants.userId, userId)
        )
      );
    joined = !!p;
  }

  return {
    id: ch.id,
    name: ch.hashtag,
    emoji: ch.emoji,
    description: ch.description,
    category: ch.category,
    participants: countRow?.count ?? 0,
    daysLeft: ch.status === 'active' ? daysLeft(ch.endsAt) : undefined,
    startsIn: ch.status === 'upcoming' ? daysUntil(ch.startsAt) : undefined,
    prize: ch.prize,
    status: ch.status,
    featured: ch.featured,
    joined,
    winners: winners.map((w) => ({
      name: w.displayName,
      avatar: w.avatar,
    })),
  };
}

router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const all = await db.select().from(challenges).orderBy(desc(challenges.startsAt));
    const serialized = await Promise.all(
      all.map((ch) => serializeChallenge(ch, req.userId))
    );
    res.json(serialized);
  } catch (err) {
    console.error('List challenges error:', err);
    res.status(500).json({ error: 'Failed to fetch challenges' });
  }
});

router.get('/featured', requireAuth, async (req: AuthRequest, res) => {
  try {
    const [featured] = await db
      .select()
      .from(challenges)
      .where(eq(challenges.featured, true))
      .orderBy(desc(challenges.startsAt))
      .limit(1);

    if (!featured) {
      res.json(null);
      return;
    }

    res.json(await serializeChallenge(featured, req.userId));
  } catch (err) {
    console.error('Featured challenge error:', err);
    res.status(500).json({ error: 'Failed to fetch featured challenge' });
  }
});

router.post('/:id/join', requireAuth, async (req: AuthRequest, res) => {
  try {
    const challengeId = String(req.params.id);
    const [ch] = await db
      .select()
      .from(challenges)
      .where(eq(challenges.id, challengeId));

    if (!ch || ch.status !== 'active') {
      res.status(400).json({ error: 'Challenge not available' });
      return;
    }

    await db
      .insert(challengeParticipants)
      .values({ challengeId, userId: req.userId! })
      .onConflictDoNothing();

    res.json({ success: true });
  } catch (err) {
    console.error('Join challenge error:', err);
    res.status(500).json({ error: 'Failed to join challenge' });
  }
});

export default router;
