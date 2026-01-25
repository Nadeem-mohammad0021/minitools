import { NextRequest, NextResponse } from 'next/server';
import robotsParser from 'robots-txt-parser';

export async function POST(req: NextRequest) {
    try {
        const { robotsTxt, url, userAgent } = await req.json();

        if (!robotsTxt || !url) {
            return NextResponse.json({ error: 'Robots.txt content and URL are required' }, { status: 400 });
        }

        const robots = robotsParser({
            userAgent: userAgent || '*',
            allowOnNeutral: true,
        });

        // Mock the fetch behavior since we already have the content
        await robots.useRobotsFor(url, {
            get: () => Promise.resolve(robotsTxt)
        });

        const canCrawl = await robots.canCrawl(url);

        return NextResponse.json({
            allowed: canCrawl,
            status: canCrawl ? 'allowed' : 'blocked'
        });
    } catch (error) {
        console.error('Robots Parser Error:', error);
        return NextResponse.json({ error: 'Failed to parse robots.txt' }, { status: 500 });
    }
}
