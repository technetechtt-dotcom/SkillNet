import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth.js';
import { isUserBlocked } from '../utils/moderation.js';

export interface AuthRequest extends Request {
  userId?: string;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  try {
    const { userId } = verifyToken(header.slice(7));
    req.userId = userId;

    isUserBlocked(userId)
      .then((status) => {
        if (status.blocked) {
          res.status(403).json({
            error: 'Your account has been blocked',
            reason: status.reason,
            blockedUntil: status.blockedUntil?.toISOString() || null,
          });
          return;
        }
        next();
      })
      .catch(() => {
        res.status(500).json({ error: 'Account verification failed' });
      });
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
