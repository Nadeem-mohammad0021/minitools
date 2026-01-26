'use client';

import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { ToolCard } from '@/components/ui/ToolCard';
import { SearchBar } from '@/components/ui/SearchBar';

interface CategoryPageProps {
  categoryId: string;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ categoryId }) => {
  const { getToolsByCategory, allCategories, searchTerm, setSearchTerm } = useApp();
  
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

  const category = allCategories.find(c => c.id === categoryId);
  const tools = getToolsByCategory(categoryId);

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
          <p className="text-gray-600 mb-8">The category you&apos;re looking for doesn&apos;t exist.</p>
          <a href="/tools" className="text-blue-600 hover:underline">Browse all tools</a>
        </div>
      </div>
    );
  }

  // Filter tools based on search
  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-theme(spacing.24))] relative overflow-hidden py-12">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-purple-300/10 dark:bg-purple-900/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen animate-blob" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-indigo-300/10 dark:bg-indigo-900/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-slate-200/50 dark:border-slate-800/50 mb-8 shadow-sm">
            <span className="text-6xl mr-6">{category.icon}</span>
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-800 to-slate-900 dark:from-white dark:via-indigo-300 dark:to-white">
                  {category.name}
                </span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                {tools.length} Tools in this category
              </p>
            </div>
          </div>

          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            {category.description}
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto scale-110">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder={`Search ${category.name.toLowerCase()}...`}
              className="shadow-2xl shadow-indigo-500/10 dark:shadow-indigo-900/20"
            />
          </div>
        </div>

        {/* Results Info */}
        {searchTerm && (
          <div className="mb-8 flex justify-center">
            <div className="px-4 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-semibold">
              Found {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'} for &quot;{searchTerm}&quot;
            </div>
          </div>
        )}

        {/* Tools Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTools.map((tool) => (
              <ToolCard
                key={tool.id}
                title={tool.name}
                description={tool.description}
                icon={tool.icon}
                category={category.name}
                href={tool.path || `/tools/${tool.id.replace(/-/g, '')}`}
                popular={tool.popular}
                featured={tool.featured}
                isNew={tool.new}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            <div className="text-6xl mb-6 opacity-40">🔍</div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              {searchTerm ? 'No tools found' : 'No tools available yet'}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
              {searchTerm
                ? `We couldn't find anything matching "${searchTerm}" in the ${category.name.toLowerCase()} category.`
                : `We're currently expanding our ${category.name.toLowerCase()} collection. Check back soon!`
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all font-bold"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};