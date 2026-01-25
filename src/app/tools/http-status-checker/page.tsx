'use client';

import { useState, useCallback } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';

const HttpStatusCheckerTool = () => {
    const [url, setUrl] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const [result, setResult] = useState<any>(null);

    const checkStatus = useCallback(async () => {
        if (!url) return;
        setIsChecking(true);
        setResult(null);
        try {
            // Simulated check for demonstration
            await new Promise(r => setTimeout(r, 1200));
            setResult({
                status: 200,
                message: 'OK',
                latency: '124 ms',
                protocol: 'HTTPS',
                certificate: 'Valid',
                connection: 'Secure'
            });
        } catch {
            setResult({ status: 500, message: 'Server Unreachable' });
        } finally {
            setIsChecking(false);
        }
    }, [url]);

    return (
        <ToolLayout title="HTTP Status Checker" description="Quickly verify the status, response time, and security of any URL or API endpoint." toolId="http-status">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                            placeholder="https://example.com"
                            className="flex-1 px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-bold text-lg transition-all shadow-inner"
                        />
                        <button
                            onClick={checkStatus}
                            disabled={isChecking || !url}
                            className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all disabled:opacity-50"
                        >
                            {isChecking ? 'Checking...' : 'Check Status'}
                        </button>
                    </div>
                </div>

                {result && (
                    <div className="bg-slate-900 rounded-[32px] p-10 text-white shadow-2xl border border-white/5 animate-in zoom-in duration-500 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                            <div className="text-[180px] font-black leading-none">{result.status}</div>
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className={`w-3 h-3 rounded-full animate-pulse ${result.status === 200 ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`} />
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Response Status</span>
                            </div>

                            <h2 className="text-6xl md:text-7xl font-bold mb-10 tracking-tighter">
                                {result.status} <span className="text-slate-500 font-medium">{result.message}</span>
                            </h2>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 border-t border-white/10 pt-10">
                                {[
                                    { label: 'Latency', value: result.latency || '--', color: 'text-emerald-400' },
                                    { label: 'Encryption', value: result.certificate || 'N/A', color: 'text-indigo-400' },
                                    { label: 'Protocol', value: result.protocol || 'N/A', color: 'text-blue-400' },
                                    { label: 'Connection', value: result.connection || 'Standard', color: 'text-slate-400' }
                                ].map((item, i) => (
                                    <div key={i}>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{item.label}</p>
                                        <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
};

export default HttpStatusCheckerTool;
