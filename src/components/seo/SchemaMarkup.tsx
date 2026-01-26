'use client';

import { useEffect } from 'react';

interface OrganizationSchema {
  '@type': 'Organization';
  name: string;
  url: string;
  logo?: string;
  contactPoint?: {
    '@type': 'ContactPoint';
    telephone: string;
    contactType: string;
  };
}

interface WebSiteSchema {
  '@type': 'WebSite';
  name: string;
  url: string;
  potentialAction: {
    '@type': 'SearchAction';
    target: string;
    'query-input': string;
  };
}

interface BreadcrumbListSchema {
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string;
  }>;
}

interface FAQPageSchema {
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
}

interface WebPageSchema {
  '@type': 'WebPage';
  name: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
}

interface ToolSchema {
  '@type': 'SoftwareApplication' | 'WebApplication';
  name: string;
  description: string;
  url: string;
  applicationCategory: string;
  operatingSystem: string;
  offers: {
    '@type': 'Offer';
    price: string;
  };
}

interface SDOrganizationProps {
  name: string;
  url: string;
  logo?: string;
  contactNumber?: string;
}

interface SDWebSiteProps {
  name: string;
  url: string;
  searchUrl: string;
}

interface SDBreadcrumbProps {
  breadcrumbs: Array<{
    name: string;
    url?: string;
    position: number;
  }>;
}

interface SDFAQProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

interface SDWebPageProps {
  name: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
}

interface SDToolProps {
  name: string;
  description: string;
  url: string;
  category: string;
}

export const SchemaOrganization = ({ name, url, logo, contactNumber }: SDOrganizationProps) => {
  useEffect(() => {
    const schema: OrganizationSchema = {
      '@type': 'Organization',
      name,
      url,
      ...(logo && { logo }),
      ...(contactNumber && {
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: contactNumber,
          contactType: 'customer service'
        }
      })
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [name, url, logo, contactNumber]);

  return null;
};

export const SchemaWebSite = ({ name, url, searchUrl }: SDWebSiteProps) => {
  useEffect(() => {
    const schema: WebSiteSchema = {
      '@type': 'WebSite',
      name,
      url,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${searchUrl}{search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [name, url, searchUrl]);

  return null;
};

export const SchemaBreadcrumb = ({ breadcrumbs }: SDBreadcrumbProps) => {
  useEffect(() => {
    const schema: BreadcrumbListSchema = {
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map(breadcrumb => ({
        '@type': 'ListItem',
        position: breadcrumb.position,
        name: breadcrumb.name,
        ...(breadcrumb.url && { item: `${window.location.origin}${breadcrumb.url}` })
      }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [breadcrumbs]);

  return null;
};

export const SchemaFAQ = ({ faqs }: SDFAQProps) => {
  useEffect(() => {
    const schema: FAQPageSchema = {
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [faqs]);

  return null;
};

export const SchemaWebPage = ({ name, description, url, datePublished, dateModified }: SDWebPageProps) => {
  useEffect(() => {
    const schema: WebPageSchema = {
      '@type': 'WebPage',
      name,
      description,
      url,
      ...(datePublished && { datePublished }),
      ...(dateModified && { dateModified })
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [name, description, url, datePublished, dateModified]);

  return null;
};

export const SchemaTool = ({ name, description, url, category }: SDToolProps) => {
  useEffect(() => {
    const schema: ToolSchema = {
      '@type': 'WebApplication',
      name,
      description,
      url,
      applicationCategory: category,
      operatingSystem: 'Any',
      offers: {
        '@type': 'Offer',
        price: '0'
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [name, description, url, category]);

  return null;
};