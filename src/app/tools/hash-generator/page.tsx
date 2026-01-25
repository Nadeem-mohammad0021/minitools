'use client';

import { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Button } from '@/components/ui/button';
import { Copy, RefreshCw, Zap } from 'lucide-react';
import { md5, sha1, sha256, sha512 } from 'hash-wasm';

export default function HashGeneratorTool() {
    const [text, setText] = useState('');
    const [hashes, setHashes] = useState<Record<string, string>>({});

    useEffect(() => {
        const updateHashes = async () => {
            if (!text) {
                setHashes({});
                return;
            }

            try {
                // High-performance wasm-based hashing
                const [hMD5, hSHA1, hSHA256, hSHA512] = await Promise.all([
                    md5(text),
                    sha1(text),
                    sha256(text),
                    sha512(text)
                ]);

                setHashes({
                    'MD5': hMD5,
                    'SHA-1': hSHA1,
                    'SHA-256': hSHA256,
                    'SHA-512': hSHA512
                });
            } catch (e) {
                console.error('Hashing failed:', e);
            }
        };

        const timer = setTimeout(updateHashes, 100); // Debounce
        return () => clearTimeout(timer);
    }, [text]);

    const copy = (val: string) => {
        navigator.clipboard.writeText(val);
        // Simple visual feedback would be good here but keeping it clean as per original
    };

    return (
        <ToolLayout
            title="Hash Generator"
            description="Ultra-fast, secure cryptographic hashing powered by WebAssembly. Calculate signatures for any text."
            toolId="hash-generator"
            category="Dev"
        >
            <div className="max-w-4xl mx-auto space-y-10">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Zap size={120} className="text-indigo-600" />
                    </div>

                    <div className="relative z-10">
                        <label className="text-[10px] font-bold uppercase text-slate-400 mb-4 block tracking-widest px-1">Source Content</label>
                        <textarea
                            className="w-full h-48 p-6 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-mono text-sm resize-none transition-all shadow-inner"
                            placeholder="Drop your text here to generate hashes..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        ></textarea>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(hashes).map(([algo, hash]) => (
                        <div key={algo} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                            <div className="flex justify-between items-center mb-4">
                                <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-tighter">
                                    {algo}
                                </span>
                                <button
                                    onClick={() => copy(hash)}
                                    className="p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-slate-50 dark:bg-slate-800 rounded-lg"
                                >
                                    <Copy size={14} />
                                </button>
                            </div>
                            <div className="flex-1 bg-slate-50 dark:bg-black/20 p-4 rounded-xl border border-slate-100 dark:border-white/5 overflow-hidden">
                                <p className="font-mono text-xs break-all leading-relaxed text-slate-600 dark:text-slate-300">
                                    {hash}
                                </p>
                            </div>
                        </div>
                    ))}
                    {!text && (
                        <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[32px]">
                            <p className="text-slate-400 font-medium italic">Waiting for input content...</p>
                        </div>
                    )}
                </div>
            </div>
        </ToolLayout>
    );
}
