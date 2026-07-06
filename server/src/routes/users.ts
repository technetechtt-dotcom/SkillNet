import { Router } from 'express';
import { eq, ne } from 'drizzle-orm';
import { db } from '../db/index.js';
import { userSkills, users } from '../db/schema.js';
import { AuthRequest, requireAuth } from '../middleware/auth.js';
import { serializeUser } from '../utils/serialize.js';

const router = Router();

router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  const user = await serializeUser(req.userId!);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json(user);
});

router.get('/search', requireAuth, async (req: AuthRequest, res) => {
  try {
    const q = (req.query.q as string) || '';
    const allUsers = await db
      .select()
      .from(users)
      .where(ne(users.id, req.userId!))
      .limit(50);

    const filtered = q
      ? allUsers.filter(
          (u) =>
            u.name.toLowerCase().includes(q.toLowerCase()) ||
            (u.location?.toLowerCase().includes(q.toLowerCase()) ?? false)
        )
      : allUsers;

    const result = await Promise.all(
      filtered.slice(0, 20).map((u) => serializeUser(u.id))
    );
    res.json(result.filter(Boolean));
  } catch (err) {
    console.error('User search error:', err);
    res.status(500).json({ error: 'Failed to search users' });
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  const user = await serializeUser(req.params.id);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json(user);
});

router.patch('/me', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { name, location, bio, avatar } = req.body;
    const updates: Partial<typeof users.$inferInsert> = {};

    if (name !== undefined) updates.name = name;
    if (location !== undefined) updates.location = location;
    if (bio !== undefined) updates.bio = bio;
    if (avatar !== undefined) updates.avatar = avatar;

    if (Object.keys(updates).length > 0) {
      await db.update(users).set(updates).where(eq(users.id, req.userId!));
    }

    const user = await serializeUser(req.userId!);
    res.json(user);
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

router.put('/me/skills', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { skills } = req.body as {
      skills: { name: string; icon?: string; level?: string }[];
    };

    await db.delete(userSkills).where(eq(userSkills.userId, req.userId!));

    if (skills?.length) {
      await db.insert(userSkills).values(
        skills.map((s) => ({
          userId: req.userId!,
          name: s.name,
          icon: s.icon || '🔧',
          level: s.level || 'beginner',
        }))
      );
    }

    const user = await serializeUser(req.userId!);
    res.json(user);
  } catch (err) {
    console.error('Update skills error:', err);
    res.status(500).json({ error: 'Failed to update skills' });
  }
});

export default router;
