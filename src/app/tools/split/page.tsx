'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { FileUpload } from '@/components/ui/FileUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { downloadFile } from '@/lib/utils/file-download';

export default function SplitPdfTool() {
    const [file, setFile] = useState<File | null>(null);
    const [ranges, setRanges] = useState<{ start: string; end: string }[]>([{ start: '1', end: '1' }]);
    const [isProcessing, setIsProcessing] = useState(false);

    const addRange = () => {
        setRanges([...ranges, { start: '', end: '' }]);
    };

    const removeRange = (index: number) => {
        setRanges(ranges.filter((_, i) => i !== index));
    };

    const updateRange = (index: number, field: 'start' | 'end', value: string) => {
        const newRanges = [...ranges];
        newRanges[index][field] = value;
        setRanges(newRanges);
    };

    const handleSplit = async () => {
        if (!file) return;
        setIsProcessing(true);

        try {
            // Convert 1-based user input to 0-based indices
            const parsedRanges = ranges.map(r => [
                parseInt(r.start) - 1,
                parseInt(r.end || r.start) - 1
            ]);

            const fd = new FormData();
            fd.append('file', file);
            fd.append('ranges', JSON.stringify(parsedRanges));

            const res = await fetch('/api/pdf/split', {
                method: 'POST',
                body: fd
            });

            if (!res.ok) throw new Error('Split failed');

            const blob = await res.blob();
            const filename = parsedRanges.length > 1 ? 'split-files.zip' : 'split-document.pdf';
            const type = parsedRanges.length > 1 ? 'application/zip' : 'application/pdf';

            downloadFile(blob, filename, type);
        } catch (error) {
            console.error(error);
            alert('Failed to split PDF');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout
            title="Split PDF"
            description="Extract specific pages or separate a PDF into multiple documents."
            toolId="split-pdf"
            category="PDF"
        >
            <div className="max-w-4xl mx-auto space-y-8">
                {!file ? (
                    <FileUpload
                        onFileSelect={(files) => setFile(files[0])}
                        accept=".pdf"
                        label="Upload PDF to Split"
                        icon="✂️"
                    />
                ) : (
                    <div className="space-y-8">
                        <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl flex items-center justify-between">
                            <span className="font-semibold">{file.name}</span>
                            <Button variant="ghost" size="sm" onClick={() => setFile(null)}>Change File</Button>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-700">
                            <div className="flex justify-between mb-4">
                                <h3 className="font-bold text-lg">Page Ranges</h3>
                                <Button onClick={addRange} size="sm" variant="outline"><Plus className="w-4 h-4 mr-2" /> Add Range</Button>
                            </div>

                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                {ranges.map((range, i) => (
                                    <div key={i} className="flex gap-4 items-end">
                                        <div className="flex-1">
                                            <label className="text-xs text-slate-500 mb-1 block">From Page</label>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={range.start}
                                                onChange={(e) => updateRange(i, 'start', e.target.value)}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-xs text-slate-500 mb-1 block">To Page</label>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={range.end}
                                                onChange={(e) => updateRange(i, 'end', e.target.value)}
                                            />
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeRange(i)}
                                            disabled={ranges.length === 1}
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50 text-right"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <Button
                                onClick={handleSplit}
                                disabled={isProcessing}
                                className="w-full mt-8 py-6 text-lg"
                            >
                                {isProcessing ? <Loader2 className="animate-spin" /> : 'Split PDF Now'}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
