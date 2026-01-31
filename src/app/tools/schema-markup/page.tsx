'use client';

import { useState, useCallback, useEffect } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Button } from '@/components/ui/button';
import { Loader2, Code, Copy, Download, User, Globe, Building, Info, FileText } from 'lucide-react';

type SchemaType = 'Organization' | 'WebSite' | 'Person' | 'LocalBusiness' | 'Article';

export default function SchemaMarkupGeneratorTool() {
    const [type, setType] = useState<SchemaType>('Organization');
    const [formData, setFormData] = useState({
        name: 'KYNEX.dev',
        url: 'https://kynex.dev',
        logo: 'https://kynex.dev/logo.png',
        description: 'Professional AI-powered online utilities.',
        email: 'support@kynex.dev',
        address: 'Remote First',
        author: 'Admin',
        headline: 'Breaking News in Tech'
    });
    const [res, setRes] = useState('');

    const generate = useCallback(() => {
        let schema: any = {
            "@context": "https://schema.org",
            "@type": type,
        };

        if (type === 'Organization' || type === 'LocalBusiness') {
            schema.name = formData.name;
            schema.url = formData.url;
            schema.logo = formData.logo;
            schema.contactPoint = {
                "@type": "ContactPoint",
                "email": formData.email,
                "contactType": "customer support"
            };
            if (type === 'LocalBusiness') {
                schema.address = {
                    "@type": "PostalAddress",
                    "streetAddress": formData.address
                };
            }
        } else if (type === 'WebSite') {
            schema.name = formData.name;
            schema.url = formData.url;
            schema.description = formData.description;
        } else if (type === 'Person') {
            schema.name = formData.name;
            schema.url = formData.url;
        } else if (type === 'Article') {
            schema.headline = formData.headline;
            schema.author = {
                "@type": "Person",
                "name": formData.author
            };
            schema.publisher = {
                "@type": "Organization",
                "name": formData.name
            };
        }

        setRes(JSON.stringify(schema, null, 2));
    }, [type, formData]);

    useEffect(() => {
        generate();
    }, [generate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(res);
        alert('Schema copied to clipboard!');
    };

    const downloadJson = () => {
        const blob = new Blob([res], { type: 'application/ld+json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'schema.jsonld';
        a.click();
        URL.revokeObjectURL(url);
    };

    const schemaTypes: { value: SchemaType; label: string; icon: any }[] = [
        { value: 'Organization', label: 'Organization', icon: <Building size={16} /> },
        { value: 'WebSite', label: 'WebSite', icon: <Globe size={16} /> },
        { value: 'LocalBusiness', label: 'Local Business', icon: <Building size={16} /> },
        { value: 'Person', label: 'Person', icon: <User size={16} /> },
        { value: 'Article', label: 'Article', icon: <FileText size={16} /> },
    ];

    return (
        <ToolLayout
            title="Schema Markup Generator"
            description="Generate structured JSON-LD schema markup to enhance your website's SEO and search visibility."
            toolId="schema-gen"
            category="SEO Tools"
        >
            <div className="max-w-7xl mx-auto space-y-10">
                <div className="flex flex-wrap justify-center gap-3">
                    {schemaTypes.map((t) => (
                        <button
                            key={t.value}
                            onClick={() => setType(t.value)}
                            className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 border-2 ${type === t.value
                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-500/30'
                                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                                }`}
                        >
                            {t.icon}
                            {t.label}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 md:p-12 border border-slate-100 dark:border-slate-800 shadow-xl space-y-8">
                        <div className="space-y-6">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-wide">
                                <Info size={18} className="text-indigo-500" />
                                Configure Markup
                            </h3>

                            <div className="grid gap-6">
                                {(type === 'Organization' || type === 'WebSite' || type === 'LocalBusiness' || type === 'Person' || type === 'Article') && (
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">
                                            {type === 'Article' ? 'Publisher Name' : 'Name'}
                                        </label>
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-bold transition-all"
                                        />
                                    </div>
                                )}

                                {type !== 'Article' && (
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">URL</label>
                                        <input
                                            name="url"
                                            value={formData.url}
                                            onChange={handleInputChange}
                                            className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-bold transition-all"
                                        />
                                    </div>
                                )}

                                {type === 'WebSite' && (
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Site Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-bold resize-none transition-all"
                                        />
                                    </div>
                                )}

                                {type === 'Article' && (
                                    <>
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Headline</label>
                                            <input
                                                name="headline"
                                                value={formData.headline}
                                                onChange={handleInputChange}
                                                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-bold transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Author Name</label>
                                            <input
                                                name="author"
                                                value={formData.author}
                                                onChange={handleInputChange}
                                                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-bold transition-all"
                                            />
                                        </div>
                                    </>
                                )}

                                {(type === 'Organization' || type === 'LocalBusiness') && (
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Email Address</label>
                                        <input
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-bold transition-all"
                                        />
                                    </div>
                                )}

                                {type === 'LocalBusiness' && (
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Street Address</label>
                                        <input
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-bold transition-all"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <Button onClick={generate} className="w-full py-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[24px] text-lg font-black uppercase tracking-widest shadow-xl shadow-indigo-500/30">
                            Refresh Schema
                        </Button>
                    </div>

                    <div className="flex flex-col h-full space-y-6">
                        <div className="flex-1 bg-slate-950 rounded-[40px] p-8 md:p-12 shadow-2xl border border-white/5 flex flex-col relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

                            <div className="flex justify-between items-center mb-8 relative z-10">
                                <div className="flex items-center gap-3">
                                    <Code className="text-indigo-400" size={20} />
                                    <span className="text-xs font-black uppercase tracking-widest text-white/50">JSON-LD Result</span>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={copyToClipboard} className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors flex items-center gap-1.5"><Copy size={14} /> Copy</button>
                                    <button onClick={downloadJson} className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors flex items-center gap-1.5"><Download size={14} /> Download</button>
                                </div>
                            </div>

                            <pre className="flex-1 p-6 bg-white/5 rounded-[28px] font-mono text-sm text-indigo-300/90 overflow-auto whitespace-pre-wrap leading-relaxed relative z-10 border border-white/5 scrollbar-hide">
                                {res || '// Result will appear here'}
                            </pre>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-xl">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600"><Info size={24} /></div>
                                <div>
                                    <h4 className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-wide">SEO Implementation</h4>
                                    <p className="text-xs text-slate-500 font-medium">Paste this code inside the &lt;head&gt; section of your website.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
