'use client';

import { useState, useCallback } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { FileUpload } from '@/components/ui/FileUpload';
import { downloadFile } from '@/lib/utils/file-download';

const UnzipFilesTool = () => {
    const [zipFile, setZipFile] = useState<File | null>(null);
    const [extractedFiles, setExtractedFiles] = useState<{ name: string, blob: Blob }[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const onFileSelect = (files: File[]) => {
        if (files[0]) {
            setZipFile(files[0]);
            setExtractedFiles([]);
        }
    };

    const unzipFiles = useCallback(async () => {
        if (!zipFile) return;
        setIsProcessing(true);
        try {
            const JSZip = (await import('jszip')).default;
            const zip = await JSZip.loadAsync(zipFile);
            const files: { name: string, blob: Blob }[] = [];

            const promises = Object.keys(zip.files).map(async (filename) => {
                const file = zip.files[filename];
                if (!file.dir) {
                    const content = await file.async('blob');
                    files.push({ name: filename, blob: content });
                }
            });

            await Promise.all(promises);
            setExtractedFiles(files);
        } catch (err) {
            console.error('Unzip error:', err);
        } finally {
            setIsProcessing(false);
        }
    }, [zipFile]);

    return (
        <ToolLayout title="Unzip Files" description="Extract all files from a ZIP archive quickly and securely directly in your browser." toolId="unzip">
            <div className="max-w-5xl mx-auto space-y-8">
                {!zipFile ? (
                    <FileUpload
                        onFileSelect={onFileSelect}
                        accept=".zip"
                        label="Upload ZIP Archive to Unzip"
                        icon="📂"
                    />
                ) : (
                    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row gap-10 items-center">
                        <div className="flex-1 space-y-8 w-full">
                            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                                <p className="text-[10px] font-bold uppercase text-slate-400 mb-4 block tracking-widest px-1">Archive Details</p>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between items-center text-slate-500">
                                        <span>File Name</span>
                                        <span className="font-bold text-indigo-600 truncate max-w-[200px]">{zipFile.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-slate-500">
                                        <span>Size</span>
                                        <span className="font-bold text-indigo-600">{(zipFile.size / 1024).toFixed(2)} KB</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={unzipFiles}
                                    disabled={isProcessing}
                                    className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {isProcessing ? 'Unzipping...' : 'Unzip Files'}
                                </button>
                                <button
                                    onClick={() => { setZipFile(null); setExtractedFiles([]); }}
                                    className="px-8 py-5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>

                        <div className="w-full lg:w-72 p-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-amber-500 text-white rounded-3xl flex items-center justify-center font-bold text-2xl shadow-lg mb-6">ZIP</div>
                            <h3 className="font-bold text-slate-900 dark:text-white mb-2 truncate max-w-full">{zipFile.name}</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-normal">Ready to Extract</p>
                        </div>
                    </div>
                )}

                {extractedFiles.length > 0 && (
                    <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl border border-white/5 animate-in slide-in-from-bottom-4 duration-500 space-y-6">
                        <div className="flex items-center justify-between border-b border-white/10 pb-6">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400">Extracted Files ({extractedFiles.length})</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                            {extractedFiles.map((file, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-transparent hover:border-white/10 transition-all group">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <span className="shrink-0 w-8 h-8 flex items-center justify-center bg-indigo-500/20 text-indigo-400 rounded-lg text-xs font-bold">{i + 1}</span>
                                        <p className="font-bold text-xs truncate text-indigo-100 group-hover:text-white transition-colors">{file.name}</p>
                                    </div>
                                    <button
                                        onClick={() => downloadFile(file.blob, file.name, 'application/octet-stream')}
                                        className="px-4 py-2 bg-white text-indigo-900 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-400 hover:text-white transition-all shadow-md active:scale-95"
                                    >
                                        Download
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
};

export default UnzipFilesTool;
