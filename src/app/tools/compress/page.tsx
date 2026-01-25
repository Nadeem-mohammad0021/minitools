'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { FileUpload } from '@/components/ui/FileUpload';
import { Button } from '@/components/ui/button';
import { Loader2, Minimize2 } from 'lucide-react';
import { downloadFile } from '@/lib/utils/file-download';

export default function CompressPdfTool() {
    const [file, setFile] = useState<File | null>(null);
    const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('medium');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCompress = async () => {
        if (!file) return;
        setIsProcessing(true);

        try {
            const fd = new FormData();
            fd.append('file', file);
            fd.append('quality', quality);

            const res = await fetch('/api/pdf/compress', {
                method: 'POST',
                body: fd
            });

            if (!res.ok) throw new Error('Failed to compress PDF');

            const blob = await res.blob();
            downloadFile(blob, `compressed-${file.name}`, 'application/pdf');
        } catch (error) {
            console.error(error);
            alert('Failed to compress PDF');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout
            title="Compress PDF"
            description="Reduce the file size of your PDF documents while maintaining quality."
            toolId="compress-pdf"
            category="PDF"
        >
            <div className="max-w-xl mx-auto space-y-8">
                {!file ? (
                    <FileUpload
                        onFileSelect={(files) => setFile(files[0])}
                        accept=".pdf"
                        label="Upload PDF to Compress"
                        icon="🗜️"
                    />
                ) : (
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-6 text-center animate-in zoom-in">
                        <div className="flex flex-col items-center gap-4">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full">
                                <Minimize2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="overflow-hidden">
                                <h3 className="text-xl font-bold truncate max-w-xs mx-auto">{file.name}</h3>
                                <p className="text-slate-500">Original size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        </div>

                        <div className="space-y-4 py-4">
                            <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest">Compression Level</label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { id: 'low', label: 'Low', desc: 'Large size, Best quality' },
                                    { id: 'medium', label: 'Medium', desc: 'Balanced' },
                                    { id: 'high', label: 'Extreme', desc: 'Small size, Lower quality' }
                                ].map((q) => (
                                    <button
                                        key={q.id}
                                        onClick={() => setQuality(q.id as any)}
                                        className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${quality === q.id
                                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700'
                                            : 'border-slate-100 dark:border-slate-800 text-slate-500 hover:border-indigo-200'
                                            }`}
                                    >
                                        <span className="font-bold">{q.label}</span>
                                        <span className="text-[10px] opacity-70">{q.desc}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button
                                onClick={handleCompress}
                                disabled={isProcessing}
                                className="w-full py-8 text-lg font-bold"
                            >
                                {isProcessing ? <Loader2 className="animate-spin" /> : 'Compress PDF'}
                            </Button>

                            <Button variant="ghost" onClick={() => setFile(null)} className="w-full">
                                Change File
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
