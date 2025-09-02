import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  FileText, 
  Image, 
  File, 
  X, 
  CheckCircle,
  Camera,
  Paperclip
} from "lucide-react";

interface EvidenceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId?: string;
  onUploadComplete?: (files: any[]) => void;
}

const EvidenceModal = ({ open, onOpenChange, taskId, onUploadComplete }: EvidenceModalProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [evidenceType, setEvidenceType] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const allowedFileTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 'text/plain', 'text/csv',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const evidenceTypes = [
    { value: "temperature-log", label: "Temperature Log" },
    { value: "training-certificate", label: "Training Certificate" },
    { value: "inspection-report", label: "Inspection Report" },
    { value: "cleaning-record", label: "Cleaning Record" },
    { value: "incident-photo", label: "Incident Photo" },
    { value: "equipment-test", label: "Equipment Test Result" },
    { value: "safety-document", label: "Safety Document" },
    { value: "compliance-form", label: "Compliance Form" },
    { value: "other", label: "Other Evidence" }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      if (!allowedFileTypes.includes(file.type)) {
        alert(`File type not supported: ${file.name}`);
        return false;
      }
      if (file.size > maxFileSize) {
        alert(`File too large: ${file.name} (max 10MB)`);
        return false;
      }
      return true;
    });

    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-4 h-4 text-blue-500" />;
    if (file.type === 'application/pdf') return <FileText className="w-4 h-4 text-red-500" />;
    return <File className="w-4 h-4 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = async () => {
    if (uploadedFiles.length === 0 || !evidenceType) return;
    
    setUploading(true);
    setUploadProgress(0);

    // Simulate file upload
    for (let i = 0; i < uploadedFiles.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUploadProgress(((i + 1) / uploadedFiles.length) * 100);
    }

    // Store evidence in localStorage
    const evidenceRecords = uploadedFiles.map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      taskId: taskId || 'general',
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      evidenceType,
      description,
      location,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'andrew'
    }));

    const existingEvidence = JSON.parse(localStorage.getItem('evidenceFiles') || '[]');
    localStorage.setItem('evidenceFiles', JSON.stringify([...existingEvidence, ...evidenceRecords]));

    if (onUploadComplete) {
      onUploadComplete(evidenceRecords);
    }

    setUploading(false);
    setUploadedFiles([]);
    setEvidenceType("");
    setDescription("");
    setLocation("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-primary" />
            <span>Upload Evidence Files</span>
          </DialogTitle>
          <DialogDescription>
            Upload documents, photos, and records as evidence for compliance activities.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Evidence Type & Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Evidence Type *</Label>
              <Select value={evidenceType} onValueChange={setEvidenceType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select evidence type" />
                </SelectTrigger>
                <SelectContent>
                  {evidenceTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Location/Site</Label>
              <Input
                placeholder="e.g., Kitchen, Office, Building A"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Describe what this evidence demonstrates or any relevant details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="flex justify-center space-x-4">
                <Upload className="w-10 h-10 text-muted-foreground" />
                <Camera className="w-10 h-10 text-muted-foreground" />
                <Paperclip className="w-10 h-10 text-muted-foreground" />
              </div>
              
              <div>
                <p className="text-lg font-medium">Drop files here or click to upload</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Supports: Images, PDFs, Word docs, Excel files (max 10MB each)
                </p>
              </div>
              
              <input
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.txt,.csv,.xls,.xlsx,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button type="button" variant="outline" className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Files
                </Button>
              </label>
            </div>
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Selected Files</h4>
                    <Badge variant="secondary">{uploadedFiles.length} files</Badge>
                  </div>
                  
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center space-x-3">
                          {getFileIcon(file)}
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upload Progress */}
          {uploading && (
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Uploading files...</span>
                    <span className="text-sm text-muted-foreground">{Math.round(uploadProgress)}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={uploading}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={uploadedFiles.length === 0 || !evidenceType || uploading}
          >
            {uploading ? (
              <>Uploading...</>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Upload Evidence
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EvidenceModal;