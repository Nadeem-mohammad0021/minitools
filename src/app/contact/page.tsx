import { ToolLayout } from '@/components/ui/ToolLayout';
import { Mail, MessageCircle, Clock, MapPin, Send, HelpCircle, ChevronRight, Github, Twitter } from 'lucide-react';

export default function ContactUsPage() {
  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Support",
      description: "For general inquiries and support requests",
      detail: "support@kynex.dev",
      response: "24-48 hours",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Feedback",
      description: "Share your ideas and suggestions",
      detail: "feedback@kynex.dev",
      response: "We read every message",
      color: "from-purple-500 to-pink-600"
    }
  ];

  const faqs = [
    {
      question: "Are your tools really free?",
      answer: "Yes! All our tools are completely free to use with no hidden costs, subscriptions, or registration requirements. We believe in open access to utilities."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. All processing happens locally in your browser—your files never leave your device or get uploaded to our servers. Your privacy is our priority."
    },
    {
      question: "What file formats do you support?",
      answer: "We support major formats including PDF, JPG, PNG, DOCX, and TXT. Check individual tool pages for specific conversion and processing details."
    },
    {
      question: "Zero Registration Required?",
      answer: "Correct. We don't ask for emails or passwords. You can start using any tool immediately with 100% anonymity."
    }
  ];

  return (
    <ToolLayout
      title="Contact Our Team"
      description="We're here to help. Reach out with questions, feedback, or just to say hello."
      toolId="contact-us"
      hideFavorites={true}
      fullWidth={true}
    >
      <div className="max-w-7xl mx-auto space-y-24 pb-20">

        {/* Contact Cards Section */}
        <div className="grid lg:grid-cols-2 gap-12">
          {contactMethods.map((method, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-[40px] p-1 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 hover:from-indigo-500 hover:to-purple-600 transition-all duration-700 shadow-xl"
            >
              <div className="bg-white dark:bg-slate-950 rounded-[38px] p-10 relative overflow-hidden h-full flex flex-col justify-between">
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${method.color} flex items-center justify-center text-white mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    {method.icon}
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">{method.title}</h3>
                  <p className="text-lg text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed">
                    {method.description}
                  </p>
                  <div className="font-mono text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-tighter mb-4">
                    {method.detail}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest mt-8">
                  <Clock className="w-4 h-4" />
                  Average Response: {method.response}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section with Premium Design */}
        <div className="bg-white dark:bg-slate-900 rounded-[48px] p-8 md:p-20 border border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-4xl mx-auto space-y-16">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <HelpCircle size={14} /> Knowledge Base
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Frequently Asked Questions</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {faqs.map((faq, index) => (
                <div key={index} className="space-y-4 p-8 rounded-[32px] bg-slate-50/50 dark:bg-black/20 border border-slate-100/50 dark:border-white/5 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 group">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-start gap-3">
                    <span className="text-indigo-500 mt-1"><ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" /></span>
                    {faq.question}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed pl-8">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Global Hub Connect */}
        <div className="bg-slate-950 rounded-[48px] p-12 md:p-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(79,70,229,0.15),transparent)] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight">
                Connect with our <br />
                <span className="text-indigo-400">Digital Community</span>
              </h2>
              <p className="text-xl text-slate-400 max-w-xl font-medium">
                Stay updated with new tool releases, open-source updates, and productivity tips.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://github.com/kynex-dev"
                target="_blank"
                rel="noopener noreferrer"
                className="group px-8 py-5 bg-white dark:bg-slate-800 rounded-2xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl"
              >
                <Github size={24} />
                Open Source
              </a>
              <a
                href="https://twitter.com/kynexdev"
                target="_blank"
                rel="noopener noreferrer"
                className="group px-8 py-5 bg-indigo-600 rounded-2xl font-black text-white flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-indigo-500/20"
              >
                <Twitter size={24} />
                Follow Updates
              </a>
            </div>
          </div>
        </div>

        {/* Location Info with Dark Aesthetic */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <MapPin />, title: "Headquarters", desc: "Remote First", detail: "Global Distribution" },
            { icon: <Clock />, title: "Support Window", desc: "24/7 Automated", detail: "Human reply in 48h" },
            { icon: <Send />, title: "Social Connect", desc: "@KYNEXdev", detail: "Across all platforms" },
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 text-center space-y-4 hover:border-indigo-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto text-indigo-500">
                {item.icon}
              </div>
              <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs">{item.title}</h4>
              <p className="text-xl font-black tracking-tight dark:text-indigo-400">{item.desc}</p>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{item.detail}</p>
            </div>
          ))}
        </div>

      </div>
    </ToolLayout>
  );
}