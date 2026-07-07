import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import * as schema from './schema.js';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seedFollows() {
  const allUsers = await db.select().from(schema.users);
  const worker = allUsers.find((u) => u.phone === '+27821234567');
  const employer1 = allUsers.find((u) => u.phone === '+27831112233');
  const employer2 = allUsers.find((u) => u.phone === '+27721234567');
  const admin = allUsers.find((u) => u.role === 'admin');

  if (!worker || !employer1) {
    console.log('Demo users not found — run db:seed first');
    return;
  }

  const existing = await db.select().from(schema.userFollows).limit(1);
  if (existing.length > 0) {
    console.log('Follow data already exists');
    return;
  }

  const pairKeys = new Set<string>();
  const pairs: { followerId: string; followingId: string }[] = [];

  function add(followerId: string, followingId: string) {
    if (followerId === followingId) return;
    const key = `${followerId}:${followingId}`;
    if (pairKeys.has(key)) return;
    pairKeys.add(key);
    pairs.push({ followerId, followingId });
  }

  add(employer1.id, worker.id);
  if (employer2) add(employer2.id, worker.id);
  if (employer2) add(worker.id, employer2.id);
  if (admin) add(admin.id, worker.id);

  const extraWorkers = allUsers.filter(
    (u) => u.id !== worker.id && u.role === 'user' && u.phone.startsWith('+278')
  );
  for (const w of extraWorkers.slice(0, 3)) {
    add(w.id, worker.id);
  }

  if (pairs.length === 0) return;

  await db.insert(schema.userFollows).values(pairs);

  console.log(`Seeded ${pairs.length} follow relationships`);
  console.log(`  ${worker.name} now has ${pairs.filter((p) => p.followingId === worker.id).length} followers`);
}

seedFollows().catch((err) => {
  console.error(err);
  process.exit(1);
});
