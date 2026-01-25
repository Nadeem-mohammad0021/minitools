'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { FileUpload } from '@/components/ui/FileUpload';
import { Button } from '@/components/ui/button';
import { Loader2, Shrink, Image as ImageIcon } from 'lucide-react';
import { downloadFile } from '@/lib/utils/file-download';

export default function ImageCompressorTool() {
    const [file, setFile] = useState<File | null>(null);
    const [quality, setQuality] = useState(80);
    const [format, setFormat] = useState('webp');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCompress = async () => {
        if (!file) return;
        setIsProcessing(true);

        try {
            const fd = new FormData();
            fd.append('file', file);
            fd.append('quality', quality.toString());
            fd.append('format', format);

            const res = await fetch('/api/image/compress', {
                method: 'POST',
                body: fd
            });

            if (!res.ok) throw new Error('Failed to compress image');

            const blob = await res.blob();
            const ext = format === 'jpeg' ? 'jpg' : format;
            downloadFile(blob, `compressed-${file.name.split('.')[0]}.${ext}`, `image/${format}`);
        } catch (error) {
            console.error(error);
            alert('Failed to compress image');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout
            title="Image Compressor"
            description="High-performance image optimization powered by Sharp. Reduce size without losing quality."
            toolId="image-compress"
            category="Image"
        >
            <div className="max-w-xl mx-auto space-y-8">
                {!file ? (
                    <FileUpload
                        onFileSelect={(f) => setFile(f[0])}
                        accept="image/*"
                        label="Upload Image to Optimize"
                        icon="🗜️"
                    />
                ) : (
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-8 animate-in zoom-in shadow-xl">
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="relative group">
                                <img src={URL.createObjectURL(file)} className="max-h-48 rounded-2xl shadow-lg group-hover:scale-[1.02] transition-transform duration-500" alt="Preview" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-2xl transition-all" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold truncate max-w-xs">{file.name}</h3>
                                <p className="text-slate-500 font-medium">Original: {(file.size / 1024).toFixed(0)} KB</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-4">
                                <label className="block text-sm font-bold uppercase tracking-widest text-slate-500">Quality: {quality}%</label>
                                <input
                                    type="range"
                                    min="1"
                                    max="100"
                                    value={quality}
                                    onChange={(e) => setQuality(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="block text-sm font-bold uppercase tracking-widest text-slate-500">Output Format</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['webp', 'jpeg', 'png'].map((f) => (
                                        <button
                                            key={f}
                                            onClick={() => setFormat(f)}
                                            className={`py-3 rounded-xl font-bold border-2 transition-all uppercase text-xs ${format === f
                                                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700'
                                                : 'border-slate-100 dark:border-slate-800 text-slate-500 hover:border-indigo-200'
                                                }`}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button
                                onClick={handleCompress}
                                disabled={isProcessing}
                                className="w-full py-8 text-xl font-black bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-lg hover:shadow-indigo-500/25 transition-all active:scale-[0.98]"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="animate-spin mr-3" />
                                        OPTIMIZING...
                                    </>
                                ) : (
                                    'OPTIMIZE IMAGE'
                                )}
                            </Button>

                            <Button variant="ghost" onClick={() => setFile(null)} className="w-full py-6 text-slate-400 hover:text-slate-600 font-bold uppercase tracking-widest text-[10px]">
                                Try another image
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
