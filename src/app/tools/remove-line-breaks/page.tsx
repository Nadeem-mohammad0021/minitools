'use client';

import { useState, useCallback } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';

const RemoveLineBreaksTool = () => {
    const [text, setText] = useState('');
    const [result, setResult] = useState('');

    const removeLineBreaks = useCallback(() => {
        setResult(text.replace(/(\r\n|\n|\r)/gm, " ").replace(/\s+/g, ' ').trim());
    }, [text]);

    return (
        <ToolLayout title="Remove Line Breaks" description="Instantly clean up your text by removing all unnecessary line breaks and extra spaces." toolId="br-remove">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                    <div className="flex items-center justify-between px-1">
                        <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Input Text</label>
                        <button onClick={() => { setText(''); setResult(''); }} className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors">Clear</button>
                    </div>
                    <textarea
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder="Paste your text with extra line breaks here..."
                        className="w-full h-80 p-6 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-medium text-lg resize-none transition-all shadow-inner leading-relaxed"
                    />
                    <button
                        onClick={removeLineBreaks}
                        disabled={!text.trim()}
                        className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all disabled:opacity-50 active:scale-95"
                    >
                        Remove Line Breaks
                    </button>
                </div>

                {result && (
                    <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl border border-white/5 animate-in slide-in-from-bottom-4 duration-500 space-y-6">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest px-1">Cleaned Text</p>
                            <button
                                onClick={() => { navigator.clipboard.writeText(result); }}
                                className="px-5 py-2 bg-white text-indigo-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-400 hover:text-white transition-all shadow-md"
                            >
                                Copy Text
                            </button>
                        </div>
                        <p className="text-indigo-100 font-mono text-lg leading-relaxed bg-white/5 p-6 rounded-2xl border border-white/5 italic">
                            {result}
                        </p>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
};

export default RemoveLineBreaksTool;
