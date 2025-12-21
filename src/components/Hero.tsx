import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Cpu, Globe, Rocket, ShieldCheck, Code2 } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden bg-[#0a0e1a] py-40 lg:py-56 selection:bg-[#ff8c04]/30">
      {/* 🚀 ATMOSPHERIC BACKGROUND */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2850&q=80"
          alt="Coding Team"
          className="w-full h-full object-cover grayscale opacity-20"
        />
        {/* Deep Brand Gradient Overlay - Corporate Navy */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a]/80 via-[#0a0e1a] to-[#0a0e1a]" />

        {/* Subtle Grid */}
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }} />

        {/* Animating Accents - Exact Brand Golden */}
        <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-[#ff8c04]/10 rounded-full blur-[140px] animate-pulse" />
      </div>

      {/* ⚡ CONTENT LAYER */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-6 flex flex-col items-center">
        {/* Nashied Badge */}
        <div className="reveal inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 text-white px-6 py-3 rounded-full mb-10 hover:bg-white/10 transition-all cursor-default group">
          <Code2 className="w-4 h-4 text-[#ff8c04]" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">The High-Output Creative Boutique</span>
          <div className="h-4 w-px bg-white/10 mx-1" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff8c04]">v2.0 Beta</span>
        </div>

        <h1 className="text-4xl md:text-7xl lg:text-[5.5rem] font-black mb-10 tracking-tighter leading-[1] uppercase reveal">
          <span className="text-white">Build</span> <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff8c04] via-[#ff8c04] to-[#e67a00]">Iconic</span> <br />
          <span className="text-white">Digital.</span>
        </h1>

        <p className="text-lg md:text-xl text-white/50 font-medium max-w-2xl mx-auto mb-16 reveal-delayed leading-relaxed">
          We are the centralized production engine for brands that value <span className="text-white font-bold underline decoration-[#ff8c04] decoration-2 underline-offset-4">unprecedented speed</span> and AI-enhanced precision.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 reveal-delayed-2 w-full sm:w-auto">
          <Link to="/project-inquiry" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="h-14 bg-[#ff8c04] hover:bg-[#e67a00] text-white font-black uppercase text-xs tracking-widest px-10 rounded-xl shadow-2xl shadow-[#ff8c04]/20 w-full transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3"
            >
              Start Your Journey <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/work" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="h-14 bg-white/5 border-white/10 text-white hover:bg-white/10 font-black uppercase text-xs tracking-widest px-10 rounded-xl w-full backdrop-blur-md transition-all border-none ring-1 ring-white/10 hover:ring-white/20"
            >
              View Our Work
            </Button>
          </Link>
        </div>

        {/* 📊 REAL-TIME TELEMETRY STATS */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-12 w-full max-w-4xl mx-auto reveal-delayed-2 border-t border-white/5 pt-16">
          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase tracking-widest text-white/20">Production Speed</p>
            <div className="text-3xl font-black text-white tabular-nums tracking-tighter hover:text-[#ff8c04] transition-colors">5.0X</div>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase tracking-widest text-white/20">Client Trust</p>
            <div className="text-3xl font-black text-white tabular-nums tracking-tighter hover:text-[#ff8c04] transition-colors">150+</div>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase tracking-widest text-white/20">Efficiency Gain</p>
            <div className="text-3xl font-black text-white tabular-nums tracking-tighter hover:text-[#ff8c04] transition-colors">60%</div>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase tracking-widest text-white/20">Uptime Metric</p>
            <div className="text-3xl font-black text-white tabular-nums tracking-tighter hover:text-[#ff8c04] transition-colors">99.9%</div>
          </div>
        </div>
      </div>

      {/* Decorative Glow - Exact Brand Golden */}
      <div className="absolute -bottom-1/2 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[#ff8c04]/10 blur-[150px] rounded-full pointer-events-none" />
    </section>
  );
};

export default Hero;