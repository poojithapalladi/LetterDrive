import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useAuth } from "@/components/AuthProvider";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import TextEditor from "@/components/TextEditor";
import SaveToDriveModal from "@/components/SaveToDriveModal";
import Toast from "@/components/Toast";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import type { Letter } from "@shared/schema";

export default function Editor() {
  const { id } = useParams<{ id?: string }>();
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [letter, setLetter] = useState<Letter | null>(null);
  const [title, setTitle] = useState("Untitled Letter");
  const [content, setContent] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      setLocation("/login");
    }
  }, [user, loading, setLocation]);

  // Fetch letter if id is provided
  const { isLoading: isLetterLoading } = useQuery({
    queryKey: ['/api/letters', id],
    enabled: !!id && !!user,
    onSuccess: (data: Letter) => {
      setLetter(data);
      setTitle(data.title);
      setContent(data.content);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to load letter: ${error}`,
        variant: "destructive",
      });
    }
  });

  // Save draft mutation
  const saveDraftMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title,
        content,
        userId: user?.id
      };
      
      if (id) {
        return apiRequest('PATCH', `/api/letters/${id}`, payload);
      } else {
        return apiRequest('POST', '/api/letters', payload);
      }
    },
    onSuccess: async (response) => {
      const data = await response.json();
      
      if (!id) {
        // If this was a new letter, update the URL
        setLocation(`/editor/${data.id}`);
      }
      
      queryClient.invalidateQueries({ queryKey: ['/api/letters'] });
      
      displayToast("Draft saved successfully");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to save draft: ${error}`,
        variant: "destructive",
      });
    }
  });

  const handleSaveToDrive = () => {
    setShowSaveModal(true);
  };

  const handleSaveDraft = () => {
    saveDraftMutation.mutate();
  };

  const handleDiscard = () => {
    if (confirm("Are you sure you want to discard this letter?")) {
      setLocation("/");
    }
  };

  const displayToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (loading || isLetterLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <Header 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onSaveToDrive={handleSaveToDrive}
      />
      
      <main className="flex-grow flex">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onNewLetter={() => setLocation('/editor')}
        />
        
        <div className="flex-grow p-4 md:p-6 flex flex-col">
          <div className="flex-grow flex flex-col">
            <div className="mb-4">
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Untitled Letter" 
                className="w-full text-2xl font-medium border-b border-[#dadce0] pb-2 focus:outline-none focus:border-[#1a73e8] bg-transparent"
              />
            </div>
            
            <TextEditor 
              content={content} 
              onChange={setContent} 
            />
            
            <div className="flex justify-between mt-4">
              <div>
                <Button
                  variant="outline"
                  onClick={handleDiscard}
                  className="border-[#dadce0] text-[#5f6368] hover:bg-[#f8f9fa]"
                >
                  <span className="material-icons mr-1 text-sm">delete</span>
                  Discard
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  className="ml-2 border-[#dadce0] text-[#5f6368] hover:bg-[#f8f9fa]"
                  disabled={saveDraftMutation.isPending}
                >
                  <span className="material-icons mr-1 text-sm">save</span>
                  Save Draft
                </Button>
              </div>
              <div>
                <Button
                  variant="outline"
                  onClick={() => window.print()}
                  className="border-[#dadce0] text-[#5f6368] hover:bg-[#f8f9fa]"
                >
                  <span className="material-icons mr-1 text-sm">print</span>
                  Print
                </Button>
                <Button
                  onClick={handleSaveToDrive}
                  className="ml-2 bg-[#1a73e8] hover:bg-blue-600"
                >
                  <span className="material-icons mr-1 text-sm">cloud_upload</span>
                  Save to Drive
                </Button>
              </div>
            </div>
            
            {letter?.updatedAt && (
              <div className="text-xs text-[#5f6368] mt-2 text-right">
                Last saved: {new Date(letter.updatedAt).toLocaleString()}
              </div>
            )}
          </div>
        </div>
      </main>
      
      {showSaveModal && (
        <SaveToDriveModal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          letterId={id || ""}
          title={title}
          content={content}
          onSuccess={(message) => {
            displayToast(message);
            queryClient.invalidateQueries({ queryKey: ['/api/letters'] });
          }}
        />
      )}
      
      <Toast 
        isVisible={showToast}
        message={toastMessage}
      />
    </div>
  );
}
