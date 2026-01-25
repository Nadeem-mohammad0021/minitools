'use client';

import { useState, useCallback, useEffect } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Button } from '@/components/ui/button';
import { Loader2, Globe, List } from 'lucide-react';

export default function XmlSitemapGeneratorTool() {
  const [urls, setUrls] = useState('https://example.com/');
  const [sitemapResult, setSitemapResult] = useState('');
  const [mode, setMode] = useState<'manual' | 'crawl'>('crawl');
  const [isProcessing, setIsProcessing] = useState(false);

  const generateSitemap = useCallback(async () => {
    if (mode === 'manual') {
      let content = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
      urls.split('\n').filter(u => u.trim()).forEach(url => {
        const cleanUrl = url.trim();
        content += `  <url>\n    <loc>${cleanUrl}</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n    <priority>0.80</priority>\n  </url>\n`;
      });
      content += `</urlset>`;
      setSitemapResult(content);
    } else {
      setIsProcessing(true);
      try {
        const res = await fetch('/api/seo/sitemap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: urls.split('\n')[0].trim() })
        });
        if (!res.ok) throw new Error('Crawl failed');
        const xml = await res.text();
        setSitemapResult(xml);
      } catch (err) {
        console.error(err);
        alert('Failed to crawl website. Please check the URL.');
      } finally {
        setIsProcessing(false);
      }
    }
  }, [urls, mode]);

  useEffect(() => {
    if (mode === 'manual') generateSitemap();
  }, [mode, urls, generateSitemap]);

  return (
    <ToolLayout title="XML Sitemap Generator" description="Generate professional XML sitemaps using real-time site crawling or manual entry." toolId="sitemap-gen">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-center">
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl flex gap-1">
            <button onClick={() => setMode('crawl')} className={`px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${mode === 'crawl' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600' : 'text-slate-500'}`}><Globe size={14} /> Real Crawl</button>
            <button onClick={() => setMode('manual')} className={`px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${mode === 'manual' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600' : 'text-slate-500'}`}><List size={14} /> Manual List</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 mb-4 block tracking-widest px-1">{mode === 'crawl' ? 'Website URL to Crawl' : 'URL List (One per line)'}</label>
              <textarea
                value={urls}
                onChange={e => setUrls(e.target.value)}
                rows={mode === 'crawl' ? 2 : 10}
                placeholder={mode === 'crawl' ? 'https://example.com' : 'https://example.com\nhttps://example.com/about'}
                className="w-full p-6 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-mono text-sm resize-none transition-all shadow-inner"
              />
            </div>

            {mode === 'crawl' && (
              <Button onClick={generateSitemap} disabled={isProcessing} className="w-full py-6 font-black uppercase tracking-widest">
                {isProcessing ? <><Loader2 className="animate-spin mr-2" /> Crawling Site...</> : 'Start Crawl'}
              </Button>
            )}

            <div className="bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/20">
              <p className="text-xs text-indigo-700 dark:text-indigo-400 leading-relaxed font-medium">
                {mode === 'crawl'
                  ? 'Tip: We will follow links on your homepage to discover pages automatically and generate a structured sitemap.'
                  : 'Tip: Each URL will be set with a default priority of 0.80 and current modification date.'}
              </p>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[32px] p-8 shadow-2xl border border-white/5 flex flex-col relative overflow-hidden group min-h-[400px]">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10 relative z-10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">XML Results</span>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    const blob = new Blob([sitemapResult], { type: 'application/xml' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'sitemap.xml';
                    a.click();
                  }}
                  className="text-[10px] font-bold uppercase tracking-widest text-white hover:text-indigo-400 transition-colors"
                >
                  Download
                </button>
                <button
                  onClick={() => { navigator.clipboard.writeText(sitemapResult); alert('Copied!'); }}
                  className="text-[10px] font-bold uppercase tracking-widest text-white hover:text-indigo-400 transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>
            <div className="flex-1 p-4 bg-black/40 rounded-2xl font-mono text-[11px] text-indigo-200/80 overflow-auto whitespace-pre-wrap leading-relaxed relative z-10 scrollbar-hide">
              {sitemapResult || 'Result will appear here...'}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
