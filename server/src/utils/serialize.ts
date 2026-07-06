import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { userSkills, users } from '../db/schema.js';

export async function getUserSkills(userId: string) {
  return db.select().from(userSkills).where(eq(userSkills.userId, userId));
}

export async function serializeUser(userId: string) {
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user) return null;

  const skills = await getUserSkills(userId);
  const { passwordHash: _, ...safeUser } = user;

  return {
    ...safeUser,
    skills: skills.map((s) => ({
      id: s.id,
      name: s.name,
      icon: s.icon,
      level: s.level as 'beginner' | 'intermediate' | 'expert',
    })),
  };
}
