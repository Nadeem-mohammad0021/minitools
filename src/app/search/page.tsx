'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { ToolCard } from '@/components/ui/ToolCard';
import { LoadingState } from '@/components/ui/States';
import { SearchBar } from '@/components/ui/SearchBar';
import { motion, AnimatePresence } from 'framer-motion';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const { allTools, allCategories } = useApp();
  const query = searchParams.get('q') || '';
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'name'>('relevance');

  const filteredTools = useMemo(() => {
    let tools = allTools.filter(tool =>
      tool.name.toLowerCase().includes(query.toLowerCase()) ||
      tool.description.toLowerCase().includes(query.toLowerCase()) ||
      tool.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );

    if (activeCategory !== 'all') {
      tools = tools.filter(tool => tool.category === activeCategory);
    }

    return [...tools].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);

      // Relevance logic
      const aNameMatch = a.name.toLowerCase().includes(query.toLowerCase()) ? 2 : 0;
      const bNameMatch = b.name.toLowerCase().includes(query.toLowerCase()) ? 2 : 0;
      return bNameMatch - aNameMatch;
    });
  }, [allTools, query, activeCategory, sortBy]);

  return (
    <div className="min-h-[calc(100vh-theme(spacing.24))] relative py-16 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Search Header */}
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 dark:from-white dark:via-indigo-200 dark:to-white"
          >
            Search Results
          </motion.h1>

          <div className="relative group max-w-2xl mx-auto">
            <SearchBar
              value={query}
              onChange={() => { }}
              placeholder="Refine your search..."
              className="shadow-2xl shadow-indigo-500/10 ring-1 ring-slate-200 dark:ring-slate-800"
            />
            <div className="absolute -bottom-10 left-0 right-0 flex justify-center gap-2 text-sm">
              <span className="text-slate-500">Found {filteredTools.length} tools for</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">"{query}"</span>
            </div>
          </div>
        </div>

        {/* Filters & Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-6 rounded-[2rem] border border-white/20 shadow-sm transition-all hover:shadow-md">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${activeCategory === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-lg'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                }`}
            >
              All Categories
            </button>
            {Object.values(allCategories).map((cat: any) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                  }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white dark:bg-slate-800 border-none rounded-xl text-sm font-bold px-4 py-2 outline-none ring-1 ring-slate-200 dark:ring-slate-800 focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
            >
              <option value="relevance">By Relevance</option>
              <option value="name">By Name</option>
            </select>
          </div>
        </div>

        {/* Results Grid */}
        <AnimatePresence mode="popLayout">
          {filteredTools.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredTools.map((tool) => (
                <motion.div
                  key={tool.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <ToolCard
                    title={tool.name}
                    description={tool.description}
                    icon={tool.icon}
                    category={allCategories.find((c: any) => c.id === tool.category)?.name}
                    href={tool.path || `/tools/${tool.id.replace(/-/g, '')}`}
                    popular={tool.popular}
                    featured={tool.featured}
                    isNew={tool.new}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32 bg-slate-50/50 dark:bg-slate-900/50 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800"
            >
              <div className="text-8xl mb-8 grayscale opacity-50">🔍</div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">No utilities found</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-10 text-lg">
                We couldn't find any tools matching your search. Try different keywords or browse all categories.
              </p>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  // Since we can't easily clear the URL param without useRouter, let's keep it simple
                  window.location.href = '/tools';
                }}
                className="px-10 py-4 bg-indigo-600 dark:bg-indigo-500 text-white rounded-2xl font-black hover:scale-105 transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
              >
                Browse All 86 Tools
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const SearchResultsPage = () => {
  return (
    <Suspense fallback={<LoadingState message="Scanning utilities..." />}>
      <SearchResultsContent />
    </Suspense>
  );
};

export default SearchResultsPage;