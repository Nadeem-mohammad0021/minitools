'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { PDFDocument } from 'pdf-lib';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { downloadFile } from '@/lib/utils/file-download';

const RemovePdfRestrictionsTool = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resultBlob, setResultBlob] = useState<Blob | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
            setResultBlob(null);
        }
    };

    const removeRestrictions = async () => {
        if (!file) return;
        setIsProcessing(true);
        setError(null);

        try {
            const fileBuffer = await file.arrayBuffer();
            // Load and re-save to strip restrictions (often works for non-password restricted files or standard permission flags)
            // For truly password-locked files, Unlock PDF should be used.
            const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true } as any);
            const bytes = await pdfDoc.save();
            setResultBlob(new Blob([bytes as any], { type: 'application/pdf' }));
        } catch (err: any) {
            setError('Failed to strip restrictions. If the file has an owner password, please use the Unlock PDF tool.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout
            title="Remove PDF Restrictions"
            description="Enable printing, copying, and editing for restricted PDF documents"
            toolId="remove-pdf-restrictions"
        >
            <div className="max-w-3xl mx-auto space-y-8">
                {!file ? (
                    <div className="border-2 border-dashed rounded-3xl p-20 text-center cursor-pointer border-slate-300 dark:border-slate-700 hover:border-green-500 transition-all" onClick={() => fileInputRef.current?.click()}>
                        <div className="text-5xl mb-4">🔓</div>
                        <p className="text-xl font-bold">Upload Restricted PDF</p>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf" className="hidden" />
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-10 border border-slate-100 dark:border-slate-700 shadow-2xl text-center">
                        <h3 className="text-xl font-bold mb-8">Ready to Unlock Restrictions</h3>
                        <p className="text-slate-500 mb-10 max-w-sm mx-auto">This will remove permission flags that prevent printing or content copying.</p>
                        <button onClick={removeRestrictions} disabled={isProcessing} className="w-full py-5 bg-green-600 hover:bg-green-700 text-white rounded-3xl font-bold shadow-xl transition-all uppercase tracking-widest">{isProcessing ? 'Processing...' : 'Remove Restrictions'}</button>
                    </div>
                )}

                {resultBlob && (
                    <div className="bg-green-50 dark:bg-green-900/10 border-2 border-green-200 dark:border-green-800 rounded-3xl p-10 text-center animate-in zoom-in duration-500">
                        <h2 className="text-3xl font-bold text-green-600 mb-2">Success!</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-8 font-bold">Permissions flags have been cleared.</p>
                        <button onClick={() => downloadFile(resultBlob, `unrestricted-${file?.name}`, 'application/pdf')} className="px-12 py-5 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold shadow-lg">Download PDF</button>
                    </div>
                )}

                {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-center font-bold">{error}</div>}
            </div>
        </ToolLayout>
    );
};

export default RemovePdfRestrictionsTool;
