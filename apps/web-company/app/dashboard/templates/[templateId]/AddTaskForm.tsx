'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export default function AddTaskForm({ templateId }: { templateId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', description: '', dueAfterDays: 1 });
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/onboarding/templates/${templateId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setForm({ title: '', description: '', dueAfterDays: 1 });
        router.refresh();
      } else {
        setError(data.message || data.error || 'Failed to add task');
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  }
  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
      {error && <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded-lg text-sm">{error}</div>}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Task Title</label>
        <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
          placeholder="e.g. Complete HR paperwork"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Description <span className="text-gray-500">(optional)</span></label>
        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
          placeholder="What should the employee do?"
          rows={2}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Due After (days)</label>
        <input type="number" required min={1} value={form.dueAfterDays} onChange={e => setForm({ ...form, dueAfterDays: parseInt(e.target.value) })}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 text-sm" />
      </div>
      <button type="submit" disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 rounded-lg font-medium text-sm">
        {loading ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  );
}
