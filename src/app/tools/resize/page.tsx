'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { FileUpload } from '@/components/ui/FileUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Scaling } from 'lucide-react';
import { resizeImage } from '@/lib/engines/imageEngine';
import { downloadFile } from '@/lib/utils/file-download';

export default function ResizeImageTool() {
    const [file, setFile] = useState<File | null>(null);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [aspectRatio, setAspectRatio] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileSelect = async (files: File[]) => {
        const f = files[0];
        setFile(f);
        // Get dimensions
        const img = await createImageBitmap(f);
        setWidth(img.width);
        setHeight(img.height);
        setAspectRatio(img.width / img.height);
    };

    const handleResize = async () => {
        if (!file) return;
        setIsProcessing(true);
        try {
            const blob = await resizeImage(file, width, height);
            downloadFile(blob, `resized-${width}x${height}-${file.name}`, file.type);
        } catch (e) {
            console.error(e);
            alert("Resize failed");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleWidthChange = (w: number) => {
        setWidth(w);
        if (aspectRatio) setHeight(Math.round(w / aspectRatio));
    };

    const handleHeightChange = (h: number) => {
        setHeight(h);
        if (aspectRatio) setWidth(Math.round(h * aspectRatio));
    };

    return (
        <ToolLayout
            title="Resize Image"
            description="Change image dimensions precisely while maintaining quality."
            toolId="image-resizer"
            category="Image"
        >
            <div className="max-w-xl mx-auto space-y-8">
                {!file ? (
                    <FileUpload onFileSelect={handleFileSelect} accept="image/*" label="Upload Image" icon="📐" />
                ) : (
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-6 animate-in zoom-in">
                        <div className="flex justify-center mb-6">
                            <img src={URL.createObjectURL(file)} className="max-h-48 rounded shadow-sm" alt="Preview" />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Width (px)</label>
                                <Input type="number" value={width} onChange={e => handleWidthChange(parseInt(e.target.value) || 0)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Height (px)</label>
                                <Input type="number" value={height} onChange={e => handleHeightChange(parseInt(e.target.value) || 0)} />
                            </div>
                        </div>

                        <Button onClick={handleResize} disabled={isProcessing} className="w-full py-6 text-lg font-bold">
                            {isProcessing ? <Loader2 className="animate-spin" /> : 'Resize Image'}
                        </Button>

                        <Button variant="ghost" onClick={() => setFile(null)} className="w-full">Change Image</Button>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
