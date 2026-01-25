'use client';

import { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { FileUpload } from '@/components/ui/FileUpload';

const PdfMetadataViewerTool = () => {
    const [metadata, setMetadata] = useState<Record<string, any> | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [fileName, setFileName] = useState('');

    const readMetadata = useCallback(async (files: File[]) => {
        if (files[0]) {
            const file = files[0];
            setFileName(file.name);
            setIsProcessing(true);
            try {
                const bytes = await file.arrayBuffer();
                const pdf = await PDFDocument.load(bytes);
                setMetadata({
                    'Title': pdf.getTitle(),
                    'Author': pdf.getAuthor(),
                    'Subject': pdf.getSubject(),
                    'Creator': pdf.getCreator(),
                    'Keywords': pdf.getKeywords(),
                    'Producer': pdf.getProducer(),
                    'Created On': pdf.getCreationDate()?.toLocaleString(),
                    'Modified On': pdf.getModificationDate()?.toLocaleString(),
                    'Page Count': pdf.getPageCount(),
                    'Security': pdf.isEncrypted ? 'Protected (Encrypted)' : 'None (Open)'
                });
            } catch {
                setMetadata({ error: 'Failed to read document information.' });
            } finally {
                setIsProcessing(false);
            }
        }
    }, []);

    return (
        <ToolLayout title="PDF Metadata Viewer" description="Quickly view properties, author info, and creation dates hidden within your PDF documents." toolId="pdf-metadata">
            <div className="max-w-5xl mx-auto space-y-10">
                {!metadata && !isProcessing ? (
                    <FileUpload
                        onFileSelect={readMetadata}
                        accept=".pdf"
                        label="Upload PDF to View Properties"
                        icon="🔍"
                    />
                ) : isProcessing ? (
                    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-20 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                        <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold mb-6 mx-auto animate-pulse">PDF</div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Reading Document...</h2>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Please wait while we extract properties</p>
                    </div>
                ) : (
                    <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500">
                        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-red-600 dark:bg-red-500 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shadow-red-100 dark:shadow-none">PDF</div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white truncate max-w-xs">{fileName}</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Properties Extracted</p>
                                </div>
                            </div>
                            <button
                                onClick={() => { setMetadata(null); setFileName(''); }}
                                className="px-8 py-3 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                            >
                                Change File
                            </button>
                        </div>

                        {metadata && !metadata.error ? (
                            <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Document Information</h3>
                                    <span className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">Metadata Decoded</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(metadata).map(([key, value]) => (
                                        <div key={key} className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 group hover:border-indigo-500/30 transition-all">
                                            <p className="text-[10px] font-bold uppercase text-slate-400 mb-2 tracking-widest">{key}</p>
                                            <p className="font-bold text-slate-900 dark:text-slate-100 truncate">{value || 'No information'}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-3xl font-bold text-center border border-red-100 dark:border-red-900/20">
                                {metadata?.error || 'Unknown error occurred.'}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </ToolLayout>
    );
};

export default PdfMetadataViewerTool;
