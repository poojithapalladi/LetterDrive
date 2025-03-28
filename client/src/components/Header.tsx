import React from "react";
import { Link } from "wouter";
// @ts-ignore
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import UserDropdown from "@/components/UserDropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onToggleSidebar?: () => void;
  onSaveToDrive?: () => void;
}

export default function Header({ onToggleSidebar, onSaveToDrive }: HeaderProps) {
  const { user, signOut } = useAuth();

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white border-b border-[#dadce0] h-14">
      <div className="flex items-center">
        {onToggleSidebar && (
          <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="mr-2">
            <Menu size={20} />
          </Button>
        )}
        
        <Link href="/">
          <a className="flex items-center space-x-2">
            <svg className="h-8 w-8 text-[#1a73e8]" viewBox="0 0 24 24">
              <path fill="currentColor" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M16,11V18.1L13.9,16L11.1,18.8L8.3,16L11.1,13.2L8.9,11L11.1,8.8L16,13.7V11H18.1L13.1,6L15.1,4L20.1,9L18.1,11H16Z" />
            </svg>
            <span className="font-medium text-lg text-[#202124] hidden md:inline">LetterDrive</span>
          </a>
        </Link>
      </div>
      
      <div className="flex items-center space-x-2">
        {user && onSaveToDrive && (
          <Button
            onClick={onSaveToDrive}
            className="hidden md:flex items-center bg-[#1a73e8] hover:bg-blue-600"
          >
            <span className="material-icons mr-1 text-sm">cloud_upload</span>
            Save to Drive
          </Button>
        )}
        
        {user ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger className="md:hidden">
                <Button variant="ghost" size="icon">
                  <span className="material-icons">more_vert</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onSaveToDrive && (
                  <DropdownMenuItem onClick={onSaveToDrive}>
                    <span className="material-icons mr-2 text-sm">cloud_upload</span>
                    Save to Drive
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => signOut()}>
                  <span className="material-icons mr-2 text-sm">logout</span>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <div className="hidden md:block">
              <UserDropdown user={user} />
            </div>
          </>
        ) : (
          <Link href="/login">
            <a>
              <Button size="sm" className="bg-[#1a73e8] hover:bg-blue-600">
                Sign In
              </Button>
            </a>
          </Link>
        )}
      </div>
    </header>
  );
}