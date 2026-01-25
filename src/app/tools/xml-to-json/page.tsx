'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { XMLParser } from 'fast-xml-parser';

const XmlToJsonTool = () => {
    const [xml, setXml] = useState('');
    const [json, setJson] = useState('');
    const [error, setError] = useState<string | null>(null);

    const convert = () => {
        try {
            if (!xml.trim()) return;
            
            const parser = new XMLParser({
                ignoreAttributes: false,
                attributeNamePrefix: "@_"
            });
            const result = parser.parse(xml);
            
            setJson(JSON.stringify(result, null, 2));
            setError(null);
        } catch {
            setError('Invalid XML format. Please check your source code.');
        }
    };

    return (
        <ToolLayout title="XML to JSON" description="Easily convert your XML documents into clean, structured JSON data for use in web applications and APIs." toolId="xml-to-json">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex justify-between items-center mb-4 px-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">XML Input</span>
                            <button onClick={() => { setXml(''); setJson(''); setError(null); }} className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-600">Clear</button>
                        </div>
                        <textarea
                            value={xml}
                            onChange={e => setXml(e.target.value)}
                            placeholder='<note>\n  <to>User</to>\n  <from>Kynex</from>\n</note>'
                            className="w-full h-[400px] p-6 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-mono text-sm resize-none transition-all shadow-inner"
                        />
                    </div>

                    <div className="bg-slate-900 rounded-[32px] p-6 shadow-2xl border border-white/5 flex flex-col">
                        <div className="flex justify-between items-center mb-4 px-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">JSON Output</span>
                            <button
                                onClick={() => navigator.clipboard.writeText(json)}
                                disabled={!json}
                                className="text-[10px] font-bold uppercase tracking-widest text-white disabled:opacity-20 hover:text-indigo-400 transition-colors"
                            >
                                Copy JSON
                            </button>
                        </div>
                        <div className="w-full flex-1 p-6 bg-black/40 rounded-2xl font-mono text-sm text-indigo-300 overflow-auto whitespace-pre-wrap min-h-[400px]">
                            {json || 'The converted JSON will appear here...'}
                        </div>
                    </div>
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={convert}
                        className="px-16 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-indigo-100 dark:shadow-none transition-all active:scale-95"
                    >
                        Convert to JSON
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

export default XmlToJsonTool;
