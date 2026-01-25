'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';

const AgeCalculatorTool = () => {
    const [birthDate, setBirthDate] = useState('');
    const [result, setResult] = useState<{ years: number; months: number; days: number } | null>(null);

    const calculateAge = () => {
        if (!birthDate) return;
        const birth = new Date(birthDate);
        const now = new Date();

        let years = now.getFullYear() - birth.getFullYear();
        let months = now.getMonth() - birth.getMonth();
        let days = now.getDate() - birth.getDate();

        if (days < 0) {
            months--;
            days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }
        setResult({ years, months, days });
    };

    return (
        <ToolLayout title="Age Calculator" description="Calculate your exact age in years, months, and days instantly by entering your date of birth." toolId="age-calc">
            <div className="max-w-4xl mx-auto space-y-10">
                <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest px-1">Date of Birth</label>
                        <input
                            type="date"
                            value={birthDate}
                            onChange={e => setBirthDate(e.target.value)}
                            className="w-full px-6 py-5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-medium text-xl transition-all shadow-inner"
                        />
                    </div>
                    <button
                        onClick={calculateAge}
                        className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-95"
                    >
                        Calculate Age
                    </button>
                </div>

                {result && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-8 duration-500">
                        {[
                            { value: result.years, label: 'Years', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
                            { value: result.months, label: 'Months', color: 'text-slate-900 dark:text-white', bg: 'bg-slate-50 dark:bg-slate-800' },
                            { value: result.days, label: 'Days', color: 'text-slate-900 dark:text-white', bg: 'bg-slate-50 dark:bg-slate-800' }
                        ].map((card, i) => (
                            <div key={i} className={`${card.bg} p-10 rounded-[32px] text-center border border-slate-100 dark:border-slate-800 shadow-sm group hover:scale-105 transition-transform`}>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">{card.label}</p>
                                <div className={`text-6xl font-bold tracking-tighter ${card.color}`}>{card.value}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </ToolLayout>
    );
};

export default AgeCalculatorTool;
