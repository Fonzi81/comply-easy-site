import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, CheckCircle, Thermometer, ClipboardList, Users, Shield } from "lucide-react";

interface TemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TemplateModal = ({ open, onOpenChange }: TemplateModalProps) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [businessType, setBusinessType] = useState("");

  const templateCategories = {
    "food-safety": {
      name: "Food Safety 3.2.2A",
      icon: <Thermometer className="w-5 h-5 text-blue-500" />,
      templates: [
        { id: "temp-log", name: "Temperature Log Sheet", description: "Daily fridge/freezer temperature recording", required: true },
        { id: "cleaning-schedule", name: "Cleaning & Sanitising Schedule", description: "Daily/weekly cleaning checklist", required: true },
        { id: "staff-training", name: "Staff Training Record", description: "Food handler training documentation", required: true },
        { id: "supplier-verification", name: "Supplier Verification Form", description: "Delivery temperature and quality checks", required: false },
        { id: "haccp-plan", name: "HACCP Plan Template", description: "Hazard analysis and critical control points", required: true },
        { id: "corrective-action", name: "Corrective Action Log", description: "Non-compliance incident recording", required: false }
      ]
    },
    "whs": {
      name: "Workplace Health & Safety",
      icon: <Shield className="w-5 h-5 text-yellow-500" />,
      templates: [
        { id: "risk-assessment", name: "Risk Assessment Form", description: "Workplace hazard identification", required: true },
        { id: "incident-report", name: "Incident Report Form", description: "Workplace injury/near-miss reporting", required: true },
        { id: "safety-induction", name: "Safety Induction Checklist", description: "New employee safety training", required: true },
        { id: "safety-meeting", name: "Safety Meeting Minutes", description: "Monthly safety meeting records", required: false },
        { id: "emergency-procedure", name: "Emergency Procedures", description: "Evacuation and emergency response", required: true },
        { id: "ppe-inspection", name: "PPE Inspection Log", description: "Personal protective equipment checks", required: false }
      ]
    },
    "fire-safety": {
      name: "Fire Safety",
      icon: <Shield className="w-5 h-5 text-red-500" />,
      templates: [
        { id: "extinguisher-log", name: "Fire Extinguisher Log", description: "Monthly equipment inspection record", required: true },
        { id: "evacuation-plan", name: "Evacuation Plan Template", description: "Building evacuation procedures", required: true },
        { id: "fire-warden-log", name: "Fire Warden Training Record", description: "Fire warden certification tracking", required: true },
        { id: "emergency-lighting", name: "Emergency Lighting Test", description: "Monthly emergency lighting checks", required: true },
        { id: "fire-drill-report", name: "Fire Drill Report", description: "Evacuation drill documentation", required: false },
        { id: "equipment-maintenance", name: "Fire Equipment Maintenance", description: "Annual service records", required: true }
      ]
    },
    "test-tag": {
      name: "Test & Tag",
      icon: <ClipboardList className="w-5 h-5 text-purple-500" />,
      templates: [
        { id: "equipment-register", name: "Equipment Register", description: "Portable electrical equipment inventory", required: true },
        { id: "test-certificate", name: "Test Certificate Template", description: "AS/NZS 3760 test results", required: true },
        { id: "defect-report", name: "Defect Report Form", description: "Failed equipment documentation", required: false },
        { id: "retest-schedule", name: "Retest Schedule", description: "Equipment testing intervals", required: true },
        { id: "qualified-tester", name: "Qualified Tester Record", description: "Tester certification tracking", required: true },
        { id: "repair-log", name: "Repair & Maintenance Log", description: "Equipment repair documentation", required: false }
      ]
    }
  };

  const businessTypes = [
    "Restaurant/Café", "Childcare Centre", "Gym/Fitness", "Office Building", 
    "Retail Store", "Manufacturing", "Healthcare", "Education", "Construction"
  ];

  const handleTemplateToggle = (templateId: string, checked: boolean) => {
    if (checked) {
      setSelectedTemplates(prev => [...prev, templateId]);
    } else {
      setSelectedTemplates(prev => prev.filter(id => id !== templateId));
    }
  };

  const handleGenerateTemplates = () => {
    const category = templateCategories[selectedCategory as keyof typeof templateCategories];
    const templates = category.templates.filter(t => selectedTemplates.includes(t.id));
    
    // Simulate template generation and download
    templates.forEach((template, index) => {
      setTimeout(() => {
        const blob = new Blob([`Template: ${template.name}\nBusiness Type: ${businessType}\nCategory: ${category.name}\n\nThis is a sample template for ${template.description}`], 
          { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${template.name.replace(/\s+/g, '_')}_Template.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, index * 500);
    });

    // Store template generation in localStorage
    const templateGeneration = {
      id: Date.now().toString(),
      category: selectedCategory,
      businessType,
      templates: templates.map(t => t.name),
      generatedAt: new Date().toISOString()
    };
    
    const existingGenerations = JSON.parse(localStorage.getItem('templateGenerations') || '[]');
    localStorage.setItem('templateGenerations', JSON.stringify([...existingGenerations, templateGeneration]));
    
    onOpenChange(false);
    setSelectedCategory("");
    setSelectedTemplates([]);
    setBusinessType("");
  };

  const currentCategory = selectedCategory ? templateCategories[selectedCategory as keyof typeof templateCategories] : null;
  const requiredTemplates = currentCategory?.templates.filter(t => t.required) || [];
  const optionalTemplates = currentCategory?.templates.filter(t => !t.required) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-primary" />
            <span>Generate Compliance Templates</span>
          </DialogTitle>
          <DialogDescription>
            Create pre-filled templates and forms for your compliance activities and record keeping.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Category Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Compliance Category *</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select compliance domain" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(templateCategories).map(([key, category]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center space-x-2">
                        {category.icon}
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Business Type *</Label>
              <Select value={businessType} onValueChange={setBusinessType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Template Selection */}
          {currentCategory && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Available Templates</h3>
                <Badge variant="outline">
                  {selectedTemplates.length} of {currentCategory.templates.length} selected
                </Badge>
              </div>

              {/* Required Templates */}
              {requiredTemplates.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span>Required Templates</span>
                    </CardTitle>
                    <CardDescription>These templates are essential for compliance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {requiredTemplates.map((template) => (
                      <div key={template.id} className="flex items-start space-x-3 p-3 border rounded-lg bg-primary/5">
                        <Checkbox
                          id={template.id}
                          checked={selectedTemplates.includes(template.id)}
                          onCheckedChange={(checked) => handleTemplateToggle(template.id, !!checked)}
                        />
                        <div className="flex-1">
                          <Label htmlFor={template.id} className="font-medium cursor-pointer">
                            {template.name}
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                        </div>
                        <Badge variant="destructive" className="text-xs">Required</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Optional Templates */}
              {optionalTemplates.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Optional Templates</CardTitle>
                    <CardDescription>Additional templates for enhanced compliance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {optionalTemplates.map((template) => (
                      <div key={template.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <Checkbox
                          id={template.id}
                          checked={selectedTemplates.includes(template.id)}
                          onCheckedChange={(checked) => handleTemplateToggle(template.id, !!checked)}
                        />
                        <div className="flex-1">
                          <Label htmlFor={template.id} className="font-medium cursor-pointer">
                            {template.name}
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs">Optional</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {selectedTemplates.length > 0 && (
            <Card className="bg-muted/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Generation Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium">Business Type:</div>
                    <div>{businessType || 'Not selected'}</div>
                  </div>
                  <div>
                    <div className="font-medium">Templates:</div>
                    <div>{selectedTemplates.length} selected</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleGenerateTemplates}
            disabled={!selectedCategory || !businessType || selectedTemplates.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Generate Templates
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateModal;