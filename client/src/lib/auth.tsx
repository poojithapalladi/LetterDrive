import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { signInWithRedirect, getRedirectResult, GoogleAuthProvider, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "./firebase";
import { apiRequest } from "./queryClient";
import type { User } from "@shared/schema";

// Define the auth context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component to wrap the app
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check if the user is already authenticated
        const response = await apiRequest('GET', '/api/auth/me');
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        // Not authenticated, and that's okay
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Check if we're coming back from a redirect
    getRedirectResult(auth)
      .then(async (result) => {
        if (result) {
          // User signed in via redirect
          const idToken = await result.user.getIdToken();
          
          // Send user data to backend to create/update user
          const response = await apiRequest('POST', '/api/auth/login', { 
            user: {
              uid: result.user.uid,
              email: result.user.email,
              displayName: result.user.displayName,
              photoURL: result.user.photoURL
            }
          });
          const userData = await response.json();
          setUser(userData);
        }
        
        // Continue with normal auth check
        return checkAuthStatus();
      })
      .catch((error) => {
        console.error("Redirect error:", error);
        setError("Authentication failed");
        setLoading(false);
      });
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const provider = new GoogleAuthProvider();
      // Add scopes for Google Drive API
      provider.addScope('https://www.googleapis.com/auth/drive.file');
      provider.addScope('https://www.googleapis.com/auth/drive.appdata');
      
      await signInWithRedirect(auth, provider);
      // The page will redirect, and we'll handle the result in the useEffect
    } catch (error) {
      console.error("Sign in error:", error);
      setError("Failed to sign in with Google");
      setLoading(false);
    }
  };

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

// Hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
