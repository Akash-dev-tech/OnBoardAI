import { NextRequest, NextResponse } from 'next/server';
import { registerCompany } from '@/lib/api';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await registerCompany(body);

  if (!result.success) {
    return NextResponse.json(result, { status: 400 });
  }

  const response = NextResponse.json({ success: true, user: result.data.user, company: result.data.company });

  response.cookies.set('onboardai_token', result.data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return response;
}
