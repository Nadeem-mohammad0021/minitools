'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { FileUpload } from '@/components/ui/FileUpload';
import { Button } from '@/components/ui/button';
import { Loader2, Hash, AlignRight, AlignCenter } from 'lucide-react';
import { downloadFile } from '@/lib/utils/file-download';

export default function PageNumbersPdfTool() {
    const [file, setFile] = useState<File | null>(null);
    const [position, setPosition] = useState<'bottom-center' | 'bottom-right'>('bottom-right');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleAddNumbers = async () => {
        if (!file) return;
        setIsProcessing(true);

        try {
            const fd = new FormData();
            fd.append('file', file);
            fd.append('position', position);

            const res = await fetch('/api/pdf/page-numbers', {
                method: 'POST',
                body: fd
            });

            if (!res.ok) throw new Error('Failed to add page numbers');

            const blob = await res.blob();
            downloadFile(blob, `numbered-${file.name}`, 'application/pdf');
        } catch (error) {
            console.error(error);
            alert('Failed to add page numbers');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout
            title="Add Page Numbers"
            description="Insert page numbers into your PDF document easily."
            toolId="add-page-numbers"
            category="PDF"
        >
            <div className="max-w-xl mx-auto space-y-8">
                {!file ? (
                    <FileUpload
                        onFileSelect={(files) => setFile(files[0])}
                        accept=".pdf"
                        label="Upload PDF"
                        icon="🔢"
                    />
                ) : (
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-8 animate-in zoom-in">
                        <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full">
                                <Hash className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-medium truncate">{file.name}</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setFile(null)} className="ml-auto">Change</Button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-4 text-center">Select Position</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setPosition('bottom-center')}
                                    className={`p-6 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${position === 'bottom-center'
                                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700'
                                            : 'border-slate-200 hover:border-indigo-200'
                                        }`}
                                >
                                    <AlignCenter className="w-8 h-8 opacity-70" />
                                    <span className="font-medium text-sm">Bottom Center</span>
                                </button>

                                <button
                                    onClick={() => setPosition('bottom-right')}
                                    className={`p-6 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${position === 'bottom-right'
                                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700'
                                            : 'border-slate-200 hover:border-indigo-200'
                                        }`}
                                >
                                    <AlignRight className="w-8 h-8 opacity-70" />
                                    <span className="font-medium text-sm">Bottom Right</span>
                                </button>
                            </div>
                        </div>

                        <Button
                            onClick={handleAddNumbers}
                            disabled={isProcessing}
                            className="w-full py-6 text-lg font-bold"
                        >
                            {isProcessing ? <Loader2 className="animate-spin" /> : 'Add Page Numbers'}
                        </Button>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
