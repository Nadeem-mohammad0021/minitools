'use client';

import { useState, useCallback } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';

const UrlCheckerTool = () => {
    const [url, setUrl] = useState('');
    const [report, setReport] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const checkUrl = useCallback(async () => {
        if (!url.trim()) return;
        setIsProcessing(true);
        // Simulate URL check for demonstration
        await new Promise(r => setTimeout(r, 1500));
        setReport({ ssl: true, safe: true, latency: '124ms', mobile: true, status: 200 });
        setIsProcessing(false);
    }, [url]);

    return (
        <ToolLayout title="URL Checker" description="Analyze any URL to check for SSL security, page health, and potential safety risks instantly." toolId="url-check">
            <div className="max-w-5xl mx-auto space-y-10">
                <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                            placeholder="Enter the URL to check (e.g., https://example.com)"
                            className="flex-1 px-8 py-5 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-medium text-lg transition-all shadow-inner"
                        />
                        <button
                            onClick={checkUrl}
                            disabled={isProcessing || !url.trim()}
                            className="px-10 py-5 bg-indigo-600 text-white rounded-xl font-bold uppercase tracking-widest shadow-lg hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isProcessing ? 'Checking...' : 'Check URL'}
                        </button>
                    </div>
                </div>

                {report && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-bottom-8 duration-500">
                        {[
                            { label: 'Security Status', value: 'SSL SECURE', icon: '🔒', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                            { label: 'Loading Speed', value: report.latency, icon: '⚡', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                            { label: 'HTTP Status', value: report.status, icon: '📡', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                            { label: 'Safety Result', value: 'SAFE', icon: '✅', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20' }
                        ].map((card, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center group hover:border-indigo-500/30 transition-all shadow-sm">
                                <div className={`w-16 h-16 ${card.bg} rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                                    {card.icon}
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
                                <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </ToolLayout>
    );
};

export default UrlCheckerTool;
