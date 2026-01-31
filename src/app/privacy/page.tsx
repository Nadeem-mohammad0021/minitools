import { ToolLayout } from '@/components/ui/ToolLayout';
import { Shield, Lock, Eye, FileText, Database, UserCheck, Bell, MessageSquare, AppWindow, Globe } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: <Database className="w-6 h-6" />,
      title: "File Processing",
      content: "All file processing occurs locally in your browser (client-side). Your files never leave your device and are never uploaded to our servers. Processing is volatile and data is lost once the tab is closed.",
      color: "text-blue-500"
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Usage Data",
      content: "We collect anonymous usage statistics through Google Analytics to improve our services. This includes tool usage patterns, performance metrics, and device information (OS/Browser).",
      color: "text-purple-500"
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Data Security",
      content: "We implement industry-standard security measures to protect our website. Since we don't store your files, the risk of data breach regarding your documents is eliminated by design.",
      color: "text-emerald-500"
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Policy Changes",
      content: "We may update this policy periodically. Material changes will be notified by updating the 'Last updated' date at the top of this page.",
      color: "text-amber-500"
    }
  ];

  return (
    <ToolLayout
      title="Privacy Infrastructure"
      description="Transparent, secure, and privacy-first data practices for the modern web."
      toolId="privacy-policy"
      hideFavorites={true}
      fullWidth={true}
    >
      <div className="max-w-7xl mx-auto space-y-20 pb-20">

        {/* Header Summary Card */}
        <div className="bg-white dark:bg-slate-900 rounded-[48px] p-10 md:p-16 border border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          <div className="max-w-3xl mx-auto space-y-8">
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight">Privacy Policy</h1>
            <p className="text-lg text-slate-500 font-bold uppercase tracking-widest">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <div className="p-8 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-[32px] border border-indigo-100 dark:border-indigo-900/30">
              <p className="text-xl md:text-2xl font-black text-indigo-600 dark:text-indigo-400 leading-tight">
                "Our fundamental principle: Your data never leaves your computer. We build tools, not databases."
              </p>
            </div>
          </div>
        </div>

        {/* Core Sections Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {sections.map((section, index) => (
            <div key={index} className="bg-white dark:bg-slate-900 rounded-[40px] p-10 border border-slate-100 dark:border-slate-800 shadow-lg hover:shadow-2xl transition-all duration-500 group">
              <div className={`w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-8 ${section.color} group-hover:scale-110 transition-transform`}>
                {section.icon}
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">{section.title}</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {/* Detailed Disclosure Section */}
        <div className="bg-slate-950 rounded-[48px] p-10 md:p-20 text-white relative overflow-hidden">
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]" />

          <div className="relative z-10 space-y-16">
            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="flex-1 space-y-6">
                <h2 className="text-4xl font-black tracking-tight">Third-Party Services</h2>
                <p className="text-xl text-slate-400 font-medium leading-relaxed">
                  We use a minimal set of trusted partners to deliver and analyze our service performance.
                </p>
                <div className="space-y-4 pt-6">
                  <div className="flex items-center gap-4 p-6 bg-white/5 rounded-3xl border border-white/10">
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400"><Globe /></div>
                    <div>
                      <h4 className="font-bold">Google Analytics</h4>
                      <p className="text-sm text-slate-500">Anonymous traffic & usage patterns</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-6 bg-white/5 rounded-3xl border border-white/10">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400"><AppWindow /></div>
                    <div>
                      <h4 className="font-bold">Cloudflare</h4>
                      <p className="text-sm text-slate-500">DDoS protection & CDN delivery</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-6 bg-white/5 rounded-[40px] p-10 border border-white/10">
                <h2 className="text-4xl font-black tracking-tight">Your Rights</h2>
                <ul className="space-y-6">
                  {[
                    "Right to access usage information",
                    "Right to request data deletion (Analytics)",
                    "Right to object to anonymous processing",
                    "Right to transparency on tool logic"
                  ].map((right, i) => (
                    <li key={i} className="flex items-center gap-4 text-slate-300 font-bold">
                      <UserCheck className="text-emerald-500" size={24} />
                      {right}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Footer */}
        <div className="text-center space-y-8 bg-white dark:bg-slate-900 rounded-[40px] p-12 border border-slate-100 dark:border-slate-800 shadow-xl">
          <MessageSquare className="w-12 h-12 mx-auto text-indigo-500" />
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Privacy Inquiries</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            If you have specific questions regarding your data privacy or our security
            implementations, our legal team is ready to provide clarifications.
          </p>
          <div className="pt-6">
            <a href="mailto:privacy@kynex.dev" className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-tighter hover:underline decoration-4 underline-offset-8">
              privacy@kynex.dev
            </a>
          </div>
        </div>

      </div>
    </ToolLayout>
  );
}