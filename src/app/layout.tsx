import './globals.css';
import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/footer';
import { AppProvider } from '@/contexts/AppContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'MiniTools - Premium Utility Platform',
  description: 'Pro-grade online tools for PDF, images, text, development, SEO and more. Beautiful, fast, and free.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
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
    </html>
  );
}