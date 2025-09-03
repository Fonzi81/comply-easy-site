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

const StatePackNSW = () => {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    document.title = "New South Wales (NSW) Compliance Pack - ComplyEasy | State-Specific Templates";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Complete NSW compliance templates including Food Act 2003, SafeWork NSW requirements, and Environmental Planning & Assessment compliance.'
      );
    }
  }, []);

  const templates = [
    {
      id: 'nsw-food-safety',
      name: 'NSW Food Safety Standards',
      description: 'Complete Food Act 2003 compliance templates and schedules',
      tasks: 22,
      fileSize: '2.1 MB',
      category: 'Food Safety',
      includes: ['Temperature monitoring', 'Food handler training', 'Cleaning procedures', 'Supplier verification']
    },
    {
      id: 'nsw-safework',
      name: 'NSW SafeWork Compliance',
      description: 'Work Health & Safety Act 2011 NSW-specific requirements',
      tasks: 20,
      fileSize: '2.0 MB',
      category: 'WHS',
      includes: ['SafeWork NSW forms', 'Incident reporting', 'Training records', 'Safety consultation']
    },
    {
      id: 'nsw-fire-safety',
      name: 'NSW Fire & Rescue Requirements',
      description: 'Fire safety compliance for NSW buildings and premises',
      tasks: 14,
      fileSize: '1.7 MB',
      category: 'Fire Safety',
      includes: ['Fire safety statements', 'Equipment maintenance', 'Evacuation procedures', 'Warden training']
    },
    {
      id: 'nsw-environmental',
      name: 'NSW Environmental Planning',
      description: 'Environmental Planning & Assessment compliance templates',
      tasks: 10,
      fileSize: '1.3 MB',
      category: 'Environmental',
      includes: ['Environmental assessments', 'Waste management', 'Noise compliance', 'Water quality monitoring']
    }
  ];

  const businessTypes = [
    { type: 'Hospitality', requirements: ['Food Safety', 'Fire Safety', 'SafeWork'] },
    { type: 'Healthcare', requirements: ['SafeWork', 'Fire Safety', 'Environmental'] },
    { type: 'Education', requirements: ['Fire Safety', 'SafeWork', 'Environmental'] },
    { type: 'Construction', requirements: ['SafeWork', 'Environmental'] },
    { type: 'Logistics', requirements: ['SafeWork', 'Fire Safety'] }
  ];

  const handleDownload = async (templateId: string, templateName: string) => {
    setDownloading(templateId);
    setDownloadProgress(0);

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

    const template = templates.find(t => t.id === templateId);
    if (template) {
      const content = `# ${template.name} - NSW Compliance Template Pack

## Description
${template.description}

## Included Templates
${template.includes.map(item => `- ${item}`).join('\n')}

## Number of Tasks: ${template.tasks}

## New South Wales Compliance Requirements

This template pack includes all necessary documentation and schedules to meet NSW state-specific compliance requirements.

### NSW Regulatory Bodies:
- SafeWork NSW: https://www.safework.nsw.gov.au/
- NSW Food Authority: https://www.foodauthority.nsw.gov.au/
- Fire and Rescue NSW: https://www.fire.nsw.gov.au/
- NSW Environment Protection Authority: https://www.epa.nsw.gov.au/

### Implementation Steps:
1. Review all templates and customize for your NSW business
2. Schedule recurring tasks in your compliance system
3. Register with relevant NSW agencies as required
4. Train staff on NSW-specific procedures
5. Begin regular compliance monitoring

Generated: ${new Date().toLocaleString()}
`;

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${template.name.replace(/\s+/g, '-')}-NSW-Template-Pack.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleDownloadAllTemplates = async () => {
    toast({
      title: "Preparing Complete Pack",
      description: "Generating all NSW templates...",
    });

    setTimeout(() => {
      const allContent = `# New South Wales (NSW) Complete Compliance Pack

## Overview
This pack contains all NSW state-specific compliance templates and documentation for business compliance management.

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

## NSW Regulatory Information:
- Food Act 2003: https://legislation.nsw.gov.au/view/html/inforce/current/act-2003-043
- Work Health and Safety Act 2011: https://legislation.nsw.gov.au/view/html/inforce/current/act-2011-010
- Environmental Planning and Assessment Act 1979: https://legislation.nsw.gov.au/view/html/inforce/current/act-1979-203

Generated: ${new Date().toLocaleString()}
Total Templates: ${templates.length}
Total Tasks: ${templates.reduce((sum, t) => sum + t.tasks, 0)}
`;

      const blob = new Blob([allContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'NSW-Complete-Compliance-Pack.txt';
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Download Complete",
        description: "NSW complete compliance pack downloaded successfully.",
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
                New South Wales (NSW) Compliance Pack
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-heading font-bold mb-6 text-carbon-foreground">
                <span className="text-primary">NSW</span> compliance templates
              </h1>
              <p className="text-xl text-carbon-foreground/80 mb-8 leading-relaxed">
                Complete compliance templates for NSW businesses. Includes Food Act 2003, 
                SafeWork NSW requirements, and Environmental Planning & Assessment compliance.
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
                Available NSW Templates
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Download individual compliance packs or get the complete NSW bundle
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

        {/* CTA Section */}
        <section className="py-20 carbon-bg">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6 text-carbon-foreground">
                Ready to get NSW-compliant?
              </h2>
              <p className="text-xl text-carbon-foreground/80 mb-8">
                Download your templates now or start a free trial for the complete compliance management system.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6" onClick={handleDownloadAllTemplates}>
                  <Download className="w-4 h-4 mr-2" />
                  Download All NSW Templates
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

export default StatePackNSW;