'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Button } from '@/components/ui/button';
import { minifyJSON } from '@/lib/engines/devEngine';
import { Copy, Trash2, Minimize2, Maximize2, Loader2, Wand2 } from 'lucide-react';

export default function JsonFormatterTool() {
    const [text, setText] = useState('');
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFormat = async () => {
        if (!text) return;
        setIsProcessing(true);
        setError('');
        try {
            const res = await fetch('/api/code/format', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: text, parser: 'json' })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Formatting failed');
            setText(data.formatted);
        } catch (e: any) {
            setError(e.message || 'Invalid JSON format');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleMinify = () => {
        try {
            setError('');
            setText(minifyJSON(text));
        } catch (e) {
            setError('Invalid JSON');
        }
    };

    const copyText = () => {
        navigator.clipboard.writeText(text);
    };

    return (
        <ToolLayout
            title="JSON Formatter"
            description="Professional JSON prettifier and minifier powered by Prettier. Clean your data instantly."
            toolId="json-formatter"
            category="Dev"
        >
            <div className="max-w-6xl mx-auto space-y-6 h-[75vh] flex flex-col">
                <div className="flex flex-wrap justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm gap-4">
                    <div className="flex gap-2">
                        <Button
                            onClick={handleFormat}
                            disabled={isProcessing}
                            className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
                        >
                            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                            Prettify JSON
                        </Button>
                        <Button onClick={handleMinify} variant="outline" className="gap-2 border-2">
                            <Minimize2 className="w-4 h-4" /> Minify
                        </Button>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={copyText} className="font-bold text-xs uppercase tracking-widest text-slate-500 hover:text-indigo-600 border border-transparent hover:border-slate-200 rounded-xl px-4">
                            <Copy className="w-3.5 h-3.5 mr-2" /> Copy
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setText('')} className="font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-red-500 border border-transparent hover:border-slate-200 rounded-xl px-4">
                            <Trash2 className="w-3.5 h-3.5 mr-2" /> Clear
                        </Button>
                    </div>
                </div>

                <div className="relative flex-1 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-[32px] -m-1 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <textarea
                        className={`w-full h-full p-8 rounded-[32px] bg-white dark:bg-slate-950 border-2 font-mono text-sm resize-none focus:ring-0 focus:border-indigo-500 transition-all shadow-inner ${error ? 'border-red-500 ring-4 ring-red-500/10' : 'border-slate-100 dark:border-slate-800'}`}
                        placeholder='{ "hint": "Paste your messy JSON here..." }'
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        spellCheck={false}
                    ></textarea>

                    {error && (
                        <div className="absolute bottom-6 left-6 right-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-bottom-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <p className="text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider">{error}</p>
                        </div>
                    )}

                    {isProcessing && (
                        <div className="absolute inset-0 bg-white/40 dark:bg-slate-950/40 backdrop-blur-[1px] rounded-[32px] flex items-center justify-center pointer-events-none">
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-4 animate-in zoom-in-95">
                                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Processing...</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ToolLayout>
    );
}
