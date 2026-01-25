'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { FileUpload } from '@/components/ui/FileUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowLeftRight } from 'lucide-react';
import { downloadFile } from '@/lib/utils/file-download';

export default function ReorderPdfPagesTool() {
    const [file, setFile] = useState<File | null>(null);
    const [orderInput, setOrderInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleReorder = async () => {
        if (!file || !orderInput) return;
        setIsProcessing(true);

        try {
            // Parse "1,3,2" -> [0, 2, 1]
            const indices = orderInput.split(',').map(p => parseInt(p.trim()) - 1).filter(i => !isNaN(i) && i >= 0);

            const fd = new FormData();
            fd.append('file', file);
            fd.append('order', JSON.stringify(indices));

            const res = await fetch('/api/pdf/reorder-pages', {
                method: 'POST',
                body: fd
            });

            if (!res.ok) throw new Error('Failed to reorder pages');

            const blob = await res.blob();
            downloadFile(blob, `reordered-${file.name}`, 'application/pdf');
        } catch (error) {
            console.error(error);
            alert('Failed to reorder pages');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout
            title="Reorder PDF Pages"
            description="Change the order of pages in your PDF document."
            toolId="reorder-pdf-pages"
            category="PDF"
        >
            <div className="max-w-xl mx-auto space-y-8">
                {!file ? (
                    <FileUpload
                        onFileSelect={(files) => setFile(files[0])}
                        accept=".pdf"
                        label="Upload PDF"
                        icon="↔️"
                    />
                ) : (
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-6 animate-in zoom-in">
                        <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                            <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full">
                                <ArrowLeftRight className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-medium truncate">{file.name}</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setFile(null)} className="ml-auto">Change</Button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">New Page Order</label>
                            <Input
                                type="text"
                                value={orderInput}
                                onChange={e => setOrderInput(e.target.value)}
                                placeholder="e.g. 2, 1, 3, 4"
                                className="mb-2"
                            />
                            <p className="text-xs text-slate-500">Enter page numbers in the desired order, separated by commas.</p>
                        </div>

                        <Button
                            onClick={handleReorder}
                            disabled={isProcessing}
                            className="w-full py-6 text-lg font-bold"
                        >
                            {isProcessing ? <Loader2 className="animate-spin" /> : 'Reorder Pages'}
                        </Button>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
