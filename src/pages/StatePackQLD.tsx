import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Download, FileText, Calendar, Users, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const StatePackQLD = () => {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Queensland (QLD) Compliance Pack - ComplyEasy | State-Specific Templates";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Complete Queensland compliance templates including Food Act 2006, Work Health & Safety Act 2011, and Fire & Emergency Services Act requirements.'
      );
    }
  }, []);

  const templates = [
    {
      id: 'qld-food-safety',
      name: 'QLD Food Safety 3.2.2A',
      description: 'Complete Food Act 2006 compliance templates and schedules',
      tasks: 24,
      fileSize: '2.3 MB',
      category: 'Food Safety',
      includes: ['Temperature log templates', 'HACCP documentation', 'Staff training records', 'Cleaning schedules']
    },
    {
      id: 'qld-whs',
      name: 'QLD Work Health & Safety',
      description: 'Work Health & Safety Act 2011 compliance framework',
      tasks: 18,
      fileSize: '1.8 MB',
      category: 'WHS',
      includes: ['Safety inspection forms', 'Incident report templates', 'Training documentation', 'Risk assessment guides']
    },
    {
      id: 'qld-fire-safety',
      name: 'QLD Fire Safety',
      description: 'Fire & Emergency Services Act compliance templates',
      tasks: 12,
      fileSize: '1.5 MB',
      category: 'Fire Safety',
      includes: ['Equipment testing logs', 'Evacuation procedures', 'Fire warden training', 'Emergency response plans']
    },
    {
      id: 'qld-electrical',
      name: 'QLD Electrical Safety',
      description: 'Electrical Safety Act 2002 requirements and testing',
      tasks: 8,
      fileSize: '1.2 MB',
      category: 'Electrical',
      includes: ['Test & tag schedules', 'Electrical inspection forms', 'Compliance certificates', 'Safety procedures']
    }
  ];

  const businessTypes = [
    { type: 'Cafés & Restaurants', requirements: ['Food Safety', 'Fire Safety', 'WHS'] },
    { type: 'Childcare Centres', requirements: ['Food Safety', 'Fire Safety', 'WHS', 'Electrical'] },
    { type: 'Gyms & Fitness', requirements: ['WHS', 'Fire Safety', 'Electrical'] },
    { type: 'Retail Stores', requirements: ['Fire Safety', 'WHS', 'Electrical'] },
    { type: 'Manufacturing', requirements: ['WHS', 'Fire Safety', 'Electrical'] }
  ];

  const handleDownload = async (templateId: string, templateName: string) => {
    setDownloading(templateId);
    setDownloadProgress(0);

    // Simulate download progress
    const progressInterval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            setDownloading(null);
            setDownloadProgress(0);
            toast({
              title: "Download Complete",
              description: `${templateName} has been downloaded successfully.`,
            });
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Create and download actual file
    const template = templates.find(t => t.id === templateId);
    if (template) {
      const content = `# ${template.name} - Compliance Template Pack

## Description
${template.description}

## Included Templates
${template.includes.map(item => `- ${item}`).join('\n')}

## Number of Tasks: ${template.tasks}

## Queensland Compliance Requirements

This template pack includes all necessary documentation and schedules to meet Queensland state-specific compliance requirements.

### Implementation Steps:
1. Review all templates and customize for your business
2. Schedule recurring tasks in your compliance system
3. Train staff on new procedures
4. Begin regular compliance monitoring

### Contact Support:
For assistance with template implementation, contact support@complyeasy.com.au

Generated: ${new Date().toLocaleString()}
`;

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${template.name.replace(/\s+/g, '-')}-QLD-Template-Pack.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleDownloadAllTemplates = async () => {
    toast({
      title: "Preparing Complete Pack",
      description: "Generating all Queensland templates...",
    });

    setTimeout(() => {
      const allContent = `# Queensland (QLD) Complete Compliance Pack

## Overview
This pack contains all Queensland state-specific compliance templates and documentation for business compliance management.

## Included Templates:
${templates.map(template => `
### ${template.name}
- Description: ${template.description}
- Tasks: ${template.tasks}
- Category: ${template.category}
- Includes: ${template.includes.join(', ')}
`).join('\n')}

## Business Type Recommendations:
${businessTypes.map(business => `
### ${business.type}
Required compliance areas: ${business.requirements.join(', ')}
`).join('\n')}

## Queensland Regulatory Information:
- Food Act 2006: https://www.legislation.qld.gov.au/view/html/inforce/current/act-2006-026
- Work Health & Safety Act 2011: https://www.legislation.qld.gov.au/view/html/inforce/current/act-2011-018
- Fire & Emergency Services Act 1990: https://www.legislation.qld.gov.au/view/html/inforce/current/act-1990-040
- Electrical Safety Act 2002: https://www.legislation.qld.gov.au/view/html/inforce/current/act-2002-092

Generated: ${new Date().toLocaleString()}
Total Templates: ${templates.length}
Total Tasks: ${templates.reduce((sum, t) => sum + t.tasks, 0)}
`;

      const blob = new Blob([allContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'QLD-Complete-Compliance-Pack.txt';
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Download Complete",
        description: "Queensland complete compliance pack downloaded successfully.",
      });
    }, 2000);
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
                Queensland (QLD) Compliance Pack
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-heading font-bold mb-6 text-carbon-foreground">
                <span className="text-primary">Queensland</span> compliance templates
              </h1>
              <p className="text-xl text-carbon-foreground/80 mb-8 leading-relaxed">
                Complete compliance templates for Queensland businesses. Includes Food Act 2006, 
                Work Health & Safety Act 2011, and Fire & Emergency Services requirements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6" onClick={handleDownloadAllTemplates}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Complete Pack
                </Button>
                <Link to="/login">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="text-lg px-8 py-6 border-carbon-foreground/20 text-carbon-foreground hover:bg-carbon-foreground/10 w-full"
                  >
                    Start Free Trial
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Template Downloads */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
                Available Queensland Templates
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Download individual compliance packs or get the complete Queensland bundle
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {templates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{template.name}</CardTitle>
                        <CardDescription className="mt-2">{template.description}</CardDescription>
                      </div>
                      <Badge variant="outline">{template.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{template.tasks} tasks</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span>{template.fileSize}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Includes:</h4>
                      <ul className="space-y-1">
                        {template.includes.map((item, index) => (
                          <li key={index} className="flex items-center space-x-2 text-sm">
                            <CheckCircle className="w-3 h-3 text-primary flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {downloading === template.id && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Downloading...</span>
                          <span>{downloadProgress}%</span>
                        </div>
                        <Progress value={downloadProgress} className="w-full" />
                      </div>
                    )}

                    <Button 
                      className="w-full" 
                      onClick={() => handleDownload(template.id, template.name)}
                      disabled={downloading === template.id}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {downloading === template.id ? 'Downloading...' : 'Download Template'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Business Types */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-heading font-bold text-center mb-12">
                Recommended templates by business type
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businessTypes.map((business, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{business.type}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {business.requirements.map((req, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="text-sm">{req}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Getting Started */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-heading font-bold text-center mb-12">
                Implementation support
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <Card className="text-center p-6">
                  <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-heading font-semibold mb-3">Download Templates</h3>
                  <p className="text-sm text-muted-foreground">
                    Get your Queensland-specific compliance templates and documentation.
                  </p>
                </Card>
                
                <Card className="text-center p-6">
                  <Users className="w-12 h-12 text-accent mx-auto mb-4" />
                  <h3 className="text-lg font-heading font-semibold mb-3">Setup Assistance</h3>
                  <p className="text-sm text-muted-foreground">
                    Our team helps you customize templates for your specific business needs.
                  </p>
                </Card>
                
                <Card className="text-center p-6">
                  <AlertTriangle className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-heading font-semibold mb-3">Ongoing Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Continuous updates when Queensland regulations change.
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
                Ready to get Queensland-compliant?
              </h2>
              <p className="text-xl text-carbon-foreground/80 mb-8">
                Download your templates now or start a free trial for the complete compliance management system.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6" onClick={handleDownloadAllTemplates}>
                  <Download className="w-4 h-4 mr-2" />
                  Download All QLD Templates
                </Button>
                <Link to="/login">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="text-lg px-8 py-6 border-carbon-foreground/20 text-carbon-foreground hover:bg-carbon-foreground/10 w-full"
                  >
                    Start Free Trial
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default StatePackQLD;