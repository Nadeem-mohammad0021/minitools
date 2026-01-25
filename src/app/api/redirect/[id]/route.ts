import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
    url: process.env.REDIS_URL!,
    token: process.env.REDIS_TOKEN!,
});

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const url = await redis.get(`url:${id}`) as string;

        if (!url) {
            return new NextResponse('URL Not Found', { status: 404 });
        }

        return NextResponse.redirect(url);
    } catch (error) {
        console.error('Redirect Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
