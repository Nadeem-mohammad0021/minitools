'use client';

import { useState, useCallback } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { FileUpload } from '@/components/ui/FileUpload';

const WordToPdfTool = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const onFileSelect = (files: File[]) => {
        if (files[0]) {
            setFile(files[0]);
        }
    };

    const convertToPdf = useCallback(() => {
        setIsProcessing(true);
        // Simulate conversion for UI demonstration as in original
        setTimeout(() => {
            alert('Word to PDF conversion is currently being optimized for high-performance browser environments. Stay tuned!');
            setIsProcessing(false);
        }, 2000);
    }, []);

    return (
        <ToolLayout title="Word to PDF" description="Instantly convert your Microsoft Word documents (.doc, .docx) into professional PDF files." toolId="word-to-pdf">
            <div className="max-w-4xl mx-auto space-y-8">
                {!file ? (
                    <FileUpload
                        onFileSelect={onFileSelect}
                        accept=".doc,.docx"
                        label="Upload Word Document to Convert"
                        icon="📘"
                    />
                ) : (
                    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm animate-in zoom-in-95 duration-500">
                        <div className="flex flex-col items-center text-center space-y-8">
                            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-3xl animate-pulse">
                                🛠️
                            </div>

                            <div className="space-y-2 max-w-md mx-auto">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white truncate px-4">{file.name}</h2>
                                <p className="text-slate-500 text-sm">Size: {(file.size / 1024).toFixed(2)} KB</p>
                            </div>

                            <div className="w-full max-w-md space-y-3">
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">
                                    <span>{isProcessing ? 'Processing Document...' : 'Ready to Convert'}</span>
                                    <span>{isProcessing ? '85%' : '0%'}</span>
                                </div>
                                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                                    <div className={`h-full bg-blue-600 transition-all duration-500 ${isProcessing ? 'w-[85%]' : 'w-0'}`}></div>
                                </div>
                            </div>

                            <div className="flex gap-4 w-full max-w-md">
                                <button
                                    onClick={convertToPdf}
                                    disabled={isProcessing}
                                    className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {isProcessing ? 'Converting...' : 'Convert to PDF'}
                                </button>
                                <button
                                    onClick={() => setFile(null)}
                                    className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
};

export default WordToPdfTool;
