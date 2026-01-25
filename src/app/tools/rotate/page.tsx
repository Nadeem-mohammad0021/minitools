'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { FileUpload } from '@/components/ui/FileUpload';
import { Button } from '@/components/ui/button';
import { Loader2, RotateCw } from 'lucide-react';
import { downloadFile } from '@/lib/utils/file-download';

export default function RotatePdfTool() {
    const [file, setFile] = useState<File | null>(null);
    const [rotation, setRotation] = useState(90); // Default 90 degrees clockwise
    const [isProcessing, setIsProcessing] = useState(false);

    const handleRotate = async () => {
        if (!file) return;
        setIsProcessing(true);

        try {
            const fd = new FormData();
            fd.append('file', file);
            fd.append('rotation', rotation.toString());

            const res = await fetch('/api/pdf/rotate', {
                method: 'POST',
                body: fd
            });

            if (!res.ok) throw new Error('Rotation failed');

            const blob = await res.blob();
            downloadFile(blob, `rotated-${rotation}-${file.name}`, 'application/pdf');
        } catch (error) {
            console.error(error);
            alert('Failed to rotate PDF');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout
            title="Rotate PDF"
            description="Rotate your PDF pages permanently. Correct orientation issues instantly."
            toolId="rotate-pdf"
            category="PDF"
        >
            <div className="max-w-4xl mx-auto space-y-10">
                {!file ? (
                    <FileUpload
                        onFileSelect={(files) => setFile(files[0])}
                        accept=".pdf"
                        label="Upload PDF to Rotate"
                        icon="🔄"
                    />
                ) : (
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
                        <div className="mb-8">
                            <h3 className="text-xl font-bold mb-2">{file.name}</h3>
                            <p className="text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
                            {[90, 180, 270].map((deg) => (
                                <button
                                    key={deg}
                                    onClick={() => setRotation(deg)}
                                    className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${rotation === deg
                                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700'
                                            : 'border-slate-200 hover:border-indigo-300'
                                        }`}
                                >
                                    <RotateCw className={`w-8 h-8 ${rotation === deg ? 'text-indigo-600' : 'text-slate-400'}`} style={{ transform: `rotate(${deg}deg)` }} />
                                    <span className="font-bold">{deg}° Clockwise</span>
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-center gap-4">
                            <Button onClick={handleRotate} disabled={isProcessing} className="px-8 py-6 text-lg">
                                {isProcessing ? <Loader2 className="animate-spin" /> : 'Rotate PDF'}
                            </Button>
                            <Button variant="outline" onClick={() => setFile(null)} className="px-8 py-6 text-lg">
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
