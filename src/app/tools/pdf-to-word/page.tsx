'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { FileUpload } from '@/components/ui/FileUpload';
import { Button } from '@/components/ui/button';
import { Loader2, FileText } from 'lucide-react';
import { downloadFile } from '@/lib/utils/file-download';

export default function PdfToWordTool() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleConvert = async () => {
        if (!file) return;
        setIsProcessing(true);

        try {
            const fd = new FormData();
            fd.append('file', file);

            const res = await fetch('/api/pdf/pdf-to-word', {
                method: 'POST',
                body: fd
            });

            if (!res.ok) throw new Error('Failed to convert PDF');

            const blob = await res.blob();
            downloadFile(blob, `converted-${file.name.replace('.pdf', '')}.docx`, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        } catch (error) {
            console.error(error);
            alert('Failed to convert PDF');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout
            title="PDF to Word"
            description="Convert PDF documents to editable Word (.docx) files. Extracts text content."
            toolId="pdf-to-word"
            category="PDF"
        >
            <div className="max-w-xl mx-auto space-y-8">
                {!file ? (
                    <FileUpload
                        onFileSelect={(files) => setFile(files[0])}
                        accept=".pdf"
                        label="Upload PDF to Convert"
                        icon="📝"
                    />
                ) : (
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-6 animate-in zoom-in">
                        <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-medium truncate">{file.name}</p>
                                <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setFile(null)} className="ml-auto">Change</Button>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-sm text-yellow-800 dark:text-yellow-200">
                            <strong>Note:</strong> This tool extracts text and paragraphs. Complex formatting, images, and tables may not be preserved perfectly.
                        </div>

                        <Button
                            onClick={handleConvert}
                            disabled={isProcessing}
                            className="w-full py-6 text-lg font-bold"
                        >
                            {isProcessing ? <Loader2 className="animate-spin" /> : 'Convert to Word'}
                        </Button>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
