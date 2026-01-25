'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { ToolCard } from '@/components/ui/ToolCard';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterChips } from '@/components/ui/SearchBar';

const ToolsPage = () => {
  const {
    allTools,
    allCategories,
    searchTerm,
    setSearchTerm,
    filteredTools,
    popularTools
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get all available tags
  const allTags = Array.from(new Set(allTools.flatMap(tool => tool.tags || []))).sort();

  // Apply filters
  const getFilteredTools = () => {
    let tools = filteredTools;

    if (selectedCategory) {
      tools = tools.filter(tool => tool.category === selectedCategory);
    }

    if (selectedTags.length > 0) {
      tools = tools.filter(tool =>
        selectedTags.some(tag => tool.tags?.includes(tag))
      );
    }

    return tools;
  };

  const filteredToolsWithFilters = getFilteredTools();

  return (
    <div className="min-h-[calc(100vh-theme(spacing.24))] relative overflow-hidden py-12">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300/10 dark:bg-purple-900/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen animate-blob" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-300/10 dark:bg-indigo-900/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 font-heading">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-800 to-slate-900 dark:from-white dark:via-indigo-300 dark:to-white">
              Discover All Tools
            </span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Every utility you need in one place. Pro-grade, fast, and completely free to use.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12 space-y-10">
          <div className="max-w-3xl mx-auto scale-105">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search through all our tools..."
              className="shadow-2xl shadow-indigo-500/10 dark:shadow-indigo-900/20"
            />
          </div>

          {/* Category Filter */}
          <div className="glass shadow-sm rounded-2xl p-2 flex flex-wrap justify-center gap-2 max-w-5xl mx-auto border border-white/20 dark:border-slate-800/20">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 ${selectedCategory === ''
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
            >
              All Categories
            </button>
            {allCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${selectedCategory === category.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
              >
                <span className="text-xl">{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          {/* Tag Filter */}
          {allTags.length > 0 && (
            <div className="max-w-4xl mx-auto bg-slate-50/50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-widest text-center">Filter by tags</h3>
              <FilterChips
                filters={selectedTags}
                onFilterChange={setSelectedTags}
                availableFilters={allTags}
              />
            </div>
          )}
        </div>

        {/* Results Count & Tools Grid */}
        <div className="mb-10 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Available Tools
            <span className="ml-3 text-sm font-medium px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full">
              {filteredToolsWithFilters.length} found
            </span>
          </h2>
        </div>

        {filteredToolsWithFilters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredToolsWithFilters.map((tool) => (
              <ToolCard
                key={tool.id}
                title={tool.name}
                description={tool.description}
                icon={tool.icon}
                category={allCategories.find(c => c.id === tool.category)?.name}
                href={tool.path || `/tools/${tool.id.replace(/-/g, '')}`}
                popular={tool.popular}
                featured={tool.featured}
                isNew={tool.new}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            <div className="text-6xl mb-6 opacity-40">🔎</div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              No tools matched your criteria
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
              Try adjusting your search terms or filters to find exactly what you&apos;re looking for.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setSelectedTags([]);
              }}
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
            >
              Reset all filters
            </button>
          </div>
        )}

        {/* Popular Tools (when no search/filter active) */}
        {!searchTerm && !selectedCategory && selectedTags.length === 0 && (
          <div className="mt-24 pt-16 border-t border-slate-100 dark:border-slate-900">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Editor&apos;s Choice</h2>
                <p className="text-slate-500 dark:text-slate-400">Our most popular and newly released features</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularTools.slice(0, 8).map((tool) => (
                <ToolCard
                  key={tool.id}
                  title={tool.name}
                  description={tool.description}
                  icon={tool.icon}
                  category={allCategories.find(c => c.id === tool.category)?.name}
                  href={tool.path || `/tools/${tool.id.replace(/-/g, '')}`}
                  popular={tool.popular}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolsPage;