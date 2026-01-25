'use client';

import { useState, useCallback } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { downloadFile } from '@/lib/utils/file-download';

const TxtToPdfTool = () => {
    const [text, setText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [resultBlob, setResultBlob] = useState<Blob | null>(null);

    const createPdf = useCallback(async () => {
        if (!text.trim()) return;
        setIsProcessing(true);
        try {
            const pdfDoc = await PDFDocument.create();
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
            let page = pdfDoc.addPage();
            const { height } = page.getSize();
            const fontSize = 12;
            const margin = 50;
            let y = height - margin;

            const lines = text.split('\n');
            for (const line of lines) {
                if (y < margin + fontSize) {
                    page = pdfDoc.addPage();
                    y = height - margin;
                }
                page.drawText(line, {
                    x: margin,
                    y,
                    size: fontSize,
                    font,
                    color: rgb(0, 0, 0),
                });
                y -= fontSize + 5;
            }

            const pdfBytes = await pdfDoc.save();
            setResultBlob(new Blob([(pdfBytes as any).buffer], { type: 'application/pdf' }));
        } catch (err) {
            console.error('Text to PDF error:', err);
        } finally {
            setIsProcessing(false);
        }
    }, [text]);

    return (
        <ToolLayout title="Text to PDF" description="Convert plain text or notes into a clean, professional PDF document instantly." toolId="txt-to-pdf">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-8">
                    <div className="relative group">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block px-1">Text Input</label>
                        <textarea
                            value={text}
                            onChange={e => { setText(e.target.value); setResultBlob(null); }}
                            placeholder="Type or paste your text here..."
                            className="w-full h-[400px] p-8 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 rounded-[24px] outline-none font-sans text-lg transition-all shadow-inner leading-relaxed resize-none scrollbar-hide"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={createPdf}
                            disabled={isProcessing || !text.trim()}
                            className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isProcessing ? 'Creating PDF...' : 'Create PDF'}
                        </button>
                        <button
                            onClick={() => { setText(''); setResultBlob(null); }}
                            className="px-10 py-5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95"
                        >
                            Clear
                        </button>
                    </div>
                </div>

                {resultBlob && (
                    <div className="bg-slate-900 rounded-[32px] p-10 text-white shadow-2xl border border-white/5 animate-in slide-in-from-bottom-4 duration-500 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="space-y-2 text-center md:text-left">
                            <h2 className="text-2xl font-bold tracking-tight">PDF Document Ready</h2>
                            <p className="text-indigo-300 text-sm font-medium">Your text has been successfully converted to a PDF file.</p>
                        </div>
                        <button
                            onClick={() => downloadFile(resultBlob, 'converted_text.pdf', 'application/pdf')}
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

export default TxtToPdfTool;
