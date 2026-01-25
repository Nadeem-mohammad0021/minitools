'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { FileUpload } from '@/components/ui/FileUpload';
import { Button } from '@/components/ui/button';
import { Loader2, Images } from 'lucide-react';
import { downloadFile } from '@/lib/utils/file-download';

export default function ImageToPdfTool() {
    const [files, setFiles] = useState<File[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleConvert = async () => {
        if (files.length === 0) return;
        setIsProcessing(true);

        try {
            const fd = new FormData();
            files.forEach(f => fd.append('files', f));

            const res = await fetch('/api/pdf/image-to-pdf', {
                method: 'POST',
                body: fd
            });

            if (!res.ok) throw new Error('Failed to convert images');

            const blob = await res.blob();
            downloadFile(blob, `images-converted.pdf`, 'application/pdf');
        } catch (error) {
            console.error(error);
            alert('Failed to convert images');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout
            title="Image to PDF"
            description="Convert your JPG and PNG images into a single PDF document instantly."
            toolId="image-to-pdf"
            category="PDF"
        >
            <div className="max-w-xl mx-auto space-y-8">
                <FileUpload
                    onFileSelect={(uploaded) => setFiles(prev => [...prev, ...uploaded])}
                    accept="image/jpeg, image/png, image/jpg"
                    multiple={true}
                    label="Upload Images (JPG/PNG)"
                    icon="🖼️"
                />

                {files.length > 0 && (
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-6 animate-in zoom-in">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold flex items-center gap-2">
                                <Images className="w-5 h-5 text-indigo-500" />
                                Selected Images ({files.length})
                            </h3>
                            <Button variant="ghost" size="sm" onClick={() => setFiles([])} className="text-red-500 hover:text-red-600 hover:bg-red-50">Clear All</Button>
                        </div>

                        <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            {files.map((f, i) => (
                                <div key={i} className="aspect-square bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden relative group">
                                    <img
                                        src={URL.createObjectURL(f)}
                                        alt={f.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs text-center p-1 break-all">
                                        {f.name}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Button
                            onClick={handleConvert}
                            disabled={isProcessing}
                            className="w-full py-6 text-lg font-bold"
                        >
                            {isProcessing ? <Loader2 className="animate-spin" /> : 'Convert to PDF'}
                        </Button>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
