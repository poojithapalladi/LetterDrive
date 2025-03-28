import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/components/AuthProvider";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && user) {
      // Redirect authenticated users to the editor
      setLocation("/editor");
    }
  }, [user, loading, setLocation]);

  const handleSignIn = () => {
    setLocation("/login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <Header />
      
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <Card className="max-w-2xl w-full shadow-sm">
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center">
              <svg className="h-24 w-24 text-[#1a73e8] mb-6" viewBox="0 0 24 24">
                <path fill="currentColor" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M16,11V18.1L13.9,16L11.1,18.8L8.3,16L11.1,13.2L8.9,11L11.1,8.8L16,13.7V11H18.1L13.1,6L15.1,4L20.1,9L18.1,11H16Z" />
              </svg>
              
              <h1 className="text-3xl font-medium mb-2 text-[#202124]">Welcome to LetterDrive</h1>
              <p className="text-lg text-[#5f6368] max-w-md mx-auto mb-8">
                Create, edit, and save letters directly to your Google Drive with ease.
              </p>
              
              <Button 
                className="flex items-center justify-center text-lg bg-[#1a73e8] hover:bg-blue-600 text-white px-8 py-6 h-auto"
                onClick={handleSignIn}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12.545 12.151L12.542 12.147L12.547 12.151M12.545 12.151C12.752 11.998 13.01 11.92 13.272 11.92C13.398 11.92 13.524 11.943 13.642 11.988L18.95 9.868C18.395 8.477 17.368 7.35 16.088 6.639C14.782 5.913 13.267 5.651 11.786 5.893C10.304 6.135 8.94 6.865 7.915 7.965C6.891 9.064 6.26 10.471 6.112 11.969C5.964 13.466 6.308 14.967 7.091 16.237C7.874 17.507 9.052 18.475 10.441 19.005C11.829 19.535 13.354 19.6 14.785 19.191C16.216 18.782 17.48 17.921 18.394 16.733L14.125 14.525C13.61 15.102 12.88 15.407 12.129 15.382C11.457 15.36 10.818 15.098 10.335 14.646C9.852 14.193 9.556 13.579 9.503 12.91C9.462 12.421 9.555 11.93 9.771 11.487C9.987 11.043 10.319 10.666 10.732 10.393C11.145 10.12 11.624 9.96 12.116 9.929C12.608 9.897 13.102 9.996 13.547 10.215L12.545 12.151Z" />
                  <path fill="currentColor" d="M21.435 11.981C21.436 12.304 21.414 12.627 21.37 12.946L21.37 12.948L21.369 12.957C21.27 13.582 21.072 14.187 20.782 14.751L20.781 14.753C20.556 15.167 20.294 15.56 19.995 15.929L19.994 15.93L19.981 15.947L19.939 16.001L16.241 14.037L16.238 14.04C16.983 13.213 17.38 12.143 17.38 10.96C17.38 9.984 17.117 9.08 16.651 8.314L16.648 8.309L21.318 6.48L21.319 6.482C21.39 6.648 21.435 6.823 21.435 7V11.981Z" />
                  <path fill="currentColor" d="M6.35 14.17C6.214 13.777 6.146 13.372 6.146 12.96C6.146 11.681 6.736 10.532 7.646 9.797L7.648 9.795L7.66 9.785L7.679 9.77L2.855 7.858C2.676 7.783 2.52 7.672 2.394 7.536C2.289 7.742 2.198 7.957 2.122 8.18L2.121 8.182C1.828 9.14 1.68 10.144 1.68 11.163C1.68 12.25 1.849 13.311 2.173 14.318C2.327 14.782 2.522 15.231 2.751 15.661L2.752 15.662L6.35 14.17Z" />
                  <path fill="currentColor" d="M11.92 21.436C8.271 21.436 5.119 19.344 3.565 16.262L7.167 14.638C7.93 16.47 9.799 17.765 11.92 17.765C12.888 17.765 13.789 17.54 14.55 17.131L17.954 19.363C16.16 20.739 14.091 21.436 11.92 21.436Z" />
                  <path fill="currentColor" d="M21.304 6.102L16.651 8.313C15.783 7.007 14.399 6.126 12.828 6.01C10.761 5.856 8.814 6.945 7.896 8.77L3.092 6.858C4.76 3.59 8.035 1.406 11.81 1.557C13.414 1.62 14.973 2.027 16.372 2.748C18.121 3.639 19.608 4.927 20.703 6.501C20.733 6.545 20.762 6.589 20.79 6.634C20.966 6.905 21.128 7.183 21.28 7.465L21.304 6.102Z" />
                </svg>
                Sign in with Google
              </Button>
              
              <div className="mt-10 text-[#5f6368]">
                <p className="text-sm">Create professional letters in minutes and save them directly to your Google Drive</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
