'use client';

import { useState, useCallback } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { downloadFile } from '@/lib/utils/file-download';

const ImageConverterTool = ({ from, to }: { from: string, to: string }) => {
    const [file, setFile] = useState<File | null>(null);
    const [pre, setPre] = useState<string | null>(null);
    const [isP, setIsP] = useState(false);
    const [res, setRes] = useState<Blob | null>(null);

    const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) {
            setFile(f);
            setPre(URL.createObjectURL(f));
            setRes(null);
        }
    };

    const apply = useCallback(() => {
        if (!file || !pre) return;
        setIsP(true);
        const img = new Image();
        img.src = pre;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width; canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0);
            canvas.toBlob(blob => {
                setRes(blob);
                setIsP(false);
            }, `image/${to.toLowerCase()}`);
        };
    }, [file, pre, to]);

    return (
        <ToolLayout title={`Ordinance Transmuter (${from}→${to})`} description={`Structural format transmutation and re-encoding of ${from} assets into high-performance ${to} streams`} toolId={`${from.toLowerCase()}-to-${to.toLowerCase()}`}>
            <div className="max-w-6xl mx-auto space-y-12">
                {!file ? (
                    <label className="block border-4 border-dashed rounded-[60px] p-32 text-center cursor-pointer border-slate-200 dark:border-slate-800 hover:border-black transition-all bg-white dark:bg-slate-900 shadow-2xl group">
                        <div className="text-8xl mb-10 group-hover:scale-110 transition-transform">💎</div>
                        <h2 className="text-4xl font-black mb-4">Ingest {from} Asset</h2>
                        <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">Target: {to} Manifest Conversion</p>
                        <input type="file" onChange={handle} accept={`image/${from.toLowerCase()}`} className="hidden" />
                    </label>
                ) : (
                    <div className="bg-white dark:bg-slate-800 rounded-[50px] p-12 border border-slate-100 dark:border-slate-700 shadow-2xl flex flex-col lg:flex-row gap-12 items-center">
                        <div className="relative flex-1 bg-slate-50 dark:bg-slate-900 rounded-[40px] p-10 min-h-[500px] flex items-center justify-center overflow-hidden border-8 border-slate-200 dark:border-slate-700 shadow-inner">
                            <img src={pre!} alt="Preview" className="max-h-full object-contain transition-transform duration-500 shadow-2xl rounded-2xl" />
                            <div className="absolute top-6 left-6 px-6 py-2 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl">Buffer: {file.name}</div>
                        </div>
                        <div className="w-full lg:w-96 space-y-10">
                            <div className="p-10 bg-slate-50 dark:bg-slate-900 rounded-[40px] border border-transparent shadow-inner">
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-6 block text-center">Re-Encoding Protocol</p>
                                <div className="flex items-center justify-between gap-6">
                                    <div className="flex-1 text-center"><p className="text-sm font-black text-slate-300 mb-1">{from}</p><div className="h-1 bg-slate-200 dark:bg-slate-800 rounded-full" /></div>
                                    <div className="text-indigo-500 font-black">→</div>
                                    <div className="flex-1 text-center"><p className="text-sm font-black text-indigo-500 mb-1">{to}</p><div className="h-1 bg-indigo-500 rounded-full animate-pulse" /></div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <button onClick={apply} disabled={isP} className="w-full py-10 bg-black text-white rounded-[40px] font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-slate-800 transition-all text-xl">{isP ? 'Encoding...' : 'Execute Transmutation'}</button>
                                <button onClick={() => setFile(null)} className="w-full py-4 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-rose-500 transition-colors text-center block">Flush Manifest</button>
                            </div>
                        </div>
                    </div>
                )}

                {res && (
                    <div className="bg-slate-900 rounded-[60px] p-16 text-white shadow-2xl border border-white/5 animate-in zoom-in duration-700 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                            <div className="text-[150px] font-black leading-none">{to}</div>
                        </div>
                        <div className="relative z-10 flex items-center gap-10">
                            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 text-4xl shadow-emerald-500/10 border border-emerald-500/20">✓</div>
                            <div>
                                <h2 className="text-4xl font-black tracking-tighter mb-2">Manifest Re-Encoded</h2>
                                <p className="text-indigo-400 font-black uppercase text-[10px] tracking-[0.3em]">Assembled High-Fidelity {to} Stream</p>
                            </div>
                        </div>
                        <button onClick={() => downloadFile(res, `converted.${to.toLowerCase()}`, `image/${to.toLowerCase()}`)} className="relative z-10 px-20 py-10 bg-white text-black rounded-[32px] font-black text-2xl hover:bg-indigo-400 transition-all shadow-2xl">Transmit</button>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
};

export default ImageConverterTool;
