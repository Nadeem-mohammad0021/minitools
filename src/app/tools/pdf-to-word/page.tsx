'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { FileUpload } from '@/components/ui/FileUpload';
import { Button } from '@/components/ui/button';
import { Loader2, FileText, Download, Settings } from 'lucide-react';
import { downloadFile } from '@/lib/utils/file-download';

export default function PdfToWordTool() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [outputFormat, setOutputFormat] = useState<'docx'>('docx');
    const [preserveFormatting, setPreserveFormatting] = useState<boolean>(true);
    const [includeImages, setIncludeImages] = useState<boolean>(false);

    const handleConvert = async () => {
        if (!file) return;
        setIsProcessing(true);

        try {
            const fd = new FormData();
            fd.append('file', file);
            fd.append('format', outputFormat);
            fd.append('includeImages', includeImages.toString());

            const res = await fetch('/api/pdf/pdf-to-word', {
                method: 'POST',
                body: fd
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to convert PDF');
            }

            const blob = await res.blob();
            const fileName = `converted-${file.name.replace('.pdf', '')}.${outputFormat}`;
            downloadFile(blob, fileName, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        } catch (error: any) {
            console.error('Conversion error:', error);
            alert(`Failed to convert PDF: ${error.message || 'Unknown error'}`);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout
            title="PDF to Word"
            description="Convert PDF documents to editable Word (.docx) files. Extracts text content."
            toolId="pdf-to-word"
            category="PDF"
        >
            <div className="max-w-xl mx-auto space-y-8">
                {!file ? (
                    <FileUpload
                        onFileSelect={(files) => setFile(files[0])}
                        accept=".pdf"
                        label="Upload PDF to Convert"
                        icon="📝"
                    />
                ) : (
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-6 animate-in zoom-in">
                        <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-medium truncate">{file.name}</p>
                                <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setFile(null)} className="ml-auto">Change</Button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Output Format</label>
                                <div className="flex gap-2">
                                    <button
                                        className={`flex-1 py-2 px-4 rounded-lg border ${outputFormat === 'docx' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 dark:border-slate-700'}`}
                                        onClick={() => setOutputFormat('docx')}
                                    >
                                        DOCX
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div>
                                    <p className="font-medium">Preserve Formatting</p>
                                    <p className="text-xs text-slate-500">Keep original text styles</p>
                                </div>
                                <div className="relative inline-block w-12 h-6">
                                    <input
                                        type="checkbox"
                                        checked={preserveFormatting}
                                        onChange={(e) => setPreserveFormatting(e.target.checked)}
                                        className="sr-only"
                                        id="formatting-toggle"
                                    />
                                    <label
                                        htmlFor="formatting-toggle"
                                        className={`block w-12 h-6 rounded-full cursor-pointer transition-colors ${preserveFormatting ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                                    >
                                        <span
                                            className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${preserveFormatting ? 'transform translate-x-6' : ''}`}
                                        ></span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div>
                                    <p className="font-medium">Include Images</p>
                                    <p className="text-xs text-slate-500">Extract images from PDF</p>
                                </div>
                                <div className="relative inline-block w-12 h-6">
                                    <input
                                        type="checkbox"
                                        checked={includeImages}
                                        onChange={(e) => setIncludeImages(e.target.checked)}
                                        className="sr-only"
                                        id="images-toggle"
                                    />
                                    <label
                                        htmlFor="images-toggle"
                                        className={`block w-12 h-6 rounded-full cursor-pointer transition-colors ${includeImages ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                                    >
                                        <span
                                            className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${includeImages ? 'transform translate-x-6' : ''}`}
                                        ></span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-sm text-yellow-800 dark:text-yellow-200">
                            <strong>Note:</strong> This tool extracts text and paragraphs. Complex formatting, images, and tables may not be preserved perfectly.
                        </div>

                        <Button
                            onClick={handleConvert}
                            disabled={isProcessing}
                            className="w-full py-6 text-lg font-bold flex items-center justify-center gap-2"
                        >
                            {isProcessing ? <><Loader2 className="animate-spin" /> Converting...</> : <><Download className="w-5 h-5" /> Convert to Word</>}
                        </Button>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
