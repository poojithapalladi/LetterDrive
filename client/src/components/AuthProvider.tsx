import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut as firebaseSignOut, User as FirebaseUser, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { User } from "@shared/schema";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Check if user is already authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          await handleFirebaseUser(firebaseUser);
        } catch (err) {
          setError("Failed to authenticate with server");
          console.error("Authentication error:", err);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle Firebase user authentication with backend
  const handleFirebaseUser = async (firebaseUser: FirebaseUser) => {
    try {
      // Send Firebase user to backend for authentication/registration
      const response = await apiRequest("POST", "/api/login", { user: firebaseUser });
      
      if (!response.ok) {
        throw new Error("Failed to authenticate with server");
      }
      
      const userData = await response.json();
      setUser(userData);
      setError(null);
    } catch (err) {
      console.error("Server authentication error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      if (result.user) {
        await handleFirebaseUser(result.user);
        toast({
          title: "Signed in successfully",
          description: `Welcome, ${result.user.displayName || result.user.email}!`,
        });
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google");
      toast({
        title: "Sign in failed",
        description: err.message || "An error occurred during sign in",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      // Sign out from Firebase
      await firebaseSignOut(auth);
      
      // Sign out from backend
      await apiRequest("POST", "/api/logout");
      
      setUser(null);
      toast({
        title: "Signed out successfully",
      });
    } catch (err: any) {
      setError(err.message || "Failed to sign out");
      toast({
        title: "Sign out failed",
        description: err.message || "An error occurred during sign out",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
}