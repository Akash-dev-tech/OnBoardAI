import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getMe, getTemplates } from '@/lib/api';
import Link from 'next/link';
import AssignForm from './AssignForm';

export default async function EmployeesPage({ searchParams }: { searchParams: { templateId?: string } }) {
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
          <Link href="/dashboard/templates" className="text-gray-400 hover:text-white text-sm">Templates</Link>
          <Link href="/dashboard/employees" className="text-white text-sm">Employees</Link>
          <Link href="/dashboard/progress" className="text-gray-400 hover:text-white text-sm">Progress</Link>
        </div>
      </nav>
      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Assign Onboarding</h1>
          <p className="text-gray-400 mt-1">Invite an employee and assign a template</p>
        </div>
        <AssignForm templates={templates} defaultTemplateId={searchParams.templateId || ''} />
      </main>
    </div>
  );
}
