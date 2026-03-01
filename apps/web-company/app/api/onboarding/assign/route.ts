import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const ONBOARDING_URL = process.env.ONBOARDING_API_URL || process.env.NEXT_PUBLIC_ONBOARDING_API_URL || 'http://localhost:3002';
const AUTH_URL = process.env.AUTH_API_URL || 'http://localhost:3001';

export async function POST(req: NextRequest) {
  const token = cookies().get('onboardai_token')?.value;
  if (!token) return NextResponse.json({ success: false }, { status: 401 });

  const body = await req.json();
  const { employeeName, employeeEmail, templateId } = body;

  // Debug: return exactly what we received
  if (!employeeName || !employeeEmail || !templateId) {
    return NextResponse.json({ 
      success: false, 
      message: 'All fields are required',
      debug: { employeeName, employeeEmail, templateId, body }
    }, { status: 400 });
  }

  const meRes = await fetch(`${AUTH_URL}/api/v1/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const meData = await meRes.json();
  if (!meData.success) {
    return NextResponse.json({ success: false, message: 'Could not get company info' }, { status: 400 });
  }

  const company = meData.data.company;

  const registerRes = await fetch(`${AUTH_URL}/api/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: employeeName,
      email: employeeEmail,
      password: 'Welcome@123',
      companyName: company.name,
      domain: company.domain,
      role: 'employee',
    }),
  });

  const registerData = await registerRes.json();
  if (!registerData.success) {
    return NextResponse.json({ success: false, message: registerData.error?.message || 'Failed to create employee' }, { status: 400 });
  }

  const employeeId = registerData.data?.user?.id;
  if (!employeeId) {
    return NextResponse.json({ success: false, message: 'Could not get employee ID' }, { status: 500 });
  }

  const assignRes = await fetch(`${ONBOARDING_URL}/api/v1/templates/assign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ employeeId, templateId }),
  });

  return NextResponse.json(await assignRes.json());
}
