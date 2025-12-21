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
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#ff8c04]/60">Case Study Archive</span>
              </div>
              <h2 className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tighter leading-[0.85] uppercase">
                Selected <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff8c04] to-[#e67a00]">Impact.</span>
              </h2>
            </div>

            <Link to="/work">
              <Button
                size="lg"
                className="h-14 px-12 rounded-2xl bg-foreground text-background hover:bg-[#ff8c04] hover:text-white font-bold uppercase text-xs tracking-[0.2em] transition-all group shadow-2xl shadow-foreground/5"
              >
                Entrance Archive
                <ArrowUpRight className="ml-3 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* List Layout - 'LIRS' style with separator lines */}
          <div className="mt-12">
            {displayProjects.map((project, index) => (
              <Link
                key={index}
                to={`/work/${project!.id}`}
                className="group flex flex-col md:flex-row items-center justify-between py-12 border-b border-foreground/10 hover:px-8 transition-all duration-500 rounded-2xl hover:bg-foreground/[0.02]"
              >
                <div className="flex items-center gap-8 md:gap-16 w-full md:w-auto">
                  <span className="text-xl font-bold text-foreground/10 tabular-nums">
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest border-[#ff8c04]/30 text-[#ff8c04]">
                        {project!.category}
                      </Badge>
                    </div>
                    <h3 className="text-3xl md:text-6xl font-bold uppercase tracking-tighter text-foreground group-hover:text-[#ff8c04] transition-colors duration-500">
                      {project!.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-12 mt-8 md:mt-0 opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                  <p className="hidden lg:block text-sm font-medium text-foreground/60 max-w-xs text-right italic">
                    {project!.description}
                  </p>
                  <div className="h-16 w-16 rounded-full border border-foreground/10 flex items-center justify-center group-hover:bg-[#ff8c04] group-hover:border-[#ff8c04] transition-all duration-500 group-hover:scale-110">
                    <ArrowUpRight className="h-6 w-6 text-foreground group-hover:text-background transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Background Subtle Gradient */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#ff8c04]/5 blur-[120px] rounded-full pointer-events-none" />
    </section>
  );
};

export default Portfolio;
