import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Cpu, Globe, Rocket, ShieldCheck, Code2 } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden bg-nashied-navy py-40 lg:py-56 selection:bg-[#ff8c04]/30">
      {/* 🚀 ATMOSPHERIC BACKGROUND - CLEAN & PROFESSIONAL */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2850&auto=format&fit=crop"
          alt="Creative Workspace"
          className="w-full h-full object-cover opacity-30"
        />
        {/* Deep Branded Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-nashied-navy/95 via-nashied-navy/80 to-nashied-navy" />

        {/* Subtle Grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }} />
      </div>

      {/* ⚡ CONTENT LAYER */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-6 flex flex-col items-center">
        {/* Nashied Badge */}
        <div className="reveal inline-flex items-center gap-2 bg-white/5 backdrop-blur-2xl border border-white/10 text-white px-5 py-2.5 rounded-full mb-10 hover:bg-white/10 transition-all cursor-default group">
          <Code2 className="w-3.5 h-3.5 text-[#ff8c04]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">The High-Output Creative Boutique</span>
          <div className="h-4 w-px bg-white/10 mx-1" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff8c04]">v2.0 Beta</span>
        </div>

        <h1 className="text-5xl md:text-8xl lg:text-[7rem] font-bold mb-10 tracking-tighter leading-[1] uppercase reveal">
          <span className="text-white">Build</span> <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff8c04] via-[#ffb931] to-[#ff8c04] animate-glow-pulse">Iconic</span> <br />
          <span className="text-white">Digital.</span>
        </h1>

        <p className="text-lg md:text-xl text-white/60 font-medium max-w-3xl mx-auto mb-16 reveal-delayed leading-relaxed">
          We are a high-output, AI-powered creative partner. Delivering premium digital solutions with speed, precision, and authentic innovation.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 reveal-delayed-2 w-full sm:w-auto">
          <Link to="/project-inquiry" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="h-14 bg-[#ff8c04] hover:bg-[#e67a00] text-white font-bold uppercase text-xs tracking-widest px-10 rounded-xl shadow-2xl shadow-[#ff8c04]/20 w-full transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3"
            >
              Start Your Journey <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/work" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="h-14 bg-white/5 border-white/10 text-white hover:bg-white/10 font-bold uppercase text-xs tracking-widest px-10 rounded-xl w-full backdrop-blur-md transition-all border border-white/10 hover:border-white/20"
            >
              View Our Work
            </Button>
          </Link>
        </div>

        {/* 📊 CLEAN STATS SECTION */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24 w-full max-w-5xl mx-auto reveal-delayed-2 border-t border-white/5 pt-16">
          <div className="flex flex-col items-center space-y-4">
            <Cpu className="w-6 h-6 text-[#ff8c04]" />
            <div className="space-y-1 text-center">
              <div className="text-4xl font-bold text-white tabular-nums tracking-tighter">5x</div>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">Faster Production</p>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <Globe className="w-6 h-6 text-[#ff8c04]" />
            <div className="space-y-1 text-center">
              <div className="text-4xl font-bold text-white tabular-nums tracking-tighter">Global</div>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">Client Base</p>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <Code2 className="w-6 h-6 text-[#ff8c04]" />
            <div className="space-y-1 text-center">
              <div className="text-4xl font-bold text-white tabular-nums tracking-tighter">Premium</div>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">Code Quality</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Glow */}
      <div className="absolute -bottom-1/2 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[#ff8c04]/5 blur-[150px] rounded-full pointer-events-none" />
    </section>
  );
};

export default Hero;
