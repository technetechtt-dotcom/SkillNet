import { Router } from 'express';
import { count, desc, eq, sql } from 'drizzle-orm';
import { db } from '../db/index.js';
import {
  challenges,
  jobs,
  programs,
  stories,
  transactions,
  userFollows,
  users,
  videos,
  wallets,
} from '../db/schema.js';
import { AdminRequest, requireAdmin } from '../middleware/admin.js';
import { hashPassword } from '../utils/auth.js';
import { serializeUser } from '../utils/serialize.js';

const router = Router();
router.use(requireAdmin);

router.get('/stats', async (_req, res) => {
  try {
    const [
      [userCount],
      [jobCount],
      [videoCount],
      [storyCount],
      [challengeCount],
      [programCount],
      [txCount],
    ] = await Promise.all([
      db.select({ count: count() }).from(users),
      db.select({ count: count() }).from(jobs),
      db.select({ count: count() }).from(videos),
      db.select({ count: count() }).from(stories),
      db.select({ count: count() }).from(challenges),
      db.select({ count: count() }).from(programs),
      db.select({ count: count() }).from(transactions),
    ]);

    const recentUsers = await db
      .select({
        id: users.id,
        name: users.name,
        phone: users.phone,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(5);

    const walletTotal = await db
      .select({ total: sql<number>`coalesce(sum(${wallets.balance}), 0)` })
      .from(wallets);

    res.json({
      counts: {
        users: userCount.count,
        jobs: jobCount.count,
        videos: videoCount.count,
        stories: storyCount.count,
        challenges: challengeCount.count,
        programs: programCount.count,
        transactions: txCount.count,
        walletBalance: Number(walletTotal[0]?.total ?? 0),
      },
      recentUsers,
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ error: 'Failed to load stats' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const q = (req.query.q as string) || '';
    const role = req.query.role as string | undefined;

    let query = db.select().from(users).orderBy(desc(users.createdAt)).limit(100);

    const allUsers = await query;
    const filtered = allUsers.filter((u) => {
      const matchesQ =
        !q ||
        u.name.toLowerCase().includes(q.toLowerCase()) ||
        u.phone.includes(q);
      const matchesRole = !role || u.role === role;
      return matchesQ && matchesRole;
    });

    const followerCounts = await db
      .select({
        userId: userFollows.followingId,
        count: sql<number>`count(*)::int`,
      })
      .from(userFollows)
      .groupBy(userFollows.followingId);

    const followingCounts = await db
      .select({
        userId: userFollows.followerId,
        count: sql<number>`count(*)::int`,
      })
      .from(userFollows)
      .groupBy(userFollows.followerId);

    const followerMap = new Map(followerCounts.map((r) => [r.userId, r.count]));
    const followingMap = new Map(followingCounts.map((r) => [r.userId, r.count]));

    res.json(
      filtered.map(({ passwordHash: _, ...u }) => ({
        ...u,
        followerCount: followerMap.get(u.id) ?? 0,
        followingCount: followingMap.get(u.id) ?? 0,
      }))
    );
  } catch (err) {
    console.error('Admin list users error:', err);
    res.status(500).json({ error: 'Failed to list users' });
  }
});

router.get('/users/:id/social', async (req, res) => {
  try {
    const userId = String(req.params.id);

    const [user] = await db
      .select({ id: users.id, name: users.name, phone: users.phone })
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const followers = await db
      .select({
        userId: userFollows.followerId,
        name: users.name,
        phone: users.phone,
        avatar: users.avatar,
        createdAt: userFollows.createdAt,
      })
      .from(userFollows)
      .innerJoin(users, eq(userFollows.followerId, users.id))
      .where(eq(userFollows.followingId, userId))
      .orderBy(desc(userFollows.createdAt));

    const following = await db
      .select({
        userId: userFollows.followingId,
        name: users.name,
        phone: users.phone,
        avatar: users.avatar,
        createdAt: userFollows.createdAt,
      })
      .from(userFollows)
      .innerJoin(users, eq(userFollows.followingId, users.id))
      .where(eq(userFollows.followerId, userId))
      .orderBy(desc(userFollows.createdAt));

    res.json({
      user,
      followerCount: followers.length,
      followingCount: following.length,
      followers,
      following,
    });
  } catch (err) {
    console.error('Admin user social error:', err);
    res.status(500).json({ error: 'Failed to load follow data' });
  }
});

router.get('/follows', async (req, res) => {
  try {
    const q = ((req.query.q as string) || '').toLowerCase();

    const rows = await db
      .select({
        followerId: userFollows.followerId,
        followingId: userFollows.followingId,
        createdAt: userFollows.createdAt,
      })
      .from(userFollows)
      .orderBy(desc(userFollows.createdAt))
      .limit(200);

    const userIds = new Set<string>();
    for (const row of rows) {
      userIds.add(row.followerId);
      userIds.add(row.followingId);
    }

    const userRows =
      userIds.size > 0
        ? await db
            .select({
              id: users.id,
              name: users.name,
              phone: users.phone,
              avatar: users.avatar,
            })
            .from(users)
        : [];

    const userMap = new Map(userRows.map((u) => [u.id, u]));

    const result = rows
      .map((row) => {
        const follower = userMap.get(row.followerId);
        const following = userMap.get(row.followingId);
        return {
          followerId: row.followerId,
          followerName: follower?.name || 'Unknown',
          followerPhone: follower?.phone || '',
          followerAvatar: follower?.avatar || null,
          followingId: row.followingId,
          followingName: following?.name || 'Unknown',
          followingPhone: following?.phone || '',
          followingAvatar: following?.avatar || null,
          createdAt: row.createdAt,
        };
      })
      .filter(
        (row) =>
          !q ||
          row.followerName.toLowerCase().includes(q) ||
          row.followingName.toLowerCase().includes(q) ||
          row.followerPhone.includes(q) ||
          row.followingPhone.includes(q)
      );

    res.json(result);
  } catch (err) {
    console.error('Admin list follows error:', err);
    res.status(500).json({ error: 'Failed to list follows' });
  }
});

router.get('/users/:id/content', async (req, res) => {
  try {
    const userId = String(req.params.id);

    const userVideos = await db
      .select({
        id: videos.id,
        title: videos.title,
        description: videos.description,
        skillCategory: videos.skillCategory,
        thumbnail: videos.thumbnail,
        videoUrl: videos.videoUrl,
        likes: videos.likes,
        comments: videos.comments,
        shares: videos.shares,
        duration: videos.duration,
        status: videos.status,
        moderationReason: videos.moderationReason,
        userId: videos.userId,
        userName: users.name,
        userAvatar: users.avatar,
        createdAt: videos.createdAt,
      })
      .from(videos)
      .leftJoin(users, eq(videos.userId, users.id))
      .where(eq(videos.userId, userId))
      .orderBy(desc(videos.createdAt));

    const userStories = await db
      .select({
        id: stories.id,
        text: stories.text,
        skillTag: stories.skillTag,
        mediaType: stories.mediaType,
        mediaUrl: stories.mediaUrl,
        status: stories.status,
        moderationReason: stories.moderationReason,
        userId: stories.userId,
        userName: users.name,
        userAvatar: users.avatar,
        expiresAt: stories.expiresAt,
        createdAt: stories.createdAt,
      })
      .from(stories)
      .leftJoin(users, eq(stories.userId, users.id))
      .where(eq(stories.userId, userId))
      .orderBy(desc(stories.createdAt));

    res.json({ videos: userVideos, stories: userStories });
  } catch (err) {
    console.error('Admin user content error:', err);
    res.status(500).json({ error: 'Failed to load user content' });
  }
});

router.get('/users/:id', async (req, res) => {
  const user = await serializeUser(String(req.params.id));
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json(user);
});

router.patch('/users/:id', async (req: AdminRequest, res) => {
  try {
    const id = String(req.params.id);
    const { name, location, bio, role, trustScore, rating, availabilityStatus } =
      req.body;

    const updates: Partial<typeof users.$inferInsert> = {};
    if (name !== undefined) updates.name = name;
    if (location !== undefined) updates.location = location;
    if (bio !== undefined) updates.bio = bio;
    if (role !== undefined) updates.role = role;
    if (trustScore !== undefined) updates.trustScore = trustScore;
    if (rating !== undefined) updates.rating = rating;
    if (availabilityStatus !== undefined) {
      updates.availabilityStatus = availabilityStatus;
    }

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ error: 'No updates provided' });
      return;
    }

    await db.update(users).set(updates).where(eq(users.id, id));
    const user = await serializeUser(id);
    res.json(user);
  } catch (err) {
    console.error('Admin update user error:', err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.delete('/users/:id', async (req: AdminRequest, res) => {
  try {
    const id = String(req.params.id);
    if (id === req.userId) {
      res.status(400).json({ error: 'Cannot delete your own account' });
      return;
    }
    await db.delete(users).where(eq(users.id, id));
    res.json({ success: true });
  } catch (err) {
    console.error('Admin delete user error:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

router.post('/users', async (req, res) => {
  try {
    const { phone, password, name, location, role = 'user' } = req.body;

    if (!phone || !password || !name) {
      res.status(400).json({ error: 'Phone, password, and name are required' });
      return;
    }

    const passwordHash = await hashPassword(password);
    const [user] = await db
      .insert(users)
      .values({
        phone,
        passwordHash,
        name,
        location: location || null,
        role,
      })
      .returning();

    await db.insert(wallets).values({ userId: user.id, balance: 0, currency: 'ZAR' });
    const serialized = await serializeUser(user.id);
    res.status(201).json(serialized);
  } catch (err) {
    console.error('Admin create user error:', err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.get('/videos', async (req, res) => {
  try {
    const userId = req.query.userId as string | undefined;

    let rows = await db
      .select({
        id: videos.id,
        title: videos.title,
        description: videos.description,
        skillCategory: videos.skillCategory,
        thumbnail: videos.thumbnail,
        videoUrl: videos.videoUrl,
        likes: videos.likes,
        comments: videos.comments,
        shares: videos.shares,
        duration: videos.duration,
        status: videos.status,
        moderationReason: videos.moderationReason,
        userId: videos.userId,
        userName: users.name,
        userAvatar: users.avatar,
        createdAt: videos.createdAt,
      })
      .from(videos)
      .leftJoin(users, eq(videos.userId, users.id))
      .orderBy(desc(videos.createdAt))
      .limit(100);

    if (userId) rows = rows.filter((v) => v.userId === userId);
    res.json(rows);
  } catch (err) {
    console.error('Admin list videos error:', err);
    res.status(500).json({ error: 'Failed to list videos' });
  }
});

router.get('/videos/:id', async (req, res) => {
  try {
    const id = String(req.params.id);
    const [row] = await db
      .select({
        id: videos.id,
        title: videos.title,
        description: videos.description,
        skillCategory: videos.skillCategory,
        thumbnail: videos.thumbnail,
        videoUrl: videos.videoUrl,
        likes: videos.likes,
        comments: videos.comments,
        shares: videos.shares,
        duration: videos.duration,
        status: videos.status,
        moderationReason: videos.moderationReason,
        userId: videos.userId,
        userName: users.name,
        userAvatar: users.avatar,
        createdAt: videos.createdAt,
      })
      .from(videos)
      .leftJoin(users, eq(videos.userId, users.id))
      .where(eq(videos.id, id));

    if (!row) {
      res.status(404).json({ error: 'Video not found' });
      return;
    }
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get video' });
  }
});

router.delete('/videos/:id', async (req, res) => {
  try {
    const id = String(req.params.id);
    await db.delete(videos).where(eq(videos.id, id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete video' });
  }
});

router.get('/stories', async (req, res) => {
  try {
    const userId = req.query.userId as string | undefined;

    let rows = await db
      .select({
        id: stories.id,
        text: stories.text,
        skillTag: stories.skillTag,
        mediaType: stories.mediaType,
        mediaUrl: stories.mediaUrl,
        status: stories.status,
        moderationReason: stories.moderationReason,
        userId: stories.userId,
        userName: users.name,
        userAvatar: users.avatar,
        expiresAt: stories.expiresAt,
        createdAt: stories.createdAt,
      })
      .from(stories)
      .leftJoin(users, eq(stories.userId, users.id))
      .orderBy(desc(stories.createdAt))
      .limit(100);

    if (userId) rows = rows.filter((s) => s.userId === userId);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to list stories' });
  }
});

router.get('/stories/:id', async (req, res) => {
  try {
    const id = String(req.params.id);
    const [row] = await db
      .select({
        id: stories.id,
        text: stories.text,
        skillTag: stories.skillTag,
        mediaType: stories.mediaType,
        mediaUrl: stories.mediaUrl,
        status: stories.status,
        moderationReason: stories.moderationReason,
        userId: stories.userId,
        userName: users.name,
        userAvatar: users.avatar,
        expiresAt: stories.expiresAt,
        createdAt: stories.createdAt,
      })
      .from(stories)
      .leftJoin(users, eq(stories.userId, users.id))
      .where(eq(stories.id, id));

    if (!row) {
      res.status(404).json({ error: 'Story not found' });
      return;
    }
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get story' });
  }
});

router.delete('/stories/:id', async (req, res) => {
  try {
    const id = String(req.params.id);
    await db.delete(stories).where(eq(stories.id, id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete story' });
  }
});

router.get('/jobs', async (_req, res) => {
  try {
    const rows = await db
      .select({
        id: jobs.id,
        title: jobs.title,
        location: jobs.location,
        paymentAmount: jobs.paymentAmount,
        paymentCurrency: jobs.paymentCurrency,
        isUrgent: jobs.isUrgent,
        employerId: jobs.employerId,
        employerName: users.name,
        createdAt: jobs.createdAt,
      })
      .from(jobs)
      .leftJoin(users, eq(jobs.employerId, users.id))
      .orderBy(desc(jobs.createdAt))
      .limit(100);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to list jobs' });
  }
});

router.delete('/jobs/:id', async (req, res) => {
  try {
    await db.delete(jobs).where(eq(jobs.id, String(req.params.id)));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

router.get('/challenges', async (_req, res) => {
  try {
    const rows = await db
      .select()
      .from(challenges)
      .orderBy(desc(challenges.startsAt));
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to list challenges' });
  }
});

router.post('/challenges', async (req, res) => {
  try {
    const {
      name,
      hashtag,
      emoji = '🏆',
      description,
      category,
      prize,
      startsAt,
      endsAt,
      status = 'active',
      featured = false,
    } = req.body;

    if (!name || !hashtag || !category || !startsAt || !endsAt) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const [challenge] = await db
      .insert(challenges)
      .values({
        name,
        hashtag,
        emoji,
        description,
        category,
        prize,
        startsAt: new Date(startsAt),
        endsAt: new Date(endsAt),
        status,
        featured,
      })
      .returning();

    res.status(201).json(challenge);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create challenge' });
  }
});

router.patch('/challenges/:id', async (req, res) => {
  try {
    const updates: Partial<typeof challenges.$inferInsert> = {};
    const fields = [
      'name',
      'hashtag',
      'emoji',
      'description',
      'category',
      'prize',
      'status',
      'featured',
    ] as const;

    for (const field of fields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }
    if (req.body.startsAt) updates.startsAt = new Date(req.body.startsAt);
    if (req.body.endsAt) updates.endsAt = new Date(req.body.endsAt);

    const [challenge] = await db
      .update(challenges)
      .set(updates)
      .where(eq(challenges.id, String(req.params.id)))
      .returning();

    if (!challenge) {
      res.status(404).json({ error: 'Challenge not found' });
      return;
    }
    res.json(challenge);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update challenge' });
  }
});

router.delete('/challenges/:id', async (req, res) => {
  try {
    await db.delete(challenges).where(eq(challenges.id, String(req.params.id)));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete challenge' });
  }
});

router.get('/programs', async (req, res) => {
  try {
    const type = req.query.type as string | undefined;
    const rows = await db
      .select()
      .from(programs)
      .orderBy(desc(programs.createdAt));

    const filtered = type ? rows.filter((p) => p.type === type) : rows;
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: 'Failed to list programs' });
  }
});

router.post('/programs', async (req, res) => {
  try {
    const {
      slug,
      title,
      type,
      provider,
      description,
      location,
      duration,
      stipend,
      fundingAmount,
      nqf,
      closingDate,
      spots,
      status = 'active',
      featured = false,
    } = req.body;

    if (!slug || !title || !type) {
      res.status(400).json({ error: 'Slug, title, and type are required' });
      return;
    }

    const [program] = await db
      .insert(programs)
      .values({
        slug,
        title,
        type,
        provider,
        description,
        location,
        duration,
        stipend,
        fundingAmount,
        nqf,
        closingDate: closingDate ? new Date(closingDate) : null,
        spots,
        status,
        featured,
      })
      .returning();

    res.status(201).json(program);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create program' });
  }
});

router.patch('/programs/:id', async (req, res) => {
  try {
    const updates: Partial<typeof programs.$inferInsert> = {};
    const fields = [
      'slug',
      'title',
      'type',
      'provider',
      'description',
      'location',
      'duration',
      'stipend',
      'fundingAmount',
      'nqf',
      'spots',
      'status',
      'featured',
    ] as const;

    for (const field of fields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }
    if (req.body.closingDate !== undefined) {
      updates.closingDate = req.body.closingDate
        ? new Date(req.body.closingDate)
        : null;
    }

    const [program] = await db
      .update(programs)
      .set(updates)
      .where(eq(programs.id, String(req.params.id)))
      .returning();

    if (!program) {
      res.status(404).json({ error: 'Program not found' });
      return;
    }
    res.json(program);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update program' });
  }
});

router.delete('/programs/:id', async (req, res) => {
  try {
    await db.delete(programs).where(eq(programs.id, String(req.params.id)));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete program' });
  }
});

router.get('/transactions', async (_req, res) => {
  try {
    const rows = await db
      .select({
        id: transactions.id,
        type: transactions.type,
        amount: transactions.amount,
        description: transactions.description,
        status: transactions.status,
        reference: transactions.reference,
        createdAt: transactions.createdAt,
        userName: users.name,
      })
      .from(transactions)
      .leftJoin(wallets, eq(transactions.walletId, wallets.id))
      .leftJoin(users, eq(wallets.userId, users.id))
      .orderBy(desc(transactions.createdAt))
      .limit(100);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to list transactions' });
  }
});

export default router;
