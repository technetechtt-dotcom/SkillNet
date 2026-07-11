import { Router } from 'express';
import { and, count, desc, eq, ne, sql } from 'drizzle-orm';
import { db } from '../db/index.js';
import {
  jobApplications,
  jobs,
  notifications,
  savedJobs,
  users,
} from '../db/schema.js';
import { AuthRequest, requireAuth } from '../middleware/auth.js';
import { formatPayment, timeAgo } from '../utils/format.js';
import { serializeUser } from '../utils/serialize.js';
import { param } from '../utils/params.js';

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
    status: job.status as 'open' | 'filled' | 'closed',
  };
}

async function serializeApplication(app: typeof jobApplications.$inferSelect) {
  const applicant = await serializeUser(app.applicantId);
  const [job] = await db.select().from(jobs).where(eq(jobs.id, app.jobId));
  return {
    id: app.id,
    jobId: app.jobId,
    jobTitle: job?.title || null,
    applicantId: app.applicantId,
    applicant,
    message: app.message,
    status: app.status as 'pending' | 'accepted' | 'rejected' | 'withdrawn',
    createdAt: app.createdAt.toISOString(),
    postedTime: timeAgo(app.createdAt),
  };
}

router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { search, location, skill } = req.query as Record<string, string>;
    const allJobs = await db.select().from(jobs).orderBy(desc(jobs.createdAt));

    let filtered = allJobs.filter((j) => j.status === 'open');
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

router.get('/mine', requireAuth, async (req: AuthRequest, res) => {
  try {
    const myJobs = await db
      .select()
      .from(jobs)
      .where(eq(jobs.employerId, req.userId!))
      .orderBy(desc(jobs.createdAt));

    const result = await Promise.all(
      myJobs.map(async (job) => {
        const [{ value }] = await db
          .select({ value: count() })
          .from(jobApplications)
          .where(eq(jobApplications.jobId, job.id));
        return serializeJob(job, value);
      })
    );

    res.json(result);
  } catch (err) {
    console.error('My jobs error:', err);
    res.status(500).json({ error: 'Failed to fetch your jobs' });
  }
});

router.get('/applications/mine', requireAuth, async (req: AuthRequest, res) => {
  try {
    const apps = await db
      .select()
      .from(jobApplications)
      .where(eq(jobApplications.applicantId, req.userId!))
      .orderBy(desc(jobApplications.createdAt));

    res.json(await Promise.all(apps.map(serializeApplication)));
  } catch (err) {
    console.error('My applications error:', err);
    res.status(500).json({ error: 'Failed to fetch applications' });
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

router.get('/:id/applications', requireAuth, async (req: AuthRequest, res) => {
  try {
    const jobId = param(req, 'id');
    const [job] = await db.select().from(jobs).where(eq(jobs.id, jobId));
    if (!job) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }
    if (job.employerId !== req.userId) {
      res.status(403).json({ error: 'Only the employer can view applications' });
      return;
    }

    const apps = await db
      .select()
      .from(jobApplications)
      .where(eq(jobApplications.jobId, jobId))
      .orderBy(desc(jobApplications.createdAt));

    res.json(await Promise.all(apps.map(serializeApplication)));
  } catch (err) {
    console.error('List applications error:', err);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

router.patch('/applications/:applicationId', requireAuth, async (req: AuthRequest, res) => {
  try {
    const applicationId = param(req, 'applicationId');
    const { status } = req.body as { status?: string };

    if (!status || !['accepted', 'rejected'].includes(status)) {
      res.status(400).json({ error: 'Status must be accepted or rejected' });
      return;
    }

    const [application] = await db
      .select()
      .from(jobApplications)
      .where(eq(jobApplications.id, applicationId));

    if (!application) {
      res.status(404).json({ error: 'Application not found' });
      return;
    }

    const [job] = await db.select().from(jobs).where(eq(jobs.id, application.jobId));
    if (!job || job.employerId !== req.userId) {
      res.status(403).json({ error: 'Only the employer can update this application' });
      return;
    }

    if (application.status !== 'pending') {
      res.status(400).json({ error: `Application is already ${application.status}` });
      return;
    }

    const [updated] = await db
      .update(jobApplications)
      .set({ status })
      .where(eq(jobApplications.id, applicationId))
      .returning();

    if (status === 'accepted') {
      await db.update(jobs).set({ status: 'filled' }).where(eq(jobs.id, job.id));

      await db
        .update(jobApplications)
        .set({ status: 'rejected' })
        .where(
          and(
            eq(jobApplications.jobId, job.id),
            ne(jobApplications.id, applicationId),
            eq(jobApplications.status, 'pending')
          )
        );

      await db
        .update(users)
        .set({ completedJobs: sql`${users.completedJobs} + 1` })
        .where(eq(users.id, application.applicantId));
    }

    await db.insert(notifications).values({
      userId: application.applicantId,
      type: 'application',
      title: status === 'accepted' ? 'Application accepted' : 'Application declined',
      description:
        status === 'accepted'
          ? `You were accepted for "${job.title}"`
          : `Your application for "${job.title}" was declined`,
      metadata: { jobId: job.id, applicationId, status },
    });

    res.json(await serializeApplication(updated));
  } catch (err) {
    console.error('Update application error:', err);
    res.status(500).json({ error: 'Failed to update application' });
  }
});

router.patch('/:id/status', requireAuth, async (req: AuthRequest, res) => {
  try {
    const jobId = param(req, 'id');
    const { status } = req.body as { status?: string };

    if (!status || !['open', 'filled', 'closed'].includes(status)) {
      res.status(400).json({ error: 'Status must be open, filled, or closed' });
      return;
    }

    const [job] = await db.select().from(jobs).where(eq(jobs.id, jobId));
    if (!job) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }
    if (job.employerId !== req.userId) {
      res.status(403).json({ error: 'Only the employer can update this job' });
      return;
    }

    const [updated] = await db
      .update(jobs)
      .set({ status })
      .where(eq(jobs.id, jobId))
      .returning();

    res.json(await serializeJob(updated));
  } catch (err) {
    console.error('Update job status error:', err);
    res.status(500).json({ error: 'Failed to update job status' });
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, param(req, 'id')));
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
      paymentCurrency = 'ZAR',
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
        status: 'open',
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
    const jobId = param(req, 'id');

    const [job] = await db.select().from(jobs).where(eq(jobs.id, jobId));
    if (!job) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }

    if (job.status !== 'open') {
      res.status(400).json({ error: 'This job is no longer accepting applications' });
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

    const [application] = await db
      .insert(jobApplications)
      .values({
        jobId,
        applicantId: req.userId!,
        message: message || null,
      })
      .returning();

    const applicant = await serializeUser(req.userId!);
    await db.insert(notifications).values({
      userId: job.employerId,
      type: 'application',
      title: 'New Job Application',
      description: `${applicant?.name} applied for "${job.title}"`,
      metadata: { jobId, applicantId: req.userId!, applicationId: application.id },
    });

    res.status(201).json(await serializeApplication(application));
  } catch (err) {
    console.error('Apply job error:', err);
    res.status(500).json({ error: 'Failed to apply' });
  }
});

router.post('/:id/save', requireAuth, async (req: AuthRequest, res) => {
  try {
    await db
      .insert(savedJobs)
      .values({ userId: req.userId!, jobId: param(req, 'id') })
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
          eq(savedJobs.jobId, param(req, 'id'))
        )
      );

    res.json({ success: true });
  } catch (err) {
    console.error('Unsave job error:', err);
    res.status(500).json({ error: 'Failed to unsave job' });
  }
});

export default router;
