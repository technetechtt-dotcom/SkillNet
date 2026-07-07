import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import * as schema from './schema.js';
import { hashPassword } from '../utils/auth.js';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function ensureAdmin() {
  const phone = '+27800000001';
  const [existing] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.phone, phone));

  if (existing) {
    await db
      .update(schema.users)
      .set({ role: 'admin' })
      .where(eq(schema.users.id, existing.id));
    console.log('Admin role applied to existing user:', phone);
  } else {
    const passwordHash = await hashPassword('password123');
    const [admin] = await db
      .insert(schema.users)
      .values({
        phone,
        passwordHash,
        name: 'SkillNet Admin',
        location: 'Johannesburg, South Africa',
        role: 'admin',
        trustScore: 100,
      })
      .returning();

    await db.insert(schema.wallets).values({
      userId: admin.id,
      balance: 0,
      currency: 'ZAR',
    });
    console.log('Created admin user:', phone);
  }

  const programCount = await db.select().from(schema.programs);
  if (programCount.length === 0) {
    await db.insert(schema.programs).values([
      {
        slug: 'grants',
        title: 'Grants & Funding',
        type: 'grant',
        provider: 'National Empowerment Fund',
        description:
          'Access funding for small businesses and skills development across South Africa.',
        fundingAmount: 'Up to R 500,000',
        status: 'active',
        featured: true,
      },
      {
        slug: 'seta',
        title: 'SETA Learnerships',
        type: 'learnership',
        provider: 'merSETA / CETA / MICT SETA',
        description:
          'Accredited learnership programs with monthly stipends and NQF qualifications.',
        location: 'Nationwide',
        duration: '12–18 months',
        stipend: 'R 3,800–5,000/month',
        status: 'active',
        featured: true,
      },
    ]);
    console.log('Seeded default programs');
  }

  console.log('Done. Login at /admin with', phone, '/ password123');
}

ensureAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
