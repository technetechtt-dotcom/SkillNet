import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PlusIcon, Trash2Icon, PencilIcon } from 'lucide-react';
import { api, ApiProgram } from '../../lib/api';

const emptyForm = {
  slug: '',
  title: '',
  type: 'grant',
  provider: '',
  description: '',
  location: '',
  duration: '',
  stipend: '',
  fundingAmount: '',
  status: 'active',
  featured: false,
};

export function AdminPrograms() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<ApiProgram | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const { data: programs = [], isLoading } = useQuery({
    queryKey: ['admin', 'programs'],
    queryFn: () => api.admin.programs.list(),
  });

  const saveMutation = useMutation({
    mutationFn: () =>
      editing
        ? api.admin.programs.update(editing.id, form)
        : api.admin.programs.create(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'programs'] });
      setShowForm(false);
      setEditing(null);
      setForm(emptyForm);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.admin.programs.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'programs'] }),
  });

  const openEdit = (p: ApiProgram) => {
    setEditing(p);
    setForm({
      slug: p.slug,
      title: p.title,
      type: p.type,
      provider: p.provider || '',
      description: p.description || '',
      location: p.location || '',
      duration: p.duration || '',
      stipend: p.stipend || '',
      fundingAmount: p.fundingAmount || '',
      status: p.status,
      featured: p.featured,
    });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-text-primary">Programs</h1>
          <p className="text-text-secondary">
            Government grants, learnerships, and training programs
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setForm(emptyForm);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-bold text-sm">
          <PlusIcon className="w-4 h-4" />
          Add program
        </button>
      </div>

      {showForm && (
        <div className="bg-surface border border-border rounded-2xl p-6 mb-6 space-y-4">
          <h3 className="font-bold">{editing ? 'Edit program' : 'New program'}</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Slug (e.g. grants)"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="px-4 py-2 rounded-xl border border-border bg-background"
            />
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="px-4 py-2 rounded-xl border border-border bg-background"
            />
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="px-4 py-2 rounded-xl border border-border bg-background">
              <option value="grant">Grant</option>
              <option value="learnership">Learnership</option>
              <option value="training">Training</option>
              <option value="compliance">Compliance</option>
            </select>
            <input
              placeholder="Provider"
              value={form.provider}
              onChange={(e) => setForm({ ...form, provider: e.target.value })}
              className="px-4 py-2 rounded-xl border border-border bg-background"
            />
            <input
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="px-4 py-2 rounded-xl border border-border bg-background"
            />
            <input
              placeholder="Duration"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              className="px-4 py-2 rounded-xl border border-border bg-background"
            />
            <input
              placeholder="Stipend"
              value={form.stipend}
              onChange={(e) => setForm({ ...form, stipend: e.target.value })}
              className="px-4 py-2 rounded-xl border border-border bg-background"
            />
            <input
              placeholder="Funding amount"
              value={form.fundingAmount}
              onChange={(e) => setForm({ ...form, fundingAmount: e.target.value })}
              className="px-4 py-2 rounded-xl border border-border bg-background"
            />
          </div>
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 rounded-xl border border-border bg-background"
          />
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            Featured on Government Hub
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
              className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-sm">
              Save
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditing(null);
              }}
              className="px-4 py-2 rounded-xl border border-border text-sm font-semibold">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        {isLoading ? (
          <p className="p-6 text-text-secondary">Loading…</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-text-secondary border-b border-border bg-background/50">
                <th className="px-6 py-3 font-semibold">Title</th>
                <th className="px-6 py-3 font-semibold">Type</th>
                <th className="px-6 py-3 font-semibold">Provider</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {programs.map((p) => (
                <tr key={p.id} className="border-b border-border">
                  <td className="px-6 py-3 font-medium">
                    {p.title}
                    {p.featured && (
                      <span className="ml-2 text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">
                        featured
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3 capitalize">{p.type}</td>
                  <td className="px-6 py-3 text-text-secondary">
                    {p.provider || '—'}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                        p.status === 'active'
                          ? 'bg-success/10 text-success'
                          : 'bg-background text-text-secondary'
                      }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 flex gap-1">
                    <button
                      onClick={() => openEdit(p)}
                      className="p-2 rounded-lg text-primary hover:bg-primary/10">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete ${p.title}?`)) {
                          deleteMutation.mutate(p.id);
                        }
                      }}
                      className="p-2 rounded-lg text-error hover:bg-error/10">
                      <Trash2Icon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
