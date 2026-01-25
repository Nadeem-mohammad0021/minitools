'use client';

import { useState, useCallback } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';

const XmlFormatterTool = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState<string | null>(null);

    const apply = useCallback(() => {
        try {
            if (!input.trim()) return;
            
            // Parse first to ensure validity
            const parser = new XMLParser({
                ignoreAttributes: false,
                attributeNamePrefix: "@_"
            });
            const obj = parser.parse(input);
            
            // Build with formatting
            const builder = new XMLBuilder({
                ignoreAttributes: false,
                format: true,
                attributeNamePrefix: "@_"
            });
            const formatted = builder.build(obj);

            setOutput(formatted);
            setError(null);
        } catch (e) {
            setError('The XML data provided is invalid.');
            setOutput('');
        }
    }, [input]);

    const copyToClipboard = () => {
        if (output) {
            navigator.clipboard.writeText(output);
        }
    };

    return (
        <ToolLayout title="XML Formatter" description="Organize and format your XML markup for better readability and structure." toolId="xml-formatter">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Section */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Input XML</label>
                            <button onClick={() => { setInput(''); setOutput(''); setError(null); }} className="text-xs font-bold text-red-500 hover:text-red-600">Clear</button>
                        </div>
                        <textarea
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="<root><node>data</node></root>"
                            className="w-full h-[500px] p-6 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 rounded-3xl outline-none font-mono text-sm resize-none transition-all shadow-inner"
                        />
                    </div>

                    {/* Output Section */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Formatted XML</label>
                            <button
                                onClick={copyToClipboard}
                                disabled={!output}
                                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 disabled:opacity-30"
                            >
                                Copy All
                            </button>
                        </div>
                        <div className="relative h-[500px] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                            <pre className="w-full h-full p-6 font-mono text-sm text-cyan-300 overflow-auto whitespace-pre-wrap leading-relaxed">
                                {output || (error ? '' : 'Formatted results will appear here...')}
                            </pre>
                            {error && (
                                <div className="absolute inset-x-0 bottom-0 p-4 bg-red-950/90 border-t border-red-900/50 text-red-400 text-xs font-bold animate-in slide-in-from-bottom-2">
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <button
                    onClick={apply}
                    className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all"
                >
                    Format XML
                </button>
            </div>
        </ToolLayout>
    );
};

export default XmlFormatterTool;
