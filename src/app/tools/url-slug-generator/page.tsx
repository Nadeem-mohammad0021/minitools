'use client';

import { useState, useCallback } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { generateSlug, isGeminiConfigured } from '@/lib/utils/gemini';
import { Loader2 } from 'lucide-react';

const UrlSlugGeneratorTool = () => {
  const [text, setText] = useState('');
  const [slug, setSlug] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const geminiAvailable = isGeminiConfigured();

  const apply = useCallback(() => {
    const s = text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    setSlug(s);
  }, [text]);
  
  const applyWithAI = async () => {
    if (!text.trim() || !geminiAvailable) return;
    
    setIsAiProcessing(true);
    try {
      const s = await generateSlug(text);
      setSlug(s);
    } catch (error) {
      console.error('AI slug generation failed:', error);
      alert('AI slug generation failed. Please try again.');
    } finally {
      setIsAiProcessing(false);
    }
  };

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

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={apply}
              disabled={!text.trim()}
              className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
              Generate Slug
            </button>
            
            {geminiAvailable && (
              <button
                onClick={applyWithAI}
                disabled={isAiProcessing || !text.trim()}
                className="flex-1 py-5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-indigo-200 dark:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isAiProcessing ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Generating with AI...
                  </>
                ) : (
                  'AI-Powered Slug'
                )}
              </button>
            )}
          </div>
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
