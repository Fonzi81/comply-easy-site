import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  FileText, 
  Plus, 
  Settings, 
  Calendar,
  ExternalLink,
  Clock
} from "lucide-react";

interface Template {
  id: string;
  name: string;
  state: string;
  industry: string;
  version: string;
  lastUpdated: string;
  isActive: boolean;
  taskCount: number;
  recurrenceRule: string;
  evidenceRequired: string[];
  guidanceUrl: string;
  description: string;
}

const Templates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    state: "",
    industry: ""
  });

  const availableTemplates = {
    "QLD": {
      "Food Safety": "QLD Food Safety 3.2.2A Standard",
      "WHS": "QLD Work Health & Safety Compliance",
      "Fire Safety": "QLD Fire Safety Building Code",
      "Childcare": "QLD Childcare Licensing Requirements"
    },
    "NSW": {
      "Food Safety": "NSW Food Safety Standards",
      "WHS": "NSW SafeWork Compliance",
      "Fire Safety": "NSW Fire & Rescue Requirements"
    },
    "VIC": {
      "Food Safety": "VIC Food Safety Standards",
      "WHS": "VIC WorkSafe Compliance",
      "Fire Safety": "VIC Fire Services Requirements"
    }
  };

  useEffect(() => {
    // Sample installed templates
    const sampleTemplates: Template[] = [
      {
        id: '1',
        name: 'QLD Food Safety 3.2.2A',
        state: 'Queensland',
        industry: 'Food Safety',
        version: '2.1.0',
        lastUpdated: '2024-01-10',
        isActive: true,
        taskCount: 24,
        recurrenceRule: 'Daily temperature checks, Weekly deep cleaning, Monthly audits',
        evidenceRequired: ['Temperature logs', 'Cleaning checklists', 'Photos', 'Certificates'],
        guidanceUrl: 'https://www.business.qld.gov.au/industries/hospitality-tourism-sport/food-beverage/food-safety',
        description: 'Comprehensive food safety compliance for Queensland businesses under Standard 3.2.2A'
      },
      {
        id: '2',
        name: 'QLD WHS Compliance',
        state: 'Queensland',
        industry: 'Work Health & Safety',
        version: '1.8.3',
        lastUpdated: '2024-01-08',
        isActive: true,
        taskCount: 18,
        recurrenceRule: 'Weekly safety checks, Monthly training, Quarterly audits',
        evidenceRequired: ['Safety reports', 'Training records', 'Incident reports', 'Certificates'],
        guidanceUrl: 'https://www.worksafe.qld.gov.au/',
        description: 'Queensland workplace health and safety compliance requirements'
      },
      {
        id: '3',
        name: 'QLD Fire Safety',
        state: 'Queensland',
        industry: 'Fire Safety',
        version: '3.0.1',
        lastUpdated: '2024-01-05',
        isActive: false,
        taskCount: 12,
        recurrenceRule: 'Monthly equipment checks, Quarterly system tests, Annual inspections',
        evidenceRequired: ['Inspection reports', 'Equipment logs', 'Test certificates'],
        guidanceUrl: 'https://www.qfes.qld.gov.au/',
        description: 'Fire safety building code compliance for Queensland premises'
      },
      {
        id: '4',
        name: 'Test & Tag Standard',
        state: 'National',
        industry: 'Electrical Safety',
        version: '4.2.0',
        lastUpdated: '2024-01-12',
        isActive: true,
        taskCount: 8,
        recurrenceRule: 'Monthly PAT testing, Quarterly visual inspections, Annual certifications',
        evidenceRequired: ['Test certificates', 'Equipment registers', 'Fault reports'],
        guidanceUrl: 'https://www.standards.org.au/',
        description: 'Portable appliance testing and electrical safety compliance'
      }
    ];
    setTemplates(sampleTemplates);
  }, []);

  const handleToggleTemplate = (templateId: string) => {
    setTemplates(prev =>
      prev.map(template =>
        template.id === templateId
          ? { ...template, isActive: !template.isActive }
          : template
      )
    );
  };

  const handleAddTemplate = () => {
    if (newTemplate.state && newTemplate.industry) {
      const templateName = (availableTemplates as any)[newTemplate.state]?.[newTemplate.industry];
      if (templateName) {
        const newTemplateData: Template = {
          id: Date.now().toString(),
          name: templateName,
          state: newTemplate.state,
          industry: newTemplate.industry,
          version: '1.0.0',
          lastUpdated: new Date().toISOString().split('T')[0],
          isActive: true,
          taskCount: Math.floor(Math.random() * 20) + 5,
          recurrenceRule: 'Varies by template requirements',
          evidenceRequired: ['Documentation', 'Records', 'Certificates'],
          guidanceUrl: '#',
          description: `${newTemplate.state} ${newTemplate.industry} compliance template`
        };
        
        setTemplates(prev => [...prev, newTemplateData]);
        setNewTemplate({ state: "", industry: "" });
        setIsAddModalOpen(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Templates & State Packs</h1>
          <p className="text-muted-foreground">
            Manage compliance templates and regulatory requirements
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Template Pack
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Template Pack</DialogTitle>
              <DialogDescription>
                Select your state and industry to install the appropriate compliance template
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">State/Territory</label>
                <Select value={newTemplate.state} onValueChange={(value) => setNewTemplate(prev => ({ ...prev, state: value, industry: "" }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="QLD">Queensland</SelectItem>
                    <SelectItem value="NSW">New South Wales</SelectItem>
                    <SelectItem value="VIC">Victoria</SelectItem>
                    <SelectItem value="SA">South Australia</SelectItem>
                    <SelectItem value="WA">Western Australia</SelectItem>
                    <SelectItem value="TAS">Tasmania</SelectItem>
                    <SelectItem value="NT">Northern Territory</SelectItem>
                    <SelectItem value="ACT">Australian Capital Territory</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {newTemplate.state && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Industry</label>
                  <Select value={newTemplate.industry} onValueChange={(value) => setNewTemplate(prev => ({ ...prev, industry: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys((availableTemplates as any)[newTemplate.state] || {}).map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {newTemplate.state && newTemplate.industry && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-medium mb-1">Template Preview:</p>
                  <p className="text-sm text-muted-foreground">
                    {(availableTemplates as any)[newTemplate.state][newTemplate.industry]}
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTemplate} disabled={!newTemplate.state || !newTemplate.industry}>
                  Add Template
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Installed Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="hover-lift">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {template.state} • {template.industry}
                  </CardDescription>
                </div>
                <Switch
                  checked={template.isActive}
                  onCheckedChange={() => handleToggleTemplate(template.id)}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Version:</span>
                <Badge variant="outline">{template.version}</Badge>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tasks:</span>
                <span className="font-medium">{template.taskCount}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Updated:</span>
                <span>{template.lastUpdated}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant={template.isActive ? "default" : "secondary"}>
                  {template.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="pt-2 border-t space-y-2">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-full sm:max-w-xl">
                    <SheetHeader>
                      <SheetTitle>{template.name}</SheetTitle>
                      <SheetDescription>
                        {template.state} • {template.industry} • Version {template.version}
                      </SheetDescription>
                    </SheetHeader>
                    
                    <div className="mt-6 space-y-6">
                      <div>
                        <h4 className="font-medium mb-2">Description</h4>
                        <p className="text-sm text-muted-foreground">
                          {template.description}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2 flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          Recurrence Rules
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {template.recurrenceRule}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Evidence Required</h4>
                        <div className="flex flex-wrap gap-2">
                          {template.evidenceRequired.map((evidence, index) => (
                            <Badge key={index} variant="outline">
                              {evidence}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Official Guidance</h4>
                        <Button variant="outline" size="sm" asChild>
                          <a href={template.guidanceUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Guidelines
                          </a>
                        </Button>
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium">Template Status</span>
                          <Switch
                            checked={template.isActive}
                            onCheckedChange={() => handleToggleTemplate(template.id)}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {template.isActive 
                            ? "This template is active and generating compliance tasks"
                            : "This template is inactive and not generating tasks"
                          }
                        </p>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
                
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a href={template.guidanceUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Guidelines
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {templates.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No Templates Installed</h3>
            <p className="text-muted-foreground mb-4">
              Add your first compliance template to get started with automated task generation
            </p>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Template
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{templates.length}</p>
                <p className="text-xs text-muted-foreground">Total Templates</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{templates.filter(t => t.isActive).length}</p>
                <p className="text-xs text-muted-foreground">Active Templates</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">
                  {templates.reduce((sum, t) => sum + t.taskCount, 0)}
                </p>
                <p className="text-xs text-muted-foreground">Total Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Plus className="w-5 h-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-muted-foreground">Available Packs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Templates;