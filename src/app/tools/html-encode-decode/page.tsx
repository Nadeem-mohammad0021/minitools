'use client';

import { useState, useCallback, useEffect } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';

const HtmlEncodeDecodeTool = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState<'encode' | 'decode'>('encode');

    const processHtml = useCallback(() => {
        if (!input.trim()) {
            setOutput('');
            return;
        }
        const container = document.createElement('div');
        if (mode === 'encode') {
            container.innerText = input;
            setOutput(container.innerHTML);
        } else {
            container.innerHTML = input;
            setOutput(container.innerText);
        }
    }, [input, mode]);

    useEffect(() => {
        processHtml();
    }, [processHtml]);

    const handleSwap = () => {
        setMode(prev => prev === 'encode' ? 'decode' : 'encode');
        if (output) setInput(output);
    };

    return (
        <ToolLayout title="HTML Encoder / Decoder" description="Quickly encode or decode HTML entities to prevent rendering issues and secure your content." toolId="html-tool">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="flex justify-center mb-4">
                    <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl flex border border-slate-200 dark:border-slate-700 shadow-sm">
                        {(['encode', 'decode'] as const).map(m => (
                            <button
                                key={m}
                                onClick={() => setMode(m)}
                                className={`px-10 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all ${mode === m ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-md' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                        <div className="flex justify-between items-center mb-4 px-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Input</span>
                            <button
                                onClick={handleSwap}
                                className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors"
                            >
                                Use Output as Input ⇄
                            </button>
                        </div>
                        <textarea
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Type or paste your content here..."
                            className="w-full h-[400px] p-6 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 rounded-2xl outline-none font-mono text-sm resize-none transition-all shadow-inner"
                        />
                    </div>

                    <div className="bg-slate-900 rounded-[32px] p-6 shadow-2xl border border-white/5 flex flex-col relative overflow-hidden group">
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                        <div className="flex justify-between items-center mb-4 px-1 relative z-10">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Result</span>
                            <button
                                onClick={() => navigator.clipboard.writeText(output)}
                                disabled={!output}
                                className="text-[10px] font-bold uppercase tracking-widest text-white disabled:opacity-20 hover:text-emerald-400 transition-colors"
                            >
                                Copy Result
                            </button>
                        </div>
                        <div className="w-full flex-1 p-6 bg-black/40 rounded-2xl font-mono text-sm text-emerald-300 overflow-auto whitespace-pre-wrap leading-relaxed min-h-[400px] relative z-10 scrollbar-hide">
                            {output || 'Waiting for input...'}
                        </div>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
};

export default HtmlEncodeDecodeTool;
