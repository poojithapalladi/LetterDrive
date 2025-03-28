import { createContext, useContext, useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "./firebase";
import { apiRequest } from "./queryClient";
import type { User } from "@shared/schema";

// Create a context for authentication
const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}>({
  user: null,
  loading: true,
  error: null,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check auth state on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await getRedirectResult(auth);
        
        if (result) {
          // User signed in via redirect
          const currentUser = {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL
          };
          
          // Send to backend
          const response = await apiRequest('POST', '/api/auth/login', { user: currentUser });
          const userData = await response.json();
          setUser(userData);
        } else {
          // Check if already logged in
          try {
            const response = await apiRequest('GET', '/api/auth/me');
            const userData = await response.json();
            setUser(userData);
          } catch {
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Auth error:", error);
        setError("Authentication failed");
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Sign in with Google
  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/drive.file');
      provider.addScope('https://www.googleapis.com/auth/drive.appdata');
      
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("Sign in error:", error);
      setError("Failed to sign in with Google");
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      await apiRequest('POST', '/api/auth/logout');
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
      setError("Failed to sign out");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
