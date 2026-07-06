import { Router } from 'express';
import { and, desc, eq, gt } from 'drizzle-orm';
import { db } from '../db/index.js';
import { stories } from '../db/schema.js';
import { AuthRequest, requireAuth } from '../middleware/auth.js';
import { serializeUser } from '../utils/serialize.js';
import { timeAgo } from '../utils/format.js';

const router = Router();

router.get('/', requireAuth, async (_req, res) => {
  try {
    const now = new Date();
    const activeStories = await db
      .select()
      .from(stories)
      .where(gt(stories.expiresAt, now))
      .orderBy(desc(stories.createdAt));

    const grouped = new Map<
      string,
      {
        userId: string;
        user: Awaited<ReturnType<typeof serializeUser>>;
        items: typeof activeStories;
      }
    >();

    for (const story of activeStories) {
      if (!grouped.has(story.userId)) {
        const user = await serializeUser(story.userId);
        grouped.set(story.userId, { userId: story.userId, user, items: [] });
      }
      grouped.get(story.userId)!.items.push(story);
    }

    const result = await Promise.all(
      Array.from(grouped.values()).map(async (group) => ({
        userId: group.userId,
        userName: group.user?.name || 'User',
        userAvatar: group.user?.avatar || null,
        stories: group.items.map((s) => ({
          id: s.id,
          userId: s.userId,
          userName: group.user?.name || 'User',
          userAvatar: group.user?.avatar || null,
          skill: s.skillTag || group.user?.skills?.[0]?.name || 'Skilled Worker',
          image: s.mediaUrl,
          text: s.text || '',
          timestamp: timeAgo(s.createdAt),
        })),
      }))
    );

    res.json(result);
  } catch (err) {
    console.error('List stories error:', err);
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
});

router.get('/feed', requireAuth, async (_req, res) => {
  try {
    const now = new Date();
    const activeStories = await db
      .select()
      .from(stories)
      .where(gt(stories.expiresAt, now))
      .orderBy(desc(stories.createdAt));

    const seen = new Set<string>();
    const rings: {
      userId: string;
      userName: string;
      userAvatar: string | null;
      hasUnread: boolean;
    }[] = [];

    for (const story of activeStories) {
      if (seen.has(story.userId)) continue;
      seen.add(story.userId);
      const user = await serializeUser(story.userId);
      rings.push({
        userId: story.userId,
        userName: user?.name || 'User',
        userAvatar: user?.avatar || null,
        hasUnread: true,
      });
    }

    res.json(rings);
  } catch (err) {
    console.error('Story feed error:', err);
    res.status(500).json({ error: 'Failed to fetch story feed' });
  }
});

router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { mediaUrl, text, skillTag, mediaType = 'image' } = req.body;
    if (!mediaUrl) {
      res.status(400).json({ error: 'Media URL is required' });
      return;
    }

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const [story] = await db
      .insert(stories)
      .values({
        userId: req.userId!,
        mediaUrl,
        mediaType,
        text: text || null,
        skillTag: skillTag || null,
        expiresAt,
      })
      .returning();

    const user = await serializeUser(story.userId);
    res.status(201).json({
      id: story.id,
      userId: story.userId,
      userName: user?.name || 'User',
      userAvatar: user?.avatar || null,
      skill: story.skillTag || user?.skills?.[0]?.name || 'Skilled Worker',
      image: story.mediaUrl,
      text: story.text || '',
      timestamp: 'just now',
    });
  } catch (err) {
    console.error('Create story error:', err);
    res.status(500).json({ error: 'Failed to create story' });
  }
});

export default router;
