import { Flame, Zap, Target, Users, Rocket, ShieldCheck, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const BeBold = () => {
  const pillars = [
    {
      icon: Users,
      title: "Co-Creation Pulse",
      description: "We don't work for you; we work with you. Real-time collaboration via our dedicated production dashboard."
    },
    {
      icon: ShieldCheck,
      title: "Managed Excellence",
      description: "Structured reporting and full creative ownership. Every asset is meticulously vetted before delivery."
    },
    {
      icon: Target,
      title: "Full-Stack Creative",
      description: "One partnership, infinite capabilities. From high-end branding to complex system development."
    },
    {
      icon: Zap,
      title: "AI Synthesis",
      description: "The speed of light, built into our workflow. We use AI to eliminate the mundane and amplify the genius."
    }
  ];

  return (
    <section className="py-24 lg:py-40 bg-background text-foreground relative overflow-hidden rounded-[40px] lg:rounded-[100px] mx-4 lg:mx-10 my-10 lg:my-20 shadow-xl border border-foreground/5 transition-colors duration-500">
      {/* Bold Orange Accent Line */}
      <div className="absolute top-0 left-0 w-full h-[12px] bg-gradient-to-r from-[#ff8c04] to-transparent" />

      <div className="container mx-auto px-6 relative">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="grid lg:grid-cols-2 gap-20 items-end mb-32">
            <div className="space-y-8">
              <Flame className="w-5 h-5 fill-[#ff8c04] text-[#ff8c04]" />
              <span className="font-bold text-xs uppercase tracking-widest text-[#ff8c04]">#BeBold2026 Initiative</span>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.1] uppercase">
                The Era of <br />
                <span className="text-[#ff8c04]">Boldness.</span>
              </h2>
            </div>
            <div className="space-y-8">
              <p className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed max-w-xl">
                Talent is rarely the ceiling. <span className="text-foreground font-bold">Boldness is.</span> Our #BeBold2026 mandate is a drive to redefine digital performance in emerging markets.
              </p>
              <Link to="/about">
                <Button variant="ghost" className="font-bold uppercase text-[10px] tracking-[0.2em] p-0 hover:bg-transparent hover:text-orange-500 group">
                  Learn the Mandate <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform text-[#ff8c04]" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Strategic Pillars */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-32">
            {pillars.map((pillar, index) => (
              <div
                key={index}
                className="space-y-6 group"
              >
                <div className="w-16 h-16 bg-muted rounded-[20px] flex items-center justify-center mb-8 shadow-sm group-hover:bg-orange-500 transition-all group-hover:-translate-y-2">
                  <pillar.icon className="w-7 h-7 text-[#ff8c04] group-hover:text-white transition-colors" />
                </div>
                <div className="space-y-3">
                  <h3 className="font-bold uppercase tracking-tight text-2xl">{pillar.title}</h3>
                  <p className="text-muted-foreground font-medium leading-relaxed">{pillar.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Rules Teaser Card */}
          <div className="bg-foreground rounded-[48px] p-12 lg:p-24 text-background relative overflow-hidden shadow-2xl">
            {/* Decorative */}
            <div className="absolute top-0 right-0 p-24 opacity-5 rotate-12 scale-150">
              <Rocket className="h-64 w-64" />
            </div>

            <div className="relative z-10 grid lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-4 space-y-6">
                <div className="h-20 w-20 bg-[#ff8c04] rounded-3xl flex items-center justify-center text-4xl font-bold italic shadow-2xl shadow-[#ff8c04]/20">26</div>
                <h3 className="text-4xl font-bold uppercase tracking-tighter">Rules of the <br /> Production Vault.</h3>
                <p className="text-background/60 font-medium">Internal mandates that ensure 5X output and world-class quality for every single project.</p>
              </div>

              <div className="lg:col-span-8 grid md:grid-cols-2 gap-x-12 gap-y-6">
                {[
                  "Speed is a Primary Feature",
                  "AI is the Engine, Humans are Architects",
                  "Output over Ego, Every Time",
                  "Premium isn't a Goal, it's a Standard",
                  "Strategic Aggression in Design",
                  "Be Different, Not Just Better"
                ].map((rule, i) => (
                  <div key={i} className="flex gap-4 items-center group/rule">
                    <span className="text-[#ff8c04] font-bold italic">{(i + 1).toString().padStart(2, '0')}</span>
                    <p className="font-bold uppercase tracking-tight text-lg group-hover/rule:text-[#ff8c04] transition-colors">{rule}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-20 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-foreground/20">"We're going bold. Join us."</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeBold;
