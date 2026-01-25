'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { FileUpload } from '@/components/ui/FileUpload';
import { downloadFile } from '@/lib/utils/file-download';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function MergePdfTool() {
    const [files, setFiles] = useState<File[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleUpload = (uploadedFiles: File[]) => {
        // Add new files to existing ones or replace? Merge usually implies multipick.
        setFiles(prev => [...prev, ...uploadedFiles]);
    };

    const handleMerge = async () => {
        if (files.length < 2) return;
        setIsProcessing(true);

        try {
            const fd = new FormData();
            files.forEach(f => fd.append("files", f));

            const res = await fetch("/api/pdf/merge", {
                method: "POST",
                body: fd
            });

            if (!res.ok) throw new Error("Merge failed");

            const blob = await res.blob();
            downloadFile(blob, "merged.pdf", "application/pdf");
        } catch (error) {
            console.error(error);
            alert("Failed to merge PDFs. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout
            title="Merge PDF"
            description="Combine multiple PDF files into a single document using our high-speed engine."
            toolId="merge-pdf"
        >
            <div className="space-y-8">
                <FileUpload
                    onFileSelect={handleUpload}
                    accept=".pdf"
                    multiple={true}
                    label="Drop PDFs here to merge"
                    icon="📚"
                />

                {files.length > 0 && (
                    <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                        <h3 className="text-lg font-semibold mb-4">Selected Files ({files.length})</h3>
                        <ul className="space-y-2 mb-6 max-h-60 overflow-y-auto">
                            {files.map((f, i) => (
                                <li key={i} className="flex justify-between items-center bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                                    <span className="truncate">{f.name}</span>
                                    <span className="text-xs text-slate-500">{(f.size / 1024 / 1024).toFixed(2)} MB</span>
                                </li>
                            ))}
                        </ul>

                        <div className="flex gap-4">
                            <Button
                                onClick={handleMerge}
                                disabled={isProcessing || files.length < 2}
                                className="w-full py-6 text-lg"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Merging...
                                    </>
                                ) : (
                                    'Merge PDFs Now'
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setFiles([])}
                                className="px-6 py-6"
                            >
                                Clear
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
