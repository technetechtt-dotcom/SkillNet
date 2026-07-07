import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import * as schema from './schema.js';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seedEngagement() {
  const allVideos = await db.select().from(schema.videos).limit(5);
  if (allVideos.length === 0) {
    console.log('No videos found — skip engagement seed');
    return;
  }

  const allUsers = await db.select().from(schema.users).limit(10);
  const video = allVideos[0];

  const existingLikes = await db
    .select()
    .from(schema.videoLikes)
    .where(eq(schema.videoLikes.videoId, video.id));

  if (existingLikes.length > 0) {
    console.log('Engagement data already exists');
    return;
  }

  const likers = allUsers.filter((u) => u.id !== video.userId).slice(0, 4);

  for (const user of likers) {
    await db.insert(schema.videoLikes).values({
      videoId: video.id,
      userId: user.id,
      reaction: user.name.includes('Build') ? 'love' : 'like',
    });
  }

  await db.insert(schema.videoComments).values([
    {
      videoId: video.id,
      userId: likers[0]?.id || allUsers[0].id,
      text: 'Great work! Very helpful tutorial.',
    },
    {
      videoId: video.id,
      userId: likers[1]?.id || allUsers[1].id,
      text: 'Can you do one on industrial wiring next?',
    },
  ]);

  if (likers[2]) {
    await db.insert(schema.videoShares).values({
      videoId: video.id,
      userId: likers[2].id,
    });
  }

  console.log(`Seeded engagement for video "${video.title}"`);
  console.log(`  ${likers.length} likes, 2 comments, 1 share`);
}

seedEngagement().catch((err) => {
  console.error(err);
  process.exit(1);
});
