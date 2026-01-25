'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { FileUpload } from '@/components/ui/FileUpload';
import { Button } from '@/components/ui/button';
import { Loader2, Table } from 'lucide-react';
import { downloadFile } from '@/lib/utils/file-download';

export default function PdfToExcelTool() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleConvert = async () => {
        if (!file) return;
        setIsProcessing(true);

        try {
            const fd = new FormData();
            fd.append('file', file);

            const res = await fetch('/api/pdf/pdf-to-excel', {
                method: 'POST',
                body: fd
            });

            if (!res.ok) throw new Error('Failed to convert PDF');

            const blob = await res.blob();
            downloadFile(blob, `converted-${file.name.replace('.pdf', '')}.csv`, 'text/csv');
        } catch (error) {
            console.error(error);
            alert('Failed to convert PDF to Excel. This tool works best with PDF tables.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout
            title="PDF to Excel"
            description="Transform your PDF tables and data into editable Excel spreadsheets (CSV)."
            toolId="pdf-to-excel"
            category="PDF"
        >
            <div className="max-w-xl mx-auto space-y-8">
                {!file ? (
                    <FileUpload
                        onFileSelect={(files) => setFile(files[0])}
                        accept=".pdf"
                        label="Upload PDF to Convert"
                        icon="📊"
                    />
                ) : (
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-6 animate-in zoom-in">
                        <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                                <Table className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-medium truncate">{file.name}</p>
                                <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setFile(null)} className="ml-auto">Change</Button>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-sm text-yellow-800 dark:text-yellow-200 text-center">
                            Note: Tables are extracted based on text alignment. Best results with clean grid layouts.
                        </div>

                        <Button
                            onClick={handleConvert}
                            disabled={isProcessing}
                            className="w-full py-6 text-lg font-bold bg-green-600 hover:bg-green-700 text-white"
                        >
                            {isProcessing ? <Loader2 className="animate-spin" /> : 'Convert to Excel (CSV)'}
                        </Button>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
