import { NextRequest, NextResponse } from 'next/server';
import { SitemapStream, streamToPromise } from 'sitemap';

export async function POST(req: NextRequest) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: 'URL required' }, { status: 400 });
        }

        const baseUrl = new URL(url).origin;
        const discoveredLinks = new Set<string>([url]);
        const linksToScan = new Set<string>();

        // Phase 1: Scan homepage
        const response = await fetch(url);
        const html = await response.text();
        const linkRegex = /href="((https?:\/\/[^"]+)|(\/[^"]+))"/g;
        let match;

        while ((match = linkRegex.exec(html)) !== null) {
            let link = match[1];
            if (link.startsWith('/')) link = baseUrl + link;
            if (link.startsWith(baseUrl)) {
                discoveredLinks.add(link);
                linksToScan.add(link);
            }
        }

        // Phase 2: Shallow recursive scan (up to 20 links to avoid excessive time)
        const scanBatch = Array.from(linksToScan).slice(0, 20);
        await Promise.all(scanBatch.map(async (link) => {
            try {
                const res = await fetch(link);
                const subHtml = await res.text();
                let subMatch;
                while ((subMatch = linkRegex.exec(subHtml)) !== null) {
                    let slink = subMatch[1];
                    if (slink.startsWith('/')) slink = baseUrl + slink;
                    if (slink.startsWith(baseUrl)) discoveredLinks.add(slink);
                }
            } catch (e) {
                // Skip dead links
            }
        }));

        const stream = new SitemapStream({ hostname: baseUrl });
        discoveredLinks.forEach(l => stream.write({ url: l, changefreq: 'weekly', priority: 0.6 }));
        stream.end();

        const sitemap = await streamToPromise(stream);

        return new NextResponse(sitemap.toString(), {
            headers: {
                'Content-Type': 'application/xml',
                'Content-Disposition': 'attachment; filename="sitemap.xml"',
            },
        });
    } catch (error) {
        console.error('Sitemap Error:', error);
        return NextResponse.json({ error: 'Failed to generate sitemap. Ensure the URL is accessible.' }, { status: 500 });
    }
}
