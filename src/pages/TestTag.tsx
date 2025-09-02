import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Zap, Calendar, FileText, AlertTriangle, Settings } from "lucide-react";

const TestTag = () => {
  useEffect(() => {
    document.title = "Test & Tag Compliance - ComplyEasy | AS/NZS 3760 Electrical Safety";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Automated Test & Tag compliance management with AS/NZS 3760 intervals. Track portable electrical equipment testing and maintain electrical safety records.'
      );
    }
  }, []);

  const requirements = [
    {
      icon: Zap,
      title: "Equipment Registration",
      description: "Comprehensive tracking of all portable electrical equipment",
      details: ["Asset identification", "Equipment categories", "Risk classification", "Location tracking"]
    },
    {
      icon: Calendar,
      title: "Testing Schedules", 
      description: "Automated scheduling based on AS/NZS 3760 requirements",
      details: ["Risk-based intervals", "Environment considerations", "Usage frequency", "Automatic reminders"]
    },
    {
      icon: FileText,
      title: "Test Records",
      description: "Digital test certificates and maintenance records",
      details: ["Test certificates", "Pass/fail tracking", "Defect reporting", "Repair documentation"]
    },
    {
      icon: Settings,
      title: "Compliance Management",
      description: "Complete electrical safety compliance oversight",
      details: ["Qualified tester tracking", "Standard compliance", "Audit preparation", "Risk mitigation"]
    }
  ];

  const equipmentCategories = [
    {
      category: "Construction Tools",
      riskLevel: "High Risk",
      testInterval: "3 months", 
      examples: ["Power tools", "Extension leads", "Portable lights", "Compressors"],
      environment: "Hostile environment with frequent damage risk"
    },
    {
      category: "Office Equipment",
      riskLevel: "Low Risk", 
      testInterval: "5 years",
      examples: ["Computers", "Printers", "Photocopiers", "Phone chargers"],
      environment: "Controlled environment with minimal damage risk"
    },
    {
      category: "Workshop Equipment", 
      riskLevel: "Medium Risk",
      testInterval: "12 months",
      examples: ["Bench grinders", "Welding equipment", "Air tools", "Test equipment"],
      environment: "Industrial environment with moderate damage risk"
    },
    {
      category: "Hospitality Equipment",
      riskLevel: "Medium Risk",
      testInterval: "12 months", 
      examples: ["Coffee machines", "Kitchen appliances", "Cleaning equipment", "Entertainment systems"],
      environment: "Commercial environment with public access"
    }
  ];

  const testingProcess = [
    {
      step: "1",
      title: "Visual Inspection",
      description: "External examination for damage, wear, or modifications",
      checks: ["Cord condition", "Plug integrity", "Case damage", "Warning labels"]
    },
    {
      step: "2", 
      title: "Electrical Testing",
      description: "Comprehensive electrical safety measurements",
      checks: ["Earth continuity", "Insulation resistance", "Polarity testing", "Touch current"]
    },
    {
      step: "3",
      title: "Functional Testing", 
      description: "Operational verification and safety feature testing",
      checks: ["Normal operation", "Safety switches", "RCD functionality", "Performance verification"]
    },
    {
      step: "4",
      title: "Documentation",
      description: "Complete test certification and record keeping", 
      checks: ["Test certificate", "Equipment tagging", "Record updating", "Next test date"]
    }
  ];

  const complianceFeatures = [
    "AS/NZS 3760:2022 standard compliance",
    "Risk-based testing interval calculation",
    "Qualified tester certification tracking", 
    "Equipment register maintenance",
    "Test certificate generation",
    "Defective equipment quarantine",
    "Repair and retest tracking",
    "Compliance reporting and analytics"
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
                AS/NZS 3760 Electrical Safety
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-heading font-bold mb-6 text-carbon-foreground">
                <span className="text-primary">Test & Tag</span> compliance simplified
              </h1>
              <p className="text-xl text-carbon-foreground/80 mb-8 leading-relaxed">
                Never miss electrical equipment testing again. Automated AS/NZS 3760 scheduling, 
                digital certificates, and complete equipment registers for electrical safety compliance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6">
                  Start Test & Tag tracking
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-6 border-carbon-foreground/20 text-carbon-foreground hover:bg-carbon-foreground/10"
                >
                  Download equipment register
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Core Features */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
                Complete Test & Tag management system
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need for electrical safety compliance
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

        {/* Equipment Categories */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-heading font-bold mb-4">
                Equipment categories & testing intervals
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Risk-based testing schedules according to AS/NZS 3760
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {equipmentCategories.map((category, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-lg">{category.category}</CardTitle>
                      <Badge 
                        variant={category.riskLevel === 'High Risk' ? 'destructive' : 
                               category.riskLevel === 'Medium Risk' ? 'secondary' : 'default'}
                      >
                        {category.riskLevel}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Every {category.testInterval}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Common Equipment:</h4>
                      <div className="flex flex-wrap gap-2">
                        {category.examples.map((example, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {example}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Environment:</h4>
                      <p className="text-sm text-muted-foreground">{category.environment}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testing Process */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-heading font-bold mb-4">
                AS/NZS 3760 testing process
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Comprehensive testing methodology for electrical safety
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {testingProcess.map((process, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                      {process.step}
                    </div>
                    <CardTitle className="text-lg">{process.title}</CardTitle>
                    <CardDescription>{process.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {process.checks.map((check, i) => (
                        <li key={i} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                          <span>{check}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Compliance Features */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-heading font-bold text-center mb-12">
                Complete compliance management
              </h2>
              
              <Card className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-heading font-semibold mb-4 flex items-center space-x-2">
                      <Zap className="w-5 h-5 text-primary" />
                      <span>System Features</span>
                    </h3>
                    <ul className="space-y-3">
                      {complianceFeatures.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-semibold mb-4 flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-primary" />
                      <span>Documentation</span>
                    </h3>
                    <ul className="space-y-3">
                      {complianceFeatures.slice(4).map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>

              <div className="mt-8 grid md:grid-cols-3 gap-6">
                <Card className="text-center p-6">
                  <AlertTriangle className="w-12 h-12 text-accent mx-auto mb-4" />
                  <h3 className="text-lg font-heading font-semibold mb-3">Risk Assessment</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatic risk classification based on equipment type and environment.
                  </p>
                </Card>
                
                <Card className="text-center p-6">
                  <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-heading font-semibold mb-3">Smart Scheduling</h3>
                  <p className="text-sm text-muted-foreground">
                    Intelligent scheduling considers usage, environment, and risk factors.
                  </p>
                </Card>
                
                <Card className="text-center p-6">
                  <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-heading font-semibold mb-3">Digital Records</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete digital trail from initial registration to disposal.
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
                Ensure electrical safety compliance
              </h2>
              <p className="text-xl text-carbon-foreground/80 mb-8">
                Protect your workplace and workers with proper Test & Tag management. 
                AS/NZS 3760 compliance made simple and automated.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6">
                  Start Test & Tag compliance
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-6 border-carbon-foreground/20 text-carbon-foreground hover:bg-carbon-foreground/10"
                >
                  Book electrical safety assessment
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

export default TestTag;