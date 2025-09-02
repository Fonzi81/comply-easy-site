import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  FileImage, 
  Upload, 
  Download, 
  Trash2, 
  Eye, 
  Grid3X3, 
  List,
  Filter,
  Plus
} from "lucide-react";

interface EvidenceItem {
  id: string;
  filename: string;
  taskTitle: string;
  dateUploaded: string;
  uploadedBy: string;
  fileType: 'image' | 'document' | 'video';
  fileSize: string;
  thumbnailUrl?: string;
}

const Evidence = () => {
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [filteredEvidence, setFilteredEvidence] = useState<EvidenceItem[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    // Sample evidence data
    const sampleEvidence: EvidenceItem[] = [
      {
        id: '1',
        filename: 'temperature_log_jan2024.pdf',
        taskTitle: 'Temperature Log Review',
        dateUploaded: '2024-01-10',
        uploadedBy: 'John Smith',
        fileType: 'document',
        fileSize: '2.3 MB'
      },
      {
        id: '2',
        filename: 'fire_extinguisher_photo.jpg',
        taskTitle: 'Fire Extinguisher Inspection',
        dateUploaded: '2024-01-09',
        uploadedBy: 'Sarah Johnson',
        fileType: 'image',
        fileSize: '1.8 MB',
        thumbnailUrl: 'https://via.placeholder.com/300x200?text=Fire+Extinguisher'
      },
      {
        id: '3',
        filename: 'safety_training_video.mp4',
        taskTitle: 'Staff Safety Training',
        dateUploaded: '2024-01-08',
        uploadedBy: 'Mike Wilson',
        fileType: 'video',
        fileSize: '45.2 MB'
      },
      {
        id: '4',
        filename: 'pat_testing_certificate.pdf',
        taskTitle: 'Equipment PAT Testing',
        dateUploaded: '2024-01-07',
        uploadedBy: 'Lisa Brown',
        fileType: 'document',
        fileSize: '0.8 MB'
      },
      {
        id: '5',
        filename: 'kitchen_inspection_photos.zip',
        taskTitle: 'Food Safety Audit',
        dateUploaded: '2024-01-06',
        uploadedBy: 'John Smith',
        fileType: 'document',
        fileSize: '12.4 MB'
      }
    ];
    setEvidence(sampleEvidence);
    setFilteredEvidence(sampleEvidence);
  }, []);

  useEffect(() => {
    let filtered = evidence;

    if (typeFilter !== "all") {
      filtered = filtered.filter(item => item.fileType === typeFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.taskTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredEvidence(filtered);
  }, [evidence, typeFilter, searchQuery]);

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return '🖼️';
      case 'document':
        return '📄';
      case 'video':
        return '🎥';
      default:
        return '📎';
    }
  };

  const getFileTypeColor = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return 'bg-blue-100 text-blue-800';
      case 'document':
        return 'bg-green-100 text-green-800';
      case 'video':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = (id: string) => {
    setEvidence(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Evidence Storage</h1>
          <p className="text-muted-foreground">
            Manage uploaded compliance evidence and documentation
          </p>
        </div>
        <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Upload Evidence
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Evidence</DialogTitle>
              <DialogDescription>
                Drag and drop files or click to browse
              </DialogDescription>
            </DialogHeader>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                Drop files here or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supports: PDF, DOC, JPG, PNG, MP4 (Max 50MB)
              </p>
              <Button variant="outline" className="mt-4">
                <Upload className="w-4 h-4 mr-2" />
                Choose Files
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filters & View</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Search</label>
              <Input
                placeholder="Search evidence..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48">
              <label className="text-sm font-medium mb-2 block">File Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                  <SelectItem value="document">Documents</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evidence Display */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Evidence Items</CardTitle>
            <p className="text-sm text-muted-foreground">
              {filteredEvidence.length} items found
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredEvidence.map((item) => (
                <Card key={item.id} className="hover-lift cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                      {item.thumbnailUrl ? (
                        <img 
                          src={item.thumbnailUrl} 
                          alt={item.filename}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-4xl">
                          {getFileIcon(item.fileType)}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <p className="font-medium text-sm truncate" title={item.filename}>
                        {item.filename}
                      </p>
                      <p className="text-xs text-muted-foreground truncate" title={item.taskTitle}>
                        {item.taskTitle}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className={getFileTypeColor(item.fileType)}>
                          {item.fileType}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {item.fileSize}
                        </span>
                      </div>
                      
                      <p className="text-xs text-muted-foreground">
                        By {item.uploadedBy} • {item.dateUploaded}
                      </p>

                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Download className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredEvidence.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="text-2xl">
                    {getFileIcon(item.fileType)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.filename}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {item.taskTitle}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <Badge variant="outline" className={getFileTypeColor(item.fileType)}>
                      {item.fileType}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.fileSize}
                    </p>
                  </div>
                  
                  <div className="text-right min-w-0">
                    <p className="text-sm font-medium">{item.uploadedBy}</p>
                    <p className="text-xs text-muted-foreground">{item.dateUploaded}</p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {filteredEvidence.length === 0 && (
            <div className="text-center py-12">
              <FileImage className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-lg font-medium mb-2">No evidence found</p>
              <p className="text-muted-foreground mb-4">
                {searchQuery || typeFilter !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "Upload your first evidence file to get started"
                }
              </p>
              {!searchQuery && typeFilter === "all" && (
                <Button onClick={() => setIsUploadModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Upload First Evidence
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Evidence;