import { ToolLayout } from '@/components/ui/ToolLayout';
import { FileText, Scale, CheckCircle, AlertTriangle, ShieldCheck, HelpCircle, ArrowRight, Gavel, FileCheck, Info } from 'lucide-react';

export default function TermsOfServicePage() {
  const highlightSections = [
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Commercial Use",
      content: "MiniTools is free for both personal and commercial projects. No special licensing required.",
      color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "No Data Storage",
      content: "We don't keep your files. Ever. All processing is transient and local to your session.",
      color: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: "Fair Use",
      content: "Automated scraping or bot-driven abuse of our APIs is strictly prohibited.",
      color: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
    }
  ];

  return (
    <ToolLayout
      title="Terms of Service"
      description="Clear, fair, and developer-friendly terms for using our utility platform."
      toolId="terms-of-service"
      hideFavorites={true}
      fullWidth={true}
    >
      <div className="max-w-7xl mx-auto space-y-20 pb-20">

        {/* Hero Concept Card */}
        <div className="bg-slate-900 rounded-[48px] p-10 md:p-20 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,rgba(99,102,241,0.15),transparent)] pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-3 text-indigo-400 font-black uppercase tracking-widest text-xs mb-8">
              <Gavel size={20} /> Legal Framework
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight mb-8">
              Platform Usage <br />
              <span className="text-indigo-400">Terms & Logic</span>
            </h1>
            <p className="text-xl text-slate-400 font-medium leading-relaxed">
              By using MiniTools by KYNEX.dev, you agree to these simple rules designed to keep the
              service running smoothly for everyone.
            </p>
            <div className="mt-12 inline-block px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-slate-300">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Quick Insights Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {highlightSections.map((item, i) => (
            <div key={i} className={`rounded-[40px] p-10 flex flex-col justify-between space-y-6 ${item.color} shadow-lg hover:scale-105 transition-transform duration-500`}>
              <div className="w-12 h-12 rounded-2xl bg-white/30 backdrop-blur-md flex items-center justify-center">
                {item.icon}
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-black tracking-tight">{item.title}</h3>
                <p className="font-bold opacity-80 leading-relaxed">{item.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Manual Sections */}
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-[40px] p-10 border border-slate-100 dark:border-slate-800 shadow-xl group">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-500"><FileText /></div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">1. Use License</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                MiniTools grants you a revocable, non-exclusive license to use our tools.
                While you're free to use them commercially, you may not repackage,
                white-label, or sell our tools as your own service without explicit written permission.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[40px] p-10 border border-slate-100 dark:border-slate-800 shadow-xl group">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl text-purple-500"><Scale /></div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">2. Prohibited Abuse</h2>
              </div>
              <ul className="space-y-3">
                {["Reverse engineering tools", "Automated mass-scraping", "Harmful file processing", "Removing source credits"].map((t, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-bold text-sm">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-indigo-600 rounded-[48px] p-10 md:p-16 text-white shadow-2xl relative overflow-hidden flex flex-col justify-center">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl font-black tracking-tight leading-tight">Warranties & Liability</h2>
              <div className="space-y-6 text-indigo-100 font-medium text-lg leading-relaxed">
                <p>"As Is" Provision: Tools are provided without warranty. We aim for 100% uptime but cannot guarantee it.</p>
                <p>Liability Cap: KYNEX.dev is not liable for data loss or business interruption resulting from tool use.</p>
              </div>
              <button className="flex items-center gap-3 px-8 py-4 bg-white text-indigo-600 rounded-[28px] font-black uppercase tracking-widest text-xs hover:bg-slate-100 transition-colors">
                Read Full Disclosure <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Governance & Contact Card */}
        <div className="bg-white dark:bg-slate-900 rounded-[48px] p-12 md:p-20 border border-slate-100 dark:border-slate-800 shadow-2xl text-center space-y-12">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[32px] flex items-center justify-center mx-auto text-indigo-500 border border-slate-100 dark:border-slate-800 shadow-inner">
              <FileCheck size={40} />
            </div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Legal Representation</h2>
            <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              These terms are governed by the laws of the United States. For formal legal inquiries,
              please use our dedicated legal channel.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-12">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Direct Email</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter hover:text-indigo-500 transition-colors cursor-pointer">legal@kynex.dev</p>
            </div>
            <div className="h-0.5 sm:h-auto sm:w-0.5 bg-slate-100 dark:bg-slate-800" />
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Web Presence</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter hover:text-indigo-500 transition-colors cursor-pointer">https://kynex.dev</p>
            </div>
          </div>
        </div>

      </div>
    </ToolLayout>
  );
}