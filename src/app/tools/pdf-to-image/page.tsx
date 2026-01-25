'use client';

import { useState, useRef, useEffect } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { FileUpload } from '@/components/ui/FileUpload';
import { Button } from '@/components/ui/button';
import { Loader2, FileImage } from 'lucide-react';
import JSZip from 'jszip';
import { downloadFile } from '@/lib/utils/file-download';

// We need to import pdfjs-dist. Since it's client-side, dynamic import or worker setup is needed.
// Standard pattern for Next.js with pdfjs

export default function PdfToImageTool() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleConvert = async () => {
        if (!file) return;
        setIsProcessing(true);
        setProgress(0);

        try {
            // Dynamic import
            const pdfJS = await import('pdfjs-dist');
            const PDFJS_VERSION = '3.11.174'; // Matching the one used in Edit PDF for consistency
            pdfJS.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.js`;

            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfJS.getDocument({ data: arrayBuffer }).promise;
            const totalPages = pdf.numPages;
            const zip = new JSZip();

            for (let i = 1; i <= totalPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 2.0 }); // High quality

                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                if (context) {
                    await page.render({
                        canvasContext: context,
                        viewport: viewport,
                        canvas: canvas
                    }).promise;

                    const blob = await new Promise<Blob | null>(resolve =>
                        canvas.toBlob(resolve, 'image/jpeg', 0.9)
                    );

                    if (blob) {
                        zip.file(`page-${i}.jpg`, blob);
                    }
                }

                setProgress(Math.round((i / totalPages) * 100));
            }

            const content = await zip.generateAsync({ type: "blob" });
            downloadFile(content, `converted-images.zip`, 'application/zip');

        } catch (error) {
            console.error(error);
            alert('Failed to convert PDF to images. Please try a simpler file.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout
            title="PDF to Image"
            description="Extract every page of your PDF as a high-quality JPG image."
            toolId="pdf-to-image"
            category="PDF"
        >
            <div className="max-w-xl mx-auto space-y-8">
                {!file ? (
                    <FileUpload
                        onFileSelect={(files) => setFile(files[0])}
                        accept=".pdf"
                        label="Upload PDF to Convert"
                        icon="🖼️"
                    />
                ) : (
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-6 animate-in zoom-in">
                        <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                                <FileImage className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-medium truncate">{file.name}</p>
                                <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setFile(null)} className="ml-auto">Change</Button>
                        </div>

                        <Button
                            onClick={handleConvert}
                            disabled={isProcessing}
                            className="w-full py-6 text-lg font-bold"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" />
                                    Converting {progress}%...
                                </>
                            ) : 'Convert to Images'}
                        </Button>

                        <p className="text-xs text-center text-slate-400">
                            Conversion happens securely in your browser.
                        </p>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
