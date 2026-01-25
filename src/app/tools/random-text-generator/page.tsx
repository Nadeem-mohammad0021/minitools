'use client';

import { useState, useCallback } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';

const RandomTextGeneratorTool = () => {
    const [length, setLength] = useState(128);
    const [charset, setCharset] = useState('alphanumeric');
    const [result, setResult] = useState('');

    const charsets: Record<string, string> = {
        alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        numeric: '0123456789',
        alpha: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
        hex: '0123456789ABCDEF'
    };

    const generateRandomText = useCallback(() => {
        const chars = charsets[charset];
        let text = '';
        for (let i = 0; i < length; i++) {
            text += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setResult(text);
    }, [length, charset]);

    return (
        <ToolLayout title="Random Text Generator" description="Generate secure random strings of any length using various character sets for your testing or security needs." toolId="random-gen">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Configuration Section */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Number of Characters: <span className="text-indigo-600 tabular-nums">{length}</span></label>
                        </div>
                        <input
                            type="range"
                            min={16}
                            max={2048}
                            step={16}
                            value={length}
                            onChange={e => setLength(parseInt(e.target.value))}
                            className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-600"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-500 uppercase tracking-wider px-1">Character Set</label>
                        <select
                            value={charset}
                            onChange={e => setCharset(e.target.value)}
                            className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-bold text-lg transition-all appearance-none cursor-pointer shadow-inner"
                        >
                            <option value="alphanumeric">Letters & Numbers (A-Z, 0-9)</option>
                            <option value="numeric">Numbers Only (0-9)</option>
                            <option value="alpha">Letters Only (A-Z)</option>
                            <option value="hex">Hexadecimal (0-F)</option>
                        </select>
                    </div>

                    <button
                        onClick={generateRandomText}
                        className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-95"
                    >
                        Generate Random Text
                    </button>
                </div>

                {/* Result Section */}
                {result && (
                    <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl border border-white/5 animate-in slide-in-from-bottom-4 duration-500 space-y-6">
                        <div className="flex justify-between items-center">
                            <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest px-1">Generated Result</p>
                            <button
                                onClick={() => { navigator.clipboard.writeText(result); }}
                                className="text-xs font-bold uppercase tracking-widest text-white hover:text-indigo-400 transition-colors"
                            >
                                Copy Text
                            </button>
                        </div>
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 font-mono text-sm break-all leading-relaxed max-h-[300px] overflow-auto text-indigo-100 shadow-inner">
                            {result}
                        </div>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
};

export default RandomTextGeneratorTool;
