/**
 * SEO Engine - Server-side operations mostly
 * URL Shortener, Sitemap, Robots
 */

// We'll import Redis conditionally or use a specific connection file
// import { redis } from '@/lib/utils/redis'; 
// Note: We can't use node modules in client components, so this engine 
// will mostly be used by API routes / Server Actions.

export function generateRobotsTxt(allow: boolean = true): string {
    if (allow) {
        return `User-agent: *\nAllow: /`;
    } else {
        return `User-agent: *\nDisallow: /`;
    }
}

export function generateXmlSitemap(urls: string[]): string {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(url => `
  <url>
    <loc>${baseUrl}${url.startsWith('/') ? url : '/' + url}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`;

    return xml.trim();
}
