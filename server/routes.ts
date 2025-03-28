import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import session from "express-session";
import { storage } from "./storage";
import { isAuthenticated } from "./middleware/auth.middleware";
import * as authController from "./controllers/auth.controller";
import * as letterController from "./controllers/letter.controller";
import * as driveController from "./controllers/drive.controller";

export async function registerRoutes(app: Express): Promise<Server> {
  // Sessions middleware for storing user sessions
  app.use(session({
    secret: process.env.SESSION_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
  }));

  // API routes
  // Auth routes
  app.post("/api/login", authController.login);
  app.post("/api/logout", authController.logout);
  app.get("/api/user", isAuthenticated, authController.getCurrentUser);

  // Letter routes
  app.get("/api/letters", isAuthenticated, letterController.getLetters);
  app.get("/api/letters/:id", isAuthenticated, letterController.getLetter);
  app.post("/api/letters", isAuthenticated, letterController.createLetter);
  app.patch("/api/letters/:id", isAuthenticated, letterController.updateLetter);
  app.delete("/api/letters/:id", isAuthenticated, letterController.deleteLetter);

  // Google Drive routes
  app.post("/api/drive/save", isAuthenticated, driveController.saveToDrive);
  app.get("/api/drive/files", isAuthenticated, driveController.getFiles);

  const httpServer = createServer(app);

  return httpServer;
}
