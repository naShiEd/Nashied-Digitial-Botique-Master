import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { ArrowUpRight, Filter, LayoutGrid, List, ArrowRight } from "lucide-react";
import { projects } from "@/data/projects";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const Work = () => {
  const [activeCategory, setActiveCategory] = useState("ALL");

  const categories = ["ALL", "BRANDING", "SOCIAL MEDIA", "WEB DESIGN", "UI/UX"];

  const filteredProjects = useMemo(() => {
    return activeCategory === "ALL"
      ? projects
      : projects.filter(project => project.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 selection:bg-orange-500/30 selection:text-orange-500">
      <Navigation />

      {/* 1️⃣ EPIC HEADER */}
      <section className="pt-40 pb-20 relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-center gap-12 text-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-foreground/5 border border-foreground/10 px-4 py-2 rounded-full backdrop-blur-md">
                  <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">Portfolio of Excellence</span>
                </div>
                <h1 className="text-7xl md:text-9xl font-bold text-foreground tracking-tighter leading-[0.85] uppercase">
                  Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Impact</span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl font-medium leading-relaxed">
                  We translate complex brand challenges into high-performance digital assets that command attention and drive results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2️⃣ FILTER STRIP */}
      <section className="sticky top-20 z-40 bg-background/80 backdrop-blur-xl border-y border-foreground/10">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto h-24 flex items-center justify-between">
            <div className="flex items-center gap-10 overflow-x-auto no-scrollbar py-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative py-2 whitespace-nowrap",
                    activeCategory === category ? "text-orange-500" : "text-foreground/40 hover:text-foreground"
                  )}
                >
                  {category}
                  {activeCategory === category && (
                    <span className="absolute -bottom-1 left-0 w-full h-1 bg-orange-500 rounded-full shadow-[0_0_12px_rgba(249,115,22,0.5)]" />
                  )}
                </button>
              ))}
            </div>
            <div className="hidden lg:flex items-center gap-3 text-foreground/20">
              <span className="text-[10px] font-bold uppercase tracking-widest">{filteredProjects.length} Cases identified</span>
              <div className="w-1 h-1 rounded-full bg-foreground/10" />
              <Filter className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

      {/* 3️⃣ PROJECTS LIST - 'LIRS' Style */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto divide-y divide-foreground/10">
            {filteredProjects.map((project, idx) => (
              <Link
                key={project.id}
                to={`/work/${project.id}`}
                className="group flex flex-col md:flex-row items-center justify-between py-16 hover:px-8 transition-all duration-500 rounded-3xl hover:bg-foreground/[0.02]"
              >
                <div className="flex items-center gap-8 md:gap-20 w-full md:w-auto">
                  <span className="text-2xl font-bold text-foreground/10 tabular-nums">
                    {(idx + 1).toString().padStart(2, '0')}
                  </span>
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.3em]">
                      {project.category}
                    </p>
                    <h3 className="text-4xl md:text-7xl font-bold text-foreground uppercase tracking-tighter group-hover:text-orange-500 transition-colors duration-500">
                      {project.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-12 mt-10 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                  <div className="hidden xl:block text-right">
                    <p className="text-sm text-foreground/40 font-bold uppercase tracking-widest">{project.year}</p>
                    <p className="text-xs text-foreground/60 font-medium">{project.deliverables}</p>
                  </div>
                  <div className="h-20 w-20 rounded-full border border-foreground/10 flex items-center justify-center group-hover:bg-orange-500 group-hover:border-orange-500 transition-all duration-500 group-hover:scale-110 shadow-xl group-hover:shadow-orange-500/20">
                    <ArrowUpRight className="w-8 h-8 text-foreground group-hover:text-white transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4️⃣ CALL TO ACTION - PREMIUM WITH BACKGROUND */}
      <section className="py-32 lg:py-60 relative overflow-hidden mx-4 lg:mx-10 my-10 lg:my-20 rounded-[40px] lg:rounded-[100px] shadow-2xl group/cta">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=2938&auto=format&fit=crop"
            alt="Lead Developer"
            className="w-full h-full object-cover opacity-30 transform scale-110 group-hover:scale-100 transition-transform duration-[3s]"
          />
          {/* Deep Branded Overlay */}
          <div className="absolute inset-0 bg-nashied-navy/90 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-nashied-navy via-transparent to-nashied-navy/60" />
        </div>

        <div className="container mx-auto px-6 text-center space-y-12 relative z-10">
          <div className="space-y-4">
            <h2 className="text-6xl md:text-[9rem] font-bold text-white tracking-tighter leading-[0.85] uppercase max-w-6xl mx-auto">
              Ready to Ship <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 animate-glow-pulse">The Future?</span>
            </h2>
          </div>

          <p className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto font-medium leading-relaxed">
            Join the network of brands pushing the boundaries of digital production. <br className="hidden md:block" />
            <span className="text-white font-bold">High output. AI efficiency. Premium results.</span>
          </p>

          <Link to="/project-inquiry" className="inline-block">
            <Button className="h-20 px-16 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase text-xs tracking-[0.3em] shadow-2xl shadow-orange-500/40 group/btn transition-all hover:-translate-y-2 active:scale-95">
              Initialize Consultation
              <ArrowRight className="ml-4 w-6 h-6 group-hover/btn:translate-x-2 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Decorative Corner Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#ff8c04]/5 blur-[150px] rounded-full pointer-events-none" />
      </section>

      {/* Footer Space */}
      <div className="h-20" />
    </div>
  );
};

export default Work;
