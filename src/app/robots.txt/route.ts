import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://minitools.kynex.dev';

  let robots = 'User-agent: *\n';
  robots += 'Allow: /\n';
  robots += 'Disallow: /api/\n';
  robots += 'Disallow: /search\n';
  robots += 'Disallow: /admin\n\n';

  // Sitemap location
  robots += `Sitemap: ${baseUrl}/sitemap.xml\n`;

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
    },
  });
}