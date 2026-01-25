'use client';

import { useState, useCallback } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Loader2 } from 'lucide-react';

const RobotsTxtTesterTool = () => {
    const [robotsTxt, setRobotsTxt] = useState('User-agent: *\nDisallow: /admin\nAllow: /');
    const [urlToCheck, setUrlToCheck] = useState('');
    const [status, setStatus] = useState<'allowed' | 'blocked' | null>(null);
    const [isChecking, setIsChecking] = useState(false);

    const testPath = useCallback(async () => {
        if (!robotsTxt || !urlToCheck) return;
        setIsChecking(true);
        setStatus(null);

        try {
            // Ensure URL is absolute for the parser
            let fullUrl = urlToCheck;
            if (urlToCheck.startsWith('/')) {
                fullUrl = 'https://example.com' + urlToCheck;
            } else if (!urlToCheck.startsWith('http')) {
                fullUrl = 'https://' + urlToCheck;
            }

            const res = await fetch('/api/seo/robots', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    robotsTxt,
                    url: fullUrl,
                    userAgent: '*'
                })
            });

            const data = await res.json();
            if (res.ok) {
                setStatus(data.status);
            } else {
                alert('Error: ' + data.error);
            }
        } catch (e) {
            alert('Failed to check robots.txt');
        } finally {
            setIsChecking(false);
        }
    }, [robotsTxt, urlToCheck]);

    return (
        <ToolLayout title="Robots.txt Tester" description="Test your robots.txt directives to see if specific paths are accessible to search engine crawlers." toolId="robots-tester">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Section */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Robots.txt Content</label>
                            <button onClick={() => { setRobotsTxt(''); setStatus(null); }} className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors">Clear</button>
                        </div>
                        <textarea
                            value={robotsTxt}
                            onChange={e => setRobotsTxt(e.target.value)}
                            className="w-full h-[350px] p-6 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-mono text-sm resize-none transition-all shadow-inner"
                        />
                    </div>

                    {/* Test Section */}
                    <div className="flex flex-col justify-start space-y-8">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-500 uppercase tracking-wider px-1">URL Path to Test</label>
                                <input
                                    type="text"
                                    value={urlToCheck}
                                    onChange={e => setUrlToCheck(e.target.value)}
                                    placeholder="e.g. /admin/settings"
                                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-bold text-lg transition-all shadow-inner"
                                />
                            </div>
                            <button
                                onClick={testPath}
                                disabled={!urlToCheck || isChecking}
                                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                            >
                                {isChecking ? <Loader2 className="animate-spin" /> : 'Test Access'}
                            </button>
                        </div>

                        {status && (
                            <div className={`bg-white dark:bg-slate-900 rounded-3xl p-8 border-2 shadow-sm animate-in zoom-in duration-500 ${status === 'allowed' ? 'border-emerald-500/20' : 'border-red-500/20'}`}>
                                <div className="flex items-center gap-6">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm ${status === 'allowed' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40' : 'bg-red-100 text-red-600 dark:bg-red-900/40'}`}>
                                        {status === 'allowed' ? '✓' : '×'}
                                    </div>
                                    <div>
                                        <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${status === 'allowed' ? 'text-emerald-500' : 'text-red-500'}`}>Crawl Status</p>
                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{status === 'allowed' ? 'Path Allowed' : 'Path Blocked'}</h2>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
};

export default RobotsTxtTesterTool;
