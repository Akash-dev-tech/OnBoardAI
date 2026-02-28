import { NextRequest, NextResponse } from 'next/server';
import { getMe } from '@/lib/api';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('onboardai_token')?.value;
  if (!token) return NextResponse.json({ success: false }, { status: 401 });

  const result = await getMe(token);
  return NextResponse.json(result);
}
