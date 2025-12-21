import { Link } from "react-router-dom";
import { ArrowUpRight, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { projects } from "@/data/projects";
import { Badge } from "./ui/badge";

const Portfolio = () => {
  // Select specific top-tier projects
  const selectedProjectIds = ["ujima-network", "the-markets-ledger", "sky-secure", "musunga"];

  const displayProjects = selectedProjectIds.map(id => {
    return projects.find(p => p.id === id);
  }).filter(p => !!p);

  return (
    <section id="work" className="py-24 lg:py-40 bg-background text-foreground relative overflow-hidden transition-colors duration-500">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-foreground/5 border border-foreground/10 px-4 py-2 rounded-full">
                <LayoutGrid className="w-3 h-3 text-[#ff8c04]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#ff8c04]/60">Case Study Archive</span>
              </div>
              <h2 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter leading-[0.85] uppercase">
                Selected <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff8c04] to-[#e67a00]">Impact.</span>
              </h2>
            </div>

            <Link to="/work">
              <Button
                size="lg"
                className="h-14 px-12 rounded-2xl bg-foreground text-background hover:bg-[#ff8c04] hover:text-white font-black uppercase text-xs tracking-[0.2em] transition-all group shadow-2xl shadow-foreground/5"
              >
                Entrance Archive
                <ArrowUpRight className="ml-3 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Grid Layout - Fixing Overlap Issues */}
          <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
            {displayProjects.map((project, index) => {
              const isLarge = index === 0 || index === 3;
              return (
                <div
                  key={index}
                  className={isLarge ? "lg:col-span-7" : "lg:col-span-5"}
                >
                  <Link
                    to={`/work/${project!.id}`}
                    className="group block relative overflow-hidden rounded-[48px] aspect-[16/10] bg-[#0a0e1a] border border-white/5 shadow-2xl transition-all hover:border-[#ff8c04]/30"
                  >
                    {/* Image with Darken Overlay to handle embedded text overlap */}
                    <img
                      src={project!.image}
                      alt={project!.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105 opacity-60 group-hover:opacity-40"
                    />

                    {/* Gradient Protection overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

                    {/* Adjusted content to prevent overlap with common image layouts */}
                    <div className="absolute inset-0 p-10 md:p-14 flex flex-col justify-end z-20">
                      <div className="space-y-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <Badge className="bg-[#ff8c04] text-background border-none font-black text-[10px] uppercase tracking-widest px-5 py-1.5 shadow-xl shadow-[#ff8c04]/20">
                          {project!.category}
                        </Badge>
                        <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-tight text-foreground group-hover:text-[#ff8c04] transition-colors">
                          {project!.title}
                        </h3>
                        <p className="text-foreground/60 font-medium line-clamp-2 max-w-lg opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 italic">
                          {project!.description}
                        </p>
                      </div>
                    </div>

                    {/* Premium Arrow Indicator */}
                    <div className="absolute top-10 right-10 h-16 w-16 rounded-3xl bg-[#ff8c04] flex items-center justify-center translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 shadow-2xl shadow-[#ff8c04]/40">
                      <ArrowUpRight className="h-7 w-7 text-background font-bold" />
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Background Subtle Gradient */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#ff8c04]/5 blur-[120px] rounded-full pointer-events-none" />
    </section>
  );
};

export default Portfolio;