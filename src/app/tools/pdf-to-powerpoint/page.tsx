'use client';
import { useState } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { FileUpload } from '@/components/ui/FileUpload';
import { Button } from '@/components/ui/button';
import { Loader2, Presentation } from 'lucide-react';
import { downloadFile } from '@/lib/utils/file-download';

export default function PdfToPowerpointTool() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleConvert = async () => {
        if (!file) return;
        setIsProcessing(true);

        try {
            const fd = new FormData();
            fd.append('file', file);

            const res = await fetch('/api/pdf/pdf-to-powerpoint', {
                method: 'POST',
                body: fd
            });

            if (!res.ok) throw new Error('Failed to convert PDF');

            const blob = await res.blob();
            downloadFile(blob, `converted-slides-${file.name.replace('.pdf', '')}.txt`, 'text/plain');
        } catch (error) {
            console.error(error);
            alert('Failed to convert PDF to Powerpoint. Each page will be a slide.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout
            title="PDF to Powerpoint"
            description="Transform your PDF pages into structured Powerpoint slides."
            toolId="pdf-to-powerpoint"
            category="PDF"
        >
            <div className="max-w-xl mx-auto space-y-8">
                {!file ? (
                    <FileUpload
                        onFileSelect={(files) => setFile(files[0])}
                        accept=".pdf"
                        label="Upload PDF to Convert"
                        icon="🎭"
                    />
                ) : (
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-6 animate-in zoom-in">
                        <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                            <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full">
                                <Presentation className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-medium truncate">{file.name}</p>
                                <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setFile(null)} className="ml-auto">Change</Button>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-sm text-blue-800 dark:text-blue-200 text-center">
                            Note: Pages are converted into slide content. Complex formatting is being optimized.
                        </div>

                        <Button
                            onClick={handleConvert}
                            disabled={isProcessing}
                            className="w-full py-6 text-lg font-bold bg-orange-600 hover:bg-orange-700 text-white"
                        >
                            {isProcessing ? <Loader2 className="animate-spin" /> : 'Convert to Powerpoint'}
                        </Button>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
