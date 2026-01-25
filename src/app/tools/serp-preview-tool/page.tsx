'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';

const SerpPreviewTool = () => {
    const [title, setTitle] = useState('My Awesome Page Title');
    const [description, setDescription] = useState('This is how your page description will look in Google search results. Make it catchy and relevant!');
    const [slug, setSlug] = useState('my-awesome-page');

    return (
        <ToolLayout
            title="SERP Preview Tool"
            description="Visualize how your pages will appear in Google search engine results"
            toolId="serp-preview-tool"
        >
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-700">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-black uppercase text-slate-400 mb-2 px-1">Meta Title ({title.length})</label>
                            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 rounded-xl outline-none font-bold" />
                            <div className={`h-1.5 mt-2 rounded-full ${title.length > 60 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${Math.min(100, (title.length / 60) * 100)}%` }}></div>
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase text-slate-400 mb-2 px-1">Slug</label>
                            <input type="text" value={slug} onChange={e => setSlug(e.target.value)} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 rounded-xl outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase text-slate-400 mb-2 px-1">Meta Description ({description.length})</label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 rounded-xl outline-none" />
                            <div className={`h-1.5 mt-2 rounded-full ${description.length > 160 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${Math.min(100, (description.length / 160) * 100)}%` }}></div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1a1a1b] rounded-3xl p-10 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <p className="text-xs text-slate-400 font-bold uppercase mb-6 tracking-widest px-1">Google Search Preview</p>
                    <div className="max-w-[600px]">
                        <div className="flex items-center space-x-2 text-sm text-[#202124] dark:text-[#bdc1c6] mb-1">
                            <span>https://kynextools.com › {slug}</span>
                            <span className="text-[10px]">▼</span>
                        </div>
                        <h3 className="text-xl text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer font-medium mb-1 truncate">{title}</h3>
                        <p className="text-sm text-[#4d5156] dark:text-[#bdc1c6] leading-relaxed line-clamp-2">{description}</p>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
};

export default SerpPreviewTool;
