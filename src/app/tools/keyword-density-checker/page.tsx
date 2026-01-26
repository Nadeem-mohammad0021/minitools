'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { analyzeText, isGeminiConfigured } from '@/lib/utils/gemini';
import { Loader2 } from 'lucide-react';

const KeywordDensityCheckerTool = () => {
    const [text, setText] = useState('');
    const [analysis, setAnalysis] = useState<{ word: string, count: number, density: number }[]>([]);
    const [aiAnalysis, setAiAnalysis] = useState<{
        keywords: string[];
        sentiment: 'positive' | 'negative' | 'neutral';
        readability: 'easy' | 'medium' | 'hard';
        summary: string;
        suggestions: string[];
    } | null>(null);
    const [isAiProcessing, setIsAiProcessing] = useState(false);
    const geminiAvailable = isGeminiConfigured();

    const analyze = () => {
        if (!text.trim()) return;
        
        // Basic keyword density analysis
        const words = text.toLowerCase().replace(/[^а-яА-Я\w\s]/g, '').split(/\s+/).filter(w => w.length > 3);
        const total = words.length;
        const counts: Record<string, number> = {};
        words.forEach(w => counts[w] = (counts[w] || 0) + 1);
        const sorted = Object.entries(counts)
            .map(([word, count]) => ({ word, count, density: (count / total) * 100 }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 15);
        setAnalysis(sorted);
        
        // Clear previous AI analysis
        setAiAnalysis(null);
    };
    
    const analyzeWithAI = async () => {
        if (!text.trim() || !geminiAvailable) return;
        
        setIsAiProcessing(true);
        try {
            const result = await analyzeText(text);
            setAiAnalysis(result);
        } catch (error) {
            console.error('AI analysis failed:', error);
            alert('AI analysis failed. Please try again.');
        } finally {
            setIsAiProcessing(false);
        }
    };

    return (
        <ToolLayout title="Keyword Density Checker" description="Analyze your text to identify the most frequently used keywords and their density percentages." toolId="keyword-density">
            <div className="max-w-6xl mx-auto space-y-10">
                <div className="bg-white dark:bg-slate-800 rounded-[40px] p-10 shadow-2xl border border-slate-100 dark:border-slate-700">
                    <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Paste your content here to analyze..." className="w-full h-64 p-8 bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-indigo-500 rounded-[32px] outline-none font-medium text-lg resize-none transition-all shadow-inner mb-8" />
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button 
                            onClick={analyze} 
                            className="flex-1 py-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[24px] font-bold uppercase tracking-widest shadow-2xl transition-all hover:scale-105 active:scale-95"
                        >
                            Analyze Text
                        </button>
                        
                        {geminiAvailable && (
                            <button 
                                onClick={analyzeWithAI}
                                disabled={isAiProcessing || !text.trim()}
                                className="flex-1 py-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-[24px] font-bold uppercase tracking-widest shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                            >
                                {isAiProcessing ? (
                                    <>
                                        <Loader2 className="animate-spin" />
                                        Analyzing with AI...
                                    </>
                                ) : (
                                    'AI-Powered Analysis'
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {analysis.length > 0 && (
                    <div className="bg-white dark:bg-slate-800 rounded-[40px] p-12 shadow-2xl border border-slate-100 dark:border-slate-700 animate-in zoom-in duration-500">
                        <div className="flex items-center justify-between mb-10 pb-4 border-b border-slate-50 dark:border-slate-700">
                            <h3 className="text-xl font-bold uppercase tracking-tight">Top Keywords</h3>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Top 15 Words</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {analysis.map((it, i) => (
                                <div key={i} className="flex flex-col p-6 bg-slate-50 dark:bg-slate-900 rounded-[28px] border border-transparent hover:border-indigo-500/20 transition-all hover:shadow-xl group">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="px-3 py-1 bg-white dark:bg-slate-800 rounded-lg text-[10px] font-black text-slate-400 group-hover:text-black transition-all">#{i + 1}</span>
                                        <span className="text-2xl font-black text-indigo-600">{it.density.toFixed(1)}%</span>
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight mb-1">{it.word}</h4>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Frequency: {it.count}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {aiAnalysis && (
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-[40px] p-12 shadow-2xl border border-purple-200 dark:border-purple-800 animate-in zoom-in duration-500">
                        <div className="flex items-center justify-between mb-10 pb-4 border-b border-purple-200 dark:border-purple-800">
                            <h3 className="text-xl font-bold uppercase tracking-tight text-purple-800 dark:text-purple-200">AI-Powered Insights</h3>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400">Powered by Gemini</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Summary */}
                            <div className="p-6 bg-white dark:bg-slate-800 rounded-[28px] border border-purple-100 dark:border-purple-900">
                                <h4 className="font-bold text-lg mb-4 text-purple-700 dark:text-purple-300">Summary</h4>
                                <p className="text-slate-700 dark:text-slate-300">{aiAnalysis.summary}</p>
                            </div>
                            
                            {/* Sentiment & Readability */}
                            <div className="p-6 bg-white dark:bg-slate-800 rounded-[28px] border border-purple-100 dark:border-purple-900">
                                <h4 className="font-bold text-lg mb-4 text-purple-700 dark:text-purple-300">Metrics</h4>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Sentiment:</span>
                                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${
                                            aiAnalysis.sentiment === 'positive' 
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                : aiAnalysis.sentiment === 'negative'
                                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                        }`}>
                                            {aiAnalysis.sentiment}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Readability:</span>
                                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${
                                            aiAnalysis.readability === 'easy' 
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                : aiAnalysis.readability === 'medium'
                                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                        }`}>
                                            {aiAnalysis.readability}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Keywords */}
                            <div className="p-6 bg-white dark:bg-slate-800 rounded-[28px] border border-purple-100 dark:border-purple-900 md:col-span-2">
                                <h4 className="font-bold text-lg mb-4 text-purple-700 dark:text-purple-300">Top Keywords</h4>
                                <div className="flex flex-wrap gap-2">
                                    {aiAnalysis.keywords.map((keyword, index) => (
                                        <span 
                                            key={index} 
                                            className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium"
                                        >
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Suggestions */}
                            <div className="p-6 bg-white dark:bg-slate-800 rounded-[28px] border border-purple-100 dark:border-purple-900 md:col-span-2">
                                <h4 className="font-bold text-lg mb-4 text-purple-700 dark:text-purple-300">Improvement Suggestions</h4>
                                <ul className="space-y-2">
                                    {aiAnalysis.suggestions.map((suggestion, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <span className="text-purple-500 mt-1">•</span>
                                            <span className="text-slate-700 dark:text-slate-300">{suggestion}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
};

export default KeywordDensityCheckerTool;
