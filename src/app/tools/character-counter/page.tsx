'use client';

import { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';

const CharacterCounterTool = () => {
    const [text, setText] = useState('');

    const stats = useMemo(() => {
        return {
            chars: text.length,
            charsNoSpaces: text.replace(/\s/g, '').length,
            words: text.trim() ? text.trim().split(/\s+/).length : 0,
        };
    }, [text]);

    return (
        <ToolLayout title="Character Counter" description="Get precise counts of characters, words, and spaces in your text in real-time." toolId="char-count">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Input Text</label>
                        <button onClick={() => setText('')} className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors">Clear All</button>
                    </div>
                    <textarea
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder="Type or paste your text here..."
                        className="w-full h-80 p-6 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-medium text-lg resize-none transition-all shadow-inner leading-relaxed"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                    {[
                        { label: 'Total Characters', value: stats.chars, color: 'bg-indigo-600 text-white' },
                        { label: 'Characters (No Spaces)', value: stats.charsNoSpaces, color: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white' },
                        { label: 'Word Count', value: stats.words, color: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white' }
                    ].map((item, i) => (
                        <div key={i} className={`${item.color} p-10 rounded-3xl text-center shadow-sm relative overflow-hidden group`}>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-4">{item.label}</p>
                            <div className="text-5xl font-bold tracking-tighter">{item.value}</div>
                        </div>
                    ))}
                </div>

                {text && (
                    <button
                        onClick={() => { navigator.clipboard.writeText(text); }}
                        className="w-full py-5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
                    >
                        Copy Text to Clipboard
                    </button>
                )}
            </div>
        </ToolLayout>
    );
};

export default CharacterCounterTool;
