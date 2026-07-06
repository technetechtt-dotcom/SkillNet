import { Router } from 'express';
import { and, count, desc, eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import {
  jobApplications,
  jobs,
  notifications,
  savedJobs,
} from '../db/schema.js';
import { AuthRequest, requireAuth } from '../middleware/auth.js';
import { formatPayment, timeAgo } from '../utils/format.js';
import { serializeUser } from '../utils/serialize.js';

const router = Router();

async function serializeJob(job: typeof jobs.$inferSelect, applicantCount?: number) {
  const employer = await serializeUser(job.employerId);
  return {
    id: job.id,
    title: job.title,
    description: job.description,
    location: job.location,
    payment: formatPayment(job.paymentAmount, job.paymentCurrency),
    paymentAmount: job.paymentAmount,
    paymentCurrency: job.paymentCurrency,
    paymentType: job.paymentType as 'fixed' | 'hourly' | 'daily',
    requiredSkills: job.requiredSkills,
    employer,
    postedTime: timeAgo(job.createdAt),
    applicants: applicantCount ?? 0,
    isUrgent: job.isUrgent,
  };
}

router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { search, location, skill } = req.query as Record<string, string>;
    let query = db.select().from(jobs).orderBy(desc(jobs.createdAt));

    const allJobs = await query;

    let filtered = allJobs;
    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(term) ||
          j.description.toLowerCase().includes(term)
      );
    }
    if (location) {
      filtered = filtered.filter((j) =>
        j.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    if (skill) {
      filtered = filtered.filter((j) =>
        j.requiredSkills.some((s) => s.toLowerCase().includes(skill.toLowerCase()))
      );
    }

    const result = await Promise.all(
      filtered.map(async (job) => {
        const [{ value }] = await db
          .select({ value: count() })
          .from(jobApplications)
          .where(eq(jobApplications.jobId, job.id));
        return serializeJob(job, value);
      })
    );

    res.json(result);
  } catch (err) {
    console.error('List jobs error:', err);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

router.get('/saved', requireAuth, async (req: AuthRequest, res) => {
  try {
    const saved = await db
      .select({ job: jobs })
      .from(savedJobs)
      .innerJoin(jobs, eq(savedJobs.jobId, jobs.id))
      .where(eq(savedJobs.userId, req.userId!))
      .orderBy(desc(savedJobs.createdAt));

    const result = await Promise.all(saved.map((s) => serializeJob(s.job)));
    res.json(result);
  } catch (err) {
    console.error('Saved jobs error:', err);
    res.status(500).json({ error: 'Failed to fetch saved jobs' });
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, req.params.id));
    if (!job) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }

    const [{ value }] = await db
      .select({ value: count() })
      .from(jobApplications)
      .where(eq(jobApplications.jobId, job.id));

    res.json(await serializeJob(job, value));
  } catch (err) {
    console.error('Get job error:', err);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const {
      title,
      description,
      location,
      paymentAmount,
      paymentCurrency = 'NGN',
      paymentType,
      requiredSkills = [],
      isUrgent = false,
    } = req.body;

    if (!title || !description || !location || !paymentAmount || !paymentType) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const [job] = await db
      .insert(jobs)
      .values({
        employerId: req.userId!,
        title,
        description,
        location,
        paymentAmount: Number(paymentAmount),
        paymentCurrency,
        paymentType,
        requiredSkills,
        isUrgent,
      })
      .returning();

    res.status(201).json(await serializeJob(job, 0));
  } catch (err) {
    console.error('Create job error:', err);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

router.post('/:id/apply', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { message } = req.body;
    const jobId = req.params.id;

    const [job] = await db.select().from(jobs).where(eq(jobs.id, jobId));
    if (!job) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }

    if (job.employerId === req.userId) {
      res.status(400).json({ error: 'Cannot apply to your own job' });
      return;
    }

    const [existing] = await db
      .select()
      .from(jobApplications)
      .where(
        and(
          eq(jobApplications.jobId, jobId),
          eq(jobApplications.applicantId, req.userId!)
        )
      );

    if (existing) {
      res.status(409).json({ error: 'Already applied to this job' });
      return;
    }

    await db.insert(jobApplications).values({
      jobId,
      applicantId: req.userId!,
      message: message || null,
    });

    const applicant = await serializeUser(req.userId!);
    await db.insert(notifications).values({
      userId: job.employerId,
      type: 'application',
      title: 'New Job Application',
      description: `${applicant?.name} applied for "${job.title}"`,
      metadata: { jobId, applicantId: req.userId! },
    });

    res.status(201).json({ success: true });
  } catch (err) {
    console.error('Apply job error:', err);
    res.status(500).json({ error: 'Failed to apply' });
  }
});

router.post('/:id/save', requireAuth, async (req: AuthRequest, res) => {
  try {
    await db
      .insert(savedJobs)
      .values({ userId: req.userId!, jobId: req.params.id })
      .onConflictDoNothing();

    res.json({ success: true });
  } catch (err) {
    console.error('Save job error:', err);
    res.status(500).json({ error: 'Failed to save job' });
  }
});

router.delete('/:id/save', requireAuth, async (req: AuthRequest, res) => {
  try {
    await db
      .delete(savedJobs)
      .where(
        and(
          eq(savedJobs.userId, req.userId!),
          eq(savedJobs.jobId, req.params.id)
        )
      );

    res.json({ success: true });
  } catch (err) {
    console.error('Unsave job error:', err);
    res.status(500).json({ error: 'Failed to unsave job' });
  }
});

export default router;
