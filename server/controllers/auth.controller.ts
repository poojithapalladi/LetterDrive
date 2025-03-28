import { Request, Response } from "express";
import { storage } from "../storage";
import session from "express-session";

// Extend express-session types
declare module "express-session" {
  interface Session {
    userId?: number;
  }
}

// Login or register a user via Google Auth
export const login = async (req: Request, res: Response) => {
  try {
    const { user } = req.body;
    
    if (!user || !user.uid || !user.email) {
      return res.status(400).json({ error: "Invalid user data" });
    }
    
    // Check if user exists
    let existingUser = await storage.getUserByGoogleId(user.uid);
    
    if (existingUser) {
      // User exists, update their session
      req.session.userId = existingUser.id;
      return res.status(200).json(existingUser);
    } else {
      // Create new user
      const newUser = await storage.createUser({
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        googleId: user.uid,
        picture: user.photoURL || null,
        accessToken: null,
        refreshToken: null
      });
      
      // Save user ID to session
      req.session.userId = newUser.id;
      return res.status(201).json(newUser);
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Login failed" });
  }
};

// Logout user
export const logout = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ error: "Logout failed" });
    }
    
    res.clearCookie("connect.sid");
    return res.status(200).json({ message: "Logged out successfully" });
  });
};

// Get current authenticated user
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    return res.status(200).json(user);
  } catch (error) {
    console.error("Get current user error:", error);
    return res.status(500).json({ error: "Failed to get current user" });
  }
};