'use client';

import { useApp } from '@/contexts/AppContext';
import { CategoryCard, ToolCard } from '@/components/ui/ToolCard';
import { SearchBar } from '@/components/ui/SearchBar';
import { ToolSEO } from '@/components/seo/ToolSEO';

const HomePage = () => {
  const {
    allCategories,
    popularTools,
    searchTerm,
    setSearchTerm,
    filteredTools
  } = useApp();

  return (
    <>

      <div className="min-h-[calc(100vh-theme(spacing.24))]">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300/20 dark:bg-purple-900/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen animate-blob" />
            <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-300/20 dark:bg-indigo-900/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000" />
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-72 h-72 bg-blue-300/20 dark:bg-blue-900/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000" />
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-white/5 border border-white/20 backdrop-blur-sm mb-8 animate-fade-in shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">v1.0 Now Available</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-800 to-slate-900 dark:from-white dark:via-indigo-300 dark:to-white">
                Professional Tools for
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                Everyday Tasks
              </span>
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
              A curated collection of premium online utilities. Convert PDFs, edit images, and process text instantly. No ads, no limits, no registration.
            </p>

            <div className="max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search for 'PDF Split'"
                className="shadow-2xl shadow-indigo-500/10 dark:shadow-indigo-900/20"
              />
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        {searchTerm ? (
          /* Search Results */
          <section className="py-12 animate-fade-in">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Search Results
                  <span className="ml-3 text-sm font-medium px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500">
                    {filteredTools.length} found
                  </span>
                </h2>
              </div>

              {filteredTools.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTools.map((tool) => (
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
                <div className="text-center py-24 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No tools found</h3>
                  <p className="text-slate-500 dark:text-slate-400">
                    We couldn't find anything matching &quot;{searchTerm}&quot;
                  </p>
                </div>
              )}
            </div>
          </section>
        ) : (
          <>
            {/* Categories Grid */}
            <section className="py-12">
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Explore Categories</h2>
                    <p className="text-slate-500 dark:text-slate-400">Everything you need, neatly organized</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allCategories.map((category) => (
                    <CategoryCard
                      key={category.id}
                      name={category.name}
                      description={category.description}
                      icon={category.icon}
                      toolCount={category.tools.length}
                      href={`/category/${category.id}`}
                      color={category.color}
                      className="h-full"
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Popular Tools */}
            <section className="py-12 bg-slate-50/50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800 my-12">
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Trending Tools</h2>
                    <p className="text-slate-500 dark:text-slate-400">Most used utilities this week</p>
                  </div>
                  <button className="hidden md:flex items-center text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                    View all tools
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
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
            </section>
          </>
        )}
      </div>
    </>
  );
};

export default HomePage;