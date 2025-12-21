import Navigation from "@/components/Navigation";
import {
  Zap,
  Cpu,
  Globe,
  BarChart3,
  PenTool,
  Rocket,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Services = () => {
  const services = [
    {
      icon: PenTool,
      title: "Brand Strategy & Identity",
      description: "We don't just design logos; we architect brand ecosystems. From concept creation to full visual guidelines, we build identities that command authority.",
      benefits: ["Logo Systems", "Brand Manuals", "Tone of Voice", "Narrative Strategy"]
    },
    {
      icon: Cpu,
      title: "AI-Enhanced Production",
      description: "Leveraging the power of Advanced AI to achieve 5X faster creative output without compromising on bespoke quality. Efficiency is our mandate.",
      benefits: ["Content Scaling", "AI Visual Synthesis", "Workflow Automation", "Rapid Prototyping"]
    },
    {
      icon: Globe,
      title: "Web & Digital Ecosystems",
      description: "High-performance digital products engineered for speed and conversion. We build websites and apps that feel like the future.",
      benefits: ["Next.js/React Dev", "UI/UX Engineering", "E-commerce Hubs", "API Integrations"]
    },
    {
      icon: Zap,
      title: "Social Media Architecture",
      description: "Dominating the digital feed with high-impact creative production. We handle the scale, you handle the growth.",
      benefits: ["Motion Design", "Visual Content", "Trend Hijacking", "Community Assets"]
    },
    {
      icon: BarChart3,
      title: "Marketing Intelligence",
      description: "Data-driven strategies that turn attention into revenue. We map the journey and optimize every touchpoint.",
      benefits: ["Conversion Audits", "Growth Hacking", "Ad Creative", "Performance Tracking"]
    },
    {
      icon: Rocket,
      title: "Concept Lab",
      description: "Birthplace of icons. We prototype wild ideas and turn them into market-ready digital masterpieces.",
      benefits: ["MVP Development", "Product Inception", "Experimental Art", "Creative Tech"]
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 selection:bg-orange-500/30 selection:text-orange-500">
      <Navigation />

      {/* 1️⃣ HERO SECTION */}
      <section className="pt-48 pb-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.1),transparent_50%)]" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-full backdrop-blur-md">
              <Zap className="w-3 h-3 text-orange-500 fill-orange-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">Capabilities Matrix</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-tight uppercase text-foreground">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Nashied</span> <br />
              Output Engine
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed">
              We provide a centralized, high-output production arm for brands that refuse to settle for traditional agency speed.
            </p>
          </div>
        </div>
      </section>

      {/* 2️⃣ SERVICES GRID */}
      <section className="pb-40">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {services.map((svc, index) => (
              <div
                key={index}
                className="group p-10 bg-white/5 border border-white/10 rounded-[40px] hover:bg-white/[0.08] hover:border-orange-500/30 transition-all duration-500 flex flex-col justify-between"
              >
                <div className="space-y-6">
                  <div className="h-14 w-14 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                    <svc.icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-black uppercase tracking-tight text-foreground group-hover:text-orange-500 transition-colors">{svc.title}</h3>
                    <p className="text-muted-foreground leading-relaxed font-normal">
                      {svc.description}
                    </p>
                  </div>

                  <ul className="space-y-3 pt-4">
                    {svc.benefits.map((b, i) => (
                      <li key={i} className="flex items-center gap-3 text-[10px] font-black text-foreground/40 uppercase tracking-widest">
                        <CheckCircle2 className="w-3.5 h-3.5 text-orange-500" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link to="/project-inquiry" className="pt-10 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/20 group-hover:text-orange-500 transition-colors">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3️⃣ MISSION SECTION */}
      <section className="py-32 bg-foreground text-background rounded-[60px] lg:rounded-[100px] mx-4 lg:mx-10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-20 opacity-5">
          <Cpu className="h-96 w-96 rotate-12" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none uppercase text-background">
                5X Efficiency <br />
                <span className="text-background/40">Is No Longer <br /> A Secret.</span>
              </h2>
              <p className="text-xl text-background/60 font-medium leading-relaxed max-w-lg">
                By integrating AI into every stage of the creative pipeline, we eliminate the friction of traditional production. We focus on the big idea, while AI handles the heavy lifting.
              </p>
              <Link to="/about">
                <Button variant="outline" className="h-14 px-10 rounded-2xl border-background/10 font-black uppercase text-xs tracking-widest hover:bg-background hover:text-foreground transition-all">
                  Learn Our Rules
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <ValueCard label="Efficiency" value="30-60%" />
              <ValueCard label="Production" value="5X Faster" />
              <ValueCard label="Quality" value="Premium" />
              <ValueCard label="Support" value="24/7" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 text-center space-y-12">
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">Ready to Deploy?</h2>
        <Link to="/contact">
          <Button className="h-20 px-12 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black uppercase text-sm tracking-widest shadow-2xl shadow-orange-500/20">
            Start Your Service Consultation
          </Button>
        </Link>
      </section>

      <div className="h-20" />
    </div>
  );
};

const ValueCard = ({ label, value }: { label: string, value: string }) => (
  <div className="p-8 bg-background/5 rounded-[32px] border border-background/5 space-y-1">
    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">{label}</p>
    <p className="text-3xl font-black text-background">{value}</p>
  </div>
);

export default Services;