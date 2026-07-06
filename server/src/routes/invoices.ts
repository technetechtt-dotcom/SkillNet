import { Router } from 'express';
import { desc, eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { invoices } from '../db/schema.js';
import { AuthRequest, requireAuth } from '../middleware/auth.js';
import { formatPayment } from '../utils/format.js';

const router = Router();

function serializeInvoice(inv: typeof invoices.$inferSelect) {
  return {
    id: inv.id,
    type: inv.type as 'invoice' | 'quote',
    number: inv.number,
    clientName: inv.clientName,
    amount: inv.amount,
    formattedAmount: formatPayment(inv.amount, inv.currency),
    currency: inv.currency,
    status: inv.status as 'draft' | 'sent' | 'paid' | 'overdue',
    date: inv.createdAt.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    dueDate: inv.dueDate
      ? inv.dueDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : null,
    notes: inv.notes,
    lineItems: inv.lineItems,
    createdAt: inv.createdAt.toISOString(),
  };
}

async function nextInvoiceNumber(userId: string, type: string) {
  const prefix = type === 'quote' ? 'QUO' : 'INV';
  const year = new Date().getFullYear();
  const existing = await db
    .select()
    .from(invoices)
    .where(eq(invoices.userId, userId));
  const seq = existing.filter((i) => i.type === type).length + 1;
  return `${prefix}-${year}-${String(seq).padStart(3, '0')}`;
}

router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const items = await db
      .select()
      .from(invoices)
      .where(eq(invoices.userId, req.userId!))
      .orderBy(desc(invoices.createdAt));

    res.json(items.map(serializeInvoice));
  } catch (err) {
    console.error('List invoices error:', err);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

router.get('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const [inv] = await db
      .select()
      .from(invoices)
      .where(eq(invoices.id, req.params.id));

    if (!inv || inv.userId !== req.userId) {
      res.status(404).json({ error: 'Invoice not found' });
      return;
    }

    res.json(serializeInvoice(inv));
  } catch (err) {
    console.error('Get invoice error:', err);
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});

router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const {
      clientName,
      type = 'invoice',
      amount,
      dueDate,
      notes,
      lineItems = [],
      status = 'draft',
    } = req.body;

    if (!clientName || !amount) {
      res.status(400).json({ error: 'Client name and amount are required' });
      return;
    }

    const number = await nextInvoiceNumber(req.userId!, type);

    const [inv] = await db
      .insert(invoices)
      .values({
        userId: req.userId!,
        clientName,
        type,
        number,
        amount: Number(amount),
        status,
        dueDate: dueDate ? new Date(dueDate) : null,
        notes: notes || null,
        lineItems,
      })
      .returning();

    res.status(201).json(serializeInvoice(inv));
  } catch (err) {
    console.error('Create invoice error:', err);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

router.patch('/:id/status', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { status } = req.body;
    const [inv] = await db
      .select()
      .from(invoices)
      .where(eq(invoices.id, req.params.id));

    if (!inv || inv.userId !== req.userId) {
      res.status(404).json({ error: 'Invoice not found' });
      return;
    }

    const [updated] = await db
      .update(invoices)
      .set({ status })
      .where(eq(invoices.id, req.params.id))
      .returning();

    res.json(serializeInvoice(updated));
  } catch (err) {
    console.error('Update invoice error:', err);
    res.status(500).json({ error: 'Failed to update invoice' });
  }
});

export default router;
