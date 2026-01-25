'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';

const ShaGenerator = ({ algorithm, title, description, id }: { algorithm: 'SHA-1' | 'SHA-256' | 'SHA-512', title: string, description: string, id: string }) => {
    const [input, setInput] = useState('');
    const [hash, setHash] = useState('');

    const generate = async () => {
        try {
            const { sha1, sha256, sha512 } = await import('hash-wasm');
            let result = '';
            
            if (algorithm === 'SHA-1') {
                result = await sha1(input);
            } else if (algorithm === 'SHA-256') {
                result = await sha256(input);
            } else if (algorithm === 'SHA-512') {
                result = await sha512(input);
            }
            
            setHash(result);
        } catch (error) {
            console.error('SHA generation failed:', error);
        }
    };

    const copy = () => {
        navigator.clipboard.writeText(hash);
    };

    return (
        <ToolLayout title={title} description={description} toolId={id}>
            <div className="max-w-4xl mx-auto space-y-10">
                <div className="bg-white dark:bg-slate-800 rounded-[40px] p-10 shadow-2xl border border-slate-100 dark:border-slate-700">
                    <label className="text-xs font-black uppercase text-slate-400 mb-4 block px-1 tracking-widest">Secure Input</label>
                    <textarea value={input} onChange={e => setInput(e.target.value)} placeholder={`Paste data to calculate ${algorithm} hash...`} className="w-full h-48 px-8 py-6 bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-cyan-500 rounded-3xl outline-none font-medium text-lg transition-all" />
                    <button onClick={generate} className="w-full mt-8 py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[28px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-cyan-600 hover:text-white transition-all">Generate Fingerprint</button>
                </div>

                {hash && (
                    <div className="bg-slate-900 rounded-[40px] p-12 text-white shadow-2xl animate-in zoom-in duration-500 relative overflow-hidden border border-white/5">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/10 blur-3xl"></div>
                        <p className="text-[10px] font-black uppercase text-cyan-400 mb-4 tracking-[0.3em]">{algorithm} Result</p>
                        <div className="text-xl md:text-3xl font-mono font-bold break-all mb-10 tracking-tight leading-relaxed">{hash}</div>
                        <button onClick={copy} className="w-full py-4 bg-white/10 hover:bg-white text-white hover:text-black rounded-2xl font-black uppercase text-xs tracking-widest transition-all">Copy Digest</button>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
};

export default ShaGenerator;
