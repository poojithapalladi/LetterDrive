import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

interface SaveToDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  letterId: string;
  title: string;
  content: string;
  onSuccess: (message: string) => void;
}

export default function SaveToDriveModal({
  isOpen,
  onClose,
  letterId,
  title,
  content,
  onSuccess,
}: SaveToDriveModalProps) {
  const [fileName, setFileName] = useState(title || "My Letter");
  const [convertToGoogleDocs, setConvertToGoogleDocs] = useState(true);

  // Save to Drive mutation
  const saveToDriveMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/drive/save", {
        letterId,
        title,
        content,
        fileName,
        convertToGoogleDocs,
      });
    },
    onSuccess: async (response) => {
      const data = await response.json();
      onSuccess(data.message || "Letter saved to Google Drive successfully");
      onClose();
    },
    onError: (error) => {
      console.error("Failed to save to Google Drive:", error);
      // We could show an error message here
    },
  });

  const handleSave = async () => {
    if (!fileName.trim()) {
      // Show error or set default filename
      setFileName(title || "My Letter");
      return;
    }
    
    saveToDriveMutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save to Google Drive</DialogTitle>
          <DialogDescription>
            Save your letter to your Google Drive account for easy access and sharing.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="filename">File name</Label>
            <Input
              id="filename"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Enter file name"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="convert"
              checked={convertToGoogleDocs}
              onCheckedChange={setConvertToGoogleDocs}
            />
            <Label htmlFor="convert">Convert to Google Docs format</Label>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saveToDriveMutation.isPending}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={saveToDriveMutation.isPending}
            className="bg-[#1a73e8] hover:bg-blue-600"
          >
            {saveToDriveMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <span className="material-icons mr-2 text-sm">cloud_upload</span>
                Save to Drive
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}