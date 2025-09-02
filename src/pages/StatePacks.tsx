import { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, MapPin, FileText, Calendar, ExternalLink } from "lucide-react";

const StatePacks = () => {
  useEffect(() => {
    document.title = "State Compliance Packs - ComplyEasy | QLD, NSW, VIC, WA Templates";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Pre-configured compliance templates for Queensland, New South Wales, Victoria, and Western Australia. State-specific schedules and requirements included.'
      );
    }
  }, []);

  const statePacks = [
    {
      state: "Queensland",
      code: "QLD",
      path: "/templates/qld",
      color: "bg-red-500",
      description: "Comprehensive compliance templates for Queensland businesses",
      highlights: [
        "Food Act 2006 requirements",
        "Work Health & Safety Act 2011",
        "Fire & Emergency Services Act",
        "Electrical Safety Act 2002"
      ],
      businessTypes: ["Cafés & Restaurants", "Childcare Centres", "Gyms & Fitness", "Retail Stores", "Manufacturing"],
      lastUpdated: "January 2024"
    },
    {
      state: "New South Wales",
      code: "NSW", 
      path: "/templates/nsw",
      color: "bg-blue-500",
      description: "Tailored compliance solutions for NSW business requirements",
      highlights: [
        "Food Act 2003 compliance",
        "Work Health & Safety Act 2011",
        "Environmental Planning & Assessment",
        "Electrical installation standards"
      ],
      businessTypes: ["Hospitality", "Healthcare", "Education", "Construction", "Logistics"],
      lastUpdated: "January 2024"
    },
    {
      state: "Victoria",
      code: "VIC",
      path: "/templates/vic", 
      color: "bg-purple-500",
      description: "Complete compliance framework for Victorian businesses",
      highlights: [
        "Food Act 1984 requirements",
        "Occupational Health & Safety Act",
        "Environment Protection Act",
        "Electrical Safety regulations"
      ],
      businessTypes: ["Food Services", "Aged Care", "Tourism", "Agriculture", "Professional Services"],
      lastUpdated: "December 2023"
    },
    {
      state: "Western Australia",
      code: "WA",
      path: "/templates/wa",
      color: "bg-yellow-500", 
      description: "Specialized templates for WA compliance requirements",
      highlights: [
        "Food Act 2008 standards",
        "Work Health & Safety Act 2020",
        "Fire Brigades Act 1942",
        "Electricity Act 1945"
      ],
      businessTypes: ["Mining Services", "Marine Industries", "Wine & Agriculture", "Remote Operations", "Indigenous Enterprises"],
      lastUpdated: "November 2023"
    }
  ];

  const commonFeatures = [
    "Pre-loaded compliance schedules",
    "State-specific document templates", 
    "Automated reminder systems",
    "Regulatory update notifications",
    "One-click audit pack generation",
    "Multi-location management"
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="carbon-bg py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-4 border-carbon-foreground/20 text-carbon-foreground">
                State-Specific Compliance
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-heading font-bold mb-6 text-carbon-foreground">
                <span className="text-primary">State compliance packs</span> ready to deploy
              </h1>
              <p className="text-xl text-carbon-foreground/80 mb-8 leading-relaxed">
                Pre-configured templates with state-specific requirements for Queensland, NSW, Victoria, 
                and Western Australia. Get compliant in minutes, not weeks.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6">
                  Choose your state pack
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-6 border-carbon-foreground/20 text-carbon-foreground hover:bg-carbon-foreground/10"
                >
                  Compare all states
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* State Cards */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
                Choose your state compliance pack
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Each pack includes state-specific schedules, templates, and requirements
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {statePacks.map((pack, index) => (
                <Card key={index} className="h-full hover:shadow-xl transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`w-12 h-12 ${pack.color} rounded-lg flex items-center justify-center`}>
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{pack.state}</CardTitle>
                        <Badge variant="outline">{pack.code}</Badge>
                      </div>
                    </div>
                    <CardDescription className="text-base">{pack.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Key Compliance Areas:</h4>
                      <ul className="space-y-2">
                        {pack.highlights.map((highlight, i) => (
                          <li key={i} className="flex items-center space-x-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Common Business Types:</h4>
                      <div className="flex flex-wrap gap-2">
                        {pack.businessTypes.map((type, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="text-sm text-muted-foreground">
                        Updated: {pack.lastUpdated}
                      </span>
                      <Link to={pack.path}>
                        <Button className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          View {pack.code} Pack
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-heading font-bold text-center mb-12">
                What's included in every state pack
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {commonFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-card rounded-lg">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-8 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-heading font-bold mb-4">
                    Always up-to-date with regulatory changes
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Our compliance team monitors state regulatory changes and automatically updates 
                    your templates and schedules. You'll never miss new requirements.
                  </p>
                  <Badge variant="outline" className="text-primary border-primary">
                    Automatic Updates Included
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Implementation Process */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-heading font-bold text-center mb-12">
                Get started in 3 simple steps
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    1
                  </div>
                  <h3 className="text-xl font-heading font-semibold mb-3">Select Your State</h3>
                  <p className="text-muted-foreground">
                    Choose your state compliance pack and business type for customized templates.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent text-accent-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    2
                  </div>
                  <h3 className="text-xl font-heading font-semibold mb-3">Configure Settings</h3>
                  <p className="text-muted-foreground">
                    Enter your business details and we'll automatically schedule all compliance tasks.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    3
                  </div>
                  <h3 className="text-xl font-heading font-semibold mb-3">Start Compliance</h3>
                  <p className="text-muted-foreground">
                    Receive reminders, upload evidence, and generate audit packs automatically.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 carbon-bg">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6 text-carbon-foreground">
                Ready to get state-compliant?
              </h2>
              <p className="text-xl text-carbon-foreground/80 mb-8">
                Choose your state pack and be compliant within minutes. 
                14-day free trial, no setup fees.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6">
                  Start with my state pack
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-6 border-carbon-foreground/20 text-carbon-foreground hover:bg-carbon-foreground/10"
                >
                  Book demo call
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default StatePacks;