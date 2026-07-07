import { Router } from 'express';
import { desc, eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { programs } from '../db/schema.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const type = req.query.type as string | undefined;
    const featured = req.query.featured === 'true';

    let rows = await db
      .select()
      .from(programs)
      .where(eq(programs.status, 'active'))
      .orderBy(desc(programs.createdAt));

    if (type) rows = rows.filter((p) => p.type === type);
    if (featured) rows = rows.filter((p) => p.featured);

    res.json(rows);
  } catch (err) {
    console.error('List programs error:', err);
    res.status(500).json({ error: 'Failed to list programs' });
  }
});

router.get('/:slug', requireAuth, async (req, res) => {
  try {
    const slug = String(req.params.slug);
    const [program] = await db
      .select()
      .from(programs)
      .where(eq(programs.slug, slug));

    if (!program) {
      res.status(404).json({ error: 'Program not found' });
      return;
    }
    res.json(program);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get program' });
  }
});

export default router;
