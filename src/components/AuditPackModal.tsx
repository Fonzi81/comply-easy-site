import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, CheckCircle, Calendar, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface AuditPackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  complianceItems: any[];
}

const AuditPackModal = ({ open, onOpenChange, complianceItems }: AuditPackModalProps) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState("last-12-months");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const categories = [
    { id: "food-safety", label: "Food Safety 3.2.2A", icon: "🍽️", count: complianceItems.filter(i => i.category === 'food-safety').length },
    { id: "whs", label: "Workplace Health & Safety", icon: "⚠️", count: complianceItems.filter(i => i.category === 'whs').length },
    { id: "fire-safety", label: "Fire Safety", icon: "🔥", count: complianceItems.filter(i => i.category === 'fire-safety').length },
    { id: "test-tag", label: "Test & Tag", icon: "⚡", count: complianceItems.filter(i => i.category === 'test-tag').length }
  ];

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, categoryId]);
    } else {
      setSelectedCategories(prev => prev.filter(id => id !== categoryId));
    }
  };

  const handleGenerate = async () => {
    if (selectedCategories.length === 0) return;
    
    setIsGenerating(true);
    setGenerationProgress(0);
    
    // Simulate audit pack generation
    const steps = [
      "Collecting compliance records...",
      "Validating documentation...",
      "Compiling evidence files...",
      "Generating compliance report...",
      "Creating audit-ready package...",
      "Finalizing document..."
    ];
    
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setGenerationProgress((i + 1) / steps.length * 100);
    }
    
    setIsGenerating(false);
    setIsComplete(true);
    
    // Store audit pack generation in localStorage
    const auditPack = {
      id: Date.now().toString(),
      categories: selectedCategories,
      dateRange,
      generatedAt: new Date().toISOString(),
      itemCount: complianceItems.filter(item => selectedCategories.includes(item.category)).length
    };
    
    const existingPacks = JSON.parse(localStorage.getItem('auditPacks') || '[]');
    localStorage.setItem('auditPacks', JSON.stringify([...existingPacks, auditPack]));
  };

  const handleDownload = () => {
    // Simulate file download
    const blob = new Blob(['Sample Audit Pack Content'], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ComplyEasy_Audit_Pack_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    onOpenChange(false);
    setIsComplete(false);
    setSelectedCategories([]);
  };

  const getTotalItems = () => {
    return complianceItems.filter(item => selectedCategories.includes(item.category)).length;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-primary" />
            <span>Generate Audit Pack</span>
          </DialogTitle>
          <DialogDescription>
            Create a comprehensive audit-ready compliance package for your selected domains.
          </DialogDescription>
        </DialogHeader>

        {!isGenerating && !isComplete && (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base font-semibold">Select Compliance Domains</Label>
              <div className="grid grid-cols-1 gap-3">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id={category.id}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={(checked) => handleCategoryChange(category.id, !!checked)}
                    />
                    <div className="flex-1 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{category.icon}</span>
                        <div>
                          <Label htmlFor={category.id} className="font-medium cursor-pointer">
                            {category.label}
                          </Label>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {category.count} {category.count === 1 ? 'item' : 'items'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateRange">Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                  <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                  <SelectItem value="last-12-months">Last 12 Months</SelectItem>
                  <SelectItem value="current-year">Current Year</SelectItem>
                  <SelectItem value="all-time">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedCategories.length > 0 && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">Audit Pack Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Selected Domains:</span>
                    <span>{selectedCategories.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Items:</span>
                    <span>{getTotalItems()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date Range:</span>
                    <span>{dateRange.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {isGenerating && (
          <div className="space-y-6 text-center py-8">
            <div className="space-y-4">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
              <div>
                <h3 className="text-lg font-semibold">Generating Audit Pack</h3>
                <p className="text-muted-foreground">Please wait while we compile your compliance documentation...</p>
              </div>
            </div>
            <div className="space-y-2">
              <Progress value={generationProgress} className="w-full" />
              <p className="text-sm text-muted-foreground">{Math.round(generationProgress)}% Complete</p>
            </div>
          </div>
        )}

        {isComplete && (
          <div className="space-y-6 text-center py-8">
            <div className="space-y-4">
              <CheckCircle className="w-16 h-16 text-primary mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-primary">Audit Pack Ready!</h3>
                <p className="text-muted-foreground">
                  Your comprehensive compliance audit pack has been generated successfully.
                </p>
              </div>
            </div>
            
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium">Generated:</div>
                  <div>{format(new Date(), 'PPP')}</div>
                </div>
                <div>
                  <div className="font-medium">Items Included:</div>
                  <div>{getTotalItems()} compliance records</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          {!isGenerating && !isComplete && (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleGenerate} 
                disabled={selectedCategories.length === 0}
              >
                <FileText className="w-4 h-4 mr-2" />
                Generate Pack
              </Button>
            </>
          )}
          
          {isComplete && (
            <>
              <Button variant="outline" onClick={() => { setIsComplete(false); setSelectedCategories([]); }}>
                Generate Another
              </Button>
              <Button onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AuditPackModal;