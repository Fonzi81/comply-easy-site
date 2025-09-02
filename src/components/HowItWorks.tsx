import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Calendar, Upload } from "lucide-react";
import { useScrollReveal, useStaggeredReveal } from "@/hooks/useScrollReveal";

const steps = [
  {
    step: "01",
    title: "Choose your state pack",
    description: "Select from QLD, NSW, VIC, or WA compliance templates preloaded with all required schedules and documentation.",
    icon: Download,
    color: "text-primary"
  },
  {
    step: "02", 
    title: "We schedule & remind",
    description: "Automatic calendar integration with email and SMS reminders for all compliance deadlines and review dates.",
    icon: Calendar,
    color: "text-accent"
  },
  {
    step: "03",
    title: "Upload evidence & export",
    description: "Store all compliance evidence in one place, then generate audit-ready packs with a single click.",
    icon: Upload,
    color: "text-primary"
  }
];

const HowItWorks = () => {
  const { elementRef: titleRef, isVisible: titleVisible } = useScrollReveal();
  const { containerRef: stepsRef, visibleItems } = useStaggeredReveal(3, 200);
  const { elementRef: roiRef, isVisible: roiVisible } = useScrollReveal();

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div ref={titleRef} className={`text-center mb-16 transition-all duration-1000 ${
          titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
            How it works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to transform your compliance management from chaos to clarity.
          </p>
        </div>

        <div ref={stepsRef} className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.step} className="relative">
                <Card className={`text-center h-full hover-lift transition-all duration-500 hover:shadow-xl border-2 hover:border-primary/20 ${
                  visibleItems[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`} style={{ transitionDelay: `${index * 200}ms` }}>
                  <CardHeader className="pb-4">
                    <div className="relative">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center ${step.color} group-hover:scale-110 transition-transform duration-300 animate-pulse`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <div className={`absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        visibleItems[index] ? 'scale-100 rotate-0' : 'scale-0 rotate-45'
                      }`} style={{ transitionDelay: `${(index * 200) + 300}ms` }}>
                        {step.step}
                      </div>
                    </div>
                    <CardTitle className="text-xl font-heading group-hover:text-primary transition-colors duration-300">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>

                {/* Connecting arrow */}
                {index < steps.length - 1 && (
                  <div className={`hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-muted-foreground/30 transition-all duration-500 ${
                    visibleItems[index] ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                  }`} style={{ transitionDelay: `${(index * 200) + 400}ms` }}>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor" className="animate-pulse">
                      <path d="M16 4l12 12-12 12v-8H4v-8h12V4z" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ROI Preview */}
        <div ref={roiRef} className={`mt-20 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 text-center hover-lift breathe transition-all duration-1000 ${
          roiVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          <h3 className="text-2xl font-heading font-bold mb-4">Save time, avoid fines</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className={`transition-all duration-500 ${roiVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '200ms' }}>
              <div className="text-3xl font-heading font-bold text-primary animate-pulse">20+</div>
              <div className="text-muted-foreground">Hours saved per month</div>
            </div>
            <div className={`transition-all duration-500 ${roiVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '400ms' }}>
              <div className="text-3xl font-heading font-bold text-accent animate-pulse" style={{ animationDelay: '1s' }}>$50K+</div>
              <div className="text-muted-foreground">Potential fines avoided</div>
            </div>
            <div className={`transition-all duration-500 ${roiVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '600ms' }}>
              <div className="text-3xl font-heading font-bold text-primary animate-pulse" style={{ animationDelay: '2s' }}>10 min</div>
              <div className="text-muted-foreground">Time to first value</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;