'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Button } from '@/components/ui/button';
import { removeDuplicateLines } from '@/lib/engines/textEngine';
import { Copy, Trash2, ArrowRight } from 'lucide-react';

export default function RemoveDuplicatesTool() {
    const [text, setText] = useState('');
    const [result, setResult] = useState('');

    const handleProcess = () => {
        setResult(removeDuplicateLines(text));
    };

    const copyText = () => {
        navigator.clipboard.writeText(result || text);
    };

    return (
        <ToolLayout
            title="Remove Duplicate Lines"
            description="Clean up your lists by automatically removing repeated lines."
            toolId="remove-duplicate-lines"
            category="Text"
        >
            <div className="grid lg:grid-cols-2 gap-8 h-[70vh]">
                <div className="flex flex-col gap-4 h-full">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-slate-700 dark:text-slate-300">Input List</h3>
                        <Button variant="ghost" size="sm" onClick={() => setText('')}>Clear</Button>
                    </div>
                    <textarea
                        className="flex-1 p-4 rounded-xl bg-white dark:bg-slate-800 border-none shadow-sm resize-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Paste your list here..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    ></textarea>
                </div>

                <div className="flex flex-col gap-4 h-full">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-slate-700 dark:text-slate-300">Cleaned List</h3>
                        <Button variant="ghost" size="sm" onClick={copyText}><Copy className="w-4 h-4 text-indigo-500" /></Button>
                    </div>
                    <div className="flex-1 relative">
                        <textarea
                            className="w-full h-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border-none resize-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Result will appear here..."
                            value={result}
                            readOnly
                        ></textarea>
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                            <Button onClick={handleProcess} className="shadow-lg px-8">Remove Duplicates</Button>
                        </div>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
