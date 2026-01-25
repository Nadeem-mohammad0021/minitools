'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { FileUpload } from '@/components/ui/FileUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Shield, Image as ImageIcon } from 'lucide-react';
import { downloadFile } from '@/lib/utils/file-download';

export default function AddImageWatermarkTool() {
    const [file, setFile] = useState<File | null>(null);
    const [watermark, setWatermark] = useState<File | null>(null);
    const [opacity, setOpacity] = useState(0.5);
    const [rotation, setRotation] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleApplyWatermark = async () => {
        if (!file || !watermark) return;
        setIsProcessing(true);

        try {
            const fd = new FormData();
            fd.append('file', file);
            fd.append('watermark', watermark);
            fd.append('opacity', opacity.toString());
            fd.append('rotation', rotation.toString());

            const res = await fetch('/api/pdf/add-image-watermark', {
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
            title="Add Image Watermark"
            description="Add your logo or any image as a watermark to every page of your PDF."
            toolId="add-image-watermark"
            category="PDF"
        >
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Step 1: Upload PDF */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <span className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-lg flex items-center justify-center text-sm">1</span>
                            Upload PDF
                        </h3>
                        {!file ? (
                            <FileUpload
                                onFileSelect={(files) => setFile(files[0])}
                                accept=".pdf"
                                label="Drop PDF here"
                                icon="📄"
                            />
                        ) : (
                            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-indigo-200 dark:border-indigo-900 flex items-center gap-4">
                                <Shield className="w-8 h-8 text-indigo-600" />
                                <div className="overflow-hidden">
                                    <p className="font-bold truncate">{file.name}</p>
                                    <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => setFile(null)} className="ml-auto">Change</Button>
                            </div>
                        )}
                    </div>

                    {/* Step 2: Upload Watermark */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <span className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-lg flex items-center justify-center text-sm">2</span>
                            Watermark Image
                        </h3>
                        {!watermark ? (
                            <FileUpload
                                onFileSelect={(files) => setWatermark(files[0])}
                                accept="image/*"
                                label="Drop logo/image here"
                                icon="🖼️"
                            />
                        ) : (
                            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-indigo-200 dark:border-indigo-900 flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                    <ImageIcon className="w-8 h-8 text-indigo-600" />
                                    <div className="overflow-hidden">
                                        <p className="font-bold truncate">{watermark.name}</p>
                                        <p className="text-xs text-slate-500">{(watermark.size / 1024).toFixed(0)} KB</p>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => setWatermark(null)} className="ml-auto">Change</Button>
                                </div>
                                <img src={URL.createObjectURL(watermark)} alt="Preview" className="h-20 w-auto object-contain bg-slate-100 dark:bg-slate-800 rounded-lg mx-auto" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Settings */}
                {file && watermark && (
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-8 animate-in fade-in slide-in-from-bottom-4">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="block text-sm font-bold uppercase tracking-widest text-slate-500">Opacity: {Math.round(opacity * 100)}%</label>
                                <input
                                    type="range"
                                    min="0.1"
                                    max="1"
                                    step="0.05"
                                    value={opacity}
                                    onChange={(e) => setOpacity(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="block text-sm font-bold uppercase tracking-widest text-slate-500">Rotation: {rotation}°</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="360"
                                    step="1"
                                    value={rotation}
                                    onChange={(e) => setRotation(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                />
                            </div>
                        </div>

                        <Button
                            onClick={handleApplyWatermark}
                            disabled={isProcessing}
                            className="w-full py-8 text-xl font-black bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-lg hover:shadow-indigo-500/25 transition-all active:scale-[0.98]"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="animate-spin mr-3" />
                                    PROCESSING...
                                </>
                            ) : (
                                'APPLY WATERMARK'
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
