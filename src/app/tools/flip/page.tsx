'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { FileUpload } from '@/components/ui/FileUpload';
import { Button } from '@/components/ui/button';
import { Loader2, FlipHorizontal, FlipVertical } from 'lucide-react';
import { flipImage } from '@/lib/engines/imageEngine';
import { downloadFile } from '@/lib/utils/file-download';

export default function FlipImageTool() {
    const [file, setFile] = useState<File | null>(null);
    const [direction, setDirection] = useState<'horizontal' | 'vertical'>('horizontal');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFlip = async () => {
        if (!file) return;
        setIsProcessing(true);
        try {
            const blob = await flipImage(file, direction);
            downloadFile(blob, `flipped-${direction}-${file.name}`, file.type);
        } catch (e) {
            console.error(e);
            alert("Flip failed");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout
            title="Flip Image"
            description="Mirror your images horizontally or vertically."
            toolId="flip-image"
            category="Image"
        >
            <div className="max-w-xl mx-auto space-y-8">
                {!file ? (
                    <FileUpload onFileSelect={(f) => setFile(f[0])} accept="image/*" label="Upload Image" icon="↔️" />
                ) : (
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-6 animate-in zoom-in text-center">
                        <div className="flex justify-center mb-6 bg-slate-100 dark:bg-slate-800 p-4 rounded-xl">
                            <img
                                src={URL.createObjectURL(file)}
                                className="max-h-64 object-contain transition-transform duration-300"
                                style={{ transform: direction === 'horizontal' ? 'scaleX(-1)' : 'scaleY(-1)' }}
                                alt="Preview"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setDirection('horizontal')}
                                className={`p-6 rounded-xl border-2 flex flex-col items-center gap-2 ${direction === 'horizontal'
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                        : 'border-slate-200'
                                    }`}
                            >
                                <FlipHorizontal className="w-8 h-8" />
                                <span className="font-bold">Horizontal</span>
                            </button>

                            <button
                                onClick={() => setDirection('vertical')}
                                className={`p-6 rounded-xl border-2 flex flex-col items-center gap-2 ${direction === 'vertical'
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                        : 'border-slate-200'
                                    }`}
                            >
                                <FlipVertical className="w-8 h-8" />
                                <span className="font-bold">Vertical</span>
                            </button>
                        </div>

                        <Button onClick={handleFlip} disabled={isProcessing} className="w-full py-6 text-lg font-bold">
                            {isProcessing ? <Loader2 className="animate-spin" /> : 'Download Flipped'}
                        </Button>

                        <Button variant="ghost" onClick={() => setFile(null)} className="w-full">Change Image</Button>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
