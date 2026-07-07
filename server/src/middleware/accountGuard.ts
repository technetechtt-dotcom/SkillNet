import { Response, NextFunction } from 'express';
import { AuthRequest, requireAuth } from './auth.js';
import { isUserBlocked } from '../utils/moderation.js';

export async function requireActiveAccount(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.userId) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  try {
    const status = await isUserBlocked(req.userId);
    if (status.blocked) {
      res.status(403).json({
        error: 'Your account has been blocked',
        reason: status.reason,
        blockedUntil: status.blockedUntil?.toISOString() || null,
      });
      return;
    }
    next();
  } catch (err) {
    console.error('Account guard error:', err);
    res.status(500).json({ error: 'Account verification failed' });
  }
}

export function requireAuthAndActive(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  requireAuth(req, res, () => {
    requireActiveAccount(req, res, next);
  });
}
