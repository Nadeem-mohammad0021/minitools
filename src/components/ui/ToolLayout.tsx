'use client';

import React, { ReactNode, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { ToolSEO } from '@/components/seo/ToolSEO';
import { AdUnit } from '@/components/ads/AdUnit';

interface ToolLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  toolId: string;
  className?: string;
  category?: string;
  fullWidth?: boolean;
  hideFavorites?: boolean;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({
  title,
  description,
  children,
  toolId,
  className = '',
  category,
  fullWidth = false,
  hideFavorites = false
}) => {
  const { addToRecent, isFavorite, toggleFavorite } = useApp();

  useEffect(() => {
    addToRecent(toolId);
  }, [toolId, addToRecent]);

  const favorite = isFavorite(toolId);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-6 sm:py-10 px-2 sm:px-6 transition-all duration-500 ${className}`}>
      <ToolSEO
        title={title}
        description={description}
        toolId={toolId}
        category={category}
        url={typeof window !== 'undefined' ? window.location.href : ''}
      />
      <div className={`${fullWidth ? 'max-w-none px-0' : 'max-w-6xl px-2 sm:px-6'} mx-auto`}>
        {/* Enhanced Header with Better Visual Hierarchy */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8 sm:mb-12 px-2 sm:px-0 fade-in-up">
          <div className="flex-1">
            {category && (
              <span className="inline-flex items-center px-3 py-1.5 text-[11px] sm:text-xs font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase bg-indigo-50 dark:bg-indigo-900/20 rounded-full border border-indigo-100 dark:border-indigo-800/30 shadow-sm hover:shadow-md transition-all duration-300">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2 animate-pulse"></span>
                {category}
              </span>
            )}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-3 sm:mb-4 tracking-tight leading-tight">
              {title}
            </h1>
            <p className="text-sm sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
              {description}
            </p>
          </div>

          {!hideFavorites && (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => toggleFavorite(toolId)}
                className={`flex items-center justify-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 border min-h-[44px] sm:min-h-[48px] w-fit shadow-sm hover:shadow-md ${favorite
                  ? 'bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-700 border-yellow-200 dark:from-yellow-900/30 dark:to-amber-900/30 dark:text-yellow-400 dark:border-yellow-800/50 hover:scale-105 hover:shadow-lg'
                  : 'bg-white text-slate-600 hover:text-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-slate-100 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:scale-105 hover:shadow-lg'
                  }`}
              >
                <svg
                  className={`w-4.5 h-4.5 sm:w-5 sm:h-5 transition-all duration-300 ${favorite ? 'text-yellow-500' : 'text-slate-400'}`}
                  fill={favorite ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
                <span className="hidden sm:block">{favorite ? 'Favorited' : 'Add to Favorites'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Enhanced Action Card Container with Better Visual Design */}
        <div className={`${fullWidth ? 'rounded-none border-x-0 border-b-0 -mx-4 md:-mx-6' : 'rounded-3xl sm:rounded-[40px] border shadow-2xl shadow-slate-200/20 dark:shadow-slate-900/30'} bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 overflow-hidden animate-fade-in-up`}>
          <div className={`${fullWidth ? 'p-0' : 'p-4 sm:p-8 md:p-10 lg:p-14'}`}>
            {children}

            {/* Ad Unit at the bottom of the content */}
            <div className={`mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 ${fullWidth ? 'px-4 md:px-8' : ''}`}>
              <AdUnit />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};