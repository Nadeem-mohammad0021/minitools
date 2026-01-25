'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { FileUpload } from '@/components/ui/FileUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Trash2 } from 'lucide-react';
import { downloadFile } from '@/lib/utils/file-download';

export default function DeletePdfPagesTool() {
    const [file, setFile] = useState<File | null>(null);
    const [pagesInput, setPagesInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleDelete = async () => {
        if (!file || !pagesInput) return;
        setIsProcessing(true);

        try {
            // Parse "1,3,5-7" style input to array of 0-based indices
            const parts = pagesInput.split(',').map(p => p.trim());
            const indices: number[] = [];

            parts.forEach(part => {
                if (part.includes('-')) {
                    const [start, end] = part.split('-').map(n => parseInt(n));
                    for (let i = start; i <= end; i++) indices.push(i - 1);
                } else {
                    indices.push(parseInt(part) - 1);
                }
            });

            const uniqueIndices = Array.from(new Set(indices.filter(i => !isNaN(i) && i >= 0)));

            const fd = new FormData();
            fd.append('file', file);
            fd.append('pages', JSON.stringify(uniqueIndices));

            const res = await fetch('/api/pdf/delete-pages', {
                method: 'POST',
                body: fd
            });

            if (!res.ok) throw new Error('Failed to delete pages');

            const blob = await res.blob();
            downloadFile(blob, `modified-${file.name}`, 'application/pdf');
        } catch (error) {
            console.error(error);
            alert('Failed to delete pages');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout
            title="Delete PDF Pages"
            description="Remove unwanted pages from your PDF documents."
            toolId="delete-pdf-pages"
            category="PDF"
        >
            <div className="max-w-xl mx-auto space-y-8">
                {!file ? (
                    <FileUpload
                        onFileSelect={(files) => setFile(files[0])}
                        accept=".pdf"
                        label="Upload PDF"
                        icon="🗑️"
                    />
                ) : (
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-6 animate-in zoom-in">
                        <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
                                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-medium truncate">{file.name}</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setFile(null)} className="ml-auto">Change</Button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Pages to Delete</label>
                            <Input
                                type="text"
                                value={pagesInput}
                                onChange={e => setPagesInput(e.target.value)}
                                placeholder="e.g. 1, 3, 5-7"
                                className="mb-2"
                            />
                            <p className="text-xs text-slate-500">Enter page numbers separated by commas or ranges (e.g. 1-5).</p>
                        </div>

                        <Button
                            onClick={handleDelete}
                            disabled={isProcessing}
                            className="w-full py-6 text-lg font-bold bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isProcessing ? <Loader2 className="animate-spin" /> : 'Delete Selected Pages'}
                        </Button>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
