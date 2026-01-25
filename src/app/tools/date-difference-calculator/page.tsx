'use client';

import { useState, useCallback, useEffect } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';

const DateDifferenceCalculatorTool = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [differenceInDays, setDifferenceInDays] = useState<number | null>(null);

    const calculateDifference = useCallback(() => {
        if (!startDate || !endDate) return;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffInMs = Math.abs(end.getTime() - start.getTime());
        setDifferenceInDays(Math.ceil(diffInMs / (1000 * 60 * 60 * 24)));
    }, [startDate, endDate]);

    useEffect(() => {
        calculateDifference();
    }, [calculateDifference]);

    return (
        <ToolLayout title="Date Difference Calculator" description="Quickly calculate the exact number of days between two dates for project planning or personal use." toolId="date-diff">
            <div className="max-w-4xl mx-auto space-y-10">
                <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest px-1">Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-medium text-lg transition-all shadow-inner"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest px-1">End Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-medium text-lg transition-all shadow-inner"
                            />
                        </div>
                    </div>
                    <button
                        onClick={calculateDifference}
                        className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-95"
                    >
                        Calculate Difference
                    </button>
                </div>

                {differenceInDays !== null && (
                    <div className="bg-slate-900 rounded-[32px] p-12 text-center text-white shadow-2xl animate-in slide-in-from-bottom-8 duration-500 border border-white/5 relative overflow-hidden group">
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                        <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-4 relative z-10">Total Difference</p>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 relative z-10">
                            <span className="text-8xl font-bold tracking-tight">{differenceInDays}</span>
                            <span className="text-xl font-bold text-slate-500 uppercase tracking-widest mt-2 md:mt-6">Days</span>
                        </div>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
};

export default DateDifferenceCalculatorTool;
