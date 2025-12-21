import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { ArrowUpRight, Filter, LayoutGrid, List } from "lucide-react";
import { projects } from "@/data/projects";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const Work = () => {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
                  <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Portfolio of Excellence</span>
                </div>
                <h1 className="text-7xl md:text-9xl font-black text-foreground tracking-tighter leading-[0.85] uppercase">
                  Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Impact</span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl font-medium leading-relaxed">
                  We translate complex brand challenges into high-performance digital assets that command attention and drive results.
                </p>
              </div>

              <div className="flex items-center gap-4 bg-foreground/5 p-2 rounded-2xl border border-foreground/10">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn("p-3 rounded-xl transition-all", viewMode === 'grid' ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "text-muted-foreground hover:text-foreground")}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn("p-3 rounded-xl transition-all", viewMode === 'list' ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "text-muted-foreground hover:text-foreground")}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2️⃣ FILTER STRIP */}
      <section className="sticky top-20 z-40 bg-background/80 backdrop-blur-xl border-y border-foreground/5">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto h-20 flex items-center justify-between">
            <div className="flex items-center gap-10 overflow-x-auto no-scrollbar py-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "text-[10px] font-black uppercase tracking-widest transition-all relative py-2 whitespace-nowrap",
                    activeCategory === category ? "text-orange-500" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {category}
                  {activeCategory === category && (
                    <span className="absolute -bottom-1 left-0 w-full h-1 bg-orange-500 rounded-full shadow-[0_0_12px_rgba(249,115,22,0.5)]" />
                  )}
                </button>
              ))}
            </div>
            <div className="hidden lg:flex items-center gap-3 text-white/20">
              <span className="text-[10px] font-black uppercase tracking-widest">{filteredProjects.length} Cases identified</span>
              <div className="w-1 h-1 rounded-full bg-white/10" />
              <Filter className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

      {/* 3️⃣ PROJECTS GRID */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            {viewMode === 'grid' ? (
              <div className="grid md:grid-cols-2 gap-x-12 gap-y-24">
                {filteredProjects.map((project, idx) => (
                  <Link
                    key={project.id}
                    to={`/work/${project.id}`}
                    className={cn(
                      "group relative",
                      idx % 2 !== 0 && "md:mt-32"
                    )}
                  >
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] bg-white/5 border border-white/10">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />

                      {/* Overlay Elements */}
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="absolute inset-0 p-10 flex flex-col justify-end translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="space-y-4">
                          <Badge className="bg-orange-500 text-white border-none rounded-full px-4 py-1.5 font-black text-[10px] uppercase tracking-widest">
                            {project.category}
                          </Badge>
                          <h3 className="text-4xl font-black text-foreground leading-tight uppercase">{project.title}</h3>
                          <button className="flex items-center gap-3 text-foreground hover:text-orange-500 transition-colors font-black uppercase text-[10px] tracking-widest">
                            View Case Study <ArrowUpRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Corner Number */}
                      <div className="absolute top-10 left-10 text-foreground/20 font-black text-6xl tracking-tighter pointer-events-none group-hover:text-orange-500/20 transition-colors">
                        {(idx + 1).toString().padStart(2, '0')}
                      </div>
                    </div>

                    <div className="mt-8 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h4 className="text-2xl font-black text-foreground uppercase tracking-tight group-hover:text-orange-500 transition-colors">{project.title}</h4>
                          <p className="text-sm text-gray-400 font-medium">{project.deliverables}</p>
                        </div>
                        <div className="h-10 w-10 rounded-full border border-foreground/10 flex items-center justify-center text-foreground group-hover:bg-orange-500 group-hover:border-orange-500 transition-all">
                          <ArrowUpRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredProjects.map((project, idx) => (
                  <Link
                    key={project.id}
                    to={`/work/${project.id}`}
                    className="group flex flex-col md:flex-row items-center justify-between py-12 border-b border-white/5 hover:bg-white/[0.02] px-8 transition-colors rounded-3xl"
                  >
                    <div className="flex items-center gap-12 w-full md:w-1/2">
                      <span className="text-xl font-black text-foreground/10 tabular-nums">{(idx + 1).toString().padStart(2, '0')}</span>
                      <div className="space-y-1">
                        <h3 className="text-3xl font-black text-foreground uppercase group-hover:text-orange-500 transition-colors">{project.title}</h3>
                        <p className="text-xs text-orange-500 font-bold uppercase tracking-[0.2em]">{project.category}</p>
                      </div>
                    </div>

                    <div className="hidden lg:block w-1/4">
                      <p className="text-sm text-gray-500 font-medium">{project.deliverables}</p>
                    </div>

                    <div className="flex items-center gap-8 justify-end w-full md:w-auto">
                      <span className="text-sm font-black text-white/20 tabular-nums">{project.year}</span>
                      <div className="h-14 w-14 rounded-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                      </div>
                      <ArrowUpRight className="w-8 h-8 text-foreground/20 group-hover:text-orange-500 group-hover:translate-x-2 group-hover:-translate-y-2 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4️⃣ CALL TO ACTION */}
      <section className="py-20 lg:py-40 relative">
        <div className="container mx-auto px-6 text-center space-y-12">
          <h2 className="text-5xl md:text-8xl font-black text-foreground tracking-tighter leading-none uppercase max-w-5xl mx-auto">
            Ready to Ship <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">The Future?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Join the network of brands pushing the boundaries of digital production. High output. AI efficiency. Premium results.
          </p>
          <Link to="/project-inquiry">
            <Button className="h-20 px-12 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black uppercase text-sm tracking-widest shadow-2xl shadow-orange-500/20 group">
              Initialize Consultation
              <ArrowUpRight className="ml-3 w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent shadow-[0_0_100px_rgba(249,115,22,0.5)]" />
      </section>

      {/* Footer Space */}
      <div className="h-20" />
    </div>
  );
};

export default Work;