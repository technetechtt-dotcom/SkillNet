import { Router } from 'express';
import { desc, eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { transactions, wallets } from '../db/schema.js';
import { AuthRequest, requireAuth } from '../middleware/auth.js';
import { formatPayment, timeAgo } from '../utils/format.js';

const router = Router();

async function getWallet(userId: string) {
  const [wallet] = await db.select().from(wallets).where(eq(wallets.userId, userId));
  return wallet;
}

router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const wallet = await getWallet(req.userId!);
    if (!wallet) {
      res.status(404).json({ error: 'Wallet not found' });
      return;
    }

    const txs = await db
      .select()
      .from(transactions)
      .where(eq(transactions.walletId, wallet.id))
      .orderBy(desc(transactions.createdAt))
      .limit(50);

    res.json({
      balance: wallet.balance,
      currency: wallet.currency,
      formattedBalance: formatPayment(wallet.balance, wallet.currency),
      transactions: txs.map((t) => ({
        id: t.id,
        type: t.type,
        amount: t.amount,
        formattedAmount: formatPayment(t.amount, wallet.currency),
        description: t.description,
        status: t.status,
        time: timeAgo(t.createdAt),
        createdAt: t.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    console.error('Wallet error:', err);
    res.status(500).json({ error: 'Failed to fetch wallet' });
  }
});

router.post('/add', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { amount, description } = req.body;
    const numAmount = Number(amount);

    if (!numAmount || numAmount <= 0) {
      res.status(400).json({ error: 'Invalid amount' });
      return;
    }

    const wallet = await getWallet(req.userId!);
    if (!wallet) {
      res.status(404).json({ error: 'Wallet not found' });
      return;
    }

    const newBalance = wallet.balance + numAmount;
    await db.update(wallets).set({ balance: newBalance }).where(eq(wallets.id, wallet.id));

    await db.insert(transactions).values({
      walletId: wallet.id,
      type: 'credit',
      amount: numAmount,
      description: description || 'Added funds',
    });

    res.json({
      balance: newBalance,
      formattedBalance: formatPayment(newBalance, wallet.currency),
    });
  } catch (err) {
    console.error('Add funds error:', err);
    res.status(500).json({ error: 'Failed to add funds' });
  }
});

router.post('/send', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { amount, description, recipientPhone } = req.body;
    const numAmount = Number(amount);

    if (!numAmount || numAmount <= 0) {
      res.status(400).json({ error: 'Invalid amount' });
      return;
    }

    const wallet = await getWallet(req.userId!);
    if (!wallet) {
      res.status(404).json({ error: 'Wallet not found' });
      return;
    }

    if (wallet.balance < numAmount) {
      res.status(400).json({ error: 'Insufficient balance' });
      return;
    }

    const newBalance = wallet.balance - numAmount;
    await db.update(wallets).set({ balance: newBalance }).where(eq(wallets.id, wallet.id));

    await db.insert(transactions).values({
      walletId: wallet.id,
      type: 'debit',
      amount: numAmount,
      description: description || `Sent to ${recipientPhone || 'recipient'}`,
    });

    res.json({
      balance: newBalance,
      formattedBalance: formatPayment(newBalance, wallet.currency),
    });
  } catch (err) {
    console.error('Send funds error:', err);
    res.status(500).json({ error: 'Failed to send funds' });
  }
});

router.post('/withdraw', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { amount, bankName, accountNumber } = req.body;
    const numAmount = Number(amount);

    if (!numAmount || numAmount <= 0) {
      res.status(400).json({ error: 'Invalid amount' });
      return;
    }

    const wallet = await getWallet(req.userId!);
    if (!wallet) {
      res.status(404).json({ error: 'Wallet not found' });
      return;
    }

    if (wallet.balance < numAmount) {
      res.status(400).json({ error: 'Insufficient balance' });
      return;
    }

    const newBalance = wallet.balance - numAmount;
    await db.update(wallets).set({ balance: newBalance }).where(eq(wallets.id, wallet.id));

    await db.insert(transactions).values({
      walletId: wallet.id,
      type: 'withdrawal',
      amount: numAmount,
      description: `Withdrawal to ${bankName || 'bank'} ••••${accountNumber?.slice(-4) || '****'}`,
      status: 'pending',
    });

    res.json({
      balance: newBalance,
      formattedBalance: formatPayment(newBalance, wallet.currency),
    });
  } catch (err) {
    console.error('Withdraw error:', err);
    res.status(500).json({ error: 'Failed to withdraw' });
  }
});

export default router;
