'use client';

import { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Button } from '@/components/ui/button';
import {
    wordCount,
    characterCount,
    sentenceCount,
    startCaseCount // Paragraph count logic can be simple split
} from '@/lib/engines/textEngine';
import { Copy, Trash2 } from 'lucide-react';

export default function WordCounterTool() {
    const [text, setText] = useState('');
    const [stats, setStats] = useState({
        words: 0,
        chars: 0,
        charsNoSpace: 0,
        sentences: 0,
        paragraphs: 0
    });

    useEffect(() => {
        setStats({
            words: wordCount(text),
            chars: characterCount(text, true),
            charsNoSpace: characterCount(text, false),
            sentences: sentenceCount(text),
            paragraphs: text.trim() ? text.split(/\n+/).length : 0
        });
    }, [text]);

    const copyText = () => {
        navigator.clipboard.writeText(text);
    };

    const clearText = () => {
        setText('');
    };

    return (
        <ToolLayout
            title="Word Counter"
            description="Analyze your text instantly. Count words, characters, sentences, and paragraphs in real-time."
            toolId="word-counter"
            category="Text"
        >
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Input Area */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-slate-700 dark:text-slate-300">Enter your text</h3>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={copyText} title="Copy">
                                <Copy className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={clearText} title="Clear">
                                <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                        </div>
                    </div>
                    <textarea
                        className="w-full h-[60vh] p-6 rounded-2xl bg-white dark:bg-slate-800 border-none shadow-sm resize-none focus:ring-2 focus:ring-indigo-500 text-lg leading-relaxed"
                        placeholder="Start typing or paste your text here to see the magic happen..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    ></textarea>
                </div>

                {/* Stats Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-6">Statistics</h3>
                        <div className="grid grid-cols-2 lg:grid-cols-1 gap-6">

                            <StatItem label="Words" value={stats.words} color="text-indigo-600 dark:text-indigo-400" />
                            <StatItem label="Characters" value={stats.chars} />
                            <StatItem label="Chars (no space)" value={stats.charsNoSpace} />
                            <StatItem label="Sentences" value={stats.sentences} />
                            <StatItem label="Paragraphs" value={stats.paragraphs} />

                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                        <h3 className="font-bold mb-2">Reading Time</h3>
                        <p className="text-4xl font-black">
                            {Math.max(1, Math.ceil(stats.words / 200))} <span className="text-lg font-medium opacity-80">min</span>
                        </p>
                        <p className="text-xs opacity-60 mt-2">Based on avg. 200 wpm</p>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}

function StatItem({ label, value, color }: { label: string, value: number, color?: string }) {
    return (
        <div className="flex flex-col">
            <span className="text-3xl font-bold font-mono tracking-tight mb-1 text-slate-900 dark:text-white">
                {value.toLocaleString()}
            </span>
            <span className={`text-sm font-medium ${color || 'text-slate-500'}`}>{label}</span>
        </div>
    );
}
