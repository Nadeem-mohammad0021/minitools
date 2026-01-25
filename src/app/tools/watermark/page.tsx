'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { FileUpload } from '@/components/ui/FileUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Stamp } from 'lucide-react';
import { downloadFile } from '@/lib/utils/file-download';

export default function WatermarkPdfTool() {
    const [file, setFile] = useState<File | null>(null);
    const [text, setText] = useState('CONFIDENTIAL');
    const [size, setSize] = useState(50);
    const [opacity, setOpacity] = useState(0.5);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleWatermark = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !text) return;
        setIsProcessing(true);

        try {
            const fd = new FormData();
            fd.append('file', file);
            fd.append('text', text);
            fd.append('size', size.toString());
            fd.append('opacity', opacity.toString());

            const res = await fetch('/api/pdf/watermark', {
                method: 'POST',
                body: fd
            });

            if (!res.ok) throw new Error('Failed to add watermark');

            const blob = await res.blob();
            downloadFile(blob, `watermarked-${file.name}`, 'application/pdf');
        } catch (error) {
            console.error(error);
            alert('Failed to add watermark');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout
            title="Add Watermark"
            description="Stamp your documents with custom text watermarks for security and branding."
            toolId="add-watermark"
            category="PDF"
        >
            <div className="max-w-xl mx-auto space-y-8">
                {!file ? (
                    <FileUpload
                        onFileSelect={(files) => setFile(files[0])}
                        accept=".pdf"
                        label="Upload PDF to Watermark"
                        icon="🛡️"
                    />
                ) : (
                    <form onSubmit={handleWatermark} className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-6 animate-in zoom-in">
                        <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
                                <Stamp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-medium truncate">{file.name}</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setFile(null)} className="ml-auto" type="button">Change</Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-2">Watermark Text</label>
                                <Input
                                    type="text"
                                    value={text}
                                    onChange={e => setText(e.target.value)}
                                    required
                                    placeholder="e.g. DRAFT"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Font Size ({size}px)</label>
                                <input
                                    type="range" min="10" max="200"
                                    value={size} onChange={e => setSize(parseInt(e.target.value))}
                                    className="w-full accent-indigo-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Opacity ({Math.round(opacity * 100)}%)</label>
                                <input
                                    type="range" min="0.1" max="1" step="0.1"
                                    value={opacity} onChange={e => setOpacity(parseFloat(e.target.value))}
                                    className="w-full accent-indigo-600"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isProcessing}
                            className="w-full py-6 text-lg font-bold"
                        >
                            {isProcessing ? <Loader2 className="animate-spin" /> : 'Add Watermark'}
                        </Button>
                    </form>
                )}
            </div>
        </ToolLayout>
    );
}
