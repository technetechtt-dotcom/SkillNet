import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { moderationLogs, users } from '../db/schema.js';

export async function isUserBlocked(userId: string): Promise<{
  blocked: boolean;
  reason?: string | null;
  blockedUntil?: Date | null;
}> {
  const [user] = await db
    .select({
      role: users.role,
      accountStatus: users.accountStatus,
      blockedUntil: users.blockedUntil,
      blockReason: users.blockReason,
    })
    .from(users)
    .where(eq(users.id, userId));

  if (!user || user.role === 'admin') {
    return { blocked: false };
  }

  if (user.accountStatus !== 'blocked') {
    return { blocked: false };
  }

  if (user.blockedUntil && user.blockedUntil < new Date()) {
    await db
      .update(users)
      .set({
        accountStatus: 'active',
        blockedUntil: null,
        blockReason: null,
        blockedAt: null,
      })
      .where(eq(users.id, userId));
    return { blocked: false };
  }

  return {
    blocked: true,
    reason: user.blockReason,
    blockedUntil: user.blockedUntil,
  };
}

export async function logModerationAction(data: {
  adminId: string;
  targetType: string;
  targetId: string;
  action: string;
  reason?: string;
  metadata?: Record<string, string>;
}) {
  await db.insert(moderationLogs).values({
    adminId: data.adminId,
    targetType: data.targetType,
    targetId: data.targetId,
    action: data.action,
    reason: data.reason || null,
    metadata: data.metadata || null,
  });
}
