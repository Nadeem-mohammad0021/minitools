'use client';

import { ToolLayout } from '@/components/ui/ToolLayout';

const PdfThumbnailGeneratorTool = () => {
    return (
        <ToolLayout title="PDF Thumbnail Generator" description="Generate high-quality image previews and thumbnails for your PDF document pages." toolId="pdf-preview">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="bg-white dark:bg-slate-900 rounded-[32px] p-20 text-center border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                        <div className="text-[150px] font-bold leading-none select-none">IMAGE</div>
                    </div>

                    <div className="relative z-10 space-y-8 flex flex-col items-center">
                        <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl flex items-center justify-center text-5xl shadow-sm group-hover:scale-110 transition-transform duration-500">📸</div>
                        <div className="space-y-4 max-w-lg">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Coming Soon</h2>
                            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                We are currently enhancing this tool to provide even faster and sharper image previews for your PDF documents. Please check back shortly.
                            </p>
                        </div>
                        <div className="pt-4">
                            <div className="px-10 py-3 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-2xl font-bold uppercase tracking-widest text-[10px]">
                                Tool Under Development
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
};

export default PdfThumbnailGeneratorTool;
