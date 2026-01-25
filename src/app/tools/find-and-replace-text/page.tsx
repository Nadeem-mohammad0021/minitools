'use client';

import { useState, useCallback } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';

const FindAndReplaceTextTool = () => {
    const [text, setText] = useState('');
    const [find, setFind] = useState('');
    const [replace, setReplace] = useState('');
    const [res, setRes] = useState('');

    const apply = useCallback(() => {
        if (!find) { setRes(text); return; }
        const escapedFind = find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedFind, 'g');
        setRes(text.replace(regex, replace));
    }, [text, find, replace]);

    return (
        <ToolLayout title="Find and Replace" description="Quickly identify and swap out words or patterns in your text with ease." toolId="text-find-replace">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Input Text</label>
                            <button onClick={() => { setText(''); setRes(''); }} className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors">Clear</button>
                        </div>
                        <textarea
                            value={text}
                            onChange={e => setText(e.target.value)}
                            placeholder="Type or paste your text here..."
                            className="w-full h-64 p-6 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-medium text-lg resize-none transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Find Text</label>
                            <input
                                type="text"
                                value={find}
                                onChange={e => setFind(e.target.value)}
                                placeholder="Word to find..."
                                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 rounded-xl outline-none font-bold transition-all shadow-inner"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Replace With</label>
                            <input
                                type="text"
                                value={replace}
                                onChange={e => setReplace(e.target.value)}
                                placeholder="Replacement word..."
                                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 rounded-xl outline-none font-bold transition-all shadow-inner"
                            />
                        </div>
                    </div>

                    <button onClick={apply} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all">
                        Replace All
                    </button>
                </div>

                {res && (
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Updated Results</p>
                            <button onClick={() => { navigator.clipboard.writeText(res); }} className="px-5 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all">Copy All</button>
                        </div>
                        <div className="text-slate-700 dark:text-slate-300 font-medium text-lg leading-relaxed whitespace-pre-wrap bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-2xl">
                            {res}
                        </div>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
};

export default FindAndReplaceTextTool;
