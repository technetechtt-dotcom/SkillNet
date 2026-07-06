import PDFDocument from 'pdfkit';

interface InvoicePdfData {
  type: string;
  number: string;
  status: string;
  clientName: string;
  fromName: string;
  fromLocation?: string;
  date: string;
  dueDate: string | null;
  notes: string | null;
  lineItems: { description: string; quantity: number; rate: number }[];
  amount: number;
  currency: string;
}

export function generateInvoicePdf(data: InvoicePdfData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc
      .fontSize(22)
      .fillColor('#0d9488')
      .text(data.type.toUpperCase(), { align: 'left' });
    doc.fontSize(11).fillColor('#666').text(data.number);
    doc.moveDown();

    doc.fontSize(10).fillColor('#333');
    doc.text(`Status: ${data.status.toUpperCase()}`, { align: 'right' });
    doc.moveDown(1.5);

    doc.fontSize(10).fillColor('#888').text('FROM');
    doc.fontSize(12).fillColor('#111').text(data.fromName);
    if (data.fromLocation) doc.fontSize(10).fillColor('#666').text(data.fromLocation);

    doc.moveDown();
    doc.fontSize(10).fillColor('#888').text('BILLED TO');
    doc.fontSize(12).fillColor('#111').text(data.clientName);

    doc.moveDown();
    doc.text(`Issued: ${data.date}`);
    if (data.dueDate) doc.text(`Due: ${data.dueDate}`);

    doc.moveDown(1.5);
    doc.fontSize(10).fillColor('#888');
    const tableTop = doc.y;
    doc.text('Description', 50, tableTop);
    doc.text('Qty', 320, tableTop);
    doc.text('Rate', 380, tableTop);
    doc.text('Amount', 460, tableTop);
    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke('#ddd');

    let y = tableTop + 25;
    doc.fillColor('#111');
    for (const item of data.lineItems) {
      const lineTotal = item.quantity * item.rate;
      doc.fontSize(10).text(item.description, 50, y, { width: 250 });
      doc.text(String(item.quantity), 320, y);
      doc.text(formatMoney(item.rate, data.currency), 380, y);
      doc.text(formatMoney(lineTotal, data.currency), 460, y);
      y += 22;
    }

    doc.moveDown(2);
    doc.fontSize(14).fillColor('#0d9488').text(
      `Total: ${formatMoney(data.amount, data.currency)}`,
      { align: 'right' }
    );

    if (data.notes) {
      doc.moveDown(2);
      doc.fontSize(10).fillColor('#888').text('Notes');
      doc.fillColor('#333').text(data.notes);
    }

    doc.end();
  });
}

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency || 'ZAR',
    minimumFractionDigits: 0,
  }).format(amount);
}
