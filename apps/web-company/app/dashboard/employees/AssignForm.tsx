'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AssignForm({ templates, defaultTemplateId }: { templates: any[]; defaultTemplateId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    employeeName: '',
    employeeEmail: '',
    templateId: defaultTemplateId || (templates[0]?.id || ''),
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/onboarding/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(`Onboarding assigned to ${form.employeeName}!`);
        setForm({ employeeName: '', employeeEmail: '', templateId: form.templateId });
        setTimeout(() => router.push('/dashboard/progress'), 1500);
      } else {
        setError(data.message || 'Failed to assign');
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-8 space-y-6">
      {error && <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded-lg text-sm">{error}</div>}
      {success && <div className="bg-green-900/30 border border-green-800 text-green-400 px-4 py-3 rounded-lg text-sm">{success}</div>}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Employee Name</label>
        <input type="text" required value={form.employeeName} onChange={e => setForm({ ...form, employeeName: e.target.value })}
          placeholder="John Doe"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Employee Email</label>
        <input type="email" required value={form.employeeEmail} onChange={e => setForm({ ...form, employeeEmail: e.target.value })}
          placeholder="john@company.com"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Onboarding Template</label>
        <select required value={form.templateId} onChange={e => setForm({ ...form, templateId: e.target.value })}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500">
          {templates.map((t: any) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>
      <button type="submit" disabled={loading || templates.length === 0}
        className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-3 rounded-lg font-medium">
        {loading ? 'Assigning...' : 'Assign Onboarding'}
      </button>
      {templates.length === 0 && (
        <p className="text-yellow-500 text-sm text-center">Create a template first before assigning.</p>
      )}
    </form>
  );
}
