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
  MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const router = useRouter();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen selection:bg-indigo-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[120px]" />
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/[0.05] bg-bg-dark/80 backdrop-blur-xl">
        <div className="container-custom h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition-transform">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">AI Counsellor</span>
          </div>

          <div className="flex items-center space-x-6">
            <button
              onClick={() => router.push('/login')}
              className="text-sm font-semibold text-text-sub hover:text-white transition-colors"
            >
              Log in
            </button>
            <Button onClick={() => router.push('/signup')} className="rounded-full px-6 shadow-lg shadow-indigo-600/20">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-20 overflow-hidden">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              {...fadeIn}
              className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-10"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-xs md:text-sm font-bold text-indigo-300 uppercase tracking-wider">The Intelligent Way to Study Abroad</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-8xl font-black mb-8 leading-[1.05] gradient-text"
            >
              Navigate Admissions <br /> with Precision.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-text-sub mb-12 max-w-2xl mx-auto font-medium"
            >
              Personalized AI guidance for profile building, university selection,
              and application success—all in one clear, logical platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-5"
            >
              <Button onClick={() => router.push('/signup')} size="lg" className="w-full sm:w-auto px-10 h-16 rounded-full text-lg shadow-2xl shadow-indigo-600/30">
                Start Your Free Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" onClick={() => router.push('/login')} size="lg" className="w-full sm:w-auto px-10 h-16 rounded-full text-lg border-white/10 hover:bg-white/[0.03]">
                Log In to Continue
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust/Social Proof Placeholder */}
      <section className="py-12 border-y border-white/[0.05] bg-white/[0.01]">
        <div className="container-custom">
          <p className="text-center text-xs font-bold text-text-dim uppercase tracking-[0.2em] mb-8">Trusted by students worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Simple placeholders for "Univ" logos or trust badges if needed */}
            <div className="text-xl font-bold italic">OXFORD</div>
            <div className="text-xl font-bold italic">HARVARD</div>
            <div className="text-xl font-bold italic">STANFORD</div>
            <div className="text-xl font-bold italic">MIT</div>
            <div className="text-xl font-bold italic">CAMBRIDGE</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">Expert Advice, <br /> Built Into Every Step.</h2>
              <p className="text-lg text-text-sub font-medium">No more endless forums or conflicting advice. Get a single source of truth for your future.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="w-8 h-8 text-indigo-400" />,
                title: "Deep Profile Analysis",
                desc: "We analyze your GPA, test scores, and budget to provide a realistic assessment of your chances."
              },
              {
                icon: <Target className="w-8 h-8 text-purple-400" />,
                title: "University Matchmaker",
                desc: "Discovery engine that labels schools as Dream, Target, or Safe based on sophisticated matching logic."
              },
              {
                icon: <MessageSquare className="w-8 h-8 text-pink-400" />,
                title: "AI Guidance Agent",
                desc: "Chat with your counsellor anytime. It can even create tasks and shortlist universities for you."
              }
            ].map((f, i) => (
              <Card key={i} className="glass-card p-10 hover:border-white/10 transition-all duration-300 group">
                <div className="w-16 h-16 bg-white/[0.03] rounded-2xl flex items-center justify-center mb-8 group-hover:bg-indigo-600/10 transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                <p className="text-text-sub leading-relaxed font-medium">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Visualization */}
      <section className="py-32 bg-bg-surface/30 border-y border-white/[0.03]">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Four Steps to Success.</h2>
            <p className="text-lg text-text-sub font-medium">A structured timeline that keeps you focused on what matters now.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {[
              { id: '01', icon: <GraduationCap />, title: "Complete Profile", desc: "Share your academic and financial background." },
              { id: '02', icon: <Search />, title: "Discover Matches", desc: "Explore AI-recommended universities for you." },
              { id: '03', icon: <Lock />, title: "Lock Selection", desc: "Commit to your choice to unlock strategy." },
              { id: '04', icon: <CheckCircle />, title: "Apply & Win", desc: "Execute with personalized task lists." }
            ].map((step, i) => (
              <div key={i} className="relative p-8 glass-card border-none bg-white/[0.02]">
                <div className="text-5xl font-black text-indigo-600/10 absolute top-6 right-8 leading-none">{step.id}</div>
                <h4 className="text-xl font-bold mb-3 mt-4">{step.title}</h4>
                <p className="text-sm text-text-sub leading-relaxed font-medium">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Wrap */}
      <section className="py-40">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-16 md:p-24 rounded-[3rem] bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-transparent border border-white/[0.05] relative overflow-hidden"
          >
            {/* Visual Flare */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] pointer-events-none" />

            <h2 className="text-4xl md:text-6xl font-black mb-8 relative z-10">Stop Wondering. Start Applying.</h2>
            <p className="text-xl text-text-sub mb-12 max-w-xl mx-auto font-medium relative z-10">
              Your international education is too important to leave to chance. Join AI Counsellor today.
            </p>
            <div className="relative z-10">
              <Button onClick={() => router.push('/signup')} size="lg" className="h-16 px-12 rounded-full text-xl shadow-2xl shadow-indigo-600/40">
                Get Started for Free
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/[0.05]">
        <div className="container-custom flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-text-dim rounded-lg flex items-center justify-center opacity-50">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-bold tracking-tight text-text-dim">AI Counsellor Platform</span>
          </div>

          <div className="flex items-center space-x-8 text-sm font-bold text-text-dim">
            <a href="#" className="hover:text-text-sub transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-text-sub transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-text-sub transition-colors">Contact Us</a>
          </div>

          <p className="text-xs font-bold text-text-dim uppercase tracking-widest">&copy; 2026 AI Counsellor</p>
        </div>
      </footer>
    </div>
  );
}
