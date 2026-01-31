import { ToolLayout } from '@/components/ui/ToolLayout';
import { Users, Zap, Shield, Globe, Award, Target, Rocket } from 'lucide-react';

export default function AboutUsPage() {
  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "All processing happens in your browser for instant results without waiting.",
      color: "from-amber-400 to-orange-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Privacy First",
      description: "Your files never leave your device. We don't store or upload your data.",
      color: "from-emerald-400 to-teal-500"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "100% Free",
      description: "Professional-grade tools available to everyone, no registration required.",
      color: "from-blue-400 to-indigo-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Driven",
      description: "Built by developers for developers, designers, and everyday users.",
      color: "from-purple-400 to-pink-500"
    }
  ];

  return (
    <ToolLayout
      title="About MiniTools"
      description="Professional online utilities designed for speed, privacy, and simplicity."
      toolId="about-us"
      hideFavorites={true}
      fullWidth={true}
    >
      <div className="max-w-7xl mx-auto space-y-24 pb-20">
        {/* Hero Section with Glassmorphism */}
        <div className="relative overflow-hidden rounded-[48px] p-1 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-2xl">
          <div className="bg-white/90 dark:bg-slate-950/90 backdrop-blur-3xl rounded-[46px] p-8 md:p-16 relative overflow-hidden">
            {/* Decorative Blobs */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700" />

            <div className="relative z-10 flex flex-col items-center text-center">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest mb-8 border border-indigo-100 dark:border-indigo-800/50">
                Our Story & Vision
              </span>
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter leading-tight">
                Empowering Digital <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Workflows with AI</span>
              </h1>
              <p className="text-lg md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed font-medium">
                MiniTools is built on the belief that powerful utilities should be fast,
                private, and accessible to everyone without complexity or cost.
              </p>
            </div>
          </div>
        </div>

        {/* Mission & Impact Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="group bg-white dark:bg-slate-900 rounded-[40px] p-10 border border-slate-100 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col justify-between">
            <div>
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/40 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                <Target className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">Our Mission</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                We empower creators, developers, and professionals by providing high-performance,
                privacy-respecting tools that run entirely in the browser. No uploads,
                no logins—just pure productivity.
              </p>
            </div>
            <div className="mt-12 pt-8 border-t border-slate-50 dark:border-slate-800 flex items-center gap-6">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-xs">
                    {i === 4 ? '10k+' : ''}
                  </div>
                ))}
              </div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Trusted by thousands globally</p>
            </div>
          </div>

          <div className="bg-slate-950 rounded-[40px] p-1 shadow-2xl relative overflow-hidden group">
            <div className="h-full bg-slate-900/50 backdrop-blur-sm rounded-[38px] p-10 flex flex-col items-center justify-center text-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all" />
              <div className="w-20 h-20 bg-white/5 rounded-[32px] flex items-center justify-center mb-8 border border-white/10">
                <Rocket className="w-10 h-10 text-indigo-400" />
              </div>
              <div className="text-7xl font-black text-white mb-2 tracking-tighter">100%</div>
              <div className="text-xl font-bold text-indigo-400 uppercase tracking-widest mb-6">Execution Guarantee</div>
              <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
                Every tool we build executes directly on your machine. Your data never touches our servers.
              </p>
            </div>
          </div>
        </div>

        {/* Features Showcase */}
        <div className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">The MiniTools Standard</h2>
            <p className="text-lg text-slate-500 font-medium uppercase tracking-[0.2em]">Why professionals choose our platform</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Global Impact */}
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-black rounded-[48px] p-12 md:p-20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                <Award className="w-8 h-8 text-indigo-400" />
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">Built by KYNEX.dev</h2>
              <p className="text-xl text-slate-400 leading-relaxed font-medium">
                Our team of dedicated engineers and designers work tirelessly to bring pro-grade utilities
                to your browser. We focus on performance, security, and a "vibe" that makes
                productivity delightful.
              </p>
              <div className="flex gap-4">
                <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl flex flex-col items-center">
                  <span className="text-3xl font-black">2026</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Next-Gen Tech</span>
                </div>
                <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl flex flex-col items-center">
                  <span className="text-3xl font-black">25+</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Tools</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] hover:bg-white/10 transition-colors">
                <h3 className="text-xl font-bold mb-2">Privacy Obsessed</h3>
                <p className="text-slate-400">Zero logging. Zero storage. Total control over your digital assets.</p>
              </div>
              <div className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] hover:bg-white/10 transition-colors">
                <h3 className="text-xl font-bold mb-2">Pro Performance</h3>
                <p className="text-slate-400">WASM and local execution ensure desktop-class speed in your web browser.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}