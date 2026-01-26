'use client';

import React, { useState } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = 'Search tools...',
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
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(value);
  };

  const clearInput = () => {
    onChange('');
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative z-20">
        <div className="relative group">
          {/* Search icon */}
          <div className="absolute left-5 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
            <svg
              className={`w-6 h-6 transition-colors duration-300 ${isFocused ? 'text-indigo-500' : 'text-slate-400'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Input */}
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className={`w-full pl-14 pr-14 py-4 md:py-5 rounded-2xl border transition-all duration-300 shadow-sm ${isFocused
              ? 'border-indigo-500 ring-4 ring-indigo-500/10 shadow-xl shadow-indigo-500/10 bg-white dark:bg-slate-800'
              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700'
              } text-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none`}
          />

          {/* Clear button */}
          {value && (
            <button
              type="button"
              onClick={clearInput}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Search Button (Mobile) */}
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 md:hidden p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 active:scale-95 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

interface FilterChipsProps {
  filters: string[];
  onFilterChange: (filters: string[]) => void;
  availableFilters: string[];
  className?: string;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  filters,
  onFilterChange,
  availableFilters,
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
  const toggleFilter = (filter: string) => {
    if (filters.includes(filter)) {
      onFilterChange(filters.filter(f => f !== filter));
    } else {
      onFilterChange([...filters, filter]);
    }
  };

  const clearAllFilters = () => {
    onFilterChange([]);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by tags:</h4>
        {filters.length > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {availableFilters.map(filter => {
          const isActive = filters.includes(filter);
          return (
            <button
              key={filter}
              onClick={() => toggleFilter(filter)}
              className={`px-3 py-1 text-sm rounded-full transition-all duration-200 transform hover:scale-105 ${isActive
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                }`}
            >
              <span className="flex items-center gap-1">
                {filter}
                {isActive && (
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};