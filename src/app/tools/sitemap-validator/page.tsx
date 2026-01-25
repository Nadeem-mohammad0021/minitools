'use client';

import { useState, useCallback } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { XMLValidator } from 'fast-xml-parser';

const SitemapValidatorTool = () => {
    const [sitemap, setSitemap] = useState('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://example.com/</loc>\n  </url>\n</urlset>');
    const [errors, setErrors] = useState<string[]>([]);
    const [isValidated, setIsValidated] = useState(false);

    const apply = useCallback(() => {
        const errs: string[] = [];
        
        // 1. Basic XML Syntax Validation using fast-xml-parser
        const result = XMLValidator.validate(sitemap);
        if (result !== true) {
            errs.push(`XML Syntax Error: ${result.err.msg} (Line ${result.err.line})`);
        } else {
            // 2. Sitemap Specific Checks
            if (!sitemap.includes('<urlset')) errs.push('Missing <urlset> root node.');
            if (!sitemap.includes('http://www.sitemaps.org/schemas/sitemap/0.9')) errs.push('Missing or incorrect Sitemap XML namespace.');
            
            const urlCount = (sitemap.match(/<url>/g) || []).length;
            if (urlCount === 0) errs.push('No <url> nodes found.');
        }

        setErrors(errs);
        setIsValidated(true);
    }, [sitemap]);

    return (
        <ToolLayout title="Sitemap Validator" description="Validate your sitemap XML structure to ensure it complies with search engine standards." toolId="sitemap-validate">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Section */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Sitemap XML</label>
                            <button onClick={() => { setSitemap(''); setIsValidated(false); }} className="text-xs font-bold text-red-500 hover:text-red-600">Clear</button>
                        </div>
                        <textarea
                            value={sitemap}
                            onChange={e => setSitemap(e.target.value)}
                            className="w-full h-[400px] p-6 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-mono text-sm resize-none transition-all shadow-inner"
                        />
                        <button
                            onClick={apply}
                            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all"
                        >
                            Validate Sitemap
                        </button>
                    </div>

                    {/* Result Section */}
                    <div className="flex flex-col justify-start">
                        {!isValidated ? (
                            <div className="h-full border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex items-center justify-center p-12 text-center bg-slate-50/50 dark:bg-slate-900/30">
                                <div className="max-w-xs">
                                    <div className="text-5xl mb-6 opacity-30">🔍</div>
                                    <p className="text-slate-400 font-medium">Click "Validate Sitemap" to check for errors and structure issues.</p>
                                </div>
                            </div>
                        ) : (
                            <div className={`bg-white dark:bg-slate-900 rounded-3xl p-8 border-2 shadow-sm animate-in zoom-in duration-500 h-full ${errors.length === 0 ? 'border-emerald-500/20' : 'border-red-500/20'}`}>
                                {errors.length === 0 ? (
                                    <div className="flex flex-col items-center text-center justify-center h-full py-10">
                                        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center text-3xl mb-6">✓</div>
                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Valid Sitemap</h2>
                                        <p className="text-slate-500">Your sitemap follows the standard XML schema and is ready for submission.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center text-xl font-black">!</div>
                                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Validation Errors</h2>
                                        </div>
                                        <div className="space-y-3">
                                            {errors.map((e, i) => (
                                                <div key={i} className="p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-100 dark:border-red-900/30 flex items-start gap-3">
                                                    <span className="w-5 h-5 flex-shrink-0 flex items-center justify-center bg-red-500 text-white rounded-full text-[10px] font-bold mt-0.5">{i + 1}</span>
                                                    <p className="font-bold text-sm text-red-700 dark:text-red-400">{e}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
};

export default SitemapValidatorTool;
