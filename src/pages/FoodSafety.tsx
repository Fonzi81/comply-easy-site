import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Thermometer, ClipboardList, Users, FileCheck, AlertTriangle } from "lucide-react";

const FoodSafety = () => {
  useEffect(() => {
    document.title = "Food Safety 3.2.2A Compliance - ComplyEasy | Temperature Logs & Staff Training";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Streamline Food Safety Standard 3.2.2A compliance with automated temperature logging, staff training records, and HACCP documentation. Always audit-ready.'
      );
    }
  }, []);

  const requirements = [
    {
      icon: Thermometer,
      title: "Temperature Monitoring",
      description: "Automated temperature log reminders and digital recording",
      details: ["Refrigerator/freezer logs", "Hot holding temperatures", "Delivery temperatures", "Cook temperatures"]
    },
    {
      icon: Users,
      title: "Staff Training Records",
      description: "Track and manage food safety training compliance",
      details: ["Food Handler certificates", "Training due dates", "Competency assessments", "Refresher scheduling"]
    },
    {
      icon: ClipboardList,
      title: "HACCP Documentation",
      description: "Hazard analysis and critical control points management",
      details: ["Hazard identification", "Critical control points", "Corrective actions", "Verification records"]
    },
    {
      icon: FileCheck,
      title: "Cleaning & Sanitising",
      description: "Scheduled cleaning programs and chemical safety",
      details: ["Cleaning schedules", "Chemical safety sheets", "Equipment sanitising", "Pest control records"]
    }
  ];

  const auditItems = [
    "Temperature monitoring records (fridges, freezers, hot holding)",
    "Staff food safety training certificates and records",
    "Cleaning and sanitising schedules and verification",
    "Supplier verification and delivery records",
    "HACCP hazard analysis and control measures",
    "Corrective action records and follow-up",
    "Equipment maintenance and calibration records",
    "Pest control monitoring and treatment records"
  ];

  const commonViolations = [
    {
      violation: "Temperature records not maintained",
      consequence: "Up to $25,000 fine",
      prevention: "Automated daily temperature log reminders"
    },
    {
      violation: "Staff without food safety training",
      consequence: "Business closure risk",
      prevention: "Training expiry alerts and certificate tracking"
    },
    {
      violation: "No HACCP plan or inadequate documentation",
      consequence: "Prosecution and fines",
      prevention: "Template HACCP plans with guided setup"
    },
    {
      violation: "Poor cleaning records",
      consequence: "Health order and closure",
      prevention: "Scheduled cleaning checklists and verification"
    }
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
                Food Safety Standard 3.2.2A
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-heading font-bold mb-6 text-carbon-foreground">
                <span className="text-primary">Food safety</span> compliance made simple
              </h1>
              <p className="text-xl text-carbon-foreground/80 mb-8 leading-relaxed">
                Never fail a food safety audit again. Automated temperature logs, 
                staff training tracking, and complete HACCP documentation at your fingertips.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6">
                  Start free trial
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-6 border-carbon-foreground/20 text-carbon-foreground hover:bg-carbon-foreground/10"
                >
                  Download sample audit pack
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
                Complete Food Safety 3.2.2A coverage
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to meet Australian food safety standards
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {requirements.map((requirement, index) => (
                <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <requirement.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{requirement.title}</CardTitle>
                    <CardDescription>{requirement.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {requirement.details.map((detail, i) => (
                        <li key={i} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Auto-Scheduled Items */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-heading font-bold text-center mb-12">
                What gets automatically scheduled
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-heading font-semibold mb-4 text-primary">Daily Tasks</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Morning temperature checks</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Delivery temperature recording</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Cleaning task verification</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-heading font-semibold mb-4 text-accent">Monthly/Annual</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span>Staff training renewals</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span>HACCP review and update</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span>Thermometer calibration</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Audit Pack Preview */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-heading font-bold text-center mb-12">
                Your audit pack includes
              </h2>
              <Card className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-heading font-semibold mb-4">Documentation Ready</h3>
                    <ul className="space-y-3">
                      {auditItems.slice(0, 4).map((item, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-semibold mb-4">Evidence Included</h3>
                    <ul className="space-y-3">
                      {auditItems.slice(4).map((item, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-8 text-center">
                  <Button size="lg">
                    <FileCheck className="w-4 h-4 mr-2" />
                    Generate sample audit pack
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Risk Prevention */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-heading font-bold text-center mb-12">
                Avoid costly violations
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {commonViolations.map((item, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-6 h-6 text-destructive mt-1 flex-shrink-0" />
                        <div>
                          <CardTitle className="text-lg text-destructive">{item.violation}</CardTitle>
                          <CardDescription className="text-destructive/80 font-medium">
                            {item.consequence}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-primary">ComplyEasy Prevention:</p>
                          <p className="text-sm text-muted-foreground">{item.prevention}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
                Never fail a food safety audit again
              </h2>
              <p className="text-xl text-carbon-foreground/80 mb-8">
                Join cafés, restaurants, and food businesses across Australia staying compliant with ComplyEasy.
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
                  Book consultation
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

export default FoodSafety;