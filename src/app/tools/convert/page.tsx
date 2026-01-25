'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { FileUpload } from '@/components/ui/FileUpload';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRightLeft } from 'lucide-react';
import { convertImageFormat } from '@/lib/engines/imageEngine';
import { downloadFile } from '@/lib/utils/file-download';

export default function ConvertImageTool() {
    const [file, setFile] = useState<File | null>(null);
    const [format, setFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/png');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleConvert = async () => {
        if (!file) return;
        setIsProcessing(true);
        try {
            const blob = await convertImageFormat(file, format);
            const ext = format.split('/')[1];
            downloadFile(blob, `converted.${ext}`, format);
        } catch (e) {
            console.error(e);
            alert("Conversion failed");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout
            title="Convert Image"
            description="Convert between JPG, PNG, and WebP formats instantly."
            toolId="image-converter"
            category="Image"
        >
            <div className="max-w-xl mx-auto space-y-8">
                {!file ? (
                    <FileUpload onFileSelect={(f) => setFile(f[0])} accept="image/*" label="Upload Image" icon="🔄" />
                ) : (
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-6 animate-in zoom-in">
                        <div className="flex justify-center mb-6">
                            <img src={URL.createObjectURL(file)} className="max-h-48 rounded shadow-sm" alt="Preview" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-4 text-center">Convert to</label>
                            <div className="grid grid-cols-3 gap-3">
                                {['jpeg', 'png', 'webp'].map((fmt) => (
                                    <button
                                        key={fmt}
                                        onClick={() => setFormat(`image/${fmt}` as any)}
                                        className={`py-3 rounded-lg font-bold border-2 transition-all uppercase ${format === `image/${fmt}`
                                                ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20'
                                                : 'border-slate-200 hover:border-indigo-200 text-slate-500'
                                            }`}
                                    >
                                        {fmt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button onClick={handleConvert} disabled={isProcessing} className="w-full py-6 text-lg font-bold">
                            {isProcessing ? <Loader2 className="animate-spin" /> : `Convert to ${format.split('/')[1].toUpperCase()}`}
                        </Button>

                        <Button variant="ghost" onClick={() => setFile(null)} className="w-full">Change Image</Button>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
