import { Router } from 'express';
import multer from 'multer';
import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from '../db/index.js';
import { videoComments, videoLikes, videoShares, videos } from '../db/schema.js';
import { AuthRequest, requireAuth } from '../middleware/auth.js';
import { serializeUser } from '../utils/serialize.js';
import {
  getUploadConfig,
  isCloudinaryConfigured,
  uploadBuffer,
} from '../utils/cloudinary.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 },
});

router.get('/upload-config', requireAuth, (_req, res) => {
  res.json(getUploadConfig());
});

router.post(
  '/upload',
  requireAuth,
  upload.single('file'),
  async (req: AuthRequest, res) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      const isVideo = req.file.mimetype.startsWith('video/');
      if (!isCloudinaryConfigured()) {
        res.status(503).json({
          error:
            'Cloudinary not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env',
        });
        return;
      }

      const result = await uploadBuffer(
        req.file.buffer,
        'videos',
        isVideo ? 'video' : 'image'
      );

      res.json({
        videoUrl: isVideo ? result.url : null,
        thumbnail: result.thumbnail || result.url,
        mediaType: isVideo ? 'video' : 'image',
      });
    } catch (err) {
      console.error('Video upload error:', err);
      res.status(500).json({ error: 'Failed to upload file' });
    }
  }
);

router.get('/', requireAuth, async (_req, res) => {
  try {
    const allVideos = await db
      .select()
      .from(videos)
      .where(eq(videos.status, 'active'))
      .orderBy(desc(videos.createdAt))
      .limit(50);

    const result = await Promise.all(
      allVideos.map(async (video) => {
        const user = await serializeUser(video.userId);
        return {
          id: video.id,
          userId: video.userId,
          user,
          title: video.title,
          skillCategory: video.skillCategory,
          description: video.description,
          thumbnail: video.thumbnail,
          videoUrl: video.videoUrl,
          likes: video.likes,
          comments: video.comments,
          shares: video.shares,
          duration: video.duration,
        };
      })
    );

    res.json(result);
  } catch (err) {
    console.error('List videos error:', err);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { title, skillCategory, description, thumbnail, videoUrl, duration } =
      req.body;

    if (!title) {
      res.status(400).json({ error: 'Title is required' });
      return;
    }

    const [video] = await db
      .insert(videos)
      .values({
        userId: req.userId!,
        title,
        skillCategory: skillCategory || null,
        description: description || null,
        thumbnail: thumbnail || null,
        videoUrl: videoUrl || null,
        duration: duration || null,
      })
      .returning();

    const user = await serializeUser(video.userId);
    res.status(201).json({
      id: video.id,
      userId: video.userId,
      user,
      title: video.title,
      skillCategory: video.skillCategory,
      description: video.description,
      thumbnail: video.thumbnail,
      videoUrl: video.videoUrl,
      likes: video.likes,
      comments: video.comments,
      shares: video.shares,
      duration: video.duration,
    });
  } catch (err) {
    console.error('Create video error:', err);
    res.status(500).json({ error: 'Failed to create video' });
  }
});

router.post('/:id/like', requireAuth, async (req: AuthRequest, res) => {
  try {
    const videoId = String(req.params.id);
    const { reaction = 'like' } = req.body;

    const [existing] = await db
      .select()
      .from(videoLikes)
      .where(
        and(
          eq(videoLikes.videoId, videoId),
          eq(videoLikes.userId, req.userId!)
        )
      );

    if (existing) {
      await db
        .update(videoLikes)
        .set({ reaction })
        .where(
          and(
            eq(videoLikes.videoId, videoId),
            eq(videoLikes.userId, req.userId!)
          )
        );
    } else {
      await db.insert(videoLikes).values({
        videoId,
        userId: req.userId!,
        reaction,
      });
      await db
        .update(videos)
        .set({ likes: sql`${videos.likes} + 1` })
        .where(eq(videos.id, videoId));
    }

    res.json({ success: true, reaction });
  } catch (err) {
    res.status(500).json({ error: 'Failed to like video' });
  }
});

router.post('/:id/comment', requireAuth, async (req: AuthRequest, res) => {
  try {
    const videoId = String(req.params.id);
    const { text } = req.body;
    if (!text?.trim()) {
      res.status(400).json({ error: 'Comment text is required' });
      return;
    }

    const [comment] = await db
      .insert(videoComments)
      .values({
        videoId,
        userId: req.userId!,
        text: text.trim(),
      })
      .returning();

    await db
      .update(videos)
      .set({ comments: sql`${videos.comments} + 1` })
      .where(eq(videos.id, videoId));

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to comment' });
  }
});

router.post('/:id/share', requireAuth, async (req: AuthRequest, res) => {
  try {
    const videoId = String(req.params.id);

    await db.insert(videoShares).values({
      videoId,
      userId: req.userId!,
    });

    await db
      .update(videos)
      .set({ shares: sql`${videos.shares} + 1` })
      .where(eq(videos.id, videoId));

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to share video' });
  }
});

export default router;
