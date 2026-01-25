'use client';

import { useState, useCallback } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { FileUpload } from '@/components/ui/FileUpload';
import { downloadFile } from '@/lib/utils/file-download';

const AddHeaderFooterTool = () => {
    const [file, setFile] = useState<File | null>(null);
    const [header, setHeader] = useState('');
    const [footer, setFooter] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [resultBlob, setResultBlob] = useState<Blob | null>(null);

    const onFileSelect = (files: File[]) => {
        if (files[0]) {
            setFile(files[0]);
            setResultBlob(null);
        }
    };

    const addHeaderFooter = useCallback(async () => {
        if (!file) return;
        setIsProcessing(true);
        try {
            const buffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(buffer);
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

            pdfDoc.getPages().forEach(page => {
                const { width, height } = page.getSize();
                if (header) {
                    page.drawText(header, {
                        x: 50,
                        y: height - 40,
                        size: 10,
                        font,
                        color: rgb(0.4, 0.4, 0.4),
                    });
                }
                if (footer) {
                    page.drawText(footer, {
                        x: 50,
                        y: 40,
                        size: 10,
                        font,
                        color: rgb(0.4, 0.4, 0.4),
                    });
                }
            });

            const pdfBytes = await pdfDoc.save();
            setResultBlob(new Blob([(pdfBytes as any).buffer], { type: 'application/pdf' }));
        } catch (err) {
            console.error('Header/Footer error:', err);
        } finally {
            setIsProcessing(false);
        }
    }, [file, header, footer]);

    return (
        <ToolLayout title="Add Header & Footer" description="Add custom headers and footers to your PDF documents for professional branding and numbering." toolId="header-footer">
            <div className="max-w-5xl mx-auto space-y-8">
                {!file ? (
                    <FileUpload
                        onFileSelect={onFileSelect}
                        accept=".pdf"
                        label="Upload PDF to Add Header & Footer"
                        icon="📋"
                    />
                ) : (
                    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row gap-10">
                        <div className="flex-1 space-y-8 w-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider px-1">Header Text</label>
                                    <input
                                        value={header}
                                        onChange={e => setHeader(e.target.value)}
                                        placeholder="e.g. Project Whitepaper 2026"
                                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-bold shadow-inner transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider px-1">Footer Text</label>
                                    <input
                                        value={footer}
                                        onChange={e => setFooter(e.target.value)}
                                        placeholder="e.g. Internal Use Only"
                                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-bold shadow-inner transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={addHeaderFooter}
                                    disabled={isProcessing || (!header && !footer)}
                                    className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {isProcessing ? 'Processing PDF...' : 'Add to PDF'}
                                </button>
                                <button
                                    onClick={() => { setFile(null); setResultBlob(null); }}
                                    className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>

                        <div className="w-full lg:w-72 p-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-slate-900 dark:bg-white/10 rounded-2xl flex items-center justify-center text-white mb-4 font-bold">PDF</div>
                            <h3 className="font-bold text-slate-900 dark:text-white mb-1 truncate max-w-full">{file.name}</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ready to process</p>
                        </div>
                    </div>
                )}

                {resultBlob && (
                    <div className="bg-slate-900 rounded-[32px] p-10 text-white shadow-2xl border border-white/5 animate-in slide-in-from-bottom-4 duration-500 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="space-y-2 text-center md:text-left">
                            <h2 className="text-2xl font-bold tracking-tight">Document Updated</h2>
                            <p className="text-indigo-300 text-sm font-medium">Headers and footers have been successfully integrated.</p>
                        </div>
                        <button
                            onClick={() => downloadFile(resultBlob, `updated-${file?.name}`, 'application/pdf')}
                            className="w-full md:w-auto px-10 py-5 bg-white text-indigo-900 rounded-2xl font-bold text-lg hover:bg-indigo-400 hover:text-white transition-all shadow-xl active:scale-95"
                        >
                            Download PDF
                        </button>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
};

export default AddHeaderFooterTool;
