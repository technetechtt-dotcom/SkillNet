import { Router } from 'express';
import { and, eq, isNotNull, sql } from 'drizzle-orm';
import { db } from '../db/index.js';
import { userSkills, users } from '../db/schema.js';
import { AuthRequest, requireAuth } from '../middleware/auth.js';

const router = Router();

function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

router.get('/nearby', requireAuth, async (req: AuthRequest, res) => {
  try {
    const lat = Number(req.query.lat) || -26.2041;
    const lng = Number(req.query.lng) || 28.0473;
    const skill = (req.query.skill as string) || '';
    const radiusKm = Number(req.query.radius) || 10;

    const workers = await db
      .select()
      .from(users)
      .where(and(isNotNull(users.latitude), isNotNull(users.longitude)));

    const withDistance = workers
      .map((w) => ({
        ...w,
        distanceKm: haversineKm(lat, lng, w.latitude!, w.longitude!),
      }))
      .filter((w) => w.distanceKm <= radiusKm && w.id !== req.userId)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    const result = await Promise.all(
      withDistance.map(async (w) => {
        const skills = await db
          .select()
          .from(userSkills)
          .where(eq(userSkills.userId, w.id));
        const primarySkill = skills[0]?.name || 'Skilled Worker';

        if (
          skill &&
          skill !== 'All' &&
          !skills.some((s) => s.name.toLowerCase() === skill.toLowerCase())
        ) {
          return null;
        }

        return {
          id: w.id,
          name: w.name,
          skill: primarySkill,
          distance: `${w.distanceKm.toFixed(1)}km away`,
          distanceKm: w.distanceKm,
          rating: w.rating,
          status: w.availabilityStatus || 'available',
          avatar: w.avatar,
          latitude: w.latitude,
          longitude: w.longitude,
          phone: w.phone,
        };
      })
    );

    res.json(result.filter(Boolean));
  } catch (err) {
    console.error('Nearby workers error:', err);
    res.status(500).json({ error: 'Failed to fetch nearby workers' });
  }
});

export default router;
