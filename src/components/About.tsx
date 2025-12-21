import { Target, Zap, Rocket, ShieldCheck } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="py-24 lg:py-40 bg-background text-foreground relative overflow-hidden rounded-[40px] lg:rounded-[100px] mx-4 lg:mx-10 my-10 lg:my-20 shadow-xl border border-foreground/5 transition-colors duration-500">
      <div className="absolute top-0 right-0 p-40 opacity-[0.03] pointer-events-none">
        <Rocket className="h-96 w-96 rotate-12" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-10">
              <div className="inline-flex items-center gap-2 text-[#ff8c04] px-0 py-3 rounded-full">
                <Zap className="w-5 h-5 fill-[#ff8c04]" />
                <span className="font-bold text-xs uppercase tracking-widest text-[#ff8c04]">The Nashied Mandate</span>
              </div>
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.85] uppercase">
                Creativity <br />
                <span className="text-[#ff8c04]">Is Life.</span>
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed max-w-lg">
                We are the high-output, AI-powered creative partner that delivers premium digital solutions with unprecedented speed and precision.
              </p>
              <div className="flex gap-12 pt-4">
                <div>
                  <p className="text-4xl font-bold text-foreground tabular-nums tracking-tighter">5X</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#ff8c04] mt-1">Faster Production</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-foreground tabular-nums tracking-tighter">150+</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#ff8c04] mt-1">Impact Milestones</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20 lg:pb-0">
              <ValueCard icon={Zap} label="Efficiency" value="30-60%" />
              <ValueCard icon={Rocket} label="Scale" value="Infinite" />
              <ValueCard icon={ShieldCheck} label="Quality" value="Elite" />
              <ValueCard icon={Target} label="Focus" value="Market Mastery" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ValueCard = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="p-10 bg-white/50 backdrop-blur-sm rounded-[40px] border border-foreground/5 space-y-4 hover:bg-[#ff8c04] hover:text-white transition-all duration-500 group shadow-sm hover:shadow-2xl hover:shadow-[#ff8c04]/20 group cursor-default">
    <Icon className="h-10 w-10 text-[#ff8c04] group-hover:text-white transition-colors" />
    <div className="space-y-1">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 group-hover:text-white/60">{label}</p>
      <p className="text-3xl font-bold uppercase tracking-tight text-foreground group-hover:text-white">{value}</p>
    </div>
  </div>
);

export default About;
