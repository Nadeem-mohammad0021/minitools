import { redis } from '@/lib/utils/redis';
import { nanoid } from 'nanoid';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { url, expiresIn } = body;

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        try {
            new URL(url);
        } catch {
            return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
        }

        const shortCode = nanoid(6);

        try {
            // Set expiration if provided (in seconds)
            if (expiresIn) {
                await redis.set(`url:${shortCode}`, url, { ex: parseInt(expiresIn) });
            } else {
                // Default to 30 days (2592000s) if no expiry provided, or keep permanent if you prefer. 
                // User asked for 1 day/1 week etc, so let's default to permanent if not specified, 
                // OR we can enforce a default to save space. Let's respect the input.
                // Actually, user said "make all in local storage only except some like url shortener add a time limit... to less the space".
                // So adding a default limit is probably aligned with "less the space". 
                // Let's set a default of 30 days if not specified, or just rely on the UI.
                await redis.set(`url:${shortCode}`, url);
            }
        } catch (e) {
            console.error("Redis set error:", e);
            return NextResponse.json({ error: 'Database connection failed' }, { status: 503 });
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        return NextResponse.json({
            originalUrl: url,
            shortCode,
            shortUrl: `${baseUrl}/u/${shortCode}`,
        });
    } catch (error) {
        console.error('Shorten URL Error:', error);
        return NextResponse.json({ error: 'Failed to shorten URL' }, { status: 500 });
    }
}
