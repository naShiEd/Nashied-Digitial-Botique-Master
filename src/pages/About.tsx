import Navigation from "@/components/Navigation";
import { ShieldCheck, Target, Zap, Rocket, ChevronRight, CheckCircle2, Award, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  const rules = [
    "Speed is a Feature",
    "AI is the Engine, We are the Architects",
    "Output over Ego",
    "Extreme Ownership of Results",
    "Bespoke is Standard",
    "Transparent Lead Times",
    "High Density Info",
    "Bold Visual Language",
    "Zimbabwean Heart, Global Mindset",
    "Radical Efficiency",
    "Future-Proof Architecture",
    "Iterate in Public",
    "No Placeholders, Only Progress",
    "5X Production Mandate",
    "Authenticity through Innovation",
    "Strategic Aggression",
    "Consistency is Branding",
    "Eliminate Frictional Costs",
    "Direct to Value",
    "Creative Autonomy",
    "Unprecedented Speed",
    "Data-Driven Intuition",
    "Be Different, Not Just Better",
    "The #BeBold2026 Initiative",
    "Cultivating Excellence",
    "The Digital Boutique Standard"
  ];

  return (
    <div className="min-h-screen bg-nashied-navy text-white selection:bg-orange-500/30 selection:text-orange-500">
      <Navigation />

      {/* 1️⃣ EPIC STORY SECTION */}
      <section className="pt-48 pb-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-10">
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
                <Star className="w-3 h-3 text-orange-500 fill-orange-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">The Nashied Mandate</span>
              </div>
              <h1 className="text-7xl md:text-9xl font-bold tracking-tighter leading-[0.85] uppercase">
                Crafting <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Tomorrow</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-400 font-medium leading-relaxed max-w-xl">
                We are a high-output, AI-powered digital boutique. We don't just build brands; we engineer digital legacies with unprecedented speed and precision.
              </p>
              <div className="flex gap-12 pt-4">
                <div>
                  <p className="text-4xl font-bold text-white tabular-nums tracking-tighter">2020</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500/60 mt-1">Founding Year</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-white tabular-nums tracking-tighter">150+</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500/60 mt-1">Impact Milestones</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-white tabular-nums tracking-tighter">Global</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500/60 mt-1">Reach Index</p>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-orange-500/20 rounded-[40px] rotate-3 blur-2xl group-hover:rotate-6 transition-transform" />
              <div className="relative bg-white/5 border border-white/10 p-12 rounded-[40px] backdrop-blur-xl space-y-8">
                <h3 className="text-3xl font-bold uppercase tracking-tighter">The #BeBold2026 Initiative</h3>
                <p className="text-lg text-gray-400 font-medium leading-relaxed">
                  A cultural reset. A personal challenge. An invitation to our clients to stop playing safe and start commanding the future. By 2026, we aim to have redefined the standard of creative production in Africa.
                </p>
                <div className="space-y-4 pt-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-orange-500 flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4" /> 5X Production Velocity
                  </p>
                  <p className="text-xs font-bold uppercase tracking-widest text-orange-500 flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4" /> Authentic AI Synthesis
                  </p>
                  <p className="text-xs font-bold uppercase tracking-widest text-orange-500 flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4" /> Zimbabwe-Centric Excellence
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2️⃣ THE 26 RULES GRID */}
      <section className="py-32 bg-white/5 text-white rounded-[60px] lg:rounded-[100px] mx-4 lg:mx-10 overflow-hidden relative border border-white/10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,rgba(249,115,22,0.1),transparent_50%)]" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mb-24">
            <h2 className="text-5xl md:text-8xl font-bold tracking-tighter leading-none uppercase">
              The 26 Rules <br />
              <span className="text-orange-500">Of The Vault.</span>
            </h2>
            <p className="text-xl text-white/60 font-medium mt-8 leading-relaxed">
              Our internal Operating System. The non-negotiable standards that drive every pixel and line of code we ship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12">
            {rules.map((rule, idx) => (
              <div key={idx} className="flex items-start gap-6 group">
                <span className="text-2xl font-bold text-orange-500/20 tabular-nums group-hover:text-orange-500 transition-colors">
                  {(idx + 1).toString().padStart(2, '0')}
                </span>
                <h4 className="text-lg font-bold uppercase tracking-tight text-white leading-tight">
                  {rule}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3️⃣ MISSION PULSE */}
      <section className="py-40">
        <div className="container mx-auto px-6 text-center space-y-16">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">Different over Better.</h2>
            <p className="text-xl text-gray-400 font-medium leading-relaxed">
              We don't try to be a 'better' version of traditional agencies. We are an entirely different species of creative partner. One that values speed, transparency, and raw output above all else.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <StatCard icon={Zap} label="Efficiency" value="Absolute" />
            <StatCard icon={Rocket} label="Scale" value="Infinite" />
            <StatCard icon={ShieldCheck} label="Quality" value="Elite" />
            <StatCard icon={Target} label="Focus" value="Market Mastery" />
          </div>

          <div className="pt-20">
            <Link to="/contact">
              <Button className="h-16 px-12 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase text-xs tracking-widest shadow-2xl shadow-orange-500/20">
                Join the Network
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Space */}
      <div className="h-20" />
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="space-y-3 p-8 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all">
    <Icon className="h-8 w-8 text-orange-500 mx-auto" />
    <div className="space-y-1">
      <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">{label}</p>
      <p className="text-xl font-bold text-white uppercase">{value}</p>
    </div>
  </div>
);

export default About;
