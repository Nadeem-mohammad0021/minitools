'use client';

import { useState, useCallback } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';

const UrlSlugGeneratorTool = () => {
  const [text, setText] = useState('');
  const [slug, setSlug] = useState('');

  const apply = useCallback(() => {
    const s = text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    setSlug(s);
  }, [text]);

  return (
    <ToolLayout title="URL Slug Generator" description="Convert your page titles into SEO-friendly URL slugs instantly." toolId="url-slug">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Page Title</label>
              <button onClick={() => { setText(''); setSlug(''); }} className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors">Clear</button>
            </div>
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="e.g. How to Build a MiniTools Platform"
              className="w-full px-6 py-5 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-bold text-xl transition-all shadow-inner"
            />
          </div>

          <button
            onClick={apply}
            disabled={!text.trim()}
            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            Generate Slug
          </button>
        </div>

        {slug && (
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">Generated Slug</p>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-2xl shadow-sm">
              <div className="text-2xl md:text-3xl font-mono font-bold text-indigo-600 truncate max-w-full">{slug}</div>
              <button
                onClick={() => { navigator.clipboard.writeText(slug); }}
                className="w-full md:w-auto px-10 py-4 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-md active:scale-95"
              >
                Copy Slug
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default UrlSlugGeneratorTool;
