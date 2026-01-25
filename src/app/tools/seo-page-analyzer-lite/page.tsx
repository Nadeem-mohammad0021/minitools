'use client';

import { useState, useCallback } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Button } from '@/components/ui/button';
import { Loader2, Globe, FileCode, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

export default function SeoPageAnalyzerLiteTool() {
    const [input, setInput] = useState('https://example.com');
    const [mode, setMode] = useState<'url' | 'code'>('url');
    const [report, setReport] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const apply = async () => {
        if (!input.trim()) return;
        setIsProcessing(true);
        setReport(null);

        try {
            if (mode === 'url') {
                const res = await fetch('/api/seo/analyzer', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: input.trim() })
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Analysis failed');

                const a = data.analysis;
                setReport([
                    { label: 'Title Tag', value: a.title, status: a.title !== 'Missing' ? 'pass' : 'fail' },
                    { label: 'Meta Description', value: a.description, status: a.description !== 'Missing' ? 'pass' : 'fail' },
                    { label: 'H1 Headers', value: `${a.h1Count} found`, status: a.h1Count === 1 ? 'pass' : 'warning' },
                    { label: 'H2 Headers', value: `${a.h2Count} found`, status: a.h2Count > 0 ? 'pass' : 'warning' },
                    { label: 'Robots.txt', value: a.robotsAllowed ? 'Allowed' : 'Blocked', status: a.robotsAllowed ? 'pass' : 'fail' },
                    { label: 'Indexability', value: a.isIndexable ? 'Indexable' : 'No-Index', status: a.isIndexable ? 'pass' : 'warning' },
                    { label: 'Image Alt Tags', value: `${a.imagesWithoutAlt} missing alt`, status: a.imagesWithoutAlt === 0 ? 'pass' : 'warning' },
                ]);
            } else {
                // Manual HTML analysis logic (Existing)
                const findings: any[] = [];
                const titleMatch = input.match(/<title>(.*?)<\/title>/i);
                findings.push({ label: 'Page Title', status: titleMatch ? 'pass' : 'fail', value: titleMatch ? titleMatch[1] : 'Missing' });

                const descMatch = input.match(/<meta name="description" content="(.*?)"/i);
                findings.push({ label: 'Meta Description', status: descMatch ? 'pass' : 'fail', value: descMatch ? (descMatch[1].length > 40 ? descMatch[1].substring(0, 40) + '...' : descMatch[1]) : 'Missing' });

                const h1Match = input.match(/<h1(.*?)>(.*?)<\/h1>/i);
                findings.push({ label: 'H1 Header', status: h1Match ? 'pass' : 'fail', value: h1Match ? 'Found' : 'Missing' });

                const totalImgs = (input.match(/<img/gi) || []).length;
                const imgsWithAlt = (input.match(/alt=["'].+?["']/gi) || []).length;
                findings.push({
                    label: 'Image Alt Tags',
                    status: (imgsWithAlt === totalImgs && totalImgs > 0) ? 'pass' : (totalImgs > 0 ? 'warning' : 'pass'),
                    value: totalImgs > 0 ? `${imgsWithAlt}/${totalImgs} optimized` : 'No images found'
                });
                setReport(findings);
            }
        } catch (e: any) {
            alert(e.message || 'Error analyzing page');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout title="SEO Intelligence" description="Professional-grade SEO analyzer for websites and code. Get actionable technical insights instantly." toolId="seo-audit">
            <div className="max-w-6xl mx-auto space-y-10">
                <div className="flex justify-center">
                    <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl flex gap-1 shadow-inner">
                        <button onClick={() => { setMode('url'); setInput('https://example.com'); setReport(null); }} className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${mode === 'url' ? 'bg-white dark:bg-slate-700 shadow-md text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}><Globe size={14} /> Live URL</button>
                        <button onClick={() => { setMode('code'); setInput('<!DOCTYPE html>\n<html>\n<head>\n  <title>Kynex Platform</title>\n</head>\n<body>\n  <h1>Kynex Tools</h1>\n</body>\n</html>'); setReport(null); }} className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${mode === 'code' ? 'bg-white dark:bg-slate-700 shadow-md text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}><FileCode size={14} /> Raw HTML</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start text-indigo-500">
                    <div className="bg-white dark:bg-slate-900 rounded-[40px] p-10 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 relative overflow-hidden group">
                        <div className="absolute -right-32 -top-32 w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px] group-hover:bg-indigo-500/10 transition-all duration-700" />

                        <div className="relative z-10">
                            <label className="text-[10px] font-black uppercase text-slate-400 mb-6 block tracking-[0.2em] px-1">{mode === 'url' ? 'Target Website' : 'Source Code'}</label>
                            {mode === 'url' ? (
                                <input
                                    type="url"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    placeholder="https://example.com"
                                    className="w-full p-6 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 focus:border-indigo-500 rounded-2xl outline-none font-bold text-lg transition-all"
                                />
                            ) : (
                                <textarea
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    className="w-full h-[350px] p-6 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 focus:border-indigo-500 rounded-3xl outline-none font-mono text-sm resize-none transition-all shadow-inner"
                                />
                            )}
                        </div>

                        <Button
                            onClick={apply}
                            disabled={isProcessing}
                            className="w-full py-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl text-xl font-black uppercase tracking-[0.1em] shadow-2xl shadow-indigo-500/30 transition-all active:scale-[0.98]"
                        >
                            {isProcessing ? <><Loader2 className="animate-spin mr-3" /> Analyzing...</> : 'Launch SEO Audit'}
                        </Button>
                    </div>

                    <div className="flex flex-col space-y-6">
                        {!report && !isProcessing ? (
                            <div className="aspect-square lg:aspect-auto h-full min-h-[400px] border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[40px] flex flex-col items-center justify-center p-16 text-center bg-slate-50/30 dark:bg-black/10">
                                <div className="p-8 bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl mb-8 animate-bounce transition-all duration-1000">
                                    <HelpCircle size={40} className="text-indigo-400" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-4">Awaiting Intelligence</h3>
                                <p className="text-slate-400 font-bold max-w-xs leading-relaxed uppercase text-[10px] tracking-widest">Configure your target above and launch the audit to see deep technical insights.</p>
                            </div>
                        ) : isProcessing ? (
                            <div className="h-full min-h-[400px] bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 p-16 flex flex-col items-center justify-center space-y-8 animate-pulse">
                                <Loader2 size={48} className="text-indigo-600 animate-spin" />
                                <div className="space-y-3 w-full">
                                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full w-full" />
                                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full w-3/4 mx-auto" />
                                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full w-1/2 mx-auto" />
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-950 rounded-[40px] shadow-2xl border border-white/5 overflow-hidden animate-in zoom-in-95 duration-700 flex flex-col h-full min-h-[500px]">
                                <div className="p-10 border-b border-white/5 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-black uppercase tracking-widest text-white">Full Intelligence Report</h3>
                                        <p className="text-[10px] font-bold text-white/30 uppercase mt-1">Audit complete. Optimization opportunities found.</p>
                                    </div>
                                    <div className="bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase border border-indigo-500/20">Pro Mode</div>
                                </div>
                                <div className="flex-1 overflow-auto divide-y divide-white/5 scrollbar-hide">
                                    {report.map((item: any, i: number) => (
                                        <div key={i} className="p-10 flex items-center justify-between group hover:bg-white/5 transition-all">
                                            <div className="flex-1 min-w-0 mr-8">
                                                <p className="text-[10px] font-black uppercase text-indigo-400 mb-3 tracking-widest">{item.label}</p>
                                                <p className="text-sm font-bold text-white/90 truncate leading-relaxed">{item.value}</p>
                                            </div>
                                            <div>
                                                {item.status === 'pass' ? <CheckCircle2 className="text-emerald-500" size={24} /> : <AlertCircle className={item.status === 'warning' ? 'text-amber-500' : 'text-red-500'} size={24} />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
