import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema.js';
import { hashPassword } from '../utils/auth.js';
import { eq } from 'drizzle-orm';

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
      phone: '+27831112233',
      passwordHash,
      name: 'BuildRight SA',
      location: 'Cape Town, South Africa',
      avatar: 'https://i.pravatar.cc/150?u=buildright',
      trustScore: 98,
      completedJobs: 15,
      rating: 4.8,
      bio: 'Construction and facilities company connecting skilled trades across South Africa.',
    })
    .returning();

  const [employer2] = await db
    .insert(schema.users)
    .values({
      phone: '+27721234567',
      passwordHash,
      name: 'Lerato Mokoena',
      location: 'Durban, South Africa',
      trustScore: 85,
      completedJobs: 8,
      rating: 4.5,
    })
    .returning();

  const [worker1] = await db
    .insert(schema.users)
    .values({
      phone: '+27821234567',
      passwordHash,
      name: 'Sipho Ndlovu',
      location: 'Johannesburg, South Africa',
      avatar: 'https://i.pravatar.cc/150?u=sipho',
      trustScore: 92,
      completedJobs: 24,
      rating: 4.9,
      bio: 'Master electrician with 10+ years experience across Gauteng.',
      latitude: -26.2041,
      longitude: 28.0473,
      availabilityStatus: 'available',
      isOnline: true,
    })
    .returning();

  const extraWorkers = await db
    .insert(schema.users)
    .values([
      {
        phone: '+27829876543',
        passwordHash,
        name: 'Nomsa Dlamini',
        location: 'Johannesburg, South Africa',
        avatar: 'https://i.pravatar.cc/150?u=nomsa',
        trustScore: 88,
        completedJobs: 18,
        rating: 4.9,
        latitude: -26.19,
        longitude: 28.055,
        availabilityStatus: 'busy',
      },
      {
        phone: '+27827654321',
        passwordHash,
        name: 'Thabo Molefe',
        location: 'Soweto, South Africa',
        avatar: 'https://i.pravatar.cc/150?u=thabo',
        trustScore: 85,
        completedJobs: 15,
        rating: 4.7,
        latitude: -26.248,
        longitude: 27.854,
        availabilityStatus: 'available',
      },
      {
        phone: '+27825432109',
        passwordHash,
        name: 'Priya Pillay',
        location: 'Johannesburg, South Africa',
        avatar: 'https://i.pravatar.cc/150?u=priya',
        trustScore: 90,
        completedJobs: 20,
        rating: 4.8,
        latitude: -26.21,
        longitude: 28.03,
        availabilityStatus: 'available',
      },
      {
        phone: '+27823456789',
        passwordHash,
        name: 'Johan van Wyk',
        location: 'Pretoria, South Africa',
        avatar: 'https://i.pravatar.cc/150?u=johan',
        trustScore: 82,
        completedJobs: 12,
        rating: 4.6,
        latitude: -25.747,
        longitude: 28.229,
        availabilityStatus: 'busy',
      },
    ])
    .returning();

  const users = [employer1, employer2, worker1, ...extraWorkers];

  for (const user of users) {
    await db.insert(schema.wallets).values({
      userId: user.id,
      balance: user.name === 'Sipho Ndlovu' ? 125000 : 50000,
      currency: 'ZAR',
    });
  }

  const [kwameWallet] = await db
    .select()
    .from(schema.wallets)
    .where(eq(schema.wallets.userId, worker1.id));

  if (kwameWallet) {
    await db.insert(schema.transactions).values([
      {
        walletId: kwameWallet.id,
        type: 'credit',
        amount: 45000,
        description: 'Payment from BuildRight SA',
        status: 'completed',
        reference: 'PAY-4591-ABC',
        metadata: { jobRef: 'Plumbing Repair - Sandton' },
      },
      {
        walletId: kwameWallet.id,
        type: 'withdrawal',
        amount: 20000,
        description: 'Withdrawal to FNB ••••4589',
        status: 'completed',
        reference: 'WTH-9823-XYZ',
        metadata: { bankDetails: 'FNB **** 4589' },
      },
      {
        walletId: kwameWallet.id,
        type: 'debit',
        amount: 5000,
        description: 'Sent to Lerato Mokoena',
        status: 'completed',
        reference: 'TRF-1124-DEF',
        metadata: { note: 'For the materials' },
      },
    ]);
  }

  await db.insert(schema.userSkills).values([
    { userId: worker1.id, name: 'Electrician', icon: '⚡', level: 'expert' },
    { userId: worker1.id, name: 'Plumber', icon: '🔨', level: 'intermediate' },
    { userId: extraWorkers[0].id, name: 'Electrician', icon: '⚡', level: 'expert' },
    { userId: extraWorkers[1].id, name: 'Carpenter', icon: '🪚', level: 'expert' },
    { userId: extraWorkers[2].id, name: 'Plumber', icon: '🔨', level: 'intermediate' },
    { userId: extraWorkers[3].id, name: 'Driver', icon: '🚗', level: 'expert' },
  ]);

  const [job1] = await db
    .insert(schema.jobs)
    .values({
      employerId: employer1.id,
      title: 'Need urgent plumbing repair for office building',
      description:
        'Water pipe burst in the main lobby. Need someone immediately to fix it and prevent further damage.',
      location: 'Sandton, Johannesburg',
      paymentAmount: 4500,
      paymentCurrency: 'ZAR',
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
      location: 'Umhlanga, Durban',
      paymentAmount: 8500,
      paymentCurrency: 'ZAR',
      paymentType: 'fixed',
      requiredSkills: ['Electrician', 'Wiring'],
    },
    {
      employerId: employer1.id,
      title: 'Experienced mechanic for fleet maintenance',
      description:
        'Looking for a reliable mechanic to maintain our fleet of 5 delivery vans.',
      location: 'Midrand, Johannesburg',
      paymentAmount: 1200,
      paymentCurrency: 'ZAR',
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
      description: 'A plumbing job in Sandton matches your skills',
      metadata: { jobId: job1.id },
    },
    {
      userId: worker1.id,
      type: 'message',
      title: 'New Message',
      description: 'BuildRight SA sent you a message',
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
      text: 'Hi Sipho, are you available for the plumbing job tomorrow?',
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

  await db.insert(schema.invoices).values([
    {
      userId: worker1.id,
      clientName: 'BuildRight SA',
      type: 'invoice',
      number: 'INV-2026-001',
      amount: 45000,
      status: 'paid',
      dueDate: new Date('2026-03-15'),
      lineItems: [
        { description: 'Labor - Plumbing Repair', quantity: 1, rate: 27000 },
        { description: 'Materials & Parts', quantity: 1, rate: 18000 },
      ],
    },
    {
      userId: worker1.id,
      clientName: 'Nomsa Dlamini',
      type: 'invoice',
      number: 'INV-2026-002',
      amount: 15000,
      status: 'sent',
      dueDate: new Date('2026-03-19'),
      lineItems: [
        { description: 'Electrical inspection', quantity: 1, rate: 15000 },
      ],
    },
    {
      userId: worker1.id,
      clientName: 'Lerato Mokoena',
      type: 'quote',
      number: 'QUO-2026-001',
      amount: 120000,
      status: 'draft',
      dueDate: new Date('2026-03-22'),
      lineItems: [
        { description: 'Full house wiring', quantity: 1, rate: 120000 },
      ],
    },
  ]);

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await db.insert(schema.stories).values([
    {
      userId: worker1.id,
      mediaUrl:
        'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      text: 'Just finished a complex engine repair 🔧',
      skillTag: 'Mechanic',
      expiresAt,
    },
    {
      userId: extraWorkers[0].id,
      mediaUrl:
        'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      text: 'Installing solar panels today ☀️⚡',
      skillTag: 'Electrician',
      expiresAt,
    },
    {
      userId: extraWorkers[1].id,
      mediaUrl:
        'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      text: 'Custom dining table coming together 🪚',
      skillTag: 'Carpenter',
      expiresAt,
    },
    {
      userId: extraWorkers[2].id,
      mediaUrl:
        'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      text: 'Catering for 100 guests today! 👨‍🍳',
      skillTag: 'Chef',
      expiresAt,
    },
    {
      userId: extraWorkers[3].id,
      mediaUrl:
        'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      text: 'Fresh harvest from the organic farm 🌾',
      skillTag: 'Farmer',
      expiresAt,
    },
  ]);

  const now = new Date();
  const [ch1, ch2, ch3, ch4, ch5] = await db
    .insert(schema.challenges)
    .values([
      {
        name: 'Fastest Wire',
        hashtag: '#FastestWire',
        emoji: '⚡',
        description: 'Show your fastest wiring job! Top 3 win badges.',
        category: 'Electrician',
        prize: 'Verified Badge + R5,000',
        startsAt: new Date(now.getTime() - 4 * 86400000),
        endsAt: new Date(now.getTime() + 3 * 86400000),
        status: 'active',
        featured: true,
      },
      {
        name: 'Cleanest Cut',
        hashtag: '#CleanestCut',
        emoji: '🪚',
        category: 'Carpentry',
        startsAt: new Date(now.getTime() - 30 * 86400000),
        endsAt: new Date(now.getTime() - 1 * 86400000),
        status: 'completed',
      },
      {
        name: 'Pipe Master',
        hashtag: '#PipeMaster',
        emoji: '🔧',
        category: 'Plumbing',
        startsAt: new Date(now.getTime() - 2 * 86400000),
        endsAt: new Date(now.getTime() + 2 * 86400000),
        status: 'active',
      },
      {
        name: 'Green Thumb',
        hashtag: '#GreenThumb',
        emoji: '🌱',
        category: 'Farming',
        startsAt: new Date(now.getTime() + 5 * 86400000),
        endsAt: new Date(now.getTime() + 19 * 86400000),
        status: 'upcoming',
      },
      {
        name: 'Speed Build',
        hashtag: '#SpeedBuild',
        emoji: '🏗️',
        category: 'Construction',
        startsAt: new Date(now.getTime() - 20 * 86400000),
        endsAt: new Date(now.getTime() - 3 * 86400000),
        status: 'completed',
      },
    ])
    .returning();

  await db.insert(schema.challengeWinners).values([
    { challengeId: ch2.id, displayName: 'Thabo M.', avatar: 'https://i.pravatar.cc/150?u=thabo', rank: 1 },
    { challengeId: ch2.id, displayName: 'Grace W.', avatar: 'https://i.pravatar.cc/150?u=grace', rank: 2 },
    { challengeId: ch2.id, displayName: 'Kofi A.', avatar: 'https://i.pravatar.cc/150?u=kofi', rank: 3 },
    { challengeId: ch5.id, displayName: 'David O.', avatar: 'https://i.pravatar.cc/150?u=david', rank: 1 },
    { challengeId: ch5.id, displayName: 'Amara O.', avatar: 'https://i.pravatar.cc/150?u=amara', rank: 2 },
    { challengeId: ch5.id, displayName: 'Sipho N.', avatar: 'https://i.pravatar.cc/150?u=sipho', rank: 3 },
  ]);

  await db.insert(schema.challengeParticipants).values([
    { challengeId: ch1.id, userId: worker1.id },
    { challengeId: ch3.id, userId: worker1.id },
  ]);

  console.log('Seed complete!');
  console.log('');
  console.log('Demo accounts (password: password123):');
  console.log('  Worker:   +27821234567 (Sipho Ndlovu)');
  console.log('  Employer: +27831112233 (BuildRight SA)');
  console.log('  Employer: +27721234567 (Lerato Mokoena)');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
