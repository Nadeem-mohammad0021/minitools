'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Button } from '@/components/ui/button';
import { toBase64, fromBase64 } from '@/lib/engines/devEngine';
import { Copy, ArrowDown } from 'lucide-react';

export default function Base64Tool() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState<'encode' | 'decode'>('encode');

    const handleProcess = () => {
        try {
            if (mode === 'encode') {
                setOutput(toBase64(input));
            } else {
                setOutput(fromBase64(input));
            }
        } catch (e) {
            alert("Invalid Input");
        }
    };

    return (
        <ToolLayout
            title="Base64 Converter"
            description="Encode string to Base64 or decode Base64 to string."
            toolId="base64-converter"
            category="Dev"
        >
            <div className="grid lg:grid-cols-2 gap-8 h-[70vh]">
                <div className="flex flex-col gap-4 h-full">
                    <h3 className="font-semibold text-slate-700 dark:text-slate-300">Input ({mode === 'encode' ? 'Text' : 'Base64'})</h3>
                    <textarea
                        className="flex-1 p-4 rounded-xl bg-white dark:bg-slate-800 border-none shadow-sm resize-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                        placeholder={mode === 'encode' ? "Paste text..." : "Paste Base64..."}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    ></textarea>
                </div>

                <div className="hidden lg:flex flex-col justify-center items-center gap-4">
                    <Button onClick={handleProcess} size="icon" className="h-14 w-14 rounded-full shadow-lg"><ArrowDown className="w-6 h-6 rotate-[-90deg] lg:rotate-0" /></Button>
                    <div className="flex flex-col bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                        <button onClick={() => setMode('encode')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'encode' ? 'bg-white dark:bg-slate-600 shadow-sm' : 'text-slate-500'}`}>Encode</button>
                        <button onClick={() => setMode('decode')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'decode' ? 'bg-white dark:bg-slate-600 shadow-sm' : 'text-slate-500'}`}>Decode</button>
                    </div>
                </div>

                {/* Mobile simple controls */}
                <div className="lg:hidden flex justify-between items-center bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
                    <button onClick={() => setMode('encode')} className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'encode' ? 'bg-white shadow-sm' : 'text-slate-500'}`}>Encode</button>
                    <button onClick={() => setMode('decode')} className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'decode' ? 'bg-white shadow-sm' : 'text-slate-500'}`}>Decode</button>
                </div>
                <div className="lg:hidden flex justify-center"><Button onClick={handleProcess} className="w-full">Convert</Button></div>

                <div className="flex flex-col gap-4 h-full">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-slate-700 dark:text-slate-300">Output</h3>
                        <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(output)}><Copy className="w-4 h-4 text-indigo-500" /></Button>
                    </div>
                    <textarea
                        className="flex-1 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border-none resize-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                        readOnly
                        value={output}
                    ></textarea>
                </div>
            </div>
        </ToolLayout>
    );
}
