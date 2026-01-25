'use client';

import { useState, useCallback } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { XMLBuilder } from 'fast-xml-parser';

const JsonToXmlTool = () => {
    const [json, setJson] = useState('');
    const [xml, setXml] = useState('');
    const [error, setError] = useState<string | null>(null);

    const convert = useCallback(() => {
        try {
            if (!json.trim()) return;
            const obj = JSON.parse(json);

            const builder = new XMLBuilder({
                ignoreAttributes: false,
                format: true,
                attributeNamePrefix: "@_"
            });
            
            const xmlContent = builder.build(obj);
            setXml(xmlContent);
            setError(null);
        } catch {
            setError('Invalid JSON format. Please check your syntax.');
        }
    }, [json]);

    return (
        <ToolLayout title="JSON to XML" description="Quickly convert your JSON data into a clean, well-formatted XML document." toolId="json-to-xml">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                        <div className="flex justify-between items-center mb-4 px-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">JSON Input</span>
                            <button onClick={() => { setJson(''); setXml(''); setError(null); }} className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-600">Clear</button>
                        </div>
                        <textarea
                            value={json}
                            onChange={e => setJson(e.target.value)}
                            placeholder='{ "id": 1, "status": "active" }'
                            className="w-full h-[400px] p-6 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-mono text-sm resize-none transition-all shadow-inner"
                        />
                    </div>

                    <div className="bg-slate-900 rounded-[32px] p-6 shadow-2xl border border-white/5 flex flex-col relative overflow-hidden group">
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                        <div className="flex justify-between items-center mb-4 px-1 relative z-10">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">XML Output</span>
                            <button
                                onClick={() => navigator.clipboard.writeText(xml)}
                                disabled={!xml}
                                className="text-[10px] font-bold uppercase tracking-widest text-white disabled:opacity-20 hover:text-indigo-400 transition-colors"
                            >
                                Copy XML
                            </button>
                        </div>
                        <div className="w-full flex-1 p-6 bg-black/40 rounded-2xl font-mono text-sm text-indigo-300 overflow-auto whitespace-pre-wrap min-h-[400px] relative z-10 scrollbar-hide">
                            {xml || 'The converted XML will appear here...'}
                        </div>
                    </div>
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={convert}
                        className="px-16 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-indigo-100 dark:shadow-none transition-all active:scale-95"
                    >
                        Convert to XML
                    </button>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl font-bold text-center border border-red-100 dark:border-red-900/30 animate-in slide-in-from-top-2">
                        {error}
                    </div>
                )}
            </div>
        </ToolLayout>
    );
};

export default JsonToXmlTool;
