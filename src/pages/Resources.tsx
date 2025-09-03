import { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, ExternalLink, BookOpen, Users, Video, Calendar } from "lucide-react";

const Resources = () => {
  useEffect(() => {
    document.title = "Compliance Resources - ComplyEasy | Guides, Templates & Training Materials";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Access comprehensive compliance resources including guides, templates, training materials, and regulatory updates for Australian businesses.'
      );
    }
  }, []);

  const guides = [
    {
      title: "Food Safety 3.2.2A Implementation Guide",
      description: "Complete step-by-step guide to implementing Food Safety Standard 3.2.2A",
      category: "Food Safety",
      type: "PDF Guide",
      pages: 45,
      downloadUrl: "#"
    },
    {
      title: "Work Health & Safety Quick Reference",
      description: "Essential WHS requirements and compliance checklists for small business",
      category: "WHS",
      type: "Quick Reference",
      pages: 12,
      downloadUrl: "#"
    },
    {
      title: "Fire Safety Equipment Testing Schedule",
      description: "Annual fire safety equipment testing requirements and schedules",
      category: "Fire Safety",
      type: "Schedule",
      pages: 8,
      downloadUrl: "#"
    },
    {
      title: "Test & Tag Compliance Manual",
      description: "Portable appliance testing procedures and record keeping",
      category: "Electrical",
      type: "Manual",
      pages: 32,
      downloadUrl: "#"
    }
  ];

  const templates = [
    {
      title: "Temperature Log Templates",
      description: "Daily temperature monitoring forms for refrigeration equipment",
      category: "Food Safety",
      format: "Excel",
      downloads: "2.3k"
    },
    {
      title: "Risk Assessment Forms",
      description: "Workplace risk assessment templates and guidance",
      category: "WHS",
      format: "Word",
      downloads: "1.8k"
    },
    {
      title: "Emergency Evacuation Plans",
      description: "Customizable evacuation procedure templates",
      category: "Fire Safety",
      format: "PDF",
      downloads: "1.2k"
    },
    {
      title: "Equipment Test Records",
      description: "Electrical equipment testing and certification forms",
      category: "Electrical",
      format: "Excel",
      downloads: "956"
    }
  ];

  const webinars = [
    {
      title: "Getting Started with Food Safety Compliance",
      date: "Every 2nd Thursday",
      duration: "45 min",
      description: "Learn the basics of Food Safety Standard 3.2.2A implementation",
      upcoming: true
    },
    {
      title: "WHS Risk Management Essentials",
      date: "Monthly - 3rd Tuesday",
      duration: "60 min",
      description: "Workplace health and safety risk assessment and management",
      upcoming: true
    },
    {
      title: "Fire Safety Compliance for Small Business",
      date: "Quarterly",
      duration: "30 min",
      description: "Essential fire safety requirements and documentation",
      upcoming: false
    },
    {
      title: "Digital Compliance Management",
      date: "Bi-monthly",
      duration: "40 min",
      description: "Leveraging technology for efficient compliance management",
      upcoming: true
    }
  ];

  const regulatoryUpdates = [
    {
      title: "New NSW Food Safety Regulations 2024",
      date: "January 2024",
      impact: "Medium",
      summary: "Updates to food handler training requirements and certification periods"
    },
    {
      title: "QLD WHS Amendment - Remote Work",
      date: "February 2024",
      impact: "High",
      summary: "New obligations for managing remote and hybrid work health and safety"
    },
    {
      title: "National Electrical Safety Update",
      date: "March 2024",
      impact: "Low",
      summary: "Clarifications on portable appliance testing intervals"
    },
    {
      title: "VIC Fire Safety Standards Review",
      date: "April 2024",
      impact: "Medium",
      summary: "Proposed changes to essential safety measures documentation"
    }
  ];

  const handleDownload = (title: string, type: string) => {
    const content = `# ${title}

## ${type}

This is a sample ${type.toLowerCase()} document for ${title}.

### Overview
This resource provides comprehensive information and guidance for compliance requirements.

### Key Points:
- Regulatory requirements overview
- Implementation guidelines
- Best practices and recommendations
- Common compliance issues and solutions
- Record keeping requirements

### How to Use This Resource:
1. Review the regulatory requirements for your business type
2. Follow the step-by-step implementation guide
3. Use the provided templates and checklists
4. Maintain proper records and documentation
5. Schedule regular reviews and updates

### Support
For additional support with implementing these requirements, contact:
- Email: support@complyeasy.com.au
- Phone: 1300 COMPLY
- Web: https://complyeasy.com.au/support

Generated: ${new Date().toLocaleString()}
© 2025 ComplyEasy. All rights reserved.
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="carbon-bg py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-4 border-carbon-foreground/20 text-carbon-foreground">
                Compliance Resources
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-heading font-bold mb-6 text-carbon-foreground">
                <span className="text-primary">Resources</span> to keep you compliant
              </h1>
              <p className="text-xl text-carbon-foreground/80 mb-8 leading-relaxed">
                Access guides, templates, training materials, and regulatory updates 
                to help your business stay compliant and audit-ready.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/login">
                  <Button size="lg" className="text-lg px-8 py-6 w-full">
                    Access Premium Resources
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-6 border-carbon-foreground/20 text-carbon-foreground hover:bg-carbon-foreground/10"
                  onClick={() => document.getElementById('free-resources')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Browse Free Resources
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Compliance Guides */}
        <section id="free-resources" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
                Compliance Guides & Manuals
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Comprehensive guides to help you understand and implement compliance requirements
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {guides.map((guide, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{guide.title}</CardTitle>
                        <CardDescription className="mt-2">{guide.description}</CardDescription>
                      </div>
                      <Badge variant="outline">{guide.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span>{guide.type}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BookOpen className="w-4 h-4 text-muted-foreground" />
                          <span>{guide.pages} pages</span>
                        </div>
                      </div>
                    </div>

                    <Button 
                      className="w-full" 
                      onClick={() => handleDownload(guide.title, guide.type)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Guide
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Templates */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
                Templates & Forms
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Ready-to-use templates for common compliance documentation
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {templates.map((template, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{template.title}</CardTitle>
                        <CardDescription className="mt-2">{template.description}</CardDescription>
                      </div>
                      <Badge variant="outline">{template.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span>{template.format} Format</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Download className="w-4 h-4 text-muted-foreground" />
                        <span>{template.downloads} downloads</span>
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleDownload(template.title, "Template")}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Webinars & Training */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
                Webinars & Training
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join our regular webinars and training sessions
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {webinars.map((webinar, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{webinar.title}</CardTitle>
                        <CardDescription className="mt-2">{webinar.description}</CardDescription>
                      </div>
                      {webinar.upcoming && (
                        <Badge className="bg-green-100 text-green-800">Upcoming</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{webinar.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Video className="w-4 h-4 text-muted-foreground" />
                        <span>{webinar.duration}</span>
                      </div>
                    </div>

                    <Button 
                      className="w-full"
                      variant={webinar.upcoming ? "default" : "outline"}
                    >
                      {webinar.upcoming ? "Register Now" : "View Recording"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Regulatory Updates */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
                  Regulatory Updates
                </h2>
                <p className="text-xl text-muted-foreground">
                  Stay informed about the latest changes in compliance requirements
                </p>
              </div>

              <div className="space-y-4">
                {regulatoryUpdates.map((update, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-heading font-semibold">{update.title}</h3>
                            <Badge 
                              variant={
                                update.impact === 'High' ? 'destructive' :
                                update.impact === 'Medium' ? 'default' : 'secondary'
                              }
                            >
                              {update.impact} Impact
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-2">{update.summary}</p>
                          <p className="text-sm text-muted-foreground">{update.date}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
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
                Need personalized compliance support?
              </h2>
              <p className="text-xl text-carbon-foreground/80 mb-8">
                Get access to premium resources, personalized guidance, and direct support from compliance experts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/login">
                  <Button size="lg" className="text-lg px-8 py-6 w-full">
                    Start Free Trial
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-6 border-carbon-foreground/20 text-carbon-foreground hover:bg-carbon-foreground/10"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Talk to Expert
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

export default Resources;