const AUTH_URL = process.env.AUTH_API_URL || process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:3001';
const ONBOARDING_URL = process.env.ONBOARDING_API_URL || process.env.NEXT_PUBLIC_ONBOARDING_API_URL || 'http://localhost:3002';

export async function registerCompany(data: {
  companyName: string; domain: string; adminName: string; email: string; password: string;
}) {
  const res = await fetch(`${AUTH_URL}/api/v1/auth/register`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  });
  return res.json();
}
export async function loginUser(data: { email: string; password: string }) {
  const res = await fetch(`${AUTH_URL}/api/v1/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  });
  return res.json();
}
export async function getMe(token: string) {
  const res = await fetch(`${AUTH_URL}/api/v1/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}
export async function getTemplates(token: string) {
  const res = await fetch(`${ONBOARDING_URL}/api/v1/templates`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}
export async function createTemplate(token: string, data: { name: string; description: string; durationDays: number }) {
  const res = await fetch(`${ONBOARDING_URL}/api/v1/templates`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(data),
  });
  return res.json();
}
export async function addTask(token: string, templateId: string, data: { title: string; description: string; dueAfterDays: number }) {
  const res = await fetch(`${ONBOARDING_URL}/api/v1/templates/${templateId}/tasks`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(data),
  });
  return res.json();
}
export async function assignTemplate(token: string, data: { employeeEmail: string; employeeName: string; templateId: string }) {
  const res = await fetch(`${ONBOARDING_URL}/api/v1/templates/assign`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(data),
  });
  return res.json();
}
export async function getProgress(token: string) {
  const res = await fetch(`${ONBOARDING_URL}/api/v1/templates/progress`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}
