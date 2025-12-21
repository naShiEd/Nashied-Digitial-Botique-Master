import { useState } from "react";
import { Button } from "@/components/ui/button";
// ThemeToggle removed
import nashiedLogo from "@/assets/nashied-logo.png";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-foreground/5 transition-all duration-500">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center">
          <img
            src={nashiedLogo}
            alt="Nashied Digital Boutique"
            className="h-10 md:h-12 w-auto transition-all"
          />
        </a>

        <div className="hidden md:flex items-center space-x-10">
          <a href="/work" className="text-minimal text-muted-foreground hover:text-accent transition-colors duration-300">
            WORK
          </a>
          <a href="/services" className="text-minimal text-muted-foreground hover:text-accent transition-colors duration-300">
            SERVICES
          </a>
          <a href="/about" className="text-minimal text-muted-foreground hover:text-accent transition-colors duration-300">
            ABOUT
          </a>
          <span className="text-minimal text-muted-foreground/50 cursor-not-allowed">
            INSIGHTS
          </span>
          <a href="/contact" className="text-minimal text-muted-foreground hover:text-accent transition-colors duration-300">
            CONTACT
          </a>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <a href="/login">
            <Button className="bg-[#ff8c04] text-background hover:bg-[#ff8c04]/90 font-display font-black uppercase text-xs tracking-[0.2em] px-8 h-12 rounded-xl">
              Operational Access
            </Button>
          </a>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="md:hidden text-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? '✕' : '☰'}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="container mx-auto px-6 py-6 space-y-4">
            <a href="/work" className="block text-minimal text-muted-foreground hover:text-accent transition-colors duration-300">
              WORK
            </a>
            <a href="/services" className="block text-minimal text-muted-foreground hover:text-accent transition-colors duration-300">
              SERVICES
            </a>
            <a href="/about" className="block text-minimal text-muted-foreground hover:text-accent transition-colors duration-300">
              ABOUT
            </a>
            <span className="block text-minimal text-muted-foreground/50 cursor-not-allowed">
              INSIGHTS
            </span>
            <a href="/contact" className="block text-minimal text-muted-foreground hover:text-accent transition-colors duration-300">
              CONTACT
            </a>

            {/* Mobile CTA */}
            <div className="pt-4 border-t border-border flex items-center justify-end">
              <a href="/login">
                <Button className="bg-[#ff8c04] text-background hover:bg-[#ff8c04]/90 font-display font-black uppercase text-xs tracking-widest px-8">
                  Operational Access
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;