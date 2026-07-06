import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema.js';
import { hashPassword } from '../utils/auth.js';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const SKILL_ICONS: Record<string, string> = {
  Electrician: '⚡',
  Mechanic: '🔧',
  Carpenter: '🪚',
  Farmer: '🌾',
  Chef: '👨‍🍳',
  Driver: '🚗',
  Hairdresser: '💇',
  Plumber: '🔨',
  Painter: '🎨',
  Tech: '📱',
  Tailor: '👔',
  Cleaner: '🧹',
};

async function seed() {
  console.log('Seeding database...');

  const passwordHash = await hashPassword('password123');

  const [employer1] = await db
    .insert(schema.users)
    .values({
      phone: '+2348012345678',
      passwordHash,
      name: 'TechHub Ltd',
      location: 'Lagos, Nigeria',
      avatar: 'https://i.pravatar.cc/150?u=techhub',
      trustScore: 98,
      completedJobs: 15,
      rating: 4.8,
      bio: 'Technology hub connecting skilled workers across West Africa.',
    })
    .returning();

  const [employer2] = await db
    .insert(schema.users)
    .values({
      phone: '+254712345678',
      passwordHash,
      name: 'David Omondi',
      location: 'Nairobi, Kenya',
      trustScore: 85,
      completedJobs: 8,
      rating: 4.5,
    })
    .returning();

  const [worker1] = await db
    .insert(schema.users)
    .values({
      phone: '+233201234567',
      passwordHash,
      name: 'Kwame Mensah',
      location: 'Accra, Ghana',
      avatar: 'https://i.pravatar.cc/150?u=kwame',
      trustScore: 92,
      completedJobs: 24,
      rating: 4.9,
      bio: 'Master electrician with 10+ years experience.',
    })
    .returning();

  const users = [employer1, employer2, worker1];

  for (const user of users) {
    await db.insert(schema.wallets).values({
      userId: user.id,
      balance: user.name === 'Kwame Mensah' ? 125000 : 50000,
      currency: 'NGN',
    });
  }

  await db.insert(schema.userSkills).values([
    { userId: worker1.id, name: 'Electrician', icon: '⚡', level: 'expert' },
    { userId: worker1.id, name: 'Plumber', icon: '🔨', level: 'intermediate' },
  ]);

  const [job1] = await db
    .insert(schema.jobs)
    .values({
      employerId: employer1.id,
      title: 'Need urgent plumbing repair for office building',
      description:
        'Water pipe burst in the main lobby. Need someone immediately to fix it and prevent further damage.',
      location: 'Victoria Island, Lagos',
      paymentAmount: 45000,
      paymentCurrency: 'NGN',
      paymentType: 'fixed',
      requiredSkills: ['Plumber', 'Pipe Fitting'],
      isUrgent: true,
    })
    .returning();

  await db.insert(schema.jobs).values([
    {
      employerId: employer2.id,
      title: 'Full house wiring for 3-bedroom apartment',
      description:
        'Complete electrical installation for a newly built apartment in Kilimani.',
      location: 'Kilimani, Nairobi',
      paymentAmount: 35000,
      paymentCurrency: 'KES',
      paymentType: 'fixed',
      requiredSkills: ['Electrician', 'Wiring'],
    },
    {
      employerId: employer1.id,
      title: 'Experienced mechanic for fleet maintenance',
      description:
        'Looking for a reliable mechanic to maintain our fleet of 5 delivery vans.',
      location: 'East Legon, Accra',
      paymentAmount: 800,
      paymentCurrency: 'GHS',
      paymentType: 'daily',
      requiredSkills: ['Mechanic', 'Diesel Engine'],
    },
  ]);

  await db.insert(schema.videos).values([
    {
      userId: worker1.id,
      title: 'How I wired a 3-bedroom house in 2 days',
      skillCategory: 'Electrician',
      description: 'Step-by-step electrical installation walkthrough.',
      thumbnail: 'https://picsum.photos/seed/skill1/400/700',
      likes: 1240,
      comments: 89,
      shares: 45,
      duration: '2:34',
    },
    {
      userId: worker1.id,
      title: 'Emergency pipe repair tips',
      skillCategory: 'Plumber',
      description: 'Quick fixes for burst pipes before the pro arrives.',
      thumbnail: 'https://picsum.photos/seed/skill2/400/700',
      likes: 890,
      comments: 56,
      shares: 23,
      duration: '1:45',
    },
  ]);

  await db.insert(schema.notifications).values([
    {
      userId: worker1.id,
      type: 'job',
      title: 'New Job Match',
      description: 'A plumbing job in Lagos matches your skills',
      metadata: { jobId: job1.id },
    },
    {
      userId: worker1.id,
      type: 'message',
      title: 'New Message',
      description: 'TechHub Ltd sent you a message',
    },
  ]);

  const [chat] = await db.insert(schema.chats).values({}).returning();
  await db.insert(schema.chatParticipants).values([
    { chatId: chat.id, userId: worker1.id },
    { chatId: chat.id, userId: employer1.id },
  ]);

  await db.insert(schema.messages).values([
    {
      chatId: chat.id,
      senderId: employer1.id,
      text: 'Hi Kwame, are you available for the plumbing job tomorrow?',
    },
    {
      chatId: chat.id,
      senderId: worker1.id,
      text: 'Yes, I can be there by 9 AM. Should I bring my own tools?',
    },
    {
      chatId: chat.id,
      senderId: employer1.id,
      text: 'Perfect! Yes, bring standard plumbing tools. Parts are on us.',
    },
  ]);

  console.log('Seed complete!');
  console.log('');
  console.log('Demo accounts (password: password123):');
  console.log('  Worker:   +233201234567 (Kwame Mensah)');
  console.log('  Employer: +2348012345678 (TechHub Ltd)');
  console.log('  Employer: +254712345678 (David Omondi)');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
