import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getMe, getTemplates, getProgress } from '@/lib/api';
import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';

export default async function DashboardPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('onboardai_token')?.value;
  if (!token) redirect('/login');

  const result = await getMe(token);
  if (!result.success) redirect('/login');

  const user = result.data;
  const company = result.data.company;

  const [templatesResult, progressResult] = await Promise.all([
    getTemplates(token),
    getProgress(token),
  ]);

  const templates = templatesResult.data || [];
  const onboardings = progressResult.data || [];
  const active = onboardings.filter((o: any) => o.status === 'IN_PROGRESS').length;
  const completed = onboardings.filter((o: any) => o.status === 'COMPLETED').length;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="text-xl font-bold text-white">OnboardAI</span>
          <Link href="/dashboard" className="text-white text-sm">Dashboard</Link>
          <Link href="/dashboard/templates" className="text-gray-400 hover:text-white text-sm">Templates</Link>
          <Link href="/dashboard/employees" className="text-gray-400 hover:text-white text-sm">Employees</Link>
          <Link href="/dashboard/progress" className="text-gray-400 hover:text-white text-sm">Progress</Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">{user.fullName}</span>
          <LogoutButton />
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold">Welcome back, {user.fullName.split(' ')[0]} í±‹</h1>
          <p className="text-gray-400 mt-1">{company.name} Â· {user.role}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Active Onboardings</p>
            <p className="text-4xl font-bold mt-2">{active}</p>
            <p className="text-gray-500 text-xs mt-1">In progress</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Completed</p>
            <p className="text-4xl font-bold mt-2">{completed}</p>
            <p className="text-gray-500 text-xs mt-1">Fully onboarded</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Templates</p>
            <p className="text-4xl font-bold mt-2">{templates.length}</p>
            <p className="text-gray-500 text-xs mt-1">Onboarding journeys</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/dashboard/templates" className="bg-gray-900 border border-gray-800 hover:border-blue-600 rounded-xl p-6 transition-colors">
            <h3 className="font-semibold text-lg">í³‹ Templates</h3>
            <p className="text-gray-400 text-sm mt-1">Create and manage onboarding journeys</p>
          </Link>
          <Link href="/dashboard/employees" className="bg-gray-900 border border-gray-800 hover:border-green-600 rounded-xl p-6 transition-colors">
            <h3 className="font-semibold text-lg">í±¤ Assign Employee</h3>
            <p className="text-gray-400 text-sm mt-1">Invite employees and assign templates</p>
          </Link>
          <Link href="/dashboard/progress" className="bg-gray-900 border border-gray-800 hover:border-purple-600 rounded-xl p-6 transition-colors md:col-span-2">
            <h3 className="font-semibold text-lg">í³Š Progress Tracker</h3>
            <p className="text-gray-400 text-sm mt-1">Track all employee onboarding progress</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
