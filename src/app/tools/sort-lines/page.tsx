'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Button } from '@/components/ui/button';
import { sortLines } from '@/lib/engines/textEngine';
import { Copy, ArrowDownAZ, ArrowUpZA, Shuffle } from 'lucide-react';

export default function SortLinesTool() {
    const [text, setText] = useState('');
    const [result, setResult] = useState('');

    const handleSort = (direction: 'asc' | 'desc' | 'random') => {
        setResult(sortLines(text, direction));
    };

    const copyText = () => {
        navigator.clipboard.writeText(result || text);
    };

    return (
        <ToolLayout
            title="Sort Text Lines"
            description="Alphabetize lists or randomize valid lines of text instantly."
            toolId="sort-text"
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
                        <h3 className="font-semibold text-slate-700 dark:text-slate-300">Sorted List</h3>
                        <Button variant="ghost" size="sm" onClick={copyText}><Copy className="w-4 h-4 text-indigo-500" /></Button>
                    </div>
                    <textarea
                        className="flex-1 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border-none resize-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Result will appear here..."
                        value={result}
                        readOnly
                    ></textarea>
                </div>
            </div>

            <div className="flex justify-center gap-4 mt-8">
                <Button onClick={() => handleSort('asc')} className="w-32">
                    <ArrowDownAZ className="w-4 h-4 mr-2" /> A-Z
                </Button>
                <Button onClick={() => handleSort('desc')} className="w-32">
                    <ArrowUpZA className="w-4 h-4 mr-2" /> Z-A
                </Button>
                <Button onClick={() => handleSort('random')} variant="outline" className="w-32">
                    <Shuffle className="w-4 h-4 mr-2" /> Random
                </Button>
            </div>
        </ToolLayout>
    );
}
