import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
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
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
            Four compliance domains, one platform
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to stay compliant across food safety, workplace health, 
            fire safety, and electrical testing.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {domains.map((domain) => (
            <Card key={domain.title} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl overflow-hidden">
                  <img 
                    src={domain.icon} 
                    alt={`${domain.title} icon`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="text-xl font-heading">{domain.title}</CardTitle>
                <CardDescription className="text-base">
                  {domain.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {domain.features.map((feature, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-center">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  variant="ghost" 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                >
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-2" />
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