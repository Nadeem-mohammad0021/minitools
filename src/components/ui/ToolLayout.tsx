'use client';

import React, { ReactNode, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { ToolSEO } from '@/components/seo/ToolSEO';

interface ToolLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  toolId: string;
  className?: string;
  category?: string;
  fullWidth?: boolean;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({
  title,
  description,
  children,
  toolId,
  className = '',
  category,
  fullWidth = false
}) => {
  const { addToRecent, isFavorite, toggleFavorite } = useApp();

  useEffect(() => {
    addToRecent(toolId);
  }, [toolId, addToRecent]);

  const favorite = isFavorite(toolId);

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 py-4 sm:py-8 px-2 sm:px-4 transition-colors duration-300 ${className}`}>
      <ToolSEO
        title={title}
        description={description}
        toolId={toolId}
        category={category}
        url={typeof window !== 'undefined' ? window.location.href : ''}
      />
      <div className={`${fullWidth ? 'max-w-none px-0' : 'max-w-5xl px-1 sm:px-4'} mx-auto`}>
        {/* Simple & Clean Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4 sm:mb-8 px-2 sm:px-0">
          <div className="flex-1">
            {category && (
              <span className="inline-block px-3 py-1 mb-2 text-[10px] sm:text-xs font-bold tracking-wider text-indigo-500 uppercase bg-indigo-50 dark:bg-indigo-900/20 rounded-full">
                {category}
              </span>
            )}
            <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-1 sm:mb-2 tracking-tight">
              {title}
            </h1>
            <p className="text-xs sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              {description}
            </p>
          </div>

          <button
            onClick={() => toggleFavorite(toolId)}
            className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 border min-h-[40px] sm:min-h-[40px] w-fit ${favorite
              ? 'bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800/50'
              : 'bg-white text-slate-500 hover:text-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-slate-200 border-slate-200 dark:border-slate-800 shadow-sm'
              }`}
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-active:scale-95"
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

        {/* Action Card Container */}
        <div className={`${fullWidth ? 'rounded-none border-x-0 border-b-0 -mx-4 md:-mx-4' : 'rounded-[20px] sm:rounded-[32px] border shadow-lg shadow-slate-200/5 dark:shadow-none'} bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 overflow-hidden animate-fade-in`}>
          <div className={`${fullWidth ? 'p-0' : 'p-3 sm:p-6 md:p-8 lg:p-12'}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};