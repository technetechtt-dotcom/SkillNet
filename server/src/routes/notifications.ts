import { Router } from 'express';
import { desc, eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { notifications } from '../db/schema.js';
import { AuthRequest, requireAuth } from '../middleware/auth.js';
import { timeAgo } from '../utils/format.js';
import { param } from '../utils/params.js';

const router = Router();

router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const items = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, req.userId!))
      .orderBy(desc(notifications.createdAt))
      .limit(50);

    res.json(
      items.map((n) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        description: n.description,
        time: timeAgo(n.createdAt),
        isRead: n.isRead,
        metadata: n.metadata,
      }))
    );
  } catch (err) {
    console.error('Notifications error:', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

router.patch('/:id/read', requireAuth, async (req: AuthRequest, res) => {
  try {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, param(req, 'id')));

    res.json({ success: true });
  } catch (err) {
    console.error('Mark read error:', err);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

router.patch('/read-all', requireAuth, async (req: AuthRequest, res) => {
  try {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.userId, req.userId!));

    res.json({ success: true });
  } catch (err) {
    console.error('Mark all read error:', err);
    res.status(500).json({ error: 'Failed to update notifications' });
  }
});

export default router;
