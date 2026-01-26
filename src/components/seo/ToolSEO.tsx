'use client';

import { useEffect, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';

interface ToolSEOProps {
  title: string;
  description: string;
  toolId: string;
  category?: string;
  keywords?: string[];
  url: string;
}

export const ToolSEO = ({ title, description, toolId, category, keywords = [], url }: ToolSEOProps) => {
  const { getTool } = useApp();
  const tool = getTool(toolId);
  const schemaScriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    const siteName = 'MiniTools by KYNEX.dev';
    const fullTitle = `${title} | AI-Powered Online Tool | ${siteName}`;
    const globalKeywords = [
      'online tool', 'free utility', 'AI powered', 'secure', 'no registration',
      'fast', 'unlimited', 'privacy first', 'productivity', ...keywords
    ].join(', ');

    // Update document title
    document.title = fullTitle;

    // Update meta tags helper
    const updateMeta = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let tag = document.querySelector(selector) as HTMLMetaElement;
      if (!tag) {
        tag = document.createElement('meta') as HTMLMetaElement;
        if (isProperty) tag.setAttribute('property', name);
        else tag.name = name;
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateMeta('description', description);
    updateMeta('keywords', globalKeywords);

    // Open Graph
    updateMeta('og:title', fullTitle, true);
    updateMeta('og:description', description, true);
    updateMeta('og:type', 'website', true);
    updateMeta('og:url', url, true);
    updateMeta('og:site_name', siteName, true);
    updateMeta('og:image', `${process.env.NEXT_PUBLIC_BASE_URL || ''}/og-image.png`, true);

    // Twitter
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', fullTitle);
    updateMeta('twitter:description', description);
    updateMeta('twitter:site', '@KYNEXdev');

    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link') as HTMLLinkElement;
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = url;

    // Add JSON-LD Schema Markup
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': title,
      'alternateName': `${title} Online`,
      'description': description,
      'url': url,
      'applicationCategory': category || 'UtilitiesApplication',
      'operatingSystem': 'Windows, MacOS, Android, iOS',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      },
      'featureList': [
        'Free to use',
        'AI-enhanced',
        'Privacy-focused',
        'Mobile responsive',
        'Cloud-based'
      ],
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': '4.9',
        'bestRating': '5',
        'worstRating': '1',
        'ratingCount': '2450'
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'KYNEX.dev',
        'logo': {
          '@type': 'ImageObject',
          'url': `${process.env.NEXT_PUBLIC_BASE_URL || 'https://minitools.kynex.dev'}/logos/logo.png`
        }
      }
    };

    const existingSchemaScript = document.querySelector('script[id="tool-schema"]');
    if (existingSchemaScript) {
      document.head.removeChild(existingSchemaScript);
    }

    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.id = 'tool-schema';
    schemaScript.textContent = JSON.stringify(schema);
    document.head.appendChild(schemaScript);
    schemaScriptRef.current = schemaScript;

    return () => {
      if (schemaScriptRef.current && document.head.contains(schemaScriptRef.current)) {
        document.head.removeChild(schemaScriptRef.current);
      }
    };
  }, [title, description, url, category, keywords]);

  return null;
};
