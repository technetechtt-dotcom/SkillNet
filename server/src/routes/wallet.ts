import { Router } from 'express';
import { and, desc, eq, gte, sql } from 'drizzle-orm';
import { db } from '../db/index.js';
import { transactions, users, wallets } from '../db/schema.js';
import { AuthRequest, requireAuth } from '../middleware/auth.js';
import { formatPayment, timeAgo } from '../utils/format.js';
import {
  initializePayment,
  isPaystackConfigured,
  verifyPayment,
} from '../utils/paystack.js';
import { broadcastToUsers } from '../ws.js';

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
        reference: t.reference,
        time: timeAgo(t.createdAt),
        createdAt: t.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    console.error('Wallet error:', err);
    res.status(500).json({ error: 'Failed to fetch wallet' });
  }
});

router.get('/stats', requireAuth, async (req: AuthRequest, res) => {
  try {
    const wallet = await getWallet(req.userId!);
    if (!wallet) {
      res.status(404).json({ error: 'Wallet not found' });
      return;
    }

    const weekAgo = new Date(Date.now() - 7 * 86400000);
    const [user] = await db.select().from(users).where(eq(users.id, req.userId!));

    const weeklyTxs = await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.walletId, wallet.id),
          eq(transactions.type, 'credit'),
          eq(transactions.status, 'completed'),
          gte(transactions.createdAt, weekAgo)
        )
      );

    const weeklyEarned = weeklyTxs.reduce((sum, t) => sum + t.amount, 0);

    res.json({
      weeklyEarned,
      formattedWeeklyEarned: formatPayment(weeklyEarned, wallet.currency),
      jobsCompleted: user?.completedJobs ?? 0,
    });
  } catch (err) {
    console.error('Wallet stats error:', err);
    res.status(500).json({ error: 'Failed to fetch wallet stats' });
  }
});

router.get('/transactions/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const wallet = await getWallet(req.userId!);
    if (!wallet) {
      res.status(404).json({ error: 'Wallet not found' });
      return;
    }

    const [tx] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, String(req.params.id)));

    if (!tx || tx.walletId !== wallet.id) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }

    const isCredit = tx.type === 'credit';
    const isWithdrawal = tx.type === 'withdrawal';

    res.json({
      id: tx.id,
      type: isWithdrawal ? 'withdrawal' : isCredit ? 'received' : 'sent',
      title: tx.description || 'Transaction',
      amount: isCredit ? tx.amount : -tx.amount,
      date: tx.createdAt.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }),
      status: tx.status,
      ref: tx.reference || tx.id.slice(0, 8).toUpperCase(),
      bankDetails: tx.metadata?.bankDetails,
      note: tx.metadata?.note,
      jobRef: tx.metadata?.jobRef,
    });
  } catch (err) {
    console.error('Transaction detail error:', err);
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
});

router.post('/paystack/initialize', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { amount } = req.body;
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

    const [user] = await db.select().from(users).where(eq(users.id, req.userId!));
    const reference = `SKN-${Date.now()}-${req.userId!.slice(0, 8)}`;

    await db.insert(transactions).values({
      walletId: wallet.id,
      type: 'credit',
      amount: numAmount,
      description: 'Paystack top-up (pending)',
      status: 'pending',
      reference,
      metadata: { source: 'paystack' },
    });

    const result = await initializePayment({
      email: `${user?.phone.replace(/\D/g, '')}@skillnet.app`,
      amount: numAmount,
      reference,
      callbackUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/wallet/add?reference=${reference}`,
    });

    res.json({
      reference: result.reference,
      authorizationUrl: result.authorizationUrl,
      devMode: result.devMode,
      paystackConfigured: isPaystackConfigured(),
    });
  } catch (err) {
    console.error('Paystack init error:', err);
    res.status(500).json({ error: 'Failed to initialize payment' });
  }
});

router.get('/paystack/verify', requireAuth, async (req: AuthRequest, res) => {
  try {
    const reference = req.query.reference as string;
    if (!reference) {
      res.status(400).json({ error: 'Reference is required' });
      return;
    }

    const wallet = await getWallet(req.userId!);
    if (!wallet) {
      res.status(404).json({ error: 'Wallet not found' });
      return;
    }

    const [tx] = await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.walletId, wallet.id),
          eq(transactions.reference, reference)
        )
      );

    if (!tx) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }

    if (tx.status === 'completed') {
      res.json({
        success: true,
        balance: wallet.balance,
        formattedBalance: formatPayment(wallet.balance, wallet.currency),
        alreadyProcessed: true,
      });
      return;
    }

    const verification = await verifyPayment(reference);
    if (!verification.success && !verification.devMode) {
      res.status(400).json({ error: 'Payment verification failed' });
      return;
    }

    const creditAmount = verification.devMode ? tx.amount : verification.amount || tx.amount;
    const newBalance = wallet.balance + creditAmount;

    await db.update(wallets).set({ balance: newBalance }).where(eq(wallets.id, wallet.id));
    await db
      .update(transactions)
      .set({
        status: 'completed',
        amount: creditAmount,
        description: 'Added funds via Paystack',
      })
      .where(eq(transactions.id, tx.id));

    broadcastToUsers([req.userId!], {
      type: 'wallet:update',
      balance: newBalance,
      formattedBalance: formatPayment(newBalance, wallet.currency),
    });

    res.json({
      success: true,
      balance: newBalance,
      formattedBalance: formatPayment(newBalance, wallet.currency),
    });
  } catch (err) {
    console.error('Paystack verify error:', err);
    res.status(500).json({ error: 'Failed to verify payment' });
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
      reference: `ADD-${Date.now()}`,
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

    const [recipient] = recipientPhone
      ? await db.select().from(users).where(eq(users.phone, recipientPhone))
      : [null];

    const senderBalance = wallet.balance - numAmount;
    await db.update(wallets).set({ balance: senderBalance }).where(eq(wallets.id, wallet.id));

    const ref = `TRF-${Date.now()}`;
    await db.insert(transactions).values({
      walletId: wallet.id,
      type: 'debit',
      amount: numAmount,
      description: description || `Sent to ${recipient?.name || recipientPhone || 'recipient'}`,
      reference: ref,
      metadata: recipientPhone ? { recipientPhone } : undefined,
    });

    if (recipient) {
      const recipientWallet = await getWallet(recipient.id);
      if (recipientWallet) {
        const recipientBalance = recipientWallet.balance + numAmount;
        await db
          .update(wallets)
          .set({ balance: recipientBalance })
          .where(eq(wallets.id, recipientWallet.id));

        await db.insert(transactions).values({
          walletId: recipientWallet.id,
          type: 'credit',
          amount: numAmount,
          description: description || `Received from ${req.userId}`,
          reference: ref,
          metadata: { senderPhone: recipientPhone },
        });

        broadcastToUsers([recipient.id], {
          type: 'wallet:update',
          balance: recipientBalance,
          formattedBalance: formatPayment(recipientBalance, recipientWallet.currency),
        });
      }
    }

    res.json({
      balance: senderBalance,
      formattedBalance: formatPayment(senderBalance, wallet.currency),
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
      reference: `WTH-${Date.now()}`,
      metadata: {
        bankDetails: `${bankName || 'Bank'} **** ${accountNumber?.slice(-4) || '****'}`,
      },
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
