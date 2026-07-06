import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth.js';

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
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
