'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { FileUpload } from '@/components/ui/FileUpload';
import { Button } from '@/components/ui/button';
import { Loader2, Hash, AlignRight, AlignCenter, AlignLeft, AlignJustify, Palette, Type } from 'lucide-react';
import { downloadFile } from '@/lib/utils/file-download';

export default function PageNumbersPdfTool() {
    const [file, setFile] = useState<File | null>(null);
    const [position, setPosition] = useState<'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-center' | 'top-right' | 'top-left'>('bottom-right');
    const [format, setFormat] = useState('Page {current} of {total}');
    const [fontSize, setFontSize] = useState(12);
    const [fontColor, setFontColor] = useState('#000000');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleAddNumbers = async () => {
        if (!file) return;
        setIsProcessing(true);

        try {
            const fd = new FormData();
            fd.append('file', file);
            fd.append('position', position);
            fd.append('format', format);
            fd.append('fontSize', fontSize.toString());
            fd.append('fontColor', fontColor.replace('#', '').match(/.{2}/g)!.map(hex => parseInt(hex, 16) / 255).join(','));

            const res = await fetch('/api/pdf/page-numbers', {
                method: 'POST',
                body: fd
            });

            if (!res.ok) throw new Error('Failed to add page numbers');

            const blob = await res.blob();
            downloadFile(blob, `numbered-${file.name}`, 'application/pdf');
        } catch (error) {
            console.error(error);
            alert('Failed to add page numbers');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout
            title="Add Page Numbers"
            description="Insert page numbers into your PDF document easily."
            toolId="add-page-numbers"
            category="PDF"
        >
            <div className="max-w-xl mx-auto space-y-8">
                {!file ? (
                    <FileUpload
                        onFileSelect={(files) => setFile(files[0])}
                        accept=".pdf"
                        label="Upload PDF"
                        icon="🔢"
                    />
                ) : (
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-8 animate-in zoom-in">
                        <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full">
                                <Hash className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-medium truncate">{file.name}</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setFile(null)} className="ml-auto">Change</Button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-4 text-center">Select Position</label>
                            <div className="grid grid-cols-3 gap-3">
                                <button
                                    onClick={() => setPosition('top-left')}
                                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${position === 'top-left'
                                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700'
                                            : 'border-slate-200 hover:border-indigo-200'
                                        }`}
                                >
                                    <AlignLeft className="w-6 h-6 opacity-70" />
                                    <span className="font-medium text-xs">Top Left</span>
                                </button>

                                <button
                                    onClick={() => setPosition('top-center')}
                                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${position === 'top-center'
                                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700'
                                            : 'border-slate-200 hover:border-indigo-200'
                                        }`}
                                >
                                    <AlignJustify className="w-6 h-6 opacity-70" />
                                    <span className="font-medium text-xs">Top Center</span>
                                </button>

                                <button
                                    onClick={() => setPosition('top-right')}
                                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${position === 'top-right'
                                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700'
                                            : 'border-slate-200 hover:border-indigo-200'
                                        }`}
                                >
                                    <AlignRight className="w-6 h-6 opacity-70" />
                                    <span className="font-medium text-xs">Top Right</span>
                                </button>

                                <button
                                    onClick={() => setPosition('bottom-left')}
                                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${position === 'bottom-left'
                                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700'
                                            : 'border-slate-200 hover:border-indigo-200'
                                        }`}
                                >
                                    <AlignLeft className="w-6 h-6 opacity-70" />
                                    <span className="font-medium text-xs">Bottom Left</span>
                                </button>

                                <button
                                    onClick={() => setPosition('bottom-center')}
                                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${position === 'bottom-center'
                                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700'
                                            : 'border-slate-200 hover:border-indigo-200'
                                        }`}
                                >
                                    <AlignCenter className="w-6 h-6 opacity-70" />
                                    <span className="font-medium text-xs">Bottom Center</span>
                                </button>

                                <button
                                    onClick={() => setPosition('bottom-right')}
                                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${position === 'bottom-right'
                                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700'
                                            : 'border-slate-200 hover:border-indigo-200'
                                        }`}
                                >
                                    <AlignRight className="w-6 h-6 opacity-70" />
                                    <span className="font-medium text-xs">Bottom Right</span>
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-4 text-center">Number Format</label>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Type className="w-5 h-5 text-slate-500" />
                                    <input
                                        type="text"
                                        value={format}
                                        onChange={(e) => setFormat(e.target.value)}
                                        placeholder="Page {current} of {total}"
                                        className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                                    <p>Use these placeholders:</p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs">{'{current}'}</span>
                                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs">{'{total}'}</span>
                                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs">{'{page}'}</span>
                                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs">{'{count}'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Font Size</label>
                                <input
                                    type="range"
                                    min="8"
                                    max="24"
                                    value={fontSize}
                                    onChange={(e) => setFontSize(Number(e.target.value))}
                                    className="w-full"
                                />
                                <div className="text-center text-sm font-medium mt-1">{fontSize}px</div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Font Color</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={fontColor}
                                        onChange={(e) => setFontColor(e.target.value)}
                                        className="w-12 h-10 rounded border border-slate-300 dark:border-slate-600 cursor-pointer"
                                    />
                                    <span className="text-sm font-mono">{fontColor}</span>
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={handleAddNumbers}
                            disabled={isProcessing}
                            className="w-full py-6 text-lg font-bold"
                        >
                            {isProcessing ? <Loader2 className="animate-spin" /> : 'Add Page Numbers'}
                        </Button>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
