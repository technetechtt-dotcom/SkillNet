import { Router } from 'express';
import { and, avg, count, desc, eq, or } from 'drizzle-orm';
import { db } from '../db/index.js';
import { jobApplications, jobs, notifications, reviews, users } from '../db/schema.js';
import { AuthRequest, requireAuth } from '../middleware/auth.js';
import { param } from '../utils/params.js';
import { serializeUser } from '../utils/serialize.js';
import { timeAgo } from '../utils/format.js';

const router = Router();

async function recalculateUserRating(userId: string) {
  const [stats] = await db
    .select({
      average: avg(reviews.rating),
      total: count(),
    })
    .from(reviews)
    .where(eq(reviews.revieweeId, userId));

  const rating = stats?.average ? Math.round(Number(stats.average) * 10) / 10 : 0;
  await db.update(users).set({ rating }).where(eq(users.id, userId));
  return { rating, reviewCount: Number(stats?.total || 0) };
}

async function canReview(
  reviewerId: string,
  revieweeId: string,
  jobId?: string | null
): Promise<boolean> {
  if (!jobId) {
    // Allow general review if either party had an accepted application involving the other
    const related = await db
      .select({ id: jobApplications.id })
      .from(jobApplications)
      .innerJoin(jobs, eq(jobApplications.jobId, jobs.id))
      .where(
        and(
          eq(jobApplications.status, 'accepted'),
          or(
            and(
              eq(jobs.employerId, reviewerId),
              eq(jobApplications.applicantId, revieweeId)
            ),
            and(
              eq(jobs.employerId, revieweeId),
              eq(jobApplications.applicantId, reviewerId)
            )
          )
        )
      )
      .limit(1);
    return related.length > 0;
  }

  const [job] = await db.select().from(jobs).where(eq(jobs.id, jobId));
  if (!job) return false;

  const [accepted] = await db
    .select()
    .from(jobApplications)
    .where(
      and(
        eq(jobApplications.jobId, jobId),
        eq(jobApplications.status, 'accepted')
      )
    )
    .limit(1);

  if (!accepted) return false;

  const employerReviewsWorker =
    job.employerId === reviewerId && accepted.applicantId === revieweeId;
  const workerReviewsEmployer =
    accepted.applicantId === reviewerId && job.employerId === revieweeId;

  return employerReviewsWorker || workerReviewsEmployer;
}

router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { revieweeId, jobId, rating, comment } = req.body;

    if (!revieweeId || !rating) {
      res.status(400).json({ error: 'revieweeId and rating are required' });
      return;
    }

    const numRating = Number(rating);
    if (!Number.isInteger(numRating) || numRating < 1 || numRating > 5) {
      res.status(400).json({ error: 'Rating must be an integer from 1 to 5' });
      return;
    }

    if (revieweeId === req.userId) {
      res.status(400).json({ error: 'Cannot review yourself' });
      return;
    }

    const [reviewee] = await db.select().from(users).where(eq(users.id, revieweeId));
    if (!reviewee) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const allowed = await canReview(req.userId!, revieweeId, jobId || null);
    if (!allowed) {
      res.status(403).json({
        error: 'You can only review after an accepted job relationship',
      });
      return;
    }

    const existing = await db
      .select()
      .from(reviews)
      .where(
        and(
          eq(reviews.reviewerId, req.userId!),
          eq(reviews.revieweeId, revieweeId)
        )
      );

    const alreadyReviewed = jobId
      ? existing.some((r) => r.jobId === jobId)
      : existing.some((r) => !r.jobId);

    if (alreadyReviewed) {
      res.status(409).json({ error: 'You already reviewed this user for this context' });
      return;
    }

    const [review] = await db
      .insert(reviews)
      .values({
        reviewerId: req.userId!,
        revieweeId,
        jobId: jobId || null,
        rating: numRating,
        comment: comment?.trim() || null,
      })
      .returning();

    const ratingStats = await recalculateUserRating(revieweeId);
    const reviewer = await serializeUser(req.userId!);

    await db.insert(notifications).values({
      userId: revieweeId,
      type: 'review',
      title: 'New review',
      description: `${reviewer?.name || 'Someone'} rated you ${numRating}/5`,
      metadata: { reviewId: review.id, rating: String(numRating) },
    });

    res.status(201).json({
      id: review.id,
      reviewerId: review.reviewerId,
      revieweeId: review.revieweeId,
      jobId: review.jobId,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt.toISOString(),
      revieweeRating: ratingStats.rating,
      reviewCount: ratingStats.reviewCount,
    });
  } catch (err) {
    console.error('Create review error:', err);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

router.get('/user/:userId', requireAuth, async (req, res) => {
  try {
    const userId = param(req, 'userId');
    const rows = await db
      .select()
      .from(reviews)
      .where(eq(reviews.revieweeId, userId))
      .orderBy(desc(reviews.createdAt))
      .limit(50);

    const result = await Promise.all(
      rows.map(async (r) => {
        const reviewer = await serializeUser(r.reviewerId);
        return {
          id: r.id,
          rating: r.rating,
          comment: r.comment,
          jobId: r.jobId,
          reviewer,
          createdAt: r.createdAt.toISOString(),
          time: timeAgo(r.createdAt),
        };
      })
    );

    const [stats] = await db
      .select({ average: avg(reviews.rating), total: count() })
      .from(reviews)
      .where(eq(reviews.revieweeId, userId));

    res.json({
      average: stats?.average ? Math.round(Number(stats.average) * 10) / 10 : 0,
      count: Number(stats?.total || 0),
      reviews: result,
    });
  } catch (err) {
    console.error('List reviews error:', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

export default router;
