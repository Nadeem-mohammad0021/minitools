'use client';

import { useState, useCallback } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';

const Base64ToImageTool = () => {
    const [base64, setBase64] = useState('');
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    const generateImage = useCallback(() => {
        if (!base64.trim()) return;

        let cleanBase64 = base64.trim();
        if (!cleanBase64.startsWith('data:image')) {
            // Default to PNG if header is missing
            cleanBase64 = `data:image/png;base64,${cleanBase64}`;
        }
        setImageSrc(cleanBase64);
    }, [base64]);

    return (
        <ToolLayout title="Base64 to Image" description="Quickly convert Base64 encoded code back into a viewable and downloadable image document." toolId="b64-image">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                    <div className="flex justify-between items-center px-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Base64 Code</label>
                        <button
                            onClick={() => { setBase64(''); setImageSrc(null); }}
                            className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:text-red-600 transition-colors"
                        >
                            Clear
                        </button>
                    </div>
                    <textarea
                        value={base64}
                        onChange={e => { setBase64(e.target.value); setImageSrc(null); }}
                        placeholder="Paste your Base64 code here (e.g., data:image/png;base64,...)"
                        className="w-full h-64 p-6 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-mono text-sm break-all transition-all shadow-inner scrollbar-hide"
                    />
                    <button
                        onClick={generateImage}
                        disabled={!base64.trim()}
                        className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
                    >
                        Generate Image
                    </button>
                </div>

                {imageSrc && (
                    <div className="bg-slate-900 rounded-[32px] p-10 border border-white/5 shadow-2xl animate-in slide-in-from-bottom-8 duration-500 flex flex-col items-center gap-10">
                        <div className="w-full flex justify-between items-center border-b border-white/10 pb-6 relative z-10">
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold text-white">Image Generated</h3>
                                <p className="text-indigo-400 text-xs font-medium">Your Base64 content has been successfully converted.</p>
                            </div>
                            <a
                                href={imageSrc}
                                download={`kynex-image-${Date.now()}.png`}
                                className="px-8 py-4 bg-white text-indigo-900 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-indigo-400 hover:text-white transition-all shadow-xl active:scale-95"
                            >
                                Download Image
                            </a>
                        </div>

                        <div className="bg-white/5 p-6 rounded-[24px] border border-white/10 backdrop-blur-sm group relative overflow-hidden flex justify-center w-full">
                            <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                            <img
                                src={imageSrc}
                                alt="Result"
                                className="max-h-[500px] object-contain rounded-xl shadow-2xl bg-white relative z-10 transition-transform duration-500 group-hover:scale-[1.02]"
                                onError={() => setImageSrc(null)}
                            />
                        </div>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
};

export default Base64ToImageTool;
