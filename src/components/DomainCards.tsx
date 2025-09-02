import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useStaggeredReveal } from "@/hooks/useScrollReveal";
import foodSafetyIcon from "@/assets/food-safety-icon.jpg";
import whsIcon from "@/assets/whs-icon.jpg";
import fireSafetyIcon from "@/assets/fire-safety-icon.jpg";
import testTagIcon from "@/assets/test-tag-icon.jpg";

const domains = [
  {
    title: "Food Safety 3.2.2A",
    description: "Training & temperature logs, staff records, ready for inspection.",
    icon: foodSafetyIcon,
    features: ["Temperature monitoring", "Staff training records", "Hazard analysis", "Audit-ready documentation"]
  },
  {
    title: "WHS",
    description: "Incidents, hazards & risk templates with scheduled reviews.",
    icon: whsIcon,
    features: ["Incident reporting", "Risk assessments", "Safety procedures", "Training compliance"]
  },
  {
    title: "Fire Safety",
    description: "Extinguisher service, evacuation drills & occupier statements.",
    icon: fireSafetyIcon,
    features: ["Equipment maintenance", "Evacuation procedures", "Fire warden training", "Emergency planning"]
  },
  {
    title: "Test & Tag",
    description: "AS/NZS 3760 intervals preloaded — never miss a retest.",
    icon: testTagIcon,
    features: ["Automated scheduling", "Compliance tracking", "Test certificates", "Equipment registers"]
  }
];

const DomainCards = () => {
  const { containerRef, visibleItems } = useStaggeredReveal(4, 150);

  return (
    <section className="py-20 bg-secondary/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-primary/[0.01] to-secondary/20"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4 animate-fade-in-up">
            Four compliance domains, one platform
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            Everything you need to stay compliant across food safety, workplace health, 
            fire safety, and electrical testing.
          </p>
        </div>

        <div ref={containerRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {domains.map((domain, index) => (
            <Card 
              key={domain.title} 
              className={`group hover-lift breathe transition-all duration-500 hover:shadow-xl border-2 hover:border-primary/20 ${
                visibleItems[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ 
                transitionDelay: `${index * 150}ms`,
                animationDelay: `${index * 0.5}s`
              }}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl overflow-hidden group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg">
                  <img 
                    src={domain.icon} 
                    alt={`${domain.title} icon`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <CardTitle className="text-xl font-heading group-hover:text-primary transition-colors duration-300">{domain.title}</CardTitle>
                <CardDescription className="text-base">
                  {domain.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {domain.features.map((feature, featureIndex) => (
                    <li 
                      key={featureIndex} 
                      className={`text-sm text-muted-foreground flex items-center transition-all duration-300 ${
                        visibleItems[index] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                      }`}
                      style={{ transitionDelay: `${(index * 150) + (featureIndex * 100)}ms` }}
                    >
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0 group-hover:bg-accent transition-colors duration-200"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  variant="ghost" 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 hover-lift"
                >
                  <span className="group-hover:scale-105 transition-transform duration-200">
                    Learn more
                  </span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DomainCards;