// ✅ Server component version — no "use client"

export function SchemaMarkup() {
  const schemaData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "KYNEX.dev",
      url: "https://kynex.dev",
      logo: "https://kynex.dev/favicon-512x512.png",
      sameAs: [
        "https://www.linkedin.com/company/kynex-dev/",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        email: "contact@kynex.dev",
        contactType: "customer support"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "MiniTools by KYNEX.dev - Professional Online Utilities",
      url: "https://minitools.kynex.dev",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://minitools.kynex.dev/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "MiniTools by KYNEX.dev - Professional Online Utilities",
      description: "Professional online utilities for PDF, images, SEO, and development tools. Free, private, and browser-based processing with no registration required.",
      url: "https://minitools.kynex.dev"
    }
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}

export default SchemaMarkup;