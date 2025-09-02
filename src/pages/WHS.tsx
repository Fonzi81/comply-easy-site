import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, ClipboardList, Users, HardHat, FileText } from "lucide-react";

const WHS = () => {
  useEffect(() => {
    document.title = "WHS Compliance Management - ComplyEasy | Workplace Health & Safety";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Streamline workplace health and safety compliance with incident reporting, risk assessments, and safety procedure management. Australian WHS standards compliant.'
      );
    }
  }, []);

  const requirements = [
    {
      icon: AlertTriangle,
      title: "Incident Reporting",
      description: "Digital incident forms with automated notifications and follow-up",
      details: ["Injury incident forms", "Near-miss reporting", "Investigation workflows", "Corrective action tracking"]
    },
    {
      icon: ClipboardList,
      title: "Risk Assessments",
      description: "Systematic risk identification and management processes",
      details: ["Workplace risk assessments", "Job safety analysis", "Hazard identification", "Control measure tracking"]
    },
    {
      icon: HardHat,
      title: "Safety Procedures",
      description: "Documented safety procedures and work instructions",
      details: ["Safe work procedures", "Emergency procedures", "Equipment operation guides", "Contractor safety requirements"]
    },
    {
      icon: Users,
      title: "Training Management",
      description: "Track safety training, inductions, and competency requirements",
      details: ["Safety inductions", "Competency assessments", "Refresher training", "Training records management"]
    }
  ];

  const riskCategories = [
    { category: "Physical Hazards", risks: ["Slips, trips, falls", "Manual handling", "Noise exposure", "Electrical hazards"] },
    { category: "Chemical Hazards", risks: ["Chemical exposure", "Fumes and vapors", "Skin contact", "Storage safety"] },
    { category: "Biological Hazards", risks: ["Infectious diseases", "Contamination", "Allergen exposure", "Waste handling"] },
    { category: "Ergonomic Hazards", risks: ["Repetitive strain", "Poor posture", "Workstation setup", "Heavy lifting"] }
  ];

  const complianceAreas = [
    "Workplace risk assessments and control measures",
    "Incident reporting and investigation records", 
    "Safety training and induction documentation",
    "Emergency procedure planning and testing",
    "Personal protective equipment management",
    "Contractor and visitor safety management",
    "Safety committee meeting minutes",
    "Corrective action implementation records"
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
                Workplace Health & Safety
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-heading font-bold mb-6 text-carbon-foreground">
                <span className="text-primary">WHS compliance</span> that protects your people
              </h1>
              <p className="text-xl text-carbon-foreground/80 mb-8 leading-relaxed">
                Comprehensive workplace health and safety management. From risk assessments to 
                incident reporting, keep your workplace safe and compliant with Australian WHS standards.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6">
                  Start WHS compliance
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-6 border-carbon-foreground/20 text-carbon-foreground hover:bg-carbon-foreground/10"
                >
                  Download risk assessment template
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Core Requirements */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
                Complete WHS management system
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                All the tools you need to maintain a safe workplace
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

        {/* Risk Management */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-heading font-bold text-center mb-12">
                Comprehensive risk identification and management
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {riskCategories.map((category, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-accent" />
                        <span>{category.category}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {category.risks.map((risk, i) => (
                          <li key={i} className="flex items-center space-x-2 text-sm">
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                            <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-12 text-center">
                <Card className="p-8 bg-gradient-to-r from-primary/5 to-accent/5">
                  <h3 className="text-xl font-heading font-bold mb-4">
                    Proactive Risk Management
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Our system helps you identify, assess, and control workplace risks before they become incidents. 
                    Regular review schedules ensure your risk assessments stay current and effective.
                  </p>
                  <Button>
                    <ClipboardList className="w-4 h-4 mr-2" />
                    Start risk assessment
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Compliance Documentation */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-heading font-bold text-center mb-12">
                WHS audit documentation ready
              </h2>
              
              <Card className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-heading font-semibold mb-4">Compliance Evidence</h3>
                    <ul className="space-y-3">
                      {complianceAreas.slice(0, 4).map((item, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-semibold mb-4">Management Systems</h3>
                    <ul className="space-y-3">
                      {complianceAreas.slice(4).map((item, index) => (
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
                    <FileText className="w-4 h-4 mr-2" />
                    Generate WHS audit pack
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Training & Competency */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-heading font-bold text-center mb-12">
                Safety training and competency management
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="text-center p-6">
                  <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-heading font-semibold mb-3">Staff Inductions</h3>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive safety inductions for all new employees with completion tracking.
                  </p>
                </Card>
                
                <Card className="text-center p-6">
                  <HardHat className="w-12 h-12 text-accent mx-auto mb-4" />
                  <h3 className="text-lg font-heading font-semibold mb-3">Skills Training</h3>
                  <p className="text-sm text-muted-foreground">
                    Role-specific safety training with competency assessments and renewal schedules.
                  </p>
                </Card>
                
                <Card className="text-center p-6">
                  <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-heading font-semibold mb-3">Record Keeping</h3>
                  <p className="text-sm text-muted-foreground">
                    Digital training records with automated expiry alerts and renewal reminders.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 carbon-bg">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6 text-carbon-foreground">
                Create a safer workplace today
              </h2>
              <p className="text-xl text-carbon-foreground/80 mb-8">
                Join thousands of Australian businesses using ComplyEasy for comprehensive WHS management. 
                Protect your people and your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6">
                  Start WHS compliance
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-6 border-carbon-foreground/20 text-carbon-foreground hover:bg-carbon-foreground/10"
                >
                  Book safety consultation
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

export default WHS;