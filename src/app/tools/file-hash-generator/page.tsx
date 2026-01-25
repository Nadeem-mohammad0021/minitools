'use client';

import { useState, useCallback } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { FileUpload } from '@/components/ui/FileUpload';

const FileHashGeneratorTool = () => {
    const [file, setFile] = useState<File | null>(null);
    const [algo, setAlgo] = useState<'SHA-256' | 'SHA-1'>('SHA-256');
    const [hashValue, setHashValue] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const generateHash = useCallback(async () => {
        if (!file) return;
        setIsProcessing(true);
        try {
            const { sha256, sha1 } = await import('hash-wasm');
            const buffer = await file.arrayBuffer();
            const data = new Uint8Array(buffer);
            
            let hashHex = '';
            if (algo === 'SHA-256') {
                hashHex = await sha256(data);
            } else {
                hashHex = await sha1(data);
            }
            
            setHashValue(hashHex);
        } catch (err) {
            console.error('Hash generation error:', err);
        } finally {
            setIsProcessing(false);
        }
    }, [file, algo]);

    const onFileSelect = (files: File[]) => {
        if (files[0]) {
            setFile(files[0]);
            setHashValue('');
        }
    };

    return (
        <ToolLayout title="File Hash Generator" description="Generate secure SHA-256 or SHA-1 cryptographic hashes to verify the integrity and authenticity of your files." toolId="file-hash">
            <div className="max-w-5xl mx-auto space-y-8">
                {!file ? (
                    <FileUpload
                        onFileSelect={onFileSelect}
                        label="Upload File to Generate Hash"
                        icon="🔐"
                    />
                ) : (
                    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
                        <div className="flex flex-col md:flex-row items-center gap-8 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                            <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none">
                                {file.name.split('.').pop()?.toUpperCase() || 'FILE'}
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white truncate max-w-md">{file.name}</h3>
                                <p className="text-slate-500 text-sm">Size: {(file.size / 1024).toFixed(2)} KB</p>
                            </div>
                            <button
                                onClick={() => { setFile(null); setHashValue(''); }}
                                className="px-5 py-2 bg-white dark:bg-slate-700 text-red-500 rounded-xl font-bold text-xs hover:bg-red-50 transition-all border border-slate-200 dark:border-slate-600"
                            >
                                Change
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-500 uppercase tracking-wider px-1">Select Hash Algorithm</label>
                                <div className="grid grid-cols-2 gap-4">
                                    {(['SHA-256', 'SHA-1'] as const).map(a => (
                                        <button
                                            key={a}
                                            onClick={() => { setAlgo(a); setHashValue(''); }}
                                            className={`py-4 rounded-xl font-bold text-xs tracking-widest transition-all ${algo === a ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-transparent'}`}
                                        >
                                            {a} {a === 'SHA-256' ? '(Recommended)' : ''}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={generateHash}
                                disabled={isProcessing}
                                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all disabled:opacity-50"
                            >
                                {isProcessing ? 'Generating Hash...' : 'Generate File Hash'}
                            </button>
                        </div>
                    </div>
                )}

                {hashValue && (
                    <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl border border-white/5 animate-in slide-in-from-bottom-4 duration-500 space-y-6">
                        <div className="space-y-3">
                            <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest px-1">{algo} Hash Result</p>
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 font-mono text-sm break-all leading-relaxed text-indigo-100">
                                {hashValue}
                            </div>
                        </div>
                        <button
                            onClick={() => navigator.clipboard.writeText(hashValue)}
                            className="w-full py-4 bg-white text-indigo-900 rounded-xl font-bold text-sm hover:bg-indigo-400 hover:text-white transition-all shadow-md active:scale-95"
                        >
                            Copy Hash to Clipboard
                        </button>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
};

export default FileHashGeneratorTool;
