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

export const jobs = pgTable('jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  employerId: uuid('employer_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description').notNull(),
  location: varchar('location', { length: 100 }).notNull(),
  paymentAmount: integer('payment_amount').notNull(),
  paymentCurrency: varchar('payment_currency', { length: 10 }).default('NGN').notNull(),
  paymentType: varchar('payment_type', { length: 20 }).notNull(),
  requiredSkills: jsonb('required_skills').$type<string[]>().default([]).notNull(),
  isUrgent: boolean('is_urgent').default(false).notNull(),
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
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const wallets = pgTable('wallets', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  balance: integer('balance').default(0).notNull(),
  currency: varchar('currency', { length: 10 }).default('NGN').notNull(),
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

export type User = typeof users.$inferSelect;
export type Job = typeof jobs.$inferSelect;
