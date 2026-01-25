'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { generateLoremIpsum } from '@/lib/engines/textEngine';
import { Copy, RefreshCw } from 'lucide-react';

export default function LoremIpsumTool() {
    const [paragraphs, setParagraphs] = useState(3);
    const [result, setResult] = useState('');

    const handleGenerate = () => {
        setResult(generateLoremIpsum(paragraphs));
    };

    const copyText = () => {
        navigator.clipboard.writeText(result);
    };

    return (
        <ToolLayout
            title="Lorem Ipsum Generator"
            description="Generate placeholder text for your designs and layouts."
            toolId="lorem-ipsum-generator"
            category="Text"
        >
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-end gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-2">Number of Paragraphs</label>
                        <Input
                            type="number" min="1" max="50"
                            value={paragraphs}
                            onChange={e => setParagraphs(parseInt(e.target.value))}
                        />
                    </div>
                    <Button onClick={handleGenerate} className="mb-[2px] h-10 px-8">Generate</Button>
                </div>

                {(result || true) && (
                    <div className="relative">
                        <textarea
                            className="w-full h-96 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none resize-none focus:ring-2 focus:ring-indigo-500 leading-relaxed text-slate-700 dark:text-slate-300"
                            placeholder="Click Generate to create text..."
                            value={result}
                            readOnly
                        ></textarea>
                        {result && (
                            <Button
                                variant="secondary"
                                size="sm"
                                className="absolute top-4 right-4 shadow-sm"
                                onClick={copyText}
                            >
                                <Copy className="w-4 h-4 mr-2" /> Copy
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
