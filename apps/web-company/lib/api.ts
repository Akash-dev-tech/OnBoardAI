const API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:3001';

export async function registerCompany(data: {
  companyName: string;
  domain: string;
  adminName: string;
  email: string;
  password: string;
}) {
  const res = await fetch(`${API_URL}/api/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function loginUser(data: { email: string; password: string }) {
  const res = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getMe(token: string) {
  const res = await fetch(`${API_URL}/api/v1/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}
