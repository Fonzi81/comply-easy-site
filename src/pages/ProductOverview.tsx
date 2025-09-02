import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Shield, Calendar, FileText, Users, Zap } from "lucide-react";

const ProductOverview = () => {
  useEffect(() => {
    document.title = "Product Overview - ComplyEasy | Complete Compliance Management Platform";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Discover ComplyEasy\'s comprehensive compliance management platform. Automated scheduling, evidence management, and audit-ready documentation for Food Safety, WHS, Fire Safety, and Test & Tag.'
      );
    }
  }, []);

  const features = [
    {
      icon: Shield,
      title: "Automated Compliance Scheduling",
      description: "Never miss a deadline with intelligent scheduling based on Australian standards and state requirements.",
      benefits: ["AS/NZS standard intervals", "State-specific templates", "Smart reminder system"]
    },
    {
      icon: FileText,
      title: "Evidence Management Vault",
      description: "Centralized storage for all compliance documentation with encrypted security and audit trails.",
      benefits: ["Secure cloud storage", "Version control", "Audit trail logging"]
    },
    {
      icon: Calendar,
      title: "Multi-Channel Reminders",
      description: "Email, SMS, and calendar integration ensures you never miss critical compliance deadlines.",
      benefits: ["Email notifications", "SMS alerts", "Calendar sync"]
    },
    {
      icon: Zap,
      title: "One-Click Audit Packs",
      description: "Generate complete audit-ready documentation packages in seconds, not hours.",
      benefits: ["Instant generation", "Professional formatting", "Regulatory compliant"]
    },
    {
      icon: Users,
      title: "Multi-Site Management",
      description: "Manage compliance across multiple locations with centralized oversight and reporting.",
      benefits: ["Centralized dashboard", "Site-specific tracking", "Consolidated reporting"]
    },
    {
      icon: CheckCircle,
      title: "Compliance Analytics",
      description: "Track performance, identify risks, and optimize your compliance operations with detailed insights.",
      benefits: ["Performance metrics", "Risk identification", "Trend analysis"]
    }
  ];

  const integrations = [
    { name: "Google Calendar", status: "Available" },
    { name: "Microsoft 365", status: "Available" },
    { name: "Xero Accounting", status: "Coming Soon" },
    { name: "MYOB", status: "Coming Soon" },
    { name: "Slack", status: "Coming Soon" },
    { name: "Microsoft Teams", status: "Available" }
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
                Complete Platform Overview
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-heading font-bold mb-6 text-carbon-foreground">
                Everything you need for <span className="text-primary">compliance success</span>
              </h1>
              <p className="text-xl text-carbon-foreground/80 mb-8 leading-relaxed">
                ComplyEasy transforms chaotic compliance management into a streamlined, 
                automated system that saves time, reduces risk, and ensures audit readiness.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6">
                  Start free 14-day trial
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-6 border-carbon-foreground/20 text-carbon-foreground hover:bg-carbon-foreground/10"
                >
                  Schedule demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Statement */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-heading font-bold text-center mb-12">
                The compliance challenge facing small businesses
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-heading font-semibold text-destructive">The Current Reality</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                      <span>Spreadsheets and sticky notes for tracking deadlines</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                      <span>Documents scattered across drives and filing cabinets</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                      <span>Hours spent preparing for audits</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                      <span>Risk of missed deadlines and non-compliance fines</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-6">
                  <h3 className="text-xl font-heading font-semibold text-primary">With ComplyEasy</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <span>Automated scheduling and reminders</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <span>Centralized evidence vault with search</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <span>One-click audit pack generation</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <span>Guaranteed compliance with built-in safeguards</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
                Powerful features built for compliance success
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Every feature designed to make compliance easier, faster, and more reliable
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Integrations */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-heading font-bold mb-4">
                  Integrates with your existing tools
                </h2>
                <p className="text-xl text-muted-foreground">
                  Seamlessly connect with the software you already use
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {integrations.map((integration, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-card rounded-lg border">
                    <span className="font-medium">{integration.name}</span>
                    <Badge variant={integration.status === 'Available' ? 'default' : 'secondary'}>
                      {integration.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 carbon-bg">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6 text-carbon-foreground">
                Ready to transform your compliance?
              </h2>
              <p className="text-xl text-carbon-foreground/80 mb-8">
                Join hundreds of businesses already using ComplyEasy to stay compliant effortlessly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6">
                  Start free 14-day trial
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-6 border-carbon-foreground/20 text-carbon-foreground hover:bg-carbon-foreground/10"
                >
                  Talk to sales
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

export default ProductOverview;