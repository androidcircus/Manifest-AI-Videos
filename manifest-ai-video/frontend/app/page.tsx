'use client';
import Link from 'next/link';
import { Sparkles, Infinity, Film, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]" />
        </div>
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-400">AI-Powered • Unlimited Length</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">Manifest Your Vision</span><br />
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Into Infinite Video</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              Transform any story into cinematic video.<span className="block text-cyan-400">No time limits. No compromises.</span>
            </p>
            <Link href="/generate" className="manifest-button inline-flex items-center gap-2">Start Creating <ArrowRight className="w-5 h-5" /></Link>
          </motion.div>
        </div>
      </section>
      <section className="py-20 bg-black/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            {[{ icon: Infinity, title: "Unlimited Length", desc: "Generate videos of any duration" },
              { icon: Sparkles, title: "Multi-Agent AI", desc: "Specialized agents for quality" },
              { icon: Film, title: "Cinematic Quality", desc: "Studio-grade visuals" },
              { icon: Clock, title: "2-Hour Generation", desc: "Up to 120 minutes" }
            ].map((f, i) => (
              <div key={i} className="glass-card p-6 text-center group hover:border-cyan-500/30 transition">
                <f.icon className="w-12 h-12 text-cyan-400 mx-auto mb-4 group-hover:scale-110 transition" />
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
