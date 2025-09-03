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

const StatePackWA = () => {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Western Australia (WA) Compliance Pack - ComplyEasy | State-Specific Templates";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Complete WA compliance templates including Food Act 2008, Work Health & Safety Act 2020, and Fire Brigades Act requirements for Western Australia.'
      );
    }
  }, []);

  const templates = [
    {
      id: 'wa-food-safety',
      name: 'WA Food Safety Standards',
      description: 'Complete Food Act 2008 compliance templates and schedules',
      tasks: 21,
      fileSize: '2.2 MB',
      category: 'Food Safety',
      includes: ['Food business registration', 'Temperature monitoring', 'Food handler training', 'Notification requirements']
    },
    {
      id: 'wa-worksafe',
      name: 'WA Work Health & Safety',
      description: 'Work Health & Safety Act 2020 Western Australia requirements',
      tasks: 17,
      fileSize: '1.8 MB',
      category: 'WHS',
      includes: ['WorkSafe WA forms', 'Risk management', 'Consultation procedures', 'Incident reporting']
    },
    {
      id: 'wa-fire-safety',
      name: 'WA Fire Safety Requirements',
      description: 'Fire Brigades Act 1942 and building fire safety compliance',
      tasks: 15,
      fileSize: '1.7 MB',
      category: 'Fire Safety',
      includes: ['Fire safety certificates', 'Equipment maintenance', 'Emergency procedures', 'Building compliance']
    },
    {
      id: 'wa-electrical',
      name: 'WA Electrical Safety',
      description: 'Electricity Act 1945 and electrical safety compliance',
      tasks: 9,
      fileSize: '1.1 MB',
      category: 'Electrical',
      includes: ['Electrical work permits', 'Testing schedules', 'Safety switches', 'Installation compliance']
    }
  ];

  const businessTypes = [
    { type: 'Mining Services', requirements: ['WHS', 'Fire Safety', 'Electrical'] },
    { type: 'Marine Industries', requirements: ['WHS', 'Fire Safety'] },
    { type: 'Wine & Agriculture', requirements: ['Food Safety', 'WHS'] },
    { type: 'Remote Operations', requirements: ['WHS', 'Fire Safety', 'Electrical'] },
    { type: 'Indigenous Enterprises', requirements: ['Food Safety', 'WHS', 'Fire Safety'] }
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
      const content = `# ${template.name} - WA Compliance Template Pack

## Description
${template.description}

## Included Templates
${template.includes.map(item => `- ${item}`).join('\n')}

## Number of Tasks: ${template.tasks}

## Western Australia Compliance Requirements

This template pack includes all necessary documentation and schedules to meet WA state-specific compliance requirements.

### WA Regulatory Bodies:
- WorkSafe Western Australia: https://www.commerce.wa.gov.au/worksafe/
- Department of Health WA (Food Safety): https://www.healthywa.wa.gov.au/
- Department of Fire and Emergency Services: https://www.dfes.wa.gov.au/
- Building and Energy (Electrical Safety): https://www.commerce.wa.gov.au/building-and-energy/

### Implementation Steps:
1. Review all templates and customize for your WA business
2. Register with relevant WA agencies as required
3. Schedule recurring tasks in your compliance system
4. Train staff on WA-specific procedures
5. Begin regular compliance monitoring

### Special Considerations for WA:
- Remote area compliance requirements
- Mining industry specific obligations
- Marine and coastal business considerations
- Indigenous community engagement requirements

Generated: ${new Date().toLocaleString()}
`;

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${template.name.replace(/\s+/g, '-')}-WA-Template-Pack.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleDownloadAllTemplates = async () => {
    toast({
      title: "Preparing Complete Pack",
      description: "Generating all WA templates...",
    });

    setTimeout(() => {
      const allContent = `# Western Australia (WA) Complete Compliance Pack

## Overview
This pack contains all WA state-specific compliance templates and documentation for business compliance management.

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

## WA Regulatory Information:
- Food Act 2008: https://www.legislation.wa.gov.au/legislation/statutes.nsf/main_mrtitle_353_homepage.html
- Work Health and Safety Act 2020: https://www.legislation.wa.gov.au/legislation/statutes.nsf/main_mrtitle_13831_homepage.html
- Fire Brigades Act 1942: https://www.legislation.wa.gov.au/legislation/statutes.nsf/main_mrtitle_355_homepage.html
- Electricity Act 1945: https://www.legislation.wa.gov.au/legislation/statutes.nsf/main_mrtitle_331_homepage.html

## Special WA Considerations:
- Remote area operations and compliance
- Mining industry specific requirements
- Marine and coastal business obligations
- Indigenous community considerations

Generated: ${new Date().toLocaleString()}
Total Templates: ${templates.length}
Total Tasks: ${templates.reduce((sum, t) => sum + t.tasks, 0)}
`;

      const blob = new Blob([allContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'WA-Complete-Compliance-Pack.txt';
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Download Complete",
        description: "WA complete compliance pack downloaded successfully.",
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
                Western Australia (WA) Compliance Pack
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-heading font-bold mb-6 text-carbon-foreground">
                <span className="text-primary">WA</span> compliance templates
              </h1>
              <p className="text-xl text-carbon-foreground/80 mb-8 leading-relaxed">
                Complete compliance templates for WA businesses. Includes Food Act 2008, 
                Work Health & Safety Act 2020, and specialized templates for mining and remote operations.
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
                Available WA Templates
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Download individual compliance packs or get the complete WA bundle
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

        {/* Special WA Considerations */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-heading font-bold text-center mb-12">
                Western Australia specific considerations
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-6">
                  <h3 className="text-xl font-heading font-semibold mb-4 text-primary">Remote Operations</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>Extended compliance reporting periods</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>Remote area safety requirements</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>Emergency response procedures</span>
                    </li>
                  </ul>
                </Card>

                <Card className="p-6">
                  <h3 className="text-xl font-heading font-semibold mb-4 text-primary">Mining Industry</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>Mining Act compliance requirements</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>Enhanced safety protocols</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>Environmental monitoring</span>
                    </li>
                  </ul>
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
                Ready to get WA-compliant?
              </h2>
              <p className="text-xl text-carbon-foreground/80 mb-8">
                Download your templates now or start a free trial for the complete compliance management system.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6" onClick={handleDownloadAllTemplates}>
                  <Download className="w-4 h-4 mr-2" />
                  Download All WA Templates
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

export default StatePackWA;