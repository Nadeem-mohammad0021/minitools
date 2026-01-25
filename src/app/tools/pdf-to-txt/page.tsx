'use client';

import { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { FileUpload } from '@/components/ui/FileUpload';
import { downloadFile } from '@/lib/utils/file-download';

const PdfToTxtTool = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [extractedText, setExtractedText] = useState('');

    const onFileSelect = (files: File[]) => {
        if (files[0]) {
            setFile(files[0]);
            setExtractedText('');
        }
    };

    const convertToText = useCallback(async () => {
        if (!file) return;
        setIsProcessing(true);
        try {
            const fd = new FormData();
            fd.append('file', file);

            const res = await fetch('/api/pdf/pdf-to-txt', {
                method: 'POST',
                body: fd
            });

            if (!res.ok) throw new Error('Failed to extract text');

            const data = await res.json();
            setExtractedText(data.text || 'No text content found in this PDF.');
        } catch (err) {
            console.error('Conversion error:', err);
            alert('Failed to extract text from PDF.');
        } finally {
            setIsProcessing(false);
        }
    }, [file]);

    return (
        <ToolLayout title="PDF to Text" description="Easily extract text and document information from your PDF files into a clean text format." toolId="pdf-to-txt">
            <div className="max-w-5xl mx-auto space-y-8">
                {!file ? (
                    <FileUpload
                        onFileSelect={onFileSelect}
                        accept=".pdf"
                        label="Upload PDF to Convert"
                        icon="📄"
                    />
                ) : (
                    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row gap-8 items-start">
                        <div className="w-full lg:w-80 p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-red-600 dark:bg-red-500 rounded-2xl flex items-center justify-center text-white mb-4 text-xl font-bold shadow-lg shadow-red-100 dark:shadow-none">PDF</div>
                            <h3 className="font-bold text-sm mb-1 truncate max-w-full text-slate-900 dark:text-white px-2">{file.name}</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 px-1">Ready for conversion</p>
                        </div>

                        <div className="flex-1 w-full space-y-6">
                            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                                <p className="text-[10px] font-bold uppercase text-slate-400 mb-4 block tracking-widest px-1">Document Settings</p>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-500 dark:text-slate-400">Output Format</span>
                                        <span className="font-bold text-indigo-600 dark:text-indigo-400">Plain Text (.txt)</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-500 dark:text-slate-400">Conversion Type</span>
                                        <span className="font-bold text-indigo-600 dark:text-indigo-400">Structural Extraction</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={convertToText}
                                    disabled={isProcessing}
                                    className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {isProcessing ? 'Converting...' : 'Convert to Text'}
                                </button>
                                <button
                                    onClick={() => { setFile(null); setExtractedText(''); }}
                                    className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {extractedText && (
                    <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl border border-white/5 animate-in slide-in-from-bottom-8 duration-500 space-y-6 relative overflow-hidden group">
                        <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-500 rounded-full blur-[120px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                        <div className="flex items-center justify-between border-b border-white/10 pb-6 relative z-10">
                            <div className="space-y-1">
                                <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400">Extracted Content</h2>
                                <p className="text-[10px] text-slate-400">Preview of the converted text</p>
                            </div>
                            <button
                                onClick={() => downloadFile(new Blob([extractedText], { type: 'text/plain' }), `kynex-extracted.txt`, 'text/plain')}
                                className="px-6 py-3 bg-white text-indigo-900 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-400 hover:text-white transition-all shadow-xl active:scale-95"
                            >
                                Download Text
                            </button>
                        </div>
                        <div className="relative z-10 bg-black/40 rounded-2xl p-6 border border-white/5">
                            <pre className="font-mono text-xs leading-relaxed text-indigo-100/80 whitespace-pre-wrap max-h-[350px] overflow-auto scrollbar-hide italic">
                                {extractedText}
                            </pre>
                        </div>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
};

export default PdfToTxtTool;
