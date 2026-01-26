import { NextRequest } from 'next/server';
import { ToolRegistry } from '@/lib/registry/tools';

export async function GET(request: NextRequest) {
  try {
    const registry = ToolRegistry.getInstance();
    const tools = registry.getAllTools();
    const categories = registry.getAllCategories();

    // Base URL from environment or default
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://minitools.kynex.dev';

    // Generate sitemap XML
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n';

    // Add homepage
    sitemap += `  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>\n`;

    // Add category pages
    categories.forEach(category => {
      sitemap += `  <url>
    <loc>${baseUrl}/category/${category.id}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>\n`;
    });

    // Add all tool pages
    tools.forEach(tool => {
      sitemap += `  <url>
    <loc>${baseUrl}/tools/${tool.id}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
    });

    sitemap += '</urlset>';

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
      },
    });
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
}