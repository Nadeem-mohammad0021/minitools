'use client';

import { useState, useRef, useEffect } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { FileUpload } from '@/components/ui/FileUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Crop } from 'lucide-react';
import { cropImage } from '@/lib/engines/imageEngine';
import { downloadFile } from '@/lib/utils/file-download';

export default function CropImageTool() {
    const [file, setFile] = useState<File | null>(null);
    const [imgDims, setImgDims] = useState({ w: 0, h: 0 });

    // Crop state
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileSelect = async (files: File[]) => {
        const f = files[0];
        setFile(f);
        const img = await createImageBitmap(f);
        setImgDims({ w: img.width, h: img.height });

        // Default crop: Center 80%
        const cropW = Math.round(img.width * 0.8);
        const cropH = Math.round(img.height * 0.8);
        setX(Math.round((img.width - cropW) / 2));
        setY(Math.round((img.height - cropH) / 2));
        setWidth(cropW);
        setHeight(cropH);
    };

    const handleCrop = async () => {
        if (!file) return;
        setIsProcessing(true);
        try {
            const blob = await cropImage(file, x, y, width, height);
            downloadFile(blob, `cropped-${file.name}`, file.type);
        } catch (e) {
            console.error(e);
            alert("Crop failed");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout
            title="Crop Image"
            description="Trim unwanted edges from your photos."
            toolId="crop-image"
            category="Image"
        >
            <div className="max-w-xl mx-auto space-y-8">
                {!file ? (
                    <FileUpload onFileSelect={handleFileSelect} accept="image/*" label="Upload Image" icon="✂️" />
                ) : (
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-6 animate-in zoom-in">
                        <div className="flex justify-center mb-6 relative bg-slate-100 dark:bg-slate-800 rounded overflow-hidden">
                            <img src={URL.createObjectURL(file)} className="max-h-64 object-contain" alt="Original" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium mb-1">X</label>
                                <Input type="number" value={x} onChange={e => setX(parseInt(e.target.value) || 0)} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1">Y</label>
                                <Input type="number" value={y} onChange={e => setY(parseInt(e.target.value) || 0)} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1">Width</label>
                                <Input type="number" value={width} onChange={e => setWidth(parseInt(e.target.value) || 0)} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1">Height</label>
                                <Input type="number" value={height} onChange={e => setHeight(parseInt(e.target.value) || 0)} />
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 text-center">Original: {imgDims.w} x {imgDims.h}</p>

                        <Button onClick={handleCrop} disabled={isProcessing} className="w-full py-6 text-lg font-bold">
                            {isProcessing ? <Loader2 className="animate-spin" /> : 'Crop Image'}
                        </Button>

                        <Button variant="ghost" onClick={() => setFile(null)} className="w-full">Change Image</Button>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
