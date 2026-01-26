'use client';

import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';

const Footer = () => {
  const { allCategories, popularTools } = useApp();
  return (
    <footer className="bg-gradient-to-t from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-950 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 flex items-center justify-center">
              <img src="/logos/logo.png" alt="MiniTools Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                MiniTools
              </span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Your all-in-one platform for professional grade online utilities. Free, fast, and secure.
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              by <a href="https://kynex.dev/" className="font-bold italic text-slate-700 dark:text-slate-300 tracking-tight">KYNEX</a><span className="font-bold italic text-slate-500 dark:text-slate-400">.dev</span>
            </p>
            <p className="text-slate-400 text-xs mt-2">
              <a href="https://kynex.dev" target="_blank" rel="noopener noreferrer" className="hover:underline">Admin Dashboard</a>
            </p>
            <div className="flex space-x-4">
              {/* Social placeholders could go here */}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6">Categories</h4>
            <ul className="space-y-3">
              {allCategories.slice(0, 6).map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/category/${category.id}`}
                    className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6">Popular Tools</h4>
            <ul className="space-y-3">
              {popularTools.slice(0, 4).map((tool) => (
                <li key={tool.id}>
                  <Link
                    href={`/tools/${tool.id}`}
                    className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6">Company</h4>
            <ul className="space-y-3">
              {['About Us', 'Privacy Policy', 'Terms of Service', 'Contact'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase().replace(/ /g, '-')}`}
                    className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} MiniTools by KYNEX.dev. All rights reserved.</p>
          <p>Made with ❤️ for the community</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;