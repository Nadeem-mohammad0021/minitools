'use client';

import { useState, useCallback } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { FileUpload } from '@/components/ui/FileUpload';
import { downloadFile } from '@/lib/utils/file-download';

const ZipFileCreatorTool = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [resultBlob, setResultBlob] = useState<Blob | null>(null);

    const onFileSelect = (newFiles: File[]) => {
        setFiles(prev => [...prev, ...newFiles]);
        setResultBlob(null);
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setResultBlob(null);
    };

    const createZip = useCallback(async () => {
        if (files.length === 0) return;
        setIsProcessing(true);
        try {
            const JSZip = (await import('jszip')).default;
            const zip = new JSZip();
            files.forEach(file => zip.file(file.name, file));
            const blob = await zip.generateAsync({ type: 'blob' });
            setResultBlob(blob);
        } catch (err) {
            console.error('ZIP creation error:', err);
        } finally {
            setIsProcessing(false);
        }
    }, [files]);

    return (
        <ToolLayout title="ZIP File Creator" description="Bundle multiple files into a single compressed ZIP archive for easier storage and sharing." toolId="zip-create">
            <div className="max-w-5xl mx-auto space-y-8">
                <FileUpload
                    onFileSelect={onFileSelect}
                    multiple
                    label="Upload Files to ZIP"
                    icon="📦"
                />

                {files.length > 0 && (
                    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row gap-8 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="flex-1 space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 px-2">Selected Files ({files.length})</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto p-2 scrollbar-hide bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                                {files.map((file, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <span className="shrink-0 w-6 h-6 flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-md text-[10px] font-bold">{i + 1}</span>
                                            <p className="font-bold text-xs truncate text-slate-700 dark:text-slate-300">{file.name}</p>
                                        </div>
                                        <button
                                            onClick={() => removeFile(i)}
                                            className="text-red-500 hover:text-red-600 transition-colors p-1"
                                        >
                                            <span className="text-xl leading-none">×</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="w-full lg:w-72 flex flex-col gap-4">
                            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 text-center flex flex-col items-center">
                                <div className="w-12 h-12 bg-amber-500 text-white rounded-xl flex items-center justify-center font-bold mb-3 shadow-lg">ZIP</div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-normal">Ready to Compress</p>
                            </div>
                            <button
                                onClick={createZip}
                                disabled={isProcessing}
                                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100 dark:shadow-none transition-all active:scale-95 disabled:opacity-50"
                            >
                                {isProcessing ? 'Compressing...' : 'Create ZIP'}
                            </button>
                            <button
                                onClick={() => setFiles([])}
                                className="w-full text-[10px] font-bold uppercase text-slate-400 tracking-widest hover:text-red-500 transition-colors"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>
                )}

                {resultBlob && (
                    <div className="bg-slate-900 rounded-[32px] p-10 text-white shadow-2xl border border-white/5 animate-in zoom-in duration-500 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="space-y-2 text-center md:text-left">
                            <h2 className="text-2xl font-bold tracking-tight">ZIP Created Successfully</h2>
                            <p className="text-indigo-300 text-sm font-medium">Your compressed archive is ready for download.</p>
                        </div>
                        <button
                            onClick={() => downloadFile(resultBlob, 'archive.zip', 'application/zip')}
                            className="w-full md:w-auto px-10 py-5 bg-white text-indigo-900 rounded-2xl font-bold text-lg hover:bg-indigo-400 hover:text-white transition-all shadow-xl active:scale-95"
                        >
                            Download ZIP
                        </button>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
};

export default ZipFileCreatorTool;
