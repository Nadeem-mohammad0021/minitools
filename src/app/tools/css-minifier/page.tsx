'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Button } from '@/components/ui/button';
import { Loader2, Copy, Maximize2, Minimize2, Trash2 } from 'lucide-react';

export default function CssMinifierTool() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const processCss = async (mode: 'minify' | 'format') => {
        if (!input.trim()) return;
        setIsProcessing(true);
        try {
            const endpoint = mode === 'minify' ? '/api/code/minify' : '/api/code/format';
            const body = mode === 'minify' 
                ? { code: input, language: 'css' }
                : { code: input, parser: 'css' };

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Processing failed');

            // API returns 'minified' for minify endpoint, 'formatted' for format endpoint
            const result = mode === 'minify' ? data.minified : data.formatted;

            setOutput(result);
        } catch (e) {
            console.error(e);
            alert('Failed to process CSS. Please check your syntax.');
        } finally {
            setIsProcessing(false);
        }
    };

    const copyToClipboard = () => {
        if (output) navigator.clipboard.writeText(output);
    };

    return (
        <ToolLayout title="CSS Studio" description="High-performance CSS minifier and formatter powered by Prettier. Optimize your styles for production." toolId="css-studio">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch h-[600px]">
                    {/* Input Section */}
                    <div className="flex flex-col bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Source CSS</span>
                            <button onClick={() => setInput('')} className="bg-slate-50 dark:bg-slate-800 p-2 rounded-xl text-slate-400 hover:text-red-500 transition-colors">
                                <Trash2 size={14} />
                            </button>
                        </div>
                        <textarea
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="/* Paste your CSS here... */"
                            className="flex-1 p-8 bg-transparent outline-none font-mono text-sm resize-none scrollbar-hide"
                            spellCheck={false}
                        />
                    </div>

                    {/* Output Section */}
                    <div className="flex flex-col bg-slate-950 rounded-[32px] border border-white/5 shadow-2xl relative group overflow-hidden">
                        <div className="absolute inset-0 bg-indigo-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center relative z-10">
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Studio Output</span>
                            <div className="flex gap-4">
                                {output && (
                                    <button onClick={copyToClipboard} className="text-[10px] font-bold text-white/50 hover:text-white uppercase tracking-widest">Copy</button>
                                )}
                            </div>
                        </div>
                        <div className="flex-1 p-8 font-mono text-sm text-cyan-300/90 overflow-auto whitespace-pre-wrap leading-relaxed relative z-10 scrollbar-hide">
                            {output || <span className="text-white/10 italic">Processed results will appear here...</span>}
                        </div>

                        {output && (
                            <div className="px-6 py-4 bg-white/5 border-t border-white/5 flex justify-between items-center relative z-10">
                                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                    Savings: <span className="text-emerald-400">{Math.max(0, Math.round((1 - output.length / input.length) * 100))}%</span>
                                </div>
                                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                    {output.length} Bytes
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                    <Button
                        onClick={() => processCss('minify')}
                        disabled={isProcessing}
                        size="lg"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-10 py-8 text-xl font-black shadow-xl shadow-indigo-500/20 gap-3"
                    >
                        {isProcessing ? <Loader2 className="animate-spin" /> : <Minimize2 size={24} />}
                        MINIFY CSS
                    </Button>
                    <Button
                        onClick={() => processCss('format')}
                        variant="outline"
                        disabled={isProcessing}
                        size="lg"
                        className="bg-white dark:bg-slate-900 border-2 rounded-2xl px-10 py-8 text-xl font-black gap-3"
                    >
                        <Maximize2 size={24} />
                        PRETTIFY
                    </Button>
                </div>
            </div>
        </ToolLayout>
    );
}
