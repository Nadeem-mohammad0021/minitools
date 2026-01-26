'use client';

import React from 'react';
import Link from 'next/link';

interface ToolCardProps {
  title: string;
  description: string;
  icon?: string;
  category?: string;
  href: string;
  featured?: boolean;
  popular?: boolean;
  isNew?: boolean;
  className?: string;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  title,
  description,
  icon,
  category,
  href,
  featured,
  popular,
  isNew,
  className = ''
}) => {
  // Suppress hydration warnings for browser extension interference
  React.useEffect(() => {
    // Clean up any fdprocessedid attributes added by browser extensions
    const cleanupExtensionAttributes = () => {
      document.querySelectorAll('[fdprocessedid]').forEach(el => {
        el.removeAttribute('fdprocessedid');
      });
    };
    
    // Run cleanup after hydration
    if (typeof window !== 'undefined') {
      setTimeout(cleanupExtensionAttributes, 100);
    }
    
    return cleanupExtensionAttributes;
  }, []);
  return (
    <Link
      href={href}
      aria-label={`Use ${title}`}
      className={`group relative block rounded-2xl transition-all duration-500 overflow-hidden ${className}`}
    >
      {/* Background with Glass Effect */}
      <div className="absolute inset-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all duration-300 group-hover:border-indigo-500/30 dark:group-hover:border-indigo-400/30 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)] rounded-2xl" />

      {/* Content */}
      <div className="relative p-6 h-full flex flex-col z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            {/* Icon Box */}
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm group-hover:shadow-indigo-500/20">
              {icon}
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {title}
              </h3>
              {category && (
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mt-1 tracking-wide uppercase">
                  {category}
                </span>
              )}
            </div>
          </div>

          {/* Badges */}
          <div className="flex gap-2 flex-shrink-0">
            {featured && (
              <span className="px-2.5 py-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-[10px] uppercase font-bold tracking-wider rounded-full shadow-sm">
                Star
              </span>
            )}
            {popular && (
              <span className="px-2.5 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-[10px] uppercase font-bold tracking-wider rounded-full shadow-sm">
                Hot
              </span>
            )}
            {isNew && (
              <span className="px-2.5 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] uppercase font-bold tracking-wider rounded-full shadow-sm animate-pulse">
                New
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2 leading-relaxed mb-6 flex-grow group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">
          {description}
        </p>

        {/* Action button */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
            Try now
          </span>
          <div className="flex items-center text-indigo-600 dark:text-indigo-400 group/btn">
            <span className="text-sm font-semibold mr-2 transition-transform duration-300 group-hover/btn:translate-x-1">
              Launch Tool
            </span>
            <div className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14m-7-7l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

interface CategoryCardProps {
  name: string;
  description: string;
  icon: string;
  toolCount: number;
  href: string;
  color?: string;
  className?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  description,
  icon,
  toolCount,
  href,
  className = ''
}) => {
  // Suppress hydration warnings for browser extension interference
  React.useEffect(() => {
    // Clean up any fdprocessedid attributes added by browser extensions
    const cleanupExtensionAttributes = () => {
      document.querySelectorAll('[fdprocessedid]').forEach(el => {
        el.removeAttribute('fdprocessedid');
      });
    };
    
    // Run cleanup after hydration
    if (typeof window !== 'undefined') {
      setTimeout(cleanupExtensionAttributes, 100);
    }
    
    return cleanupExtensionAttributes;
  }, []);
  return (
    <Link
      href={href}
      aria-label={`Explore ${name} tools`}
      className={`group relative block rounded-2xl transition-all duration-500 overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all duration-300 group-hover:border-indigo-500/30 dark:group-hover:border-indigo-400/30 group-hover:shadow-lg dark:group-hover:shadow-indigo-900/10 rounded-2xl" />

      <div className="relative p-6 pt-8 z-10 h-full flex flex-col">
        {/* Icon Background Blob */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-bl-full -mr-4 -mt-4 transition-transform duration-500 group-hover:scale-110" />

        <div className="mb-6 relative">
          <div className="text-5xl mb-4 transform transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 origin-left">
            {icon}
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {name}
          </h3>
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {toolCount} Tools
          </div>
        </div>

        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">
          {description}
        </p>

        <div className="mt-auto flex items-center text-indigo-600 dark:text-indigo-400 font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300">
          Explore Category
          <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
};