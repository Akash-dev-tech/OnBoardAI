import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const ONBOARDING_URL = process.env.NEXT_PUBLIC_ONBOARDING_API_URL || 'http://localhost:3002';

export async function POST(req: NextRequest, { params }: { params: { templateId: string } }) {
  const token = cookies().get('onboardai_token')?.value;
  if (!token) return NextResponse.json({ success: false }, { status: 401 });
  const body = await req.json();
  const res = await fetch(`${ONBOARDING_URL}/api/v1/templates/${params.templateId}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  return NextResponse.json(await res.json());
}
