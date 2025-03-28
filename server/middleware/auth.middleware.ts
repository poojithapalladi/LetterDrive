import { Request, Response, NextFunction } from "express";
import session from "express-session";

// Extend express-session types
declare module "express-session" {
  interface Session {
    userId?: number;
  }
}

// Add custom properties to Express Request
declare global {
    namespace Express {
        interface Request {
            user: any; // Replace with your User type
        }
    }
}

// Middleware to check if user is authenticated
export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check if user ID exists in session
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized. Please login." });
  }
  
  // User is authenticated, proceed to next middleware
  next();
};