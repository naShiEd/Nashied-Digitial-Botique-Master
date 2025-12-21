import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Portfolio from "@/components/Portfolio";
import BeBold from "@/components/BeBold";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden transition-colors duration-500">
      <Navigation />
      <Hero />
      <Services />
      <About />
      <Portfolio />
      <BeBold />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
