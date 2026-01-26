import { Metadata } from 'next';
import { TOOLS } from '@/lib/registry/tools';

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const toolId = 'date-difference-calculator';
  const tool = TOOLS.find(t => t.id === toolId || t.path.includes(toolId));
  
  const title = tool ? tool.name : 'Date Difference Calculator';
  const description = tool ? tool.description : 'Free online Date Difference Calculator tool. Fast, secure, and easy to use.';
  
  const siteName = 'MiniTools by KYNEX.dev';
  const fullTitle = `${title} | Online & AI-Powered | ${siteName}`;

  return {
    title: fullTitle,
    description: description,
    alternates: {
      canonical: `https://minitools.kynex.dev/tools/${toolId}`,
    },
    openGraph: {
      title: fullTitle,
      description: description,
      url: `https://minitools.kynex.dev/tools/${toolId}`,
      siteName: siteName,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: description,
    }
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
