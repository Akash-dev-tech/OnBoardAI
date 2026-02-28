import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getMe } from '@/lib/api';
import LogoutButton from '@/components/LogoutButton';

export default async function DashboardPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('onboardai_token')?.value;

  if (!token) redirect('/login');

  const result = await getMe(token);
  if (!result.success) redirect('/login');

  const user = result.data;
  const company = result.data.company;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-white">OnboardAI</span>
          <span className="bg-blue-600/20 text-blue-400 text-xs px-2 py-0.5 rounded-full border border-blue-600/30">
            {company.plan}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">{user.fullName}</span>
          <LogoutButton />
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold">Welcome back, {user.fullName.split(' ')[0]} ���</h1>
          <p className="text-gray-400 mt-1">{company.name} · {user.role}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Active Employees', value: '—', sub: 'Onboarding in progress' },
            { label: 'Tasks Completed', value: '—', sub: 'This month' },
            { label: 'Avg. Culture Fit', value: '—', sub: 'Across all employees' },
          ].map(card => (
            <div key={card.label} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <p className="text-gray-400 text-sm">{card.label}</p>
              <p className="text-4xl font-bold mt-2">{card.value}</p>
              <p className="text-gray-500 text-xs mt-1">{card.sub}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
          <p className="text-gray-500 text-sm uppercase tracking-widest mb-2">Phase 2</p>
          <h2 className="text-xl font-semibold text-white">Onboarding flows coming next</h2>
          <p className="text-gray-400 mt-2 text-sm">
            Employee invites, journey builder, AI companion — all being built.
          </p>
        </div>
      </main>
    </div>
  );
}
