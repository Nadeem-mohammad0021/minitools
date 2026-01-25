'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Copy, Check, ExternalLink } from 'lucide-react';

export default function UrlShortenerTool() {
    const [url, setUrl] = useState('');
    const [result, setResult] = useState<{ shortUrl: string; originalUrl: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const [expiresIn, setExpiresIn] = useState('86400'); // Default 1 day
    const [customDays, setCustomDays] = useState('30');

    const handleShorten = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;

        setLoading(true);
        setResult(null);

        // Calculate expiration
        let finalExpires = expiresIn;
        if (expiresIn === 'custom') {
            finalExpires = (parseInt(customDays || '1') * 86400).toString();
        }

        try {
            const res = await fetch('/api/url/shorten', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url,
                    expiresIn: parseInt(finalExpires)
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            setResult(data);
        } catch (error) {
            console.error(error);
            alert('Failed to shorten URL');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (!result) return;
        navigator.clipboard.writeText(result.shortUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <ToolLayout
            title="URL Shortener"
            description="Shorten long URLs into compact links. Set expiration to keep your data clean."
            toolId="url-shortener"
        >
            <div className="max-w-xl mx-auto space-y-8">
                <form onSubmit={handleShorten} className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                            Paste your long URL
                        </label>
                        <Input
                            type="url"
                            placeholder="https://example.com/very/long/url..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                            className="h-12 text-lg"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                            Link Expiration
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { label: '1 Day', value: '86400' },
                                { label: '1 Week', value: '604800' },
                                { label: '1 Month', value: '2592000' },
                                { label: 'Custom', value: 'custom' },
                            ].map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setExpiresIn(opt.value)}
                                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${expiresIn === opt.value
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>

                        {expiresIn === 'custom' && (
                            <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                                <label className="block text-xs font-medium mb-1 text-slate-500">
                                    Enter days to keep active
                                </label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        min="1"
                                        max="365"
                                        value={customDays}
                                        onChange={(e) => setCustomDays(e.target.value)}
                                        className="w-full"
                                    />
                                    <span className="text-sm text-slate-500">days</span>
                                </div>
                            </div>
                        )}

                        <p className="text-xs text-slate-400 mt-2">
                            {expiresIn === 'custom'
                                ? `Link will be deleted after ${customDays} days.`
                                : `Link will be deleted automatically after ${expiresIn === '86400' ? '24 hours' :
                                    expiresIn === '604800' ? '7 days' : '30 days'
                                }.`
                            }
                        </p>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 text-lg font-bold"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Shortening...
                            </>
                        ) : (
                            'Shorten URL'
                        )}
                    </Button>
                </form>

                {result && (
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-900 animation-fade-in-up">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Your Short Link</h3>

                        <div className="flex gap-2 items-center">
                            <div className="flex-1 bg-white dark:bg-slate-900 p-4 rounded-xl font-mono text-indigo-600 dark:text-indigo-400 font-bold border border-slate-200 dark:border-slate-700">
                                {result.shortUrl}
                            </div>

                            <Button onClick={copyToClipboard} size="lg" className="h-full aspect-square p-0">
                                {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                            </Button>

                            <Button asChild variant="outline" size="lg" className="h-full aspect-square p-0">
                                <a href={result.shortUrl} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-5 w-5" />
                                </a>
                            </Button>
                        </div>

                        <p className="text-xs text-slate-400 mt-4 text-center">
                            Target: <span className="truncate inline-block max-w-[200px] align-bottom">{result.originalUrl}</span>
                        </p>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
