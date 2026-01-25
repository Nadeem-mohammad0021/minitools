'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';

const KeywordDensityCheckerTool = () => {
    const [text, setText] = useState('');
    const [analysis, setAnalysis] = useState<{ word: string, count: number, density: number }[]>([]);

    const analyze = () => {
        if (!text.trim()) return;
        const words = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 3);
        const total = words.length;
        const counts: Record<string, number> = {};
        words.forEach(w => counts[w] = (counts[w] || 0) + 1);
        const sorted = Object.entries(counts)
            .map(([word, count]) => ({ word, count, density: (count / total) * 100 }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 15);
        setAnalysis(sorted);
    };

    return (
        <ToolLayout title="Keyword Density Checker" description="Analyze your text to identify the most frequently used keywords and their density percentages." toolId="keyword-density">
            <div className="max-w-6xl mx-auto space-y-10">
                <div className="bg-white dark:bg-slate-800 rounded-[40px] p-10 shadow-2xl border border-slate-100 dark:border-slate-700">
                    <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Paste your content here to analyze..." className="w-full h-64 p-8 bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-indigo-500 rounded-[32px] outline-none font-medium text-lg resize-none transition-all shadow-inner mb-8" />
                    <button onClick={analyze} className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[24px] font-bold uppercase tracking-widest shadow-2xl transition-all hover:scale-105 active:scale-95">Analyze Text</button>
                </div>

                {analysis.length > 0 && (
                    <div className="bg-white dark:bg-slate-800 rounded-[40px] p-12 shadow-2xl border border-slate-100 dark:border-slate-700 animate-in zoom-in duration-500">
                        <div className="flex items-center justify-between mb-10 pb-4 border-b border-slate-50 dark:border-slate-700">
                            <h3 className="text-xl font-bold uppercase tracking-tight">Top Keywords</h3>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Top 15 Words</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {analysis.map((it, i) => (
                                <div key={i} className="flex flex-col p-6 bg-slate-50 dark:bg-slate-900 rounded-[28px] border border-transparent hover:border-indigo-500/20 transition-all hover:shadow-xl group">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="px-3 py-1 bg-white dark:bg-slate-800 rounded-lg text-[10px] font-black text-slate-400 group-hover:text-black transition-all">#{i + 1}</span>
                                        <span className="text-2xl font-black text-indigo-600">{it.density.toFixed(1)}%</span>
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight mb-1">{it.word}</h4>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Frequency: {it.count}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
};

export default KeywordDensityCheckerTool;
