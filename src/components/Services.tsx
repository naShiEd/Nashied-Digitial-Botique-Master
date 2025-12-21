import { Zap, Cpu, Globe, BarChart3, PenTool, Rocket, CheckCircle2 } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: PenTool,
      title: "Brand Strategy & Identity",
      description: "Architecting brand ecosystems that command authority. From concept creation to full visual guidelines.",
      benefits: ["Logo Systems", "Tone of Voice", "Narrative Strategy"]
    },
    {
      icon: Cpu,
      title: "AI-Enhanced Production",
      description: "Achieving 5X faster creative output using Advanced AI without compromising bespoke quality.",
      benefits: ["Content Scaling", "Workflow Automation", "Rapid Prototyping"]
    },
    {
      icon: Globe,
      title: "Web & Digital Ecosystems",
      description: "High-performance products engineered for speed. We build websites that feel like the future.",
      benefits: ["React Engineering", "UI/UX Mastery", "API Integration"]
    }
  ];

  return (
    <section id="services" className="py-24 lg:py-40 bg-background text-foreground relative overflow-hidden transition-colors duration-500">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-[#ff8c04]/10 to-transparent opacity-50 blur-[120px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-foreground/5 border border-foreground/10 px-4 py-2 rounded-full">
                <Zap className="w-3 h-3 text-[#ff8c04] fill-[#ff8c04]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#ff8c04]/60">Capabilities Matrix</span>
              </div>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-none uppercase">
                The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff8c04] via-[#ff8c04] to-[#e67a00]">Output</span> <br />
                Engine.
              </h2>
            </div>
            <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-lg leading-relaxed">
              We provide a centralized, high-output production arm for brands that refuse to settle for traditional agency speed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group p-10 bg-foreground/5 border border-foreground/10 rounded-[40px] hover:bg-foreground/[0.08] hover:border-[#ff8c04]/30 transition-all duration-500 flex flex-col justify-between"
              >
                <div className="space-y-8">
                  <div className="h-16 w-16 bg-[#ff8c04] rounded-2xl flex items-center justify-center shadow-lg shadow-[#ff8c04]/20 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold uppercase tracking-tight text-foreground group-hover:text-[#ff8c04] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed font-medium">
                      {service.description}
                    </p>
                  </div>

                  <ul className="space-y-3 pt-4">
                    {service.benefits.map((b, i) => (
                      <li key={i} className="flex items-center gap-3 text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#ff8c04]" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
