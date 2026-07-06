import React, { useState } from 'react';
import { ArrowLeftIcon, PlusIcon, Trash2Icon, FileTextIcon } from 'lucide-react';
import { ActionButton } from '../components/ui/ActionButton';
interface CreateInvoiceProps {
  onBack: () => void;
  onSave: () => void;
}
interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}
export function CreateInvoice({ onBack, onSave }: CreateInvoiceProps) {
  const [type, setType] = useState<'invoice' | 'quote'>('invoice');
  const [clientName, setClientName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<LineItem[]>([
  {
    id: '1',
    description: '',
    quantity: 1,
    rate: 0
  }]
  );
  const addItem = () => {
    setItems([
    ...items,
    {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0
    }]
    );
  };
  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };
  const updateItem = (
  id: string,
  field: keyof LineItem,
  value: string | number) =>
  {
    setItems(
      items.map((item) =>
      item.id === id ?
      {
        ...item,
        [field]: value
      } :
      item
      )
    );
  };
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0
  );
  const total = subtotal; // Add tax logic here if needed
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-surface px-4 py-4 flex items-center justify-between flex-shrink-0 border-b border-border shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 text-text-primary min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full hover:bg-background transition-colors">
            
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-text-primary">Create New</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Type Toggle */}
        <div className="flex bg-surface p-1 rounded-xl border border-border">
          <button
            onClick={() => setType('invoice')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${type === 'invoice' ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}>
            
            Invoice
          </button>
          <button
            onClick={() => setType('quote')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${type === 'quote' ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}>
            
            Quote
          </button>
        </div>

        {/* Client Details */}
        <div className="bg-surface rounded-2xl p-4 border border-border shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
            <FileTextIcon className="w-4 h-4 text-primary" /> Details
          </h2>

          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
              Client Name
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. TechHub Ltd"
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-primary" />
            
          </div>

          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-primary" />
            
          </div>
        </div>

        {/* Line Items */}
        <div className="bg-surface rounded-2xl p-4 border border-border shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-text-primary">Line Items</h2>
          </div>

          <div className="space-y-4">
            {items.map((item, index) =>
            <div
              key={item.id}
              className="p-4 bg-background rounded-xl border border-border relative">
              
                {items.length > 1 &&
              <button
                onClick={() => removeItem(item.id)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-error text-white rounded-full flex items-center justify-center shadow-sm hover:bg-error-dark">
                
                    <Trash2Icon className="w-3 h-3" />
                  </button>
              }

                <div className="space-y-3">
                  <div>
                    <input
                    type="text"
                    value={item.description}
                    onChange={(e) =>
                    updateItem(item.id, 'description', e.target.value)
                    }
                    placeholder="Description of work"
                    className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary" />
                  
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1">
                        Qty
                      </label>
                      <input
                      type="number"
                      min="1"
                      value={item.quantity || ''}
                      onChange={(e) =>
                      updateItem(
                        item.id,
                        'quantity',
                        parseFloat(e.target.value) || 0
                      )
                      }
                      className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary" />
                    
                    </div>
                    <div className="flex-[2]">
                      <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1">
                        Rate (₦)
                      </label>
                      <input
                      type="number"
                      min="0"
                      value={item.rate || ''}
                      onChange={(e) =>
                      updateItem(
                        item.id,
                        'rate',
                        parseFloat(e.target.value) || 0
                      )
                      }
                      className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary" />
                    
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={addItem}
            className="w-full py-3 border-2 border-dashed border-border rounded-xl text-primary font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors">
            
            <PlusIcon className="w-4 h-4" /> Add Item
          </button>
        </div>

        {/* Notes */}
        <div className="bg-surface rounded-2xl p-4 border border-border shadow-sm">
          <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Thank you for your business!"
            rows={3}
            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-primary resize-none" />
          
        </div>

        {/* Totals */}
        <div className="bg-surface rounded-2xl p-5 border border-border shadow-sm space-y-3">
          <div className="flex justify-between items-center text-sm font-medium text-text-secondary">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between items-center text-sm font-medium text-text-secondary">
            <span>Tax (0%)</span>
            <span>₦0</span>
          </div>
          <div className="pt-3 border-t border-border flex justify-between items-center">
            <span className="font-bold text-text-primary">Total</span>
            <span className="text-xl font-black text-primary">
              {formatCurrency(total)}
            </span>
          </div>
        </div>

        <div className="h-4" />
      </div>

      {/* Bottom Action */}
      <div className="p-4 bg-surface border-t border-border flex-shrink-0">
        <ActionButton
          onClick={onSave}
          variant="gradient"
          disabled={!clientName || total === 0}>
          
          Preview & Save
        </ActionButton>
      </div>
    </div>);

}