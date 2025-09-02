import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import heroImage from "@/assets/hero-compliance.jpg";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Hero = () => {
  const { elementRef: heroRef, isVisible } = useScrollReveal();

  return (
    <section className="carbon-bg py-20 lg:py-32 relative">
      <div className="floating-bg"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div 
          ref={heroRef} 
          className={`grid lg:grid-cols-2 gap-12 items-center transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className={`text-4xl lg:text-6xl font-heading font-bold leading-tight transition-all duration-1000 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                Compliance made{" "}
                <span className="text-primary animate-pulse">simple</span> for small business
              </h1>
              <p className={`text-xl text-carbon-foreground/80 leading-relaxed transition-all duration-1000 delay-400 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                Preloaded state templates, smart reminders, and one-click Audit Packs 
                for Food, WHS, Fire, and Test & Tag compliance.
              </p>
            </div>

            <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-600 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <Button size="lg" className="text-lg px-8 py-6 hover-lift group">
                <span className="group-hover:scale-105 transition-transform duration-200">
                  Start free 14-day trial
                </span>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6 border-carbon-foreground/20 text-carbon-foreground hover:bg-carbon-foreground/10 hover-lift"
              >
                Download 2025 QLD Calendar
              </Button>
            </div>

            {/* Trust strip */}
            <div className="space-y-3">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
                <span className="ml-2 text-carbon-foreground/80">
                  Trusted by cafés, childcare centres, gyms & trades
                </span>
              </div>
              <p className="text-sm text-carbon-foreground/60">
                Time to first value: 10 minutes
              </p>
            </div>
          </div>

          <div className="lg:order-first">
            <div className={`relative transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}>
              <img
                src={heroImage}
                alt="ComplyEasy compliance management dashboard"
                className="rounded-2xl shadow-2xl w-full h-auto hover-lift transition-all duration-500"
              />
              <div className={`absolute -bottom-4 -right-4 bg-accent text-accent-foreground px-4 py-2 rounded-lg font-medium shadow-lg animate-pulse transition-all duration-1000 delay-800 ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}>
                Evidence integrity, always.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;