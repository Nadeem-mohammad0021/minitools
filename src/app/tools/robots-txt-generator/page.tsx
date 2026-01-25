'use client';

import { useState, useCallback, useEffect } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';

const RobotsTxtGeneratorTool = () => {
    const [agent, setAgent] = useState('*');
    const [allow, setAllow] = useState('/');
    const [disallowedPaths, setDisallowedPaths] = useState('/admin\n/private\n/temp');
    const [sitemapUrl, setSitemapUrl] = useState('');
    const [result, setResult] = useState('');

    const generateRobotsTxt = useCallback(() => {
        let content = `User-agent: ${agent || '*'}\nAllow: ${allow || '/'}\n`;
        const paths = disallowedPaths.split('\n').filter(p => p.trim());
        paths.forEach(p => {
            content += `Disallow: ${p.trim()}\n`;
        });
        if (sitemapUrl) {
            content += `\nSitemap: ${sitemapUrl}`;
        }
        setResult(content);
    }, [agent, allow, disallowedPaths, sitemapUrl]);

    useEffect(() => {
        generateRobotsTxt();
    }, [generateRobotsTxt]);

    const copyToClipboard = () => {
        if (result) {
            navigator.clipboard.writeText(result);
        }
    };

    return (
        <ToolLayout title="Robots.txt Generator" description="Create a custom robots.txt file to guide search engines and manage how crawlers access your website." toolId="robots-gen">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Configuration Section */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">User Agent</label>
                                <input
                                    value={agent}
                                    onChange={e => setAgent(e.target.value)}
                                    className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 rounded-xl outline-none font-bold transition-all"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Default Access</label>
                                <input
                                    value={allow}
                                    onChange={e => setAllow(e.target.value)}
                                    className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 rounded-xl outline-none font-bold transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Disallowed Paths (one per line)</label>
                            <textarea
                                value={disallowedPaths}
                                onChange={e => setDisallowedPaths(e.target.value)}
                                rows={5}
                                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-mono text-sm resize-none transition-all shadow-inner"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Sitemap URL (optional)</label>
                            <input
                                value={sitemapUrl}
                                onChange={e => setSitemapUrl(e.target.value)}
                                placeholder="https://example.com/sitemap.xml"
                                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-bold transition-all shadow-inner"
                            />
                        </div>
                    </div>

                    {/* Output Section */}
                    <div className="flex flex-col bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl overflow-hidden relative">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Generated Robots.txt</span>
                            <button
                                onClick={copyToClipboard}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all border border-white/10"
                            >
                                Copy Text
                            </button>
                        </div>
                        <pre className="flex-1 p-6 bg-black/40 rounded-2xl font-mono text-sm text-indigo-200 overflow-auto whitespace-pre-wrap leading-relaxed border border-white/5">
                            {result}
                        </pre>
                        <div className="mt-6">
                            <button
                                onClick={() => { setAgent('*'); setAllow('/'); setDisallowedPaths(''); setSitemapUrl(''); }}
                                className="w-full py-4 text-slate-500 hover:text-red-400 font-bold text-xs uppercase tracking-widest transition-colors"
                            >
                                Reset to Default
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
};

export default RobotsTxtGeneratorTool;
