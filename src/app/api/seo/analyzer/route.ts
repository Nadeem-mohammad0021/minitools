import { NextRequest, NextResponse } from 'next/server';
import metascraper from 'metascraper';
import metascraperTitle from 'metascraper-title';
import metascraperDescription from 'metascraper-description';
import metascraperImage from 'metascraper-image';
import metascraperLogo from 'metascraper-logo';
import metascraperAuthor from 'metascraper-author';
import robotsParser from 'robots-txt-parser';

const scraper = metascraper([
    metascraperTitle(),
    metascraperDescription(),
    metascraperImage(),
    metascraperLogo(),
    metascraperAuthor(),
]);

export async function POST(req: NextRequest) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: 'URL required' }, { status: 400 });
        }

        const response = await fetch(url);
        const html = await response.text();
        const metadata = await scraper({ html, url });

        // Basic SEO checks
        const analysis: any = {
            title: metadata.title || 'Missing',
            description: metadata.description || 'Missing',
            image: metadata.image || null,
            logo: metadata.logo || null,
            author: metadata.author || null,
            h1Count: (html.match(/<h1/g) || []).length,
            h2Count: (html.match(/<h2/g) || []).length,
            imagesWithoutAlt: (html.match(/<img(?![^>]*\balt=)[^>]*>/g) || []).length,
            isIndexable: !html.includes('noindex'),
        };

        // robots.txt check
        try {
            const robotsUrl = new URL('/robots.txt', url).href;
            const robotsRes = await fetch(robotsUrl);
            const robotsTxt = await robotsRes.text();
            
            const robots = robotsParser({
                userAgent: 'Googlebot',
                allowOnNeutral: true,
            });

            await robots.useRobotsFor(url, {
                get: () => Promise.resolve(robotsTxt)
            });

            analysis.robotsAllowed = await robots.canCrawl(url);
        } catch (e) {
            analysis.robotsAllowed = true; // Fallback
        }

        return NextResponse.json({ analysis });
    } catch (error) {
        console.error('SEO Analysis Error:', error);
        return NextResponse.json({ error: 'Failed to analyze URL. Please ensure it is public and accessible.' }, { status: 500 });
    }
}
