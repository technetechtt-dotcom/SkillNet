import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  real,
  boolean,
  timestamp,
  jsonb,
  primaryKey,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  phone: varchar('phone', { length: 20 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  location: varchar('location', { length: 100 }),
  avatar: text('avatar'),
  bio: text('bio'),
  trustScore: integer('trust_score').default(0).notNull(),
  completedJobs: integer('completed_jobs').default(0).notNull(),
  rating: real('rating').default(0).notNull(),
  isOnline: boolean('is_online').default(false).notNull(),
  latitude: real('latitude'),
  longitude: real('longitude'),
  availabilityStatus: varchar('availability_status', { length: 20 }).default('available'),
  role: varchar('role', { length: 20 }).default('user').notNull(),
  accountStatus: varchar('account_status', { length: 20 }).default('active').notNull(),
  blockedUntil: timestamp('blocked_until'),
  blockReason: text('block_reason'),
  blockedAt: timestamp('blocked_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userSkills = pgTable('user_skills', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  name: varchar('name', { length: 50 }).notNull(),
  icon: varchar('icon', { length: 10 }).default('🔧').notNull(),
  level: varchar('level', { length: 20 }).default('beginner').notNull(),
});

export const userFollows = pgTable(
  'user_follows',
  {
    followerId: uuid('follower_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    followingId: uuid('following_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.followerId, table.followingId] })]
);

export const jobs = pgTable('jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  employerId: uuid('employer_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description').notNull(),
  location: varchar('location', { length: 100 }).notNull(),
  paymentAmount: integer('payment_amount').notNull(),
  paymentCurrency: varchar('payment_currency', { length: 10 }).default('ZAR').notNull(),
  paymentType: varchar('payment_type', { length: 20 }).notNull(),
  requiredSkills: jsonb('required_skills').$type<string[]>().default([]).notNull(),
  isUrgent: boolean('is_urgent').default(false).notNull(),
  status: varchar('status', { length: 20 }).default('open').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const jobApplications = pgTable('job_applications', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobId: uuid('job_id')
    .references(() => jobs.id, { onDelete: 'cascade' })
    .notNull(),
  applicantId: uuid('applicant_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  message: text('message'),
  status: varchar('status', { length: 20 }).default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const savedJobs = pgTable(
  'saved_jobs',
  {
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    jobId: uuid('job_id')
      .references(() => jobs.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.jobId] })]
);

export const videos = pgTable('videos', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  skillCategory: varchar('skill_category', { length: 50 }),
  description: text('description'),
  thumbnail: text('thumbnail'),
  videoUrl: text('video_url'),
  likes: integer('likes').default(0).notNull(),
  comments: integer('comments').default(0).notNull(),
  shares: integer('shares').default(0).notNull(),
  duration: varchar('duration', { length: 10 }),
  status: varchar('status', { length: 20 }).default('active').notNull(),
  moderationReason: text('moderation_reason'),
  moderatedAt: timestamp('moderated_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const wallets = pgTable('wallets', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  balance: integer('balance').default(0).notNull(),
  currency: varchar('currency', { length: 10 }).default('ZAR').notNull(),
});

export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  walletId: uuid('wallet_id')
    .references(() => wallets.id, { onDelete: 'cascade' })
    .notNull(),
  type: varchar('type', { length: 20 }).notNull(),
  amount: integer('amount').notNull(),
  description: text('description'),
  status: varchar('status', { length: 20 }).default('completed').notNull(),
  reference: varchar('reference', { length: 100 }),
  metadata: jsonb('metadata').$type<Record<string, string>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  type: varchar('type', { length: 20 }).notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  isRead: boolean('is_read').default(false).notNull(),
  metadata: jsonb('metadata').$type<Record<string, string>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const chats = pgTable('chats', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const chatParticipants = pgTable(
  'chat_participants',
  {
    chatId: uuid('chat_id')
      .references(() => chats.id, { onDelete: 'cascade' })
      .notNull(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.chatId, table.userId] })]
);

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  chatId: uuid('chat_id')
    .references(() => chats.id, { onDelete: 'cascade' })
    .notNull(),
  senderId: uuid('sender_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  text: text('text').notNull(),
  imageUrl: text('image_url'),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const invoices = pgTable('invoices', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  clientName: varchar('client_name', { length: 100 }).notNull(),
  type: varchar('type', { length: 20 }).notNull(),
  number: varchar('number', { length: 50 }).notNull(),
  amount: integer('amount').notNull(),
  currency: varchar('currency', { length: 10 }).default('ZAR').notNull(),
  status: varchar('status', { length: 20 }).default('draft').notNull(),
  dueDate: timestamp('due_date'),
  notes: text('notes'),
  lineItems: jsonb('line_items')
    .$type<{ description: string; quantity: number; rate: number }[]>()
    .default([])
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const stories = pgTable('stories', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  mediaUrl: text('media_url').notNull(),
  mediaType: varchar('media_type', { length: 20 }).default('image').notNull(),
  text: text('text'),
  skillTag: varchar('skill_tag', { length: 50 }),
  expiresAt: timestamp('expires_at').notNull(),
  status: varchar('status', { length: 20 }).default('active').notNull(),
  moderationReason: text('moderation_reason'),
  moderatedAt: timestamp('moderated_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const challenges = pgTable('challenges', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  hashtag: varchar('hashtag', { length: 100 }).notNull(),
  emoji: varchar('emoji', { length: 10 }).default('🏆').notNull(),
  description: text('description'),
  category: varchar('category', { length: 50 }).notNull(),
  prize: varchar('prize', { length: 100 }),
  startsAt: timestamp('starts_at').notNull(),
  endsAt: timestamp('ends_at').notNull(),
  status: varchar('status', { length: 20 }).default('active').notNull(),
  featured: boolean('featured').default(false).notNull(),
});

export const challengeParticipants = pgTable(
  'challenge_participants',
  {
    challengeId: uuid('challenge_id')
      .references(() => challenges.id, { onDelete: 'cascade' })
      .notNull(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    joinedAt: timestamp('joined_at').defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.challengeId, table.userId] })]
);

export const challengeWinners = pgTable('challenge_winners', {
  id: uuid('id').primaryKey().defaultRandom(),
  challengeId: uuid('challenge_id')
    .references(() => challenges.id, { onDelete: 'cascade' })
    .notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  displayName: varchar('display_name', { length: 100 }).notNull(),
  avatar: text('avatar'),
  rank: integer('rank').notNull(),
});

export const videoLikes = pgTable(
  'video_likes',
  {
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    videoId: uuid('video_id')
      .references(() => videos.id, { onDelete: 'cascade' })
      .notNull(),
    reaction: varchar('reaction', { length: 20 }).default('like').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.videoId] })]
);

export const videoComments = pgTable('video_comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  videoId: uuid('video_id')
    .references(() => videos.id, { onDelete: 'cascade' })
    .notNull(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  text: text('text').notNull(),
  status: varchar('status', { length: 20 }).default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const videoShares = pgTable('video_shares', {
  id: uuid('id').primaryKey().defaultRandom(),
  videoId: uuid('video_id')
    .references(() => videos.id, { onDelete: 'cascade' })
    .notNull(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const moderationLogs = pgTable('moderation_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  adminId: uuid('admin_id')
    .references(() => users.id, { onDelete: 'set null' }),
  targetType: varchar('target_type', { length: 30 }).notNull(),
  targetId: varchar('target_id', { length: 100 }).notNull(),
  action: varchar('action', { length: 30 }).notNull(),
  reason: text('reason'),
  metadata: jsonb('metadata').$type<Record<string, string>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const programs = pgTable('programs', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  title: varchar('title', { length: 200 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  provider: varchar('provider', { length: 100 }),
  description: text('description'),
  location: varchar('location', { length: 200 }),
  duration: varchar('duration', { length: 100 }),
  stipend: varchar('stipend', { length: 100 }),
  fundingAmount: varchar('funding_amount', { length: 100 }),
  nqf: varchar('nqf', { length: 50 }),
  closingDate: timestamp('closing_date'),
  spots: integer('spots'),
  status: varchar('status', { length: 20 }).default('active').notNull(),
  featured: boolean('featured').default(false).notNull(),
  metadata: jsonb('metadata').$type<Record<string, string>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const phoneOtps = pgTable('phone_otps', {
  id: uuid('id').primaryKey().defaultRandom(),
  phone: varchar('phone', { length: 20 }).notNull(),
  code: varchar('code', { length: 6 }).notNull(),
  purpose: varchar('purpose', { length: 20 }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  attempts: integer('attempts').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  reviewerId: uuid('reviewer_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  revieweeId: uuid('reviewee_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  jobId: uuid('job_id').references(() => jobs.id, { onDelete: 'set null' }),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type Job = typeof jobs.$inferSelect;
export type Program = typeof programs.$inferSelect;
export type Review = typeof reviews.$inferSelect;
