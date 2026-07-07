import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { userSkills, users, wallets } from '../db/schema.js';
import { hashPassword, signToken, verifyPassword } from '../utils/auth.js';
import { isUserBlocked } from '../utils/moderation.js';
import { createPhoneOtp, verifyPhoneOtp } from '../utils/otp.js';
import { validatePassword } from '../utils/password.js';
import { serializeUser } from '../utils/serialize.js';

const router = Router();

async function issueSession(userId: string, res: import('express').Response) {
  const blockStatus = await isUserBlocked(userId);
  if (blockStatus.blocked) {
    res.status(403).json({
      error: 'Your account has been blocked',
      reason: blockStatus.reason,
      blockedUntil: blockStatus.blockedUntil?.toISOString() || null,
    });
    return null;
  }

  await db.update(users).set({ isOnline: true }).where(eq(users.id, userId));
  const token = signToken(userId);
  const userData = await serializeUser(userId);
  return { token, user: userData };
}

router.post('/register', async (req, res) => {
  try {
    const { phone, password, name, location, skills = [] } = req.body;

    if (!phone || !password || !name) {
      res.status(400).json({ error: 'Phone, password, and name are required' });
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      res.status(400).json({ error: passwordError });
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

    const session = await issueSession(user.id, res);
    if (!session) return;

    res.json(session);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/otp/send', async (req, res) => {
  try {
    const { phone, purpose = 'login' } = req.body;

    if (!phone) {
      res.status(400).json({ error: 'Phone is required' });
      return;
    }

    if (purpose !== 'login' && purpose !== 'register') {
      res.status(400).json({ error: 'Invalid OTP purpose' });
      return;
    }

    const [user] = await db.select().from(users).where(eq(users.phone, phone));

    if (purpose === 'login' && !user) {
      res.status(404).json({ error: 'No account found for this phone number' });
      return;
    }

    if (purpose === 'register' && user) {
      res.status(409).json({ error: 'Phone number already registered' });
      return;
    }

    const { expiresAt } = await createPhoneOtp(phone, purpose);

    res.json({
      success: true,
      message: 'Verification code sent',
      expiresAt: expiresAt.toISOString(),
    });
  } catch (err) {
    console.error('OTP send error:', err);
    res.status(500).json({ error: 'Failed to send verification code' });
  }
});

router.post('/otp/login', async (req, res) => {
  try {
    const { phone, code } = req.body;

    if (!phone || !code) {
      res.status(400).json({ error: 'Phone and code are required' });
      return;
    }

    const verification = await verifyPhoneOtp(phone, String(code), 'login');
    if (!verification.valid) {
      res.status(401).json({ error: verification.error || 'Invalid code' });
      return;
    }

    const [user] = await db.select().from(users).where(eq(users.phone, phone));
    if (!user) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    const session = await issueSession(user.id, res);
    if (!session) return;

    res.json(session);
  } catch (err) {
    console.error('OTP login error:', err);
    res.status(500).json({ error: 'OTP login failed' });
  }
});

router.post('/otp/register', async (req, res) => {
  try {
    const { phone, code, password, name, location, skills = [] } = req.body;

    if (!phone || !code || !password || !name) {
      res.status(400).json({
        error: 'Phone, code, password, and name are required',
      });
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      res.status(400).json({ error: passwordError });
      return;
    }

    const verification = await verifyPhoneOtp(phone, String(code), 'register');
    if (!verification.valid) {
      res.status(401).json({ error: verification.error || 'Invalid code' });
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
    console.error('OTP register error:', err);
    res.status(500).json({ error: 'OTP registration failed' });
  }
});

export default router;
