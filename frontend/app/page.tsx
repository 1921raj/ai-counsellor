'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import {
  GraduationCap,
  Brain,
  Target,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Search,
  Lock,
  MessageSquare,
  Globe,
  Zap,
  Shield
} from 'lucide-react';
import { motion } from 'framer-motion';

const FloatingShape = ({ className, delay = 0 }: { className: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 0.1, scale: 1 }}
    transition={{ duration: 1.5, delay }}
    className={`absolute rounded-full blur-[80px] animate-float ${className}`}
  />
);

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-bg-dark selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10 mesh-gradient opacity-40" />
      <FloatingShape className="top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600" delay={0.2} />
      <FloatingShape className="bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600" delay={0.4} />
      <FloatingShape className="top-[40%] left-[60%] w-[30%] h-[30%] bg-pink-600" delay={0.6} />

      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/[0.05] bg-bg-dark/80 backdrop-blur-xl">
        <div className="container-custom h-20 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3 group cursor-pointer"
            onClick={() => router.push('/')}
          >
            <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-indigo-600/20">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 uppercase">AI Counsellor</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-8"
          >
            <button
              onClick={() => router.push('/login')}
              className="text-sm font-bold text-text-sub hover:text-white transition-colors uppercase tracking-widest hidden md:block"
            >
              Access Portal
            </button>
            <Button onClick={() => router.push('/signup')} className="rounded-2xl px-8 h-12 font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-indigo-600/40 hover:scale-105 active:scale-95 transition-all">
              Initialize
            </Button>
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 md:pt-48 pb-32">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 bg-white/[0.03] border border-white/10 rounded-full px-6 py-2 mb-12 backdrop-blur-md"
            >
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-[10px] md:text-xs font-black text-white/60 uppercase tracking-[0.3em]">AI-Powered Admissions Protocol 2.0</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="text-6xl md:text-[120px] font-black mb-10 leading-[0.9] tracking-tighter text-white text-glow"
            >
              Navigate <br />
              <span className="gradient-text">Admissions</span> <br />
              with Precision.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-2xl text-text-sub mb-16 max-w-3xl mx-auto font-medium leading-relaxed"
            >
              Deploy advanced AI agents to architect your international academic career.
              Real-time matching, budget optimization, and application strategy.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Button
                onClick={() => router.push('/signup')}
                size="lg"
                className="w-full sm:w-auto px-12 h-20 rounded-[2rem] text-xl font-black uppercase tracking-widest shadow-[0_0_50px_-12px_rgba(99,102,241,0.5)] hover:shadow-indigo-600/60 transition-all border-t border-white/20"
              >
                Launch Discovery
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/login')}
                size="lg"
                className="w-full sm:w-auto px-12 h-20 rounded-[2rem] text-xl font-black uppercase tracking-widest border-white/10 hover:bg-white/[0.05] backdrop-blur-md"
              >
                Access Account
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trusted Universities Scrolling Bar */}
      <section className="py-20 border-y border-white/[0.05] bg-black/40 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-bg-dark via-transparent to-bg-dark z-10 pointer-events-none" />
        <div className="container-custom">
          <p className="text-center text-[10px] font-black text-white/30 uppercase tracking-[0.5em] mb-12">Global Partnership Network</p>
          <div className="flex space-x-24 items-center">
            {/* Simple infinite scroll simulation with CSS */}
            <div className="flex space-x-24 animate-infinite-scroll">
              {[
                "Oxford University", "Harvard Medical", "Stanford Tech", "MIT Labs", "Cambridge Arts", "CalTech", "ETH Zurich", "UCL London"
              ].map((uni, i) => (
                <div key={uni + i} className="text-2xl font-black italic text-white/20 whitespace-nowrap hover:text-white/60 transition-colors uppercase tracking-widest">
                  {uni}
                </div>
              ))}
              {[
                "Oxford University", "Harvard Medical", "Stanford Tech", "MIT Labs", "Cambridge Arts", "CalTech", "ETH Zurich", "UCL London"
              ].map((uni, i) => (
                <div key={uni + '-dup-' + i} className="text-2xl font-black italic text-white/20 whitespace-nowrap hover:text-white/60 transition-colors uppercase tracking-widest">
                  {uni}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section with Aurora Glow */}
      <section className="py-32 relative">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {[
              { value: "12,400+", label: "Verified Repos", icon: <Globe className="text-indigo-400" /> },
              { value: "98.2%", label: "Acceptance Rate", icon: <Zap className="text-amber-400" /> },
              { value: "65+", label: "Target Regions", icon: <Target className="text-rose-400" /> },
              { value: "0.4s", label: "AI Latency", icon: <Brain className="text-emerald-400" /> }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-1 border-glow rounded-[2.5rem] bg-white/[0.02]"
              >
                <div className="h-full w-full bg-[#0c0c0e] rounded-[calc(2.5rem-4px)] p-10 text-center flex flex-col items-center justify-center group overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="mb-6 p-4 bg-white/[0.03] rounded-2xl group-hover:scale-110 transition-transform">
                    {stat.icon}
                  </div>
                  <div className="text-5xl font-black text-white mb-3 tracking-tighter">{stat.value}</div>
                  <div className="text-[10px] font-black text-text-dim uppercase tracking-[0.3em]">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features with Catchy 3D Cards */}
      <section className="py-40 relative">
        <div className="container-custom">
          <div className="max-w-3xl mb-24">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4 mb-6"
            >
              <div className="h-0.5 w-12 bg-indigo-600" />
              <span className="text-xs font-black text-indigo-400 uppercase tracking-[0.4em]">Core Capabilities</span>
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-black mb-8 leading-[0.9] tracking-tighter">
              Bespoke Intel for <br /> Your Global Future.
            </h2>
            <p className="text-xl text-text-sub font-medium leading-relaxed">
              We've digitized the entire study abroad consultancy model into a high-performance AI engine.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <Brain className="w-10 h-10 text-indigo-400" />,
                title: "Neural Profile Matrix",
                desc: "Quantifies your academic, financial, and extracurricular data into a 4D compatibility score.",
                color: "indigo"
              },
              {
                icon: <Target className="text-rose-400 w-10 h-10" />,
                title: "Global Search Engine",
                desc: "Real-time access to global databases. Filter by scholarship status, tuition caps, and program ranking.",
                color: "rose"
              },
              {
                icon: <Shield className="text-emerald-400 w-10 h-10" />,
                title: "Strategy Validator",
                desc: "Validates your SOPs and documents against successful historical application data.",
                color: "emerald"
              }
            ].map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-${f.color}-500/10 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity`} />
                <Card className="glass-card p-12 h-full bg-white/[0.02] border-white/5 relative z-10 hover:border-white/20 transition-all rounded-[3rem]">
                  <div className="mb-10 w-20 h-20 bg-white/[0.03] rounded-3xl flex items-center justify-center group-hover:bg-white/[0.05] transition-colors shadow-inner">
                    {f.icon}
                  </div>
                  <h3 className="text-3xl font-black mb-6 tracking-tight group-hover:gradient-text transition-all">{f.title}</h3>
                  <p className="text-text-sub leading-relaxed font-medium text-lg">{f.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Process Timeline */}
      <section className="py-40 bg-black/20">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-32">
            <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-white">Operational Timeline.</h2>
            <p className="text-xl text-text-sub font-medium">Streamlined execution from base profile to final admission.</p>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/5 to-transparent hidden md:block" />

            <div className="grid md:grid-cols-4 gap-10">
              {[
                { id: 'Phase 01', title: "Architect", desc: "Build your neural academic profile with AI-standardized GPA." },
                { id: 'Phase 02', title: "Discovery", desc: "Sync with global university repositories for precise matching." },
                { id: 'Phase 03', title: "Encryption", desc: "Lock down your choices and generate application strategy." },
                { id: 'Phase 04', title: "Execution", desc: "Process application tasks with real-time success tracking." }
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative group pt-16"
                >
                  <div className="absolute top-0 left-0 text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-4">{step.id}</div>
                  <div className="w-4 h-4 rounded-full bg-indigo-600 absolute top-[-9px] left-0 hidden md:block shadow-[0_0_20px_rgba(79,70,229,0.8)]" />
                  <h4 className="text-2xl font-black mb-4 tracking-tight text-white group-hover:text-indigo-400 transition-colors uppercase">{step.title}</h4>
                  <p className="text-text-sub leading-relaxed font-medium">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* High-Impact CTA */}
      <section className="py-48 px-6">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-16 md:p-32 rounded-[4rem] bg-indigo-600 relative overflow-hidden group border-t border-white/30"
          >
            {/* Visual Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-transparent opacity-20 pointer-events-none" />
            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[120%] bg-white/10 blur-[120px] rounded-full animate-pulse-glow" />

            <div className="relative z-20 text-center max-w-4xl mx-auto">
              <h2 className="text-5xl md:text-9xl font-black mb-12 text-white leading-[0.8] tracking-tighter">
                Stop Wondering. <br />
                <span className="text-black/30">Start Applying.</span>
              </h2>
              <p className="text-xl md:text-3xl text-indigo-100 mb-16 font-bold leading-relaxed tracking-tight max-w-2xl mx-auto">
                Join 50,000+ students navigating their path with AI precision.
              </p>
              <Button
                onClick={() => router.push('/signup')}
                size="lg"
                className="h-24 px-20 bg-white text-black hover:bg-white/90 rounded-[2.5rem] text-2xl font-black uppercase tracking-widest shadow-2xl hover:scale-110 active:scale-95 transition-all"
              >
                Access System
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 border-t border-white/[0.05] bg-black/40">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-20 mb-20">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-black tracking-tighter uppercase whitespace-nowrap">AI Counsellor</span>
              </div>
              <p className="text-text-sub font-medium max-w-md leading-relaxed text-lg italic">
                Architecting the future of global education through decentralized AI intelligence.
              </p>
            </div>

            <div className="space-y-6">
              <h5 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">System Nodes</h5>
              <div className="flex flex-col space-y-4 text-sm font-bold text-text-dim">
                <a href="#" className="hover:text-white transition-colors uppercase tracking-widest">Discovery</a>
                <a href="#" className="hover:text-white transition-colors uppercase tracking-widest">Profiling</a>
                <a href="#" className="hover:text-white transition-colors uppercase tracking-widest">Analytics</a>
              </div>
            </div>

            <div className="space-y-6">
              <h5 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Legal Protocol</h5>
              <div className="flex flex-col space-y-4 text-sm font-bold text-text-dim">
                <a href="#" className="hover:text-white transition-colors uppercase tracking-widest">Privacy</a>
                <a href="#" className="hover:text-white transition-colors uppercase tracking-widest">Terms</a>
                <a href="#" className="hover:text-white transition-colors uppercase tracking-widest">Security</a>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs font-black text-text-dim uppercase tracking-[0.5em]">&copy; 2026 AI Counsellor Core Labs</p>
            <div className="flex space-x-8 text-[10px] font-bold text-text-dim uppercase tracking-widest italic">
              <span>Status: All Systems Functional</span>
              <span>Region: Global (Earth)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
