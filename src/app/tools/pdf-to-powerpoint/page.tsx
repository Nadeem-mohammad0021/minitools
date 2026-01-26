'use client';
import { useState } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { FileUpload } from '@/components/ui/FileUpload';
import { Button } from '@/components/ui/button';
import { Loader2, Presentation } from 'lucide-react';
import { downloadFile } from '@/lib/utils/file-download';

const PdfToPowerpointTool = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [slides, setSlides] = useState<{ title: string, content: string }[]>([]);

    const handleConvert = async () => {
        if (!file) return;
        setIsProcessing(true);
        setSlides([]);

        try {
            const fd = new FormData();
            fd.append('file', file);

            const res = await fetch('/api/pdf/pdf-to-powerpoint', {
                method: 'POST',
                body: fd
            });

            if (!res.ok) throw new Error('Failed to parse PDF');

            const data = await res.json();
            setSlides(data.slides || []);
        } catch (error) {
            console.error(error);
            alert('Failed to analyze PDF for slides.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout
            title="PDF to Powerpoint"
            description="Extract and structure your PDF content into professional slide decks. AI-assisted layout analysis."
            toolId="pdf-to-powerpoint"
            category="PDF"
        >
            <div className="max-w-5xl mx-auto space-y-8">
                {!file ? (
                    <FileUpload
                        onFileSelect={(files) => setFile(files[0])}
                        accept=".pdf"
                        label="Upload PDF to Generate Slides"
                        icon="🎭"
                    />
                ) : (
                    <div className="space-y-8">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-xl text-orange-600">
                                    <Presentation className="w-6 h-6" />
                                </div>
                                <div className="overflow-hidden">
                                    <h3 className="font-bold truncate max-w-[200px] md:max-w-md">{file.name}</h3>
                                    <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(0)} KB • Ready to analyze</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => { setFile(null); setSlides([]); }}>Change</Button>
                        </div>

                        {!slides.length && (
                            <Button
                                onClick={handleConvert}
                                disabled={isProcessing}
                                className="w-full py-8 text-xl font-black bg-orange-600 hover:bg-orange-700 text-white rounded-3xl shadow-xl transition-all"
                            >
                                {isProcessing ? <><Loader2 className="animate-spin mr-3" /> ANALYZING DOCUMENT...</> : 'RESTRUCTURE AS PRESENTATION'}
                            </Button>
                        )}

                        {slides.length > 0 && (
                            <div className="space-y-6 animate-in slide-in-from-bottom-4">
                                <div className="flex justify-between items-center px-2">
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Extracted Slide Deck ({slides.length} Slides)</h2>
                                    <button
                                        onClick={() => downloadFile(new Blob([JSON.stringify(slides, null, 2)], { type: 'application/json' }), 'slides-structure.json', 'application/json')}
                                        className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 hover:underline"
                                    >
                                        Download Structure
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {slides.map((slide, i) => (
                                        <div key={i} className="bg-slate-900 rounded-3xl p-8 border border-white/5 relative overflow-hidden group shadow-2xl min-h-[250px] flex flex-col">
                                            <div className="absolute top-0 right-0 p-6 text-white/5 font-black text-6xl select-none group-hover:scale-110 transition-transform">{i + 1}</div>
                                            <h4 className="text-orange-400 font-bold mb-4 pr-12 line-clamp-2">{slide.title}</h4>
                                            <p className="text-sm text-slate-300 leading-relaxed line-clamp-6 flex-1 italic">
                                                "{slide.content}"
                                            </p>
                                            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                                                <span className="text-[10px] font-bold uppercase text-white/20 tracking-tighter">Slide Preview 2026</span>
                                                <button className="text-white hover:text-orange-400 transition-colors"><Presentation size={14} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </ToolLayout>
    );
};

export default PdfToPowerpointTool;
