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

const StatePackVIC = () => {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Victoria (VIC) Compliance Pack - ComplyEasy | State-Specific Templates";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Complete Victoria compliance templates including Food Act 1984, WorkSafe Victoria requirements, and Environment Protection Act compliance.'
      );
    }
  }, []);

  const templates = [
    {
      id: 'vic-food-safety',
      name: 'VIC Food Safety Standards',
      description: 'Complete Food Act 1984 compliance templates and schedules',
      tasks: 25,
      fileSize: '2.4 MB',
      category: 'Food Safety',
      includes: ['Food safety programs', 'Temperature logs', 'Training requirements', 'Annual declarations']
    },
    {
      id: 'vic-worksafe',
      name: 'VIC WorkSafe Compliance',
      description: 'Occupational Health & Safety Act Victoria requirements',
      tasks: 19,
      fileSize: '1.9 MB',
      category: 'OHS',
      includes: ['WorkSafe forms', 'Risk assessments', 'Training records', 'Consultation procedures']
    },
    {
      id: 'vic-fire-safety',
      name: 'VIC Fire Services Requirements',
      description: 'Fire safety compliance for Victorian buildings',
      tasks: 13,
      fileSize: '1.6 MB',
      category: 'Fire Safety',
      includes: ['Essential safety measures', 'Fire equipment testing', 'Emergency procedures', 'Building audits']
    },
    {
      id: 'vic-environmental',
      name: 'VIC Environment Protection',
      description: 'Environment Protection Act compliance templates',
      tasks: 11,
      fileSize: '1.4 MB',
      category: 'Environmental',
      includes: ['EPA approvals', 'Waste tracking', 'Noise monitoring', 'Emissions reporting']
    }
  ];

  const businessTypes = [
    { type: 'Food Services', requirements: ['Food Safety', 'Fire Safety', 'OHS'] },
    { type: 'Aged Care', requirements: ['Food Safety', 'Fire Safety', 'OHS', 'Environmental'] },
    { type: 'Tourism', requirements: ['Fire Safety', 'OHS'] },
    { type: 'Agriculture', requirements: ['Environmental', 'OHS'] },
    { type: 'Professional Services', requirements: ['Fire Safety', 'OHS'] }
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
      const content = `# ${template.name} - VIC Compliance Template Pack

## Description
${template.description}

## Included Templates
${template.includes.map(item => `- ${item}`).join('\n')}

## Number of Tasks: ${template.tasks}

## Victoria Compliance Requirements

This template pack includes all necessary documentation and schedules to meet Victorian state-specific compliance requirements.

### Victorian Regulatory Bodies:
- WorkSafe Victoria: https://www.worksafe.vic.gov.au/
- Food Safety Victoria: https://www2.health.vic.gov.au/public-health/food-safety
- Country Fire Authority: https://www.cfa.vic.gov.au/
- Environment Protection Authority Victoria: https://www.epa.vic.gov.au/

### Implementation Steps:
1. Review all templates and customize for your Victorian business
2. Register with relevant Victorian agencies as required
3. Schedule recurring tasks in your compliance system
4. Train staff on Victorian-specific procedures
5. Begin regular compliance monitoring

Generated: ${new Date().toLocaleString()}
`;

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${template.name.replace(/\s+/g, '-')}-VIC-Template-Pack.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleDownloadAllTemplates = async () => {
    toast({
      title: "Preparing Complete Pack",
      description: "Generating all Victoria templates...",
    });

    setTimeout(() => {
      const allContent = `# Victoria (VIC) Complete Compliance Pack

## Overview
This pack contains all Victoria state-specific compliance templates and documentation for business compliance management.

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

## Victoria Regulatory Information:
- Food Act 1984: https://www.legislation.vic.gov.au/in-force/acts/food-act-1984
- Occupational Health and Safety Act 2004: https://www.legislation.vic.gov.au/in-force/acts/occupational-health-and-safety-act-2004
- Environment Protection Act 2017: https://www.legislation.vic.gov.au/in-force/acts/environment-protection-act-2017

Generated: ${new Date().toLocaleString()}
Total Templates: ${templates.length}
Total Tasks: ${templates.reduce((sum, t) => sum + t.tasks, 0)}
`;

      const blob = new Blob([allContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'VIC-Complete-Compliance-Pack.txt';
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Download Complete",
        description: "Victoria complete compliance pack downloaded successfully.",
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
                Victoria (VIC) Compliance Pack
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-heading font-bold mb-6 text-carbon-foreground">
                <span className="text-primary">Victoria</span> compliance templates
              </h1>
              <p className="text-xl text-carbon-foreground/80 mb-8 leading-relaxed">
                Complete compliance templates for Victorian businesses. Includes Food Act 1984, 
                WorkSafe Victoria requirements, and Environment Protection Act compliance.
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
                Available Victoria Templates
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Download individual compliance packs or get the complete Victoria bundle
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
                Ready to get Victoria-compliant?
              </h2>
              <p className="text-xl text-carbon-foreground/80 mb-8">
                Download your templates now or start a free trial for the complete compliance management system.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6" onClick={handleDownloadAllTemplates}>
                  <Download className="w-4 h-4 mr-2" />
                  Download All VIC Templates
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

export default StatePackVIC;