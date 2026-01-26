'use client';

import { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { FileUpload } from '@/components/ui/FileUpload';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeftRight, GripVertical, Download } from 'lucide-react';
import { downloadFile } from '@/lib/utils/file-download';

export default function ReorderPdfPagesTool() {
    const [file, setFile] = useState<File | null>(null);
    const [pages, setPages] = useState<{number: number, label: string}[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [pdfInfo, setPdfInfo] = useState<{pageCount: number} | null>(null);

    // Initialize pages when file is uploaded
    useEffect(() => {
        if (file && pdfInfo) {
            const initialPages = Array.from({ length: pdfInfo.pageCount }, (_, i) => ({
                number: i + 1,
                label: `Page ${i + 1}`
            }));
            setPages(initialPages);
        }
    }, [file, pdfInfo]);

    const handleFileUpload = async (files: File[]) => {
        const selectedFile = files[0];
        if (!selectedFile) return;
        
        setFile(selectedFile);
        
        try {
            // Get PDF info to determine page count
            const fd = new FormData();
            fd.append('file', selectedFile);
            
            const res = await fetch('/api/pdf/metadata', {
                method: 'POST',
                body: fd
            });
            
            if (res.ok) {
                const info = await res.json();
                setPdfInfo({ pageCount: info.pageCount });
            }
        } catch (error) {
            console.error('Error getting PDF info:', error);
            // Fallback to showing at least 10 pages
            setPdfInfo({ pageCount: 10 });
        }
    };

    const handleDragStart = (e: React.DragEvent, index: number) => {
        e.dataTransfer.setData('text/plain', index.toString());
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
        
        if (dragIndex !== dropIndex) {
            const newPages = [...pages];
            const [draggedPage] = newPages.splice(dragIndex, 1);
            newPages.splice(dropIndex, 0, draggedPage);
            setPages(newPages);
        }
    };

    const handleReorder = async () => {
        if (!file || pages.length === 0) return;
        setIsProcessing(true);

        try {
            const indices = pages.map(p => p.number - 1); // Convert to 0-based indices

            const fd = new FormData();
            fd.append('file', file);
            fd.append('order', JSON.stringify(indices));

            const res = await fetch('/api/pdf/reorder-pages', {
                method: 'POST',
                body: fd
            });

            if (!res.ok) throw new Error('Failed to reorder pages');

            const blob = await res.blob();
            downloadFile(blob, `reordered-${file.name}`, 'application/pdf');
        } catch (error) {
            console.error(error);
            alert('Failed to reorder pages');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout
            title="Reorder PDF Pages"
            description="Drag and drop to reorder pages in your PDF document."
            toolId="reorder-pdf-pages"
            category="PDF"
        >
            <div className="max-w-4xl mx-auto space-y-8">
                {!file ? (
                    <FileUpload
                        onFileSelect={handleFileUpload}
                        accept=".pdf"
                        label="Upload PDF to Reorder Pages"
                        icon="↔️"
                    />
                ) : (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in zoom-in">
                        {/* File Header */}
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full">
                                        <ArrowLeftRight className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg truncate max-w-md">{file.name}</h3>
                                        <p className="text-sm text-slate-500">
                                            {pdfInfo ? `${pdfInfo.pageCount} pages` : 'Loading...'}
                                        </p>
                                    </div>
                                </div>
                                <Button 
                                    variant="outline" 
                                    onClick={() => { 
                                        setFile(null); 
                                        setPages([]); 
                                        setPdfInfo(null); 
                                    }}
                                >
                                    Change File
                                </Button>
                            </div>
                        </div>

                        {/* Drag and Drop Interface */}
                        <div className="p-6">
                            <div className="mb-6">
                                <h4 className="font-semibold text-lg mb-2">Drag and Drop to Reorder Pages</h4>
                                <p className="text-sm text-slate-500">Drag the pages to rearrange them in your desired order.</p>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-8">
                                {pages.map((page, index) => (
                                    <div
                                        key={`${page.number}-${index}`}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, index)}
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, index)}
                                        className="bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-4 cursor-move hover:border-indigo-500 transition-all duration-200 flex items-center gap-2 group"
                                    >
                                        <GripVertical className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors flex-shrink-0" />
                                        <div className="text-center flex-1">
                                            <div className="text-sm font-bold text-slate-700 dark:text-slate-300">Page</div>
                                            <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{page.number}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Current Order Preview */}
                            {pages.length > 0 && (
                                <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                    <h5 className="font-medium mb-2">Current Order:</h5>
                                    <div className="flex flex-wrap gap-2">
                                        {pages.map((page, index) => (
                                            <span 
                                                key={`preview-${index}`}
                                                className="px-3 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium"
                                            >
                                                {page.number}
                                                {index < pages.length - 1 && (
                                                    <span className="ml-2 text-slate-400">→</span>
                                                )}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <Button
                                    onClick={() => {
                                        // Reset to original order
                                        if (pdfInfo) {
                                            const originalPages = Array.from({ length: pdfInfo.pageCount }, (_, i) => ({
                                                number: i + 1,
                                                label: `Page ${i + 1}`
                                            }));
                                            setPages(originalPages);
                                        }
                                    }}
                                    variant="outline"
                                    disabled={isProcessing}
                                    className="flex-1"
                                >
                                    Reset Order
                                </Button>
                                <Button
                                    onClick={handleReorder}
                                    disabled={isProcessing}
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-6 text-lg font-bold"
                                >
                                    {isProcessing ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Processing...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Download className="w-5 h-5" />
                                            Download Reordered PDF
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}