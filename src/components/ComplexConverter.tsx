'use client';

import { useState, useCallback } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { FileUpload } from '@/components/ui/FileUpload';

const ComplexConverterPlaceholder = ({ title, description, id, from, to }: { title: string; description: string; id: string; from: string; to: string }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const onFileSelect = (files: File[]) => {
        if (files[0]) {
            setFile(files[0]);
        }
    };

    const startConversion = useCallback(() => {
        setIsProcessing(true);
        setTimeout(() => {
            alert(`${to} conversion is currently under development. This feature will be available soon!`);
            setIsProcessing(false);
        }, 2000);
    }, [to]);

    return (
        <ToolLayout title={title} description={description} toolId={id}>
            <div className="max-w-5xl mx-auto space-y-8">
                {!file ? (
                    <FileUpload
                        onFileSelect={onFileSelect}
                        accept="*"
                        label={`Upload ${from} to Convert`}
                        icon="📄"
                    />
                ) : (
                    <div className="bg-slate-900 rounded-[32px] p-12 text-white shadow-2xl border border-white/5 animate-in zoom-in duration-500 relative overflow-hidden group">
                        <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-500 rounded-full blur-[120px] opacity-10 group-hover:opacity-20 transition-opacity"></div>

                        <div className="flex flex-col items-center text-center relative z-10">
                            <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center text-3xl mb-8 animate-pulse border border-white/10 backdrop-blur-sm">⚙️</div>
                            <h2 className="text-2xl font-bold mb-2 tracking-tight">File: {file.name}</h2>
                            <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-10">Ready to convert to {to}</p>

                            <div className="w-full max-w-md h-1.5 bg-white/5 rounded-full overflow-hidden mb-12 border border-white/10">
                                <div className="h-full bg-indigo-500 w-3/4 shadow-[0_0_20px_rgba(99,102,241,0.5)]"></div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                                <button
                                    onClick={startConversion}
                                    disabled={isProcessing}
                                    className="px-12 py-5 bg-white text-indigo-900 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-indigo-400 hover:text-white transition-all shadow-xl active:scale-95 disabled:opacity-50"
                                >
                                    {isProcessing ? 'Converting...' : 'Convert Now'}
                                </button>
                                <button
                                    onClick={() => setFile(null)}
                                    className="px-8 py-5 bg-white/5 text-slate-400 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:text-white hover:bg-white/10 transition-all border border-white/5"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
};

export default ComplexConverterPlaceholder;
