import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Upload, 
  Search, 
  Filter, 
  FileText, 
  Image, 
  File, 
  Download,
  Eye,
  Trash2,
  Calendar
} from "lucide-react";
import { format } from "date-fns";

interface EvidenceFile {
  id: string;
  taskId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  evidenceType: string;
  description: string;
  location: string;
  uploadedAt: string;
  uploadedBy: string;
}

const EvidenceManager = () => {
  const [evidenceFiles, setEvidenceFiles] = useState<EvidenceFile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    const stored = localStorage.getItem('evidenceFiles');
    if (stored) {
      setEvidenceFiles(JSON.parse(stored));
    }
  }, []);

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="w-4 h-4 text-blue-500" />;
    if (fileType === 'application/pdf') return <FileText className="w-4 h-4 text-red-500" />;
    return <File className="w-4 h-4 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getEvidenceTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      'temperature-log': 'Temperature Log',
      'training-certificate': 'Training Certificate',
      'inspection-report': 'Inspection Report',
      'cleaning-record': 'Cleaning Record',
      'incident-photo': 'Incident Photo',
      'equipment-test': 'Equipment Test',
      'safety-document': 'Safety Document',
      'compliance-form': 'Compliance Form',
      'other': 'Other Evidence'
    };
    return types[type] || type;
  };

  const filteredFiles = evidenceFiles.filter(file => {
    const matchesSearch = file.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || file.evidenceType === filterType;
    const matchesCategory = filterCategory === 'all' || file.fileType.startsWith(filterCategory);
    
    return matchesSearch && matchesType && matchesCategory;
  });

  const handleDelete = (fileId: string) => {
    const updatedFiles = evidenceFiles.filter(file => file.id !== fileId);
    setEvidenceFiles(updatedFiles);
    localStorage.setItem('evidenceFiles', JSON.stringify(updatedFiles));
  };

  const handleView = (file: EvidenceFile) => {
    // Simulate file viewing (in real app, would open file viewer)
    alert(`Viewing: ${file.fileName}\nType: ${getEvidenceTypeLabel(file.evidenceType)}\nUploaded: ${format(new Date(file.uploadedAt), 'PPP')}`);
  };

  const handleDownload = (file: EvidenceFile) => {
    // Simulate file download
    const blob = new Blob([`Evidence File: ${file.fileName}\nDescription: ${file.description}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const groupedFiles = filteredFiles.reduce((acc, file) => {
    const type = getEvidenceTypeLabel(file.evidenceType);
    if (!acc[type]) acc[type] = [];
    acc[type].push(file);
    return acc;
  }, {} as { [key: string]: EvidenceFile[] });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-heading font-bold">Evidence Management</h3>
          <p className="text-muted-foreground">Manage uploaded compliance evidence and documentation</p>
        </div>
        <Badge variant="secondary">{evidenceFiles.length} files stored</Badge>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search files by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[200px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Evidence Types</SelectItem>
            <SelectItem value="temperature-log">Temperature Logs</SelectItem>
            <SelectItem value="training-certificate">Training Certificates</SelectItem>
            <SelectItem value="inspection-report">Inspection Reports</SelectItem>
            <SelectItem value="cleaning-record">Cleaning Records</SelectItem>
            <SelectItem value="incident-photo">Incident Photos</SelectItem>
            <SelectItem value="equipment-test">Equipment Tests</SelectItem>
            <SelectItem value="other">Other Evidence</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="File type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All File Types</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="application/pdf">PDFs</SelectItem>
            <SelectItem value="text">Text Files</SelectItem>
            <SelectItem value="application">Documents</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Evidence Files */}
      {filteredFiles.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-medium mb-2">No evidence files found</h4>
            <p className="text-muted-foreground mb-4">
              {evidenceFiles.length === 0 
                ? "Upload evidence files to get started with compliance documentation."
                : "No files match your current search or filter criteria."
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedFiles).map(([type, files]) => (
            <Card key={type}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{type}</span>
                  <Badge variant="secondary">{files.length} files</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {files.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3 flex-1">
                        {getFileIcon(file.fileType)}
                        <div className="flex-1">
                          <p className="font-medium">{file.fileName}</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{formatFileSize(file.fileSize)}</span>
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {format(new Date(file.uploadedAt), 'MMM d, yyyy')}
                            </span>
                            {file.location && <span>📍 {file.location}</span>}
                          </div>
                          {file.description && (
                            <p className="text-sm text-muted-foreground mt-1">{file.description}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(file)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(file)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(file.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EvidenceManager;