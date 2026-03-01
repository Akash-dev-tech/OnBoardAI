import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getMe, getProgress } from '@/lib/api';
import Link from 'next/link';

export default async function ProgressPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('onboardai_token')?.value;
  if (!token) redirect('/login');

  const result = await getMe(token);
  if (!result.success) redirect('/login');

  const progressResult = await getProgress(token);
  const onboardings = progressResult.data || [];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="text-xl font-bold text-white">OnboardAI</span>
          <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm">Dashboard</Link>
          <Link href="/dashboard/templates" className="text-gray-400 hover:text-white text-sm">Templates</Link>
          <Link href="/dashboard/employees" className="text-gray-400 hover:text-white text-sm">Employees</Link>
          <Link href="/dashboard/progress" className="text-white text-sm">Progress</Link>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Employee Progress</h1>
            <p className="text-gray-400 mt-1">Track all active onboardings</p>
          </div>
          <Link href="/dashboard/employees" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
            + Assign New
          </Link>
        </div>

        {onboardings.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
            <p className="text-gray-500 text-lg">No active onboardings</p>
            <p className="text-gray-600 text-sm mt-2">Assign a template to an employee to get started</p>
            <Link href="/dashboard/employees" className="inline-block mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm">
              Assign Employee
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {onboardings.map((o: any) => {
              const total = o.taskProgress?.length || 0;
              const completed = o.taskProgress?.filter((t: any) => t.status === 'COMPLETED').length || 0;
              const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
              return (
                <div key={o.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold">{o.employeeName}</p>
                      <p className="text-gray-400 text-sm">{o.employeeEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">{o.template?.name}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        o.status === 'COMPLETED' ? 'bg-green-900/30 text-green-400' :
                        o.status === 'IN_PROGRESS' ? 'bg-blue-900/30 text-blue-400' :
                        'bg-gray-800 text-gray-400'
                      }`}>{o.status}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-800 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${percent}%` }} />
                    </div>
                    <span className="text-sm text-gray-400 w-20 text-right">{completed}/{total} tasks</span>
                    <span className="text-sm font-medium w-10 text-right">{percent}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
