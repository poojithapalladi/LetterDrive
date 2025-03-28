import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
// @ts-ignore
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Letter } from "@shared/schema";

interface SidebarProps {
  isOpen: boolean;
  onNewLetter: () => void;
}

interface LetterItemProps {
  letter: Letter;
  isActive: boolean;
  onClick: () => void;
}

function LetterItem({ letter, isActive, onClick }: LetterItemProps) {
  const date = new Date(letter.updatedAt);
  const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  })}`;
  
  return (
    <div
      className={`p-3 mb-1 rounded cursor-pointer hover:bg-[#f1f3f4] transition-colors ${
        isActive ? "bg-[#e8f0fe] text-[#1a73e8]" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="font-medium truncate pr-2">{letter.title}</div>
        {letter.googleDriveId && (
          <span className="material-icons text-[#34a853] text-sm">cloud_done</span>
        )}
      </div>
      <div className="text-xs text-[#5f6368] mt-1">{formattedDate}</div>
    </div>
  );
}

export default function Sidebar({ isOpen, onNewLetter }: SidebarProps) {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const [filter, setFilter] = useState<"all" | "drive">("all");

  // Get current letter ID from URL
  const currentLetterId = location.startsWith('/editor/') 
    ? parseInt(location.split('/editor/')[1]) 
    : null;

  // Fetch letters
  const { data: letters, isLoading } = useQuery<Letter[]>({
    queryKey: ['/api/letters'],
    enabled: !!user,
  });

  const recentLetters = letters?.filter((letter: Letter) => !letter.googleDriveId) || [];
  const driveLetters = letters?.filter((letter: Letter) => letter.googleDriveId) || [];
  
  // Filter letters based on selected filter
  const filteredLetters = filter === "all" 
    ? letters || [] 
    : driveLetters;

  if (!isOpen) {
    return null;
  }

  return (
    <aside className="w-64 border-r border-[#dadce0] bg-white p-3 h-full overflow-y-auto">
      <div className="mb-4">
        <Button
          className="w-full bg-[#1a73e8] hover:bg-blue-600"
          onClick={onNewLetter}
        >
          <span className="material-icons mr-2 text-sm">add</span>
          New Letter
        </Button>
        
        <div className="flex mt-4 bg-[#f1f3f4] rounded overflow-hidden">
          <button
            className={`flex-1 py-2 text-sm ${
              filter === "all" ? "bg-white shadow-sm" : ""
            }`}
            onClick={() => setFilter("all")}
          >
            Recent
          </button>
          <button
            className={`flex-1 py-2 text-sm ${
              filter === "drive" ? "bg-white shadow-sm" : ""
            }`}
            onClick={() => setFilter("drive")}
          >
            Drive
          </button>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-sm text-[#5f6368] mb-2">
          {filter === "all" ? "My Letters" : "Drive Letters"}
        </h3>
        
        {isLoading ? (
          // Loading skeleton
          <>
            <Skeleton className="h-14 w-full mb-2" />
            <Skeleton className="h-14 w-full mb-2" />
            <Skeleton className="h-14 w-full mb-2" />
          </>
        ) : filteredLetters.length > 0 ? (
          // Letter list
          filteredLetters.map((letter: Letter) => (
            <LetterItem
              key={letter.id}
              letter={letter}
              isActive={letter.id === currentLetterId}
              onClick={() => setLocation(`/editor/${letter.id}`)}
            />
          ))
        ) : (
          // Empty state
          <div className="text-center py-6 text-[#5f6368]">
            <span className="material-icons text-3xl mb-2">
              {filter === "all" ? "description" : "cloud_upload"}
            </span>
            <p className="text-sm">
              {filter === "all"
                ? "No letters found. Create one to get started!"
                : "No letters saved to Drive yet"}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}