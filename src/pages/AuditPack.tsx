import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Package, 
  Download, 
  Calendar as CalendarIcon,
  FileText,
  Building,
  Clock
} from "lucide-react";

interface AuditExport {
  id: string;
  dateGenerated: string;
  dateRange: string;
  sites: string[];
  generatedBy: string;
  fileSize: string;
  taskCount: number;
}

const AuditPack = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear() - 1, new Date().getMonth(), new Date().getDate()),
    to: new Date()
  });
  const [selectedSites, setSelectedSites] = useState<string[]>(["all"]);
  const [exports, setExports] = useState<AuditExport[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const sites = [
    "Main Site",
    "Cafe North", 
    "Cafe South",
    "Childcare Centre"
  ];

  useEffect(() => {
    // Sample export history
    const sampleExports: AuditExport[] = [
      {
        id: '1',
        dateGenerated: '2024-01-15T10:30:00Z',
        dateRange: 'Jan 2023 - Dec 2023',
        sites: ['Main Site', 'Cafe North'],
        generatedBy: 'John Smith',
        fileSize: '15.2 MB',
        taskCount: 87
      },
      {
        id: '2',
        dateGenerated: '2024-01-10T14:15:00Z',
        dateRange: 'Oct 2023 - Dec 2023',
        sites: ['All Sites'],
        generatedBy: 'Sarah Johnson',
        fileSize: '23.8 MB',
        taskCount: 124
      },
      {
        id: '3',
        dateGenerated: '2024-01-05T09:45:00Z',
        dateRange: 'Nov 2023 - Dec 2023',
        sites: ['Childcare Centre'],
        generatedBy: 'Mike Wilson',
        fileSize: '8.7 MB',
        taskCount: 42
      }
    ];
    setExports(sampleExports);
  }, []);

  const handleGenerateAuditPack = async () => {
    setIsGenerating(true);
    
    // Simulate PDF generation
    setTimeout(() => {
      const newExport: AuditExport = {
        id: Date.now().toString(),
        dateGenerated: new Date().toISOString(),
        dateRange: `${dateRange.from?.toLocaleDateString()} - ${dateRange.to?.toLocaleDateString()}`,
        sites: selectedSites.includes("all") ? ["All Sites"] : selectedSites,
        generatedBy: "Current User",
        fileSize: "12.4 MB",
        taskCount: 65
      };
      
      setExports(prev => [newExport, ...prev]);
      setIsGenerating(false);
      
      // Simulate file download
      const blob = new Blob(['Audit Pack PDF Content'], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `audit-pack-${dateRange.from?.toLocaleDateString()}-${dateRange.to?.toLocaleDateString()}.pdf`;
      link.click();
    }, 3000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Audit Pack Generator</h1>
        <p className="text-muted-foreground">
          Generate comprehensive audit reports with evidence and compliance data
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Section */}
          <Card className="carbon-bg border-0">
            <CardContent className="p-8">
              <div className="text-center">
                <Package className="w-16 h-16 mx-auto mb-4 text-carbon-foreground" />
                <h2 className="text-2xl font-heading font-bold text-carbon-foreground mb-2">
                  Generate Audit Pack
                </h2>
                <p className="text-carbon-foreground/80 mb-6">
                  Create a comprehensive PDF report with all compliance tasks and evidence
                </p>
                <Button 
                  size="lg"
                  onClick={handleGenerateAuditPack}
                  disabled={isGenerating}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isGenerating ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Generate Audit Pack
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>
                Select date range and sites for your audit pack
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Date Range */}
              <div>
                <h4 className="font-medium mb-3">Date Range</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">From</label>
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) => setDateRange(prev => ({ ...prev, from: date || prev.from }))}
                      className="rounded-md border w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">To</label>
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) => setDateRange(prev => ({ ...prev, to: date || prev.to }))}
                      className="rounded-md border w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Site Selection */}
              <div>
                <h4 className="font-medium mb-3">Sites</h4>
                <Select 
                  value={selectedSites.includes("all") ? "all" : selectedSites[0]} 
                  onValueChange={(value) => setSelectedSites(value === "all" ? ["all"] : [value])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sites" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sites</SelectItem>
                    {sites.map((site) => (
                      <SelectItem key={site} value={site}>{site}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Preview Info */}
              <div className="p-4 bg-muted rounded-lg">
                <h5 className="font-medium mb-2">Preview</h5>
                <div className="space-y-1 text-sm">
                  <p><strong>Date Range:</strong> {dateRange.from?.toLocaleDateString()} - {dateRange.to?.toLocaleDateString()}</p>
                  <p><strong>Sites:</strong> {selectedSites.includes("all") ? "All Sites" : selectedSites.join(", ")}</p>
                  <p><strong>Estimated Tasks:</strong> ~65 compliance tasks</p>
                  <p><strong>Estimated Size:</strong> ~12 MB</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Presets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setDateRange({
                  from: new Date(new Date().getFullYear(), 0, 1),
                  to: new Date()
                })}
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                Year to Date
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setDateRange({
                  from: new Date(new Date().getFullYear() - 1, 0, 1),
                  to: new Date(new Date().getFullYear() - 1, 11, 31)
                })}
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                Previous Year
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setDateRange({
                  from: new Date(new Date().setMonth(new Date().getMonth() - 3)),
                  to: new Date()
                })}
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                Last 3 Months
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setDateRange({
                  from: new Date(new Date().setMonth(new Date().getMonth() - 12)),
                  to: new Date()
                })}
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                Last 12 Months
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Export History */}
      <Card>
        <CardHeader>
          <CardTitle>Export History</CardTitle>
          <CardDescription>
            Previous audit pack generations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date Generated</TableHead>
                <TableHead>Date Range</TableHead>
                <TableHead>Sites</TableHead>
                <TableHead>Tasks</TableHead>
                <TableHead>Generated By</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exports.map((exportItem) => (
                <TableRow key={exportItem.id}>
                  <TableCell>{formatDate(exportItem.dateGenerated)}</TableCell>
                  <TableCell>{exportItem.dateRange}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {exportItem.sites.map((site, index) => (
                        <Badge key={index} variant="outline">
                          {site}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{exportItem.taskCount}</TableCell>
                  <TableCell>{exportItem.generatedBy}</TableCell>
                  <TableCell>{exportItem.fileSize}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {exports.length === 0 && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-lg font-medium mb-2">No exports yet</p>
              <p className="text-muted-foreground">
                Generate your first audit pack to see it here
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditPack;