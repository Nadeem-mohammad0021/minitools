'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';

const Md5GeneratorTool = () => {
    const [input, setInput] = useState('');
    const [hash, setHash] = useState('');

    const generate = async () => {
        try {
            const { md5 } = await import('hash-wasm');
            const result = await md5(input);
            setHash(result);
        } catch (error) {
            console.error('MD5 generation failed:', error);
        }
    };

    const copy = () => {
        navigator.clipboard.writeText(hash);
    };

    return (
        <ToolLayout title="MD5 Generator" description="Generate secure 128-bit cryptographic fingerprints for any text input" toolId="md5-generator">
            <div className="max-w-4xl mx-auto space-y-10">
                <div className="bg-white dark:bg-slate-800 rounded-[40px] p-10 shadow-2xl border border-slate-100 dark:border-slate-700">
                    <label className="text-xs font-black uppercase text-slate-400 mb-4 block px-1 tracking-widest">Input String</label>
                    <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Type or paste your data here..." className="w-full h-48 px-8 py-6 bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-indigo-500 rounded-3xl outline-none font-medium text-lg transition-all" />
                    <button onClick={generate} className="w-full mt-8 py-6 bg-indigo-600 hover:bg-black text-white rounded-[28px] font-black uppercase tracking-[0.2em] shadow-xl transition-all">Generate Hash</button>
                </div>

                {hash && (
                    <div className="bg-slate-900 rounded-[40px] p-12 text-white shadow-2xl animate-in zoom-in duration-500 relative overflow-hidden border border-white/5 group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-3xl"></div>
                        <p className="text-[10px] font-bold uppercase text-indigo-400 mb-4 tracking-widest">MD5 Hash</p>
                        <div className="text-2xl md:text-4xl font-mono font-bold break-all mb-10 tracking-tight leading-tight">{hash}</div>
                        <button onClick={copy} className="w-full py-4 bg-white/10 hover:bg-white text-white hover:text-black rounded-2xl font-black uppercase text-xs tracking-widest transition-all">Copy To Clipboard</button>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
};

export default Md5GeneratorTool;
