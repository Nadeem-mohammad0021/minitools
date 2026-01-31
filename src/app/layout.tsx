import './globals.css';
import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/footer';
import { AppProvider } from '@/contexts/AppContext';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';


const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: {
    template: '%s | MiniTools by KYNEX.dev',
    default: 'MiniTools by KYNEX.dev - AI-Powered Pro Utilities 2026',
  },
  description: 'Instant, pro-grade AI-powered online tools for PDF, images, SEO, and development. Secure, browser-based, and 100% free for everyone.',
  metadataBase: new URL('https://minitools.kynex.dev'),
  keywords: [
    'AI online tools', 'free PDF utilities', 'secure image converter',
    'bulk file processing', 'private developer tools', 'SEO analyzer 2026',
    'instant productivity tools', 'no-upload file tools', 'KYNEX dev platform'
  ],
  icons: {
    icon: '/logos/favicon.ico',
    shortcut: '/logos/favicon-16x16.png',
    apple: '/logos/apple-touch-icon.png',
  },
  openGraph: {
    title: 'MiniTools by KYNEX.dev - AI-Powered Pro Utilities 2026',
    description: 'Instant, pro-grade AI-powered online tools for PDF, images, SEO, and development. Secure and browser-based.',
    type: 'website',
    url: 'https://minitools.kynex.dev',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MiniTools by KYNEX.dev - AI-Powered Pro Utilities 2026',
    description: 'Instant, pro-grade AI-powered online tools for PDF, images, SEO, and development.',
  },
  alternates: {
    canonical: 'https://minitools.kynex.dev',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8057450154530877"
          crossOrigin="anonymous"
        ></script>

        <link rel="apple-touch-icon" sizes="180x180" href="/logos/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/logos/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/logos/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/logos/favicon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/logos/favicon-512x512.png" />
        <link rel="icon" type="image/x-icon" href="/logos/favicon.ico" />

        <SchemaMarkup />
      </head>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300`}>
        <a href="#main-content" className="sr-only focus:not-sr-only absolute top-2 left-2 z-[100] bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 px-3 py-2 rounded-md shadow-sm">Skip to main content</a>
        <AppProvider>
          <div className="flex flex-col min-h-screen relative overflow-x-hidden">
            {/* Background Gradients */}
            <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/50 via-white to-white dark:from-indigo-950/30 dark:via-slate-950 dark:to-slate-950 pointer-events-none" />

            <Navbar />
            <main id="main-content" className="flex-grow pt-24 pb-16">
              <div className="mx-auto px-4">
                {children}
              </div>
            </main>
            <Footer />
          </div>
        </AppProvider>
      </body>
    </html >
  );
}