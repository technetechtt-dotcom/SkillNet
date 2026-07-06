import { Router } from 'express';
import { desc, eq, ilike, or, sql } from 'drizzle-orm';
import { db } from '../db/index.js';
import { challengeParticipants, challenges, users, videos } from '../db/schema.js';
import { AuthRequest, requireAuth } from '../middleware/auth.js';
import { serializeUser } from '../utils/serialize.js';

const router = Router();

const CATEGORIES = [
  { name: 'Electrician', icon: '⚡' },
  { name: 'Mechanic', icon: '🔧' },
  { name: 'Carpenter', icon: '🪚' },
  { name: 'Plumber', icon: '🔨' },
  { name: 'Chef', icon: '👨‍🍳' },
  { name: 'Farmer', icon: '🌾' },
];

function formatViews(likes: number) {
  if (likes >= 1000) return `${(likes / 1000).toFixed(1)}K`;
  return String(likes);
}

router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const category = (req.query.category as string) || '';
    const q = (req.query.q as string) || '';

    let workerQuery = db.select().from(users).orderBy(desc(users.rating)).limit(20);

    if (q) {
      workerQuery = db
        .select()
        .from(users)
        .where(or(ilike(users.name, `%${q}%`), ilike(users.location, `%${q}%`)))
        .orderBy(desc(users.rating))
        .limit(20) as typeof workerQuery;
    }

    const allUsers = await workerQuery;
    const featuredWorkers = await Promise.all(
      allUsers.slice(0, 6).map(async (u) => {
        const full = await serializeUser(u.id);
        const primarySkill =
          full?.skills.find((s) =>
            category ? s.name.toLowerCase() === category.toLowerCase() : true
          ) || full?.skills[0];
        return {
          id: u.id,
          name: u.name,
          skill: primarySkill?.name || 'Skilled Worker',
          rating: u.rating,
          avatar: u.avatar,
        };
      })
    );

    const filteredWorkers = category
      ? featuredWorkers.filter(
          (w) => w.skill.toLowerCase() === category.toLowerCase()
        )
      : featuredWorkers;

    let videoQuery = db.select().from(videos).orderBy(desc(videos.likes)).limit(8);
    if (category) {
      videoQuery = db
        .select()
        .from(videos)
        .where(ilike(videos.skillCategory, `%${category}%`))
        .orderBy(desc(videos.likes))
        .limit(8) as typeof videoQuery;
    }

    const trendingVideos = (await videoQuery).map((v) => ({
      id: v.id,
      title: v.title,
      views: formatViews(v.likes),
      image: v.thumbnail || 'https://picsum.photos/seed/video/400/300',
    }));

    const [featuredChallenge] = await db
      .select()
      .from(challenges)
      .where(eq(challenges.featured, true))
      .limit(1);

    let activeChallenge = null;
    if (featuredChallenge) {
      const [countRow] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(challengeParticipants)
        .where(eq(challengeParticipants.challengeId, featuredChallenge.id));
      activeChallenge = {
        hashtag: featuredChallenge.hashtag,
        name: featuredChallenge.name,
        participants: countRow?.count ?? 0,
        daysLeft: Math.max(
          0,
          Math.ceil(
            (featuredChallenge.endsAt.getTime() - Date.now()) / 86400000
          )
        ),
      };
    }

    res.json({
      categories: CATEGORIES,
      featuredWorkers: filteredWorkers,
      trendingVideos,
      activeChallenge,
    });
  } catch (err) {
    console.error('Explore error:', err);
    res.status(500).json({ error: 'Failed to fetch explore data' });
  }
});

export default router;
