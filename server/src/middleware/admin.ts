import { Response, NextFunction } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { AuthRequest, requireAuth } from './auth.js';

export interface AdminRequest extends AuthRequest {
  adminRole?: string;
}

export async function requireAdmin(
  req: AdminRequest,
  res: Response,
  next: NextFunction
) {
  requireAuth(req, res, async () => {
    try {
      const [user] = await db
        .select({ role: users.role })
        .from(users)
        .where(eq(users.id, req.userId!));

      if (!user || user.role !== 'admin') {
        res.status(403).json({ error: 'Admin access required' });
        return;
      }

      req.adminRole = user.role;
      next();
    } catch (err) {
      console.error('Admin auth error:', err);
      res.status(500).json({ error: 'Authorization failed' });
    }
  });
}
