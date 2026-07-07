import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import { api } from '../../lib/api';

const emptyForm = {
  name: '',
  hashtag: '',
  emoji: '🏆',
  category: '',
  description: '',
  prize: '',
  startsAt: '',
  endsAt: '',
  status: 'active',
  featured: false,
};

export function AdminChallenges() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const { data: challenges = [], isLoading } = useQuery({
    queryKey: ['admin', 'challenges'],
    queryFn: () => api.admin.challenges.list(),
  });

  const createMutation = useMutation({
    mutationFn: () => api.admin.challenges.create(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'challenges'] });
      setShowForm(false);
      setForm(emptyForm);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) =>
      api.admin.challenges.update(id, { featured }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['admin', 'challenges'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.admin.challenges.delete(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['admin', 'challenges'] }),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-text-primary">Challenges</h1>
          <p className="text-text-secondary">Skill challenges and competitions</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-bold text-sm">
          <PlusIcon className="w-4 h-4" />
          Add challenge
        </button>
      </div>

      {showForm && (
        <div className="bg-surface border border-border rounded-2xl p-6 mb-6 space-y-4">
          <h3 className="font-bold">New challenge</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="px-4 py-2 rounded-xl border border-border bg-background"
            />
            <input
              placeholder="Hashtag (#SkillChallenge)"
              value={form.hashtag}
              onChange={(e) => setForm({ ...form, hashtag: e.target.value })}
              className="px-4 py-2 rounded-xl border border-border bg-background"
            />
            <input
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="px-4 py-2 rounded-xl border border-border bg-background"
            />
            <input
              placeholder="Prize"
              value={form.prize}
              onChange={(e) => setForm({ ...form, prize: e.target.value })}
              className="px-4 py-2 rounded-xl border border-border bg-background"
            />
            <input
              type="datetime-local"
              value={form.startsAt}
              onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
              className="px-4 py-2 rounded-xl border border-border bg-background"
            />
            <input
              type="datetime-local"
              value={form.endsAt}
              onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
              className="px-4 py-2 rounded-xl border border-border bg-background"
            />
          </div>
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            className="w-full px-4 py-2 rounded-xl border border-border bg-background"
          />
          <div className="flex gap-2">
            <button
              onClick={() => createMutation.mutate()}
              disabled={createMutation.isPending}
              className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-sm">
              Create
            </button>
            <button
              onClick={() => setShowForm(false)}
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
                <th className="px-6 py-3 font-semibold">Challenge</th>
                <th className="px-6 py-3 font-semibold">Category</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Featured</th>
                <th className="px-6 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {challenges.map((c) => (
                <tr key={c.id} className="border-b border-border">
                  <td className="px-6 py-3">
                    <span className="mr-2">{c.emoji}</span>
                    <span className="font-medium">{c.name}</span>
                    <span className="block text-xs text-text-secondary">
                      {c.hashtag}
                    </span>
                  </td>
                  <td className="px-6 py-3">{c.category}</td>
                  <td className="px-6 py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-background">
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <input
                      type="checkbox"
                      checked={c.featured}
                      onChange={(e) =>
                        updateMutation.mutate({
                          id: c.id,
                          featured: e.target.checked,
                        })
                      }
                    />
                  </td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => {
                        if (confirm(`Delete ${c.name}?`)) {
                          deleteMutation.mutate(c.id);
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
