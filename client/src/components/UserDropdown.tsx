// @ts-ignore
import { useAuth } from "@/components/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@shared/schema";

interface UserDropdownProps {
  user: User;
}

export default function UserDropdown({ user }: UserDropdownProps) {
  const { signOut } = useAuth();
  
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-1 rounded-full hover:bg-[#f1f3f4] p-1 transition-colors">
          <Avatar className="h-8 w-8 cursor-pointer">
            {user.picture ? (
              <AvatarImage src={user.picture} alt={user.name} />
            ) : (
              <AvatarFallback className="bg-[#1a73e8] text-white">
                {getInitials(user.name)}
              </AvatarFallback>
            )}
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center justify-start p-2">
          <Avatar className="h-10 w-10 mr-2">
            {user.picture ? (
              <AvatarImage src={user.picture} alt={user.name} />
            ) : (
              <AvatarFallback className="bg-[#1a73e8] text-white">
                {getInitials(user.name)}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-[#5f6368] truncate">
              {user.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer flex items-center"
          onClick={() => signOut()}
        >
          <span className="material-icons mr-2 text-sm">logout</span>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}