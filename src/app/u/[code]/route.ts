import { redis } from '@/lib/utils/redis';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  // In Next.js 15+ params is a Promise
  const resolvedParams = await params;
  const code = resolvedParams.code;

  if (!code) {
    return NextResponse.redirect(new URL('/404', req.url));
  }

  try {
    const originalUrl = await redis.get(`url:${code}`);

    if (originalUrl && typeof originalUrl === 'string') {
      // 301 Permanent Redirect (or 307 Temporary if we want to track stats analytics later)
      return NextResponse.redirect(originalUrl, 307);
    } else {
      return NextResponse.redirect(new URL('/404', req.url));
    }
  } catch (error) {
    console.error('Redirect Error:', error);
    return NextResponse.redirect(new URL('/404', req.url));
  }
}