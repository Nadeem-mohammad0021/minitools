'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { searchTerm, setSearchTerm, allCategories } = useApp();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    ...allCategories.slice(0, 4).map(category => ({
      name: category.name,
      href: `/category/${category.id}`
    })),
    { name: 'All Tools', href: '/tools' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-4 md:px-8 py-4 ${scrolled ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm shadow-slate-200/30 dark:shadow-slate-900/20' : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center space-x-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <img src="/logos/logo.png" alt="MiniTools Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
                MiniTools
              </span>
              <div className="flex items-baseline gap-0.5">
                <span className="font-bold italic text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-tight">
                  BY
                </span>
                <span className="font-bold italic text-brand-kynex-text dark:text-brand-kynex-text text-[10px] tracking-tight">
                  KYNEX
                </span>
                <span className="font-bold italic text-slate-500 dark:text-slate-400 text-[10px]">
                  .dev
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 bg-white/70 dark:bg-slate-800/70 p-1 rounded-full border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm shadow-sm shadow-slate-200/30 dark:shadow-slate-900/20">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/30 transform scale-105'
                    : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700/50 hover:scale-105'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Search & Mobile Toggle */}
          <div className="flex items-center space-x-4">
            <div className="hidden lg:block relative group">
              <form onSubmit={(e) => { e.preventDefault(); router.push(`/search?q=${encodeURIComponent(searchTerm)}`); }}>
                <input
                  type="text"
                  placeholder="Search tools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 rounded-full text-sm w-48 focus:w-72 transition-all duration-500 outline-none shadow-sm hover:shadow-md"
                />
                <svg className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </form>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:scale-105 transition-all shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-700"
            >
              <div className="w-6 h-5 relative flex flex-col justify-between">
                <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${isOpen ? 'opacity-0 scale-x-0' : 'opacity-100'}`} />
                <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Sidebar/Menu */}
        <div
          className={`fixed inset-0 top-[73px] z-40 md:hidden transition-all duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
        >
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          <div className={`absolute right-4 left-4 mt-2 p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl transition-all duration-500 ${isOpen ? 'translate-y-0 scale-100 opacity-100' : '-translate-y-4 scale-95 opacity-0'
            }`}>
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-2xl text-base font-semibold transition-all ${pathname === link.href
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 transform scale-105'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-105'
                    }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700">
                <form onSubmit={(e) => { e.preventDefault(); router.push(`/search?q=${encodeURIComponent(searchTerm)}`); setIsOpen(false); }}>
                  <input
                    type="text"
                    placeholder="Search all tools..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-4 pr-4 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl text-base focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 dark:focus:border-indigo-400 border border-slate-200 dark:border-slate-700 outline-none transition-all shadow-sm"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Spacer */}
    </>
  );
};

export default Navbar;
