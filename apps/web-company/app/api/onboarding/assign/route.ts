import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const ONBOARDING_URL = process.env.ONBOARDING_API_URL || process.env.NEXT_PUBLIC_ONBOARDING_API_URL || 'http://localhost:3002';
const AUTH_URL = process.env.AUTH_API_URL || 'http://localhost:3001';

export async function POST(req: NextRequest) {
  const rawText = await req.text();
  console.log('ASSIGN ROUTE HIT - raw body:', rawText);
  
  let body: any = {};
  try { body = JSON.parse(rawText); } catch(e) { 
    return NextResponse.json({ success: false, message: 'Invalid JSON', raw: rawText });
  }

  const { employeeName, employeeEmail, templateId } = body;
  console.log('Parsed:', { employeeName, employeeEmail, templateId });

  if (!employeeName || !employeeEmail || !templateId) {
    return NextResponse.json({
      success: false,
      message: 'All fields are required',
      debug: { employeeName, employeeEmail, templateId }
    }, { status: 400 });
  }

  const token = cookies().get('onboardai_token')?.value;
  if (!token) return NextResponse.json({ success: false, message: 'No token' }, { status: 401 });

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
    return NextResponse.json({ success: false, message: registerData.error?.message || registerData.message || 'Failed to create employee', registerData }, { status: 400 });
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
