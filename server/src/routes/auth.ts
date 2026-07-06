import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { userSkills, users, wallets } from '../db/schema.js';
import { hashPassword, signToken, verifyPassword } from '../utils/auth.js';
import { serializeUser } from '../utils/serialize.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { phone, password, name, location, skills = [] } = req.body;

    if (!phone || !password || !name) {
      res.status(400).json({ error: 'Phone, password, and name are required' });
      return;
    }

    if (password.length < 4) {
      res.status(400).json({ error: 'Password must be at least 4 characters' });
      return;
    }

    const [existing] = await db.select().from(users).where(eq(users.phone, phone));
    if (existing) {
      res.status(409).json({ error: 'Phone number already registered' });
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
        trustScore: 50,
        rating: 0,
      })
      .returning();

    if (skills.length > 0) {
      await db.insert(userSkills).values(
        skills.map((s: { name: string; icon?: string; level?: string }) => ({
          userId: user.id,
          name: s.name,
          icon: s.icon || '🔧',
          level: s.level || 'beginner',
        }))
      );
    }

    await db.insert(wallets).values({ userId: user.id, balance: 0, currency: 'ZAR' });

    const token = signToken(user.id);
    const userData = await serializeUser(user.id);

    res.status(201).json({ token, user: userData });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      res.status(400).json({ error: 'Phone and password are required' });
      return;
    }

    const [user] = await db.select().from(users).where(eq(users.phone, phone));
    if (!user) {
      res.status(401).json({ error: 'Invalid phone or password' });
      return;
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid phone or password' });
      return;
    }

    await db.update(users).set({ isOnline: true }).where(eq(users.id, user.id));

    const token = signToken(user.id);
    const userData = await serializeUser(user.id);

    res.json({ token, user: userData });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
