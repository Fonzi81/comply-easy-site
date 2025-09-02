import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import heroImage from "@/assets/hero-compliance.jpg";

const Hero = () => {
  return (
    <section className="carbon-bg py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-heading font-bold leading-tight">
                Compliance made{" "}
                <span className="text-primary">simple</span> for small business
              </h1>
              <p className="text-xl text-carbon-foreground/80 leading-relaxed">
                Preloaded state templates, smart reminders, and one-click Audit Packs 
                for Food, WHS, Fire, and Test & Tag compliance.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg px-8 py-6">
                Start free 14-day trial
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6 border-carbon-foreground/20 text-carbon-foreground hover:bg-carbon-foreground/10"
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
            <div className="relative">
              <img
                src={heroImage}
                alt="ComplyEasy compliance management dashboard"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
              <div className="absolute -bottom-4 -right-4 bg-accent text-accent-foreground px-4 py-2 rounded-lg font-medium shadow-lg">
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