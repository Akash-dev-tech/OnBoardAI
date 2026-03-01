import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getMe } from '@/lib/api';
import Link from 'next/link';
import AddTaskForm from './AddTaskForm';

const ONBOARDING_URL = process.env.NEXT_PUBLIC_ONBOARDING_API_URL || 'http://localhost:3002';

export default async function TemplateDetailPage({ params }: { params: { templateId: string } }) {
  const cookieStore = cookies();
  const token = cookieStore.get('onboardai_token')?.value;
  if (!token) redirect('/login');

  const result = await getMe(token);
  if (!result.success) redirect('/login');

  const res = await fetch(`${ONBOARDING_URL}/api/v1/templates`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  const data = await res.json();
  const templates = data.data || [];
  const template = templates.find((t: any) => t.id === params.templateId);

  if (!template) redirect('/dashboard/templates');

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="text-xl font-bold text-white">OnboardAI</span>
          <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm">Dashboard</Link>
          <Link href="/dashboard/templates" className="text-white text-sm">Templates</Link>
          <Link href="/dashboard/employees" className="text-gray-400 hover:text-white text-sm">Employees</Link>
          <Link href="/dashboard/progress" className="text-gray-400 hover:text-white text-sm">Progress</Link>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <Link href="/dashboard/templates" className="text-gray-500 hover:text-white text-sm">← Back to Templates</Link>
          <h1 className="text-3xl font-bold mt-4">{template.name}</h1>
          <p className="text-gray-400 mt-1">{template.description} · {template.durationDays} days</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">Tasks ({template.tasks?.length || 0})</h2>
            {template.tasks?.length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
                <p className="text-gray-500 text-sm">No tasks yet. Add your first task.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {template.tasks?.sort((a: any, b: any) => a.dayNumber - b.dayNumber).map((task: any) => (
                  <div key={task.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm">{task.title}</p>
                        <p className="text-gray-400 text-xs mt-1">{task.description}</p>
                      </div>
                      <span className="text-xs text-blue-400 bg-blue-900/30 px-2 py-1 rounded">Day {task.dayNumber}</span>
                    </div>
                    <span className="text-xs text-gray-500 mt-2 inline-block">{task.type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Add Task</h2>
            <AddTaskForm templateId={params.templateId} />
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-8">
          <h2 className="text-lg font-semibold mb-4">Assign to Employee</h2>
          <Link href={`/dashboard/employees?templateId=${params.templateId}`} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
            Assign This Template →
          </Link>
        </div>
      </main>
    </div>
  );
}
