'use client';

import { useState, useCallback, useEffect } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';

const PercentageCalculatorTool = () => {
    const [v1, setV1] = useState<number>(0);
    const [v2, setV2] = useState<number>(0);
    const [res, setRes] = useState<number | null>(null);

    const calculate = useCallback(() => {
        if (v2 === 0) { setRes(null); return; }
        setRes((v1 / 100) * v2);
    }, [v1, v2]);

    useEffect(() => { calculate(); }, [calculate]);

    return (
        <ToolLayout title="Percentage Calculator" description="Calculate percentages quickly and easily for any number or value." toolId="percent-calc">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="bg-white dark:bg-slate-800 rounded-[40px] p-12 shadow-2xl border border-slate-100 dark:border-slate-700 text-center">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-10 mb-12">
                        <div className="flex-1 w-full group">
                            <input type="number" value={v1} onChange={e => setV1(parseFloat(e.target.value) || 0)} className="w-full text-center text-6xl font-black bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-indigo-500 rounded-[32px] py-12 outline-none transition-all shadow-inner" />
                            <p className="text-[10px] font-black uppercase text-slate-400 mt-6 tracking-widest group-hover:text-indigo-500 transition-colors">Percentage Rate (%)</p>
                        </div>
                        <div className="text-4xl font-black text-slate-200 dark:text-slate-700">OF</div>
                        <div className="flex-1 w-full group">
                            <input type="number" value={v2} onChange={e => setV2(parseFloat(e.target.value) || 0)} className="w-full text-center text-6xl font-black bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-emerald-500 rounded-[32px] py-12 outline-none transition-all shadow-inner" />
                            <p className="text-[10px] font-black uppercase text-slate-400 mt-6 tracking-widest group-hover:text-emerald-500 transition-colors">Principal Amount</p>
                        </div>
                    </div>
                    <button onClick={calculate} className="px-20 py-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[24px] font-bold uppercase tracking-widest shadow-2xl transition-all">Calculate</button>
                </div>

                {res !== null && (
                    <div className="bg-slate-900 rounded-[40px] p-16 text-center text-white shadow-2xl animate-in zoom-in duration-700 border border-white/10">
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-6">Result</p>
                        <div className="text-8xl md:text-9xl font-black tracking-tighter text-indigo-400">{res.toLocaleString()}</div>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
};

export default PercentageCalculatorTool;
