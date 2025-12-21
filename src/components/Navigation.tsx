import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import nashiedLogo from "@/assets/nashied-logo.png";

import { useLocation } from "react-router-dom";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const navLinks = [
    { label: "WORK", href: "/work" },
    { label: "SERVICES", href: "/services" },
    { label: "ABOUT", href: "/about" },
    { label: "INSIGHTS", href: "#", disabled: true },
    { label: "CONTACT", href: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

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
          {navLinks.map((link) => (
            link.disabled ? (
              <span key={link.label} className="text-minimal text-muted-foreground/30 cursor-not-allowed">
                {link.label}
              </span>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className={cn(
                  "text-minimal font-bold tracking-[0.2em] transition-all duration-300 relative group py-2",
                  isActive(link.href) ? "text-orange-500" : "text-muted-foreground hover:text-white"
                )}
              >
                {link.label}
                <span className={cn(
                  "absolute bottom-0 left-0 h-0.5 bg-orange-500 transition-all duration-500",
                  isActive(link.href) ? "w-full" : "w-0 group-hover:w-full"
                )} />
              </a>
            )
          ))}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {!user ? (
            <a href="/login">
              <Button className="bg-[#ff8c04] text-background hover:bg-[#ff8c04]/90 font-display font-bold uppercase text-xs tracking-[0.2em] px-8 h-12 rounded-xl">
                Operational Access
              </Button>
            </a>
          ) : (
            <a href="/dashboard">
              <Button className="bg-white/5 border border-white/10 text-white hover:bg-white/10 font-display font-bold uppercase text-xs tracking-[0.2em] px-8 h-12 rounded-xl backdrop-blur-md">
                Command Center
              </Button>
            </a>
          )}
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
              {!user ? (
                <a href="/login">
                  <Button className="bg-[#ff8c04] text-background hover:bg-[#ff8c04]/90 font-display font-bold uppercase text-xs tracking-widest px-8">
                    Operational Access
                  </Button>
                </a>
              ) : (
                <a href="/dashboard">
                  <Button className="bg-white/5 border border-white/10 text-white hover:bg-white/10 font-display font-bold uppercase text-xs tracking-widest px-8 backdrop-blur-md">
                    Command Center
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
