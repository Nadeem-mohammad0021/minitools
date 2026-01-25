'use client';

import { useState, useCallback } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';

const PasswordGeneratorTool = () => {
  const [len, setLen] = useState(16);
  const [caps, setCaps] = useState(true);
  const [nums, setNums] = useState(true);
  const [syms, setSyms] = useState(true);
  const [pass, setPass] = useState('');

  const generate = useCallback(() => {
    let charset = 'abcdefghijklmnopqrstuvwxyz';
    if (caps) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (nums) charset += '0123456789';
    if (syms) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    let res = '';
    for (let i = 0; i < len; i++) res += charset.charAt(Math.floor(Math.random() * charset.length));
    setPass(res);
  }, [len, caps, nums, syms]);

  const copy = () => {
    navigator.clipboard.writeText(pass);
  };

  const strength = len > 24 ? 'Very Strong' : len > 14 ? 'Strong' : 'Weak';
  const strengthColor = len > 24 ? 'text-green-500' : len > 14 ? 'text-indigo-500' : 'text-rose-500';

  return (
    <ToolLayout title="Password Generator" description="Generate strong, random passwords with customizable length and character types for better security." toolId="password-gen">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="bg-white dark:bg-slate-800 rounded-[40px] p-10 shadow-2xl border border-slate-100 dark:border-slate-700">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Password Length: {len}</label>
                  <span className={`text-xs font-black uppercase tracking-widest ${strengthColor}`}>{strength}</span>
                </div>
                <input type="range" min="8" max="64" value={len} onChange={e => setLen(parseInt(e.target.value))} className="w-full h-3 bg-slate-100 dark:bg-slate-900 rounded-full appearance-none cursor-pointer accent-black dark:accent-white" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[{ v: caps, s: setCaps, l: 'ABC' }, { v: nums, s: setNums, l: '123' }, { v: syms, s: setSyms, l: '#$&' }].map((it, i) => (
                  <button key={i} onClick={() => it.s(!it.v)} className={`py-4 rounded-2xl font-black text-xs transition-all border-2 ${it.v ? 'bg-black text-white border-black shadow-lg' : 'bg-transparent text-slate-400 border-slate-100 dark:border-slate-800'}`}>{it.l}</button>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <button onClick={generate} className="w-full py-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[32px] font-bold uppercase tracking-widest shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]">Generate Password</button>
            </div>
          </div>

          {pass && (
            <div className="bg-slate-50 dark:bg-slate-900 rounded-[32px] p-8 border border-dashed border-slate-200 dark:border-slate-700 group relative">
              <div className="text-3xl md:text-5xl font-mono font-bold break-all text-center tracking-tighter mb-8 pr-12">{pass}</div>
              <button onClick={copy} className="absolute top-4 right-4 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:bg-indigo-600 hover:text-white transition-all">📋</button>
              <div className="flex justify-center flex-wrap gap-2">
                {Array.from({ length: Math.min(len, 20) }).map((_, i) => <div key={i} className={`h-1 flex-1 rounded-full ${strengthColor} opacity-20`} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
};

export default PasswordGeneratorTool;