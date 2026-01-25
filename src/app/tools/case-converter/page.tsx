'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Button } from '@/components/ui/button';
import { convertCase } from '@/lib/engines/textEngine';
import { Copy, Trash2, ArrowRight } from 'lucide-react';

export default function CaseConverterTool() {
    const [text, setText] = useState('');
    const [result, setResult] = useState('');

    const handleConvert = (type: 'upper' | 'lower' | 'title' | 'sentence' | 'camel' | 'snake' | 'kebab') => {
        setResult(convertCase(text, type));
    };

    const copyText = () => {
        navigator.clipboard.writeText(result || text);
    };

    return (
        <ToolLayout
            title="Case Converter"
            description="Easily convert text between uppercase, lowercase, title case, and more."
            toolId="case-converter"
            category="Text"
        >
            <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-slate-700 dark:text-slate-300">Input Text</h3>
                        <Button variant="ghost" size="sm" onClick={() => setText('')}><Trash2 className="w-4 h-4 text-slate-400" /></Button>
                    </div>
                    <textarea
                        className="w-full h-80 p-4 rounded-xl bg-white dark:bg-slate-800 border-none shadow-sm resize-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Type or paste text here..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    ></textarea>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-slate-700 dark:text-slate-300">Result</h3>
                        <Button variant="ghost" size="sm" onClick={copyText}><Copy className="w-4 h-4 text-indigo-500" /></Button>
                    </div>
                    <textarea
                        className="w-full h-80 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border-none resize-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                        placeholder="Result will appear here..."
                        value={result}
                        readOnly
                    ></textarea>
                </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-8 justify-center">
                <Button onClick={() => handleConvert('upper')}>UPPERCASE</Button>
                <Button onClick={() => handleConvert('lower')}>lowercase</Button>
                <Button onClick={() => handleConvert('title')}>Title Case</Button>
                <Button onClick={() => handleConvert('sentence')}>Sentence case</Button>
                <Button variant="outline" onClick={() => handleConvert('camel')}>camelCase</Button>
                <Button variant="outline" onClick={() => handleConvert('snake')}>snake_case</Button>
                <Button variant="outline" onClick={() => handleConvert('kebab')}>kebab-case</Button>
            </div>
        </ToolLayout>
    );
}
