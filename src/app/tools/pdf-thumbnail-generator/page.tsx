'use client';

import { useState, useCallback } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { FileUpload } from '@/components/ui/FileUpload';
import { Button } from '@/components/ui/button';
import { Loader2, Download, Image as ImageIcon, Trash2 } from 'lucide-react';



interface Thumbnail {
    pageNumber: number;
    dataUrl: string;
}

const PdfThumbnailGeneratorTool = () => {
    const [file, setFile] = useState<File | null>(null);
    const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);

    const generateThumbnails = useCallback(async (selectedFile: File) => {
        setIsProcessing(true);
        setThumbnails([]);
        setProgress(0);

        try {
            // Dynamically import pdfjs-dist only when needed
            const pdfjs = (await import('pdfjs-dist')).default;
            
            // Set worker path for the imported module
            const workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
            (pdfjs.GlobalWorkerOptions as any).workerSrc = workerSrc;
            
            const arrayBuffer = await selectedFile.arrayBuffer();
            const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
            const numPages = pdf.numPages;
            const newThumbnails: Thumbnail[] = [];

            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 0.5 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');

                if (context) {
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    await page.render({
                        canvasContext: context,
                        viewport: viewport,
                        canvas: canvas
                    }).promise;

                    newThumbnails.push({
                        pageNumber: i,
                        dataUrl: canvas.toDataURL('image/png')
                    });
                }
                setProgress(Math.round((i / numPages) * 100));
            }

            setThumbnails(newThumbnails);
        } catch (error) {
            console.error('Error generating thumbnails:', error);
            alert('Failed to generate thumbnails. Please ensure the file is a valid PDF.');
        } finally {
            setIsProcessing(false);
        }
    }, []);

    const handleFileSelect = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            generateThumbnails(files[0]);
        }
    };

    const downloadThumbnail = (thumbnail: Thumbnail) => {
        const link = document.createElement('a');
        link.href = thumbnail.dataUrl;
        link.download = `thumbnail-page-${thumbnail.pageNumber}.png`;
        link.click();
    };

    const downloadAll = () => {
        thumbnails.forEach(thumb => downloadThumbnail(thumb));
    };

    return (
        <ToolLayout
            title="PDF Thumbnail Generator"
            description="Generate high-quality image previews and thumbnails for your PDF document pages."
            toolId="pdf-preview"
            category="PDF"
        >
            <div className="max-w-5xl mx-auto space-y-8">
                {!file ? (
                    <FileUpload
                        onFileSelect={handleFileSelect}
                        accept=".pdf"
                        label="Upload PDF to Generate Thumbnails"
                        icon="📸"
                    />
                ) : (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-xl">
                                    <ImageIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white truncate max-w-[200px] md:max-w-md">{file.name}</h3>
                                    <p className="text-sm text-slate-500">{thumbnails.length || '...'} pages</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => { setFile(null); setThumbnails([]); }}
                                    className="rounded-xl"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" /> Change
                                </Button>
                                {thumbnails.length > 0 && (
                                    <Button onClick={downloadAll} className="rounded-xl bg-indigo-600 hover:bg-indigo-700">
                                        <Download className="w-4 h-4 mr-2" /> Download All
                                    </Button>
                                )}
                            </div>
                        </div>

                        {isProcessing && (
                            <div className="bg-white dark:bg-slate-900 p-12 rounded-[32px] border border-slate-200 dark:border-slate-700 text-center space-y-4">
                                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto" />
                                <h3 className="text-xl font-bold">Generating Thumbnails...</h3>
                                <div className="w-full max-w-xs mx-auto bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div
                                        className="bg-indigo-600 h-full transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <p className="text-slate-500">{progress}% complete</p>
                            </div>
                        )}

                        {!isProcessing && thumbnails.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {thumbnails.map((thumb) => (
                                    <div
                                        key={thumb.pageNumber}
                                        className="group bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                                    >
                                        <div className="aspect-[3/4] rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 relative group-hover:opacity-75 transition-opacity">
                                            <img
                                                src={thumb.dataUrl}
                                                alt={`Page ${thumb.pageNumber}`}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <div className="mt-3 flex items-center justify-between">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Page {thumb.pageNumber}</span>
                                            <button
                                                onClick={() => downloadThumbnail(thumb)}
                                                className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-indigo-500 hover:text-white transition-colors"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </ToolLayout>
    );
};

export default PdfThumbnailGeneratorTool;
