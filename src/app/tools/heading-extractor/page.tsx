'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';

const HeadingExtractorTool = () => {
    const [text, setText] = useState('');
    const [headings, setHeadings] = useState<{ type: string, content: string }[]>([]);

    const extractHeadings = () => {
        const mdRegex = /^(#{1,6})\s+(.+)$/gm;
        const htmlRegex = /<(h[1-6])>(.*?)<\/\1>/gi;
        const results: { type: string, content: string }[] = [];
        let match;

        while ((match = mdRegex.exec(text)) !== null) {
            results.push({ type: `H${match[1].length}`, content: match[2] });
        }
        while ((match = htmlRegex.exec(text)) !== null) {
            results.push({ type: match[1].toUpperCase(), content: match[2] });
        }
        setHeadings(results);
    };

    return (
        <ToolLayout title="Heading Extractor" description="Quickly extract and preview all headings from your HTML or Markdown content to analyze structure and SEO." toolId="heading-ext">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-6">
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest px-1">HTML or Markdown Content</label>
                        <textarea
                            value={text}
                            onChange={e => { setText(e.target.value); setHeadings([]); }}
                            placeholder="Paste your code or text here..."
                            className="w-full h-64 p-6 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-mono text-sm resize-none transition-all shadow-inner leading-relaxed"
                        />
                    </div>
                    <button
                        onClick={extractHeadings}
                        disabled={!text.trim()}
                        className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
                    >
                        Extract Headings
                    </button>
                </div>

                {headings.length > 0 && (
                    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm animate-in slide-in-from-bottom-8 duration-500">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Headings Found</h3>
                            <span className="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                {headings.length} {headings.length === 1 ? 'Heading' : 'Headings'}
                            </span>
                        </div>
                        <div className="space-y-4">
                            {headings.map((h, i) => (
                                <div key={i} className="flex items-start gap-4 p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl group transition-all hover:border-indigo-500/30 border border-transparent">
                                    <span className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-bold text-white shadow-sm ${h.type === 'H1' ? 'bg-rose-500' :
                                            h.type === 'H2' ? 'bg-indigo-500' :
                                                h.type === 'H3' ? 'bg-blue-500' :
                                                    'bg-slate-400 dark:bg-slate-600'
                                        }`}>
                                        {h.type}
                                    </span>
                                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight pt-1 select-all">{h.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
};

export default HeadingExtractorTool;
