import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getMe, getTemplates } from '@/lib/api';
import Link from 'next/link';

export default async function TemplatesPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('onboardai_token')?.value;
  if (!token) redirect('/login');

  const result = await getMe(token);
  if (!result.success) redirect('/login');

  const templatesResult = await getTemplates(token);
  const templates = templatesResult.data || [];

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
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Onboarding Templates</h1>
            <p className="text-gray-400 mt-1">Create and manage onboarding journeys</p>
          </div>
          <Link href="/dashboard/templates/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
            + New Template
          </Link>
        </div>

        {templates.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
            <p className="text-gray-500 text-lg">No templates yet</p>
            <p className="text-gray-600 text-sm mt-2">Create your first onboarding template</p>
            <Link href="/dashboard/templates/new" className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
              Create Template
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((t: any) => (
              <div key={t.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold">{t.name}</h3>
                <p className="text-gray-400 text-sm mt-1">{t.description}</p>
                <div className="flex items-center gap-4 mt-4">
                  <span className="text-gray-500 text-xs">{t.durationDays} days</span>
                  <span className="text-gray-500 text-xs">{t._count?.tasks || 0} tasks</span>
                </div>
                <Link href={`/dashboard/templates/${t.id}`} className="inline-block mt-4 text-blue-400 hover:text-blue-300 text-sm">
                  View & Edit →
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
