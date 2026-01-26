'use client';

import { useState, useCallback, useEffect } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { generateMetaTags, isGeminiConfigured } from '@/lib/utils/gemini';
import { Loader2 } from 'lucide-react';

const MetaTagsGeneratorTool = () => {
  const [site, setSite] = useState('');
  const [page, setPage] = useState('');
  const [desc, setDesc] = useState('');
  const [tags, setTags] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [res, setRes] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const geminiAvailable = isGeminiConfigured();

  const generate = useCallback(() => {
    let t = `<!-- Identity -->\n<title>${site}${page ? ` | ${page}` : ''}</title>\n`;
    if (desc) t += `<meta name="description" content="${desc}">\n`;
    if (tags) t += `<meta name="keywords" content="${tags}">\n`;
    if (author) t += `<meta name="author" content="${author}">\n`;
    if (url) t += `<link rel="canonical" href="${url}">\n`;

    t += `\n<!-- Social Graph -->\n<meta property="og:title" content="${page || site}">\n`;
    t += `<meta property="og:description" content="${desc}">\n`;
    t += `<meta property="og:type" content="website">\n`;
    if (url) t += `<meta property="og:url" content="${url}">\n`;

    t += `\n<!-- Global Broadcast -->\n<meta name="twitter:card" content="summary_large_image">\n`;
    t += `<meta name="twitter:title" content="${page || site}">\n`;
    setRes(t);
  }, [site, page, desc, tags, author, url]);
  
  const generateWithAI = async () => {
    if (!site.trim() || !desc.trim() || !geminiAvailable) return;
    
    setIsAiProcessing(true);
    try {
      const result = await generateMetaTags(site, desc, desc);
      
      // Update the fields with AI-generated content
      setPage(result.metaTitle.replace(site, '').replace(' | ', ''));
      setDesc(result.metaDescription);
      setTags(result.keywords);
      
      // Generate the tags with AI content
      let t = `<!-- Identity -->
<title>${result.metaTitle}</title>
`;
      t += `<meta name="description" content="${result.metaDescription}">
`;
      t += `<meta name="keywords" content="${result.keywords}">
`;
      if (author) t += `<meta name="author" content="${author}">
`;
      if (url) t += `<link rel="canonical" href="${url}">
`;

      t += `
<!-- Social Graph -->
<meta property="og:title" content="${result.openGraphTitle}">
`;
      t += `<meta property="og:description" content="${result.openGraphDescription}">
`;
      t += `<meta property="og:type" content="website">
`;
      if (url) t += `<meta property="og:url" content="${url}">
`;

      t += `
<!-- Global Broadcast -->
<meta name="twitter:card" content="summary_large_image">
`;
      t += `<meta name="twitter:title" content="${result.openGraphTitle}">
`;
      t += `<meta name="twitter:description" content="${result.openGraphDescription}">
`;
      
      setRes(t);
    } catch (error) {
      console.error('AI generation failed:', error);
      alert('AI generation failed. Please try again.');
    } finally {
      setIsAiProcessing(false);
    }
  };

  useEffect(() => { generate(); }, [generate]);

  return (
    <ToolLayout title="Meta Tags Generator" description="Generate SEO meta tags for your website to improve search engine visibility and social media sharing." toolId="meta-gen">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white dark:bg-slate-800 rounded-[40px] p-10 shadow-2xl border border-slate-100 dark:border-slate-700 space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Site Name</label>
                <input value={site} onChange={e => setSite(e.target.value)} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-black rounded-2xl outline-none font-bold" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Page Subject</label>
                <input value={page} onChange={e => setPage(e.target.value)} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-black rounded-2xl outline-none font-bold" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Description Schema</label>
              <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-black rounded-2xl outline-none font-bold resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Global URL</label>
                <input value={url} onChange={e => setUrl(e.target.value)} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-black rounded-2xl outline-none font-bold" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Keywords</label>
                <input value={tags} onChange={e => setTags(e.target.value)} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-black rounded-2xl outline-none font-bold" />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={generate} 
                className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
              >
                Generate Tags
              </button>
              
              {geminiAvailable && (
                <button 
                  onClick={generateWithAI}
                  disabled={isAiProcessing || !site.trim() || !desc.trim()}
                  className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-2xl font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  {isAiProcessing ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Generating with AI...
                    </>
                  ) : (
                    'AI-Powered Generation'
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="bg-black rounded-[40px] p-10 shadow-2xl flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl animate-pulse"></div>
            <div className="flex justify-between items-center mb-8">
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Generated Tags</span>
              <button onClick={() => navigator.clipboard.writeText(res)} className="text-[10px] font-bold uppercase tracking-widest text-white hover:text-indigo-400 transition-all">Copy Tags</button>
            </div>
            <pre className="flex-1 p-6 bg-white/5 rounded-[32px] font-mono text-xs text-indigo-300 overflow-auto whitespace-pre-wrap leading-relaxed">
              {res}
            </pre>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default MetaTagsGeneratorTool;
