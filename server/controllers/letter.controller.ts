import { Request, Response } from "express";
import { storage } from "../storage";
import { insertLetterSchema, updateLetterSchema } from "@shared/schema";
import { z } from "zod";

// Get all letters for authenticated user
export const getLetters = async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    const letters = await storage.getLettersByUserId(userId);
    return res.status(200).json(letters);
  } catch (error) {
    console.error("Get letters error:", error);
    return res.status(500).json({ error: "Failed to get letters" });
  }
};

// Get a single letter by ID
export const getLetter = async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    const letterId = parseInt(req.params.id);
    
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    if (isNaN(letterId)) {
      return res.status(400).json({ error: "Invalid letter ID" });
    }
    
    const letter = await storage.getLetter(letterId);
    
    if (!letter) {
      return res.status(404).json({ error: "Letter not found" });
    }
    
    // Check if letter belongs to authenticated user
    if (letter.userId !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }
    
    return res.status(200).json(letter);
  } catch (error) {
    console.error("Get letter error:", error);
    return res.status(500).json({ error: "Failed to get letter" });
  }
};

// Create a new letter
export const createLetter = async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    // Validate request body
    const letterData = insertLetterSchema.parse({
      ...req.body,
      userId
    });
    
    const letter = await storage.createLetter(letterData);
    return res.status(201).json(letter);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    
    console.error("Create letter error:", error);
    return res.status(500).json({ error: "Failed to create letter" });
  }
};

// Update an existing letter
export const updateLetter = async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    const letterId = parseInt(req.params.id);
    
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    if (isNaN(letterId)) {
      return res.status(400).json({ error: "Invalid letter ID" });
    }
    
    // Check if letter exists and belongs to user
    const existingLetter = await storage.getLetter(letterId);
    
    if (!existingLetter) {
      return res.status(404).json({ error: "Letter not found" });
    }
    
    if (existingLetter.userId !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }
    
    // Validate request body
    const updateData = updateLetterSchema.parse(req.body);
    
    const updatedLetter = await storage.updateLetter(letterId, updateData);
    return res.status(200).json(updatedLetter);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    
    console.error("Update letter error:", error);
    return res.status(500).json({ error: "Failed to update letter" });
  }
};

// Delete a letter
export const deleteLetter = async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    const letterId = parseInt(req.params.id);
    
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    if (isNaN(letterId)) {
      return res.status(400).json({ error: "Invalid letter ID" });
    }
    
    // Check if letter exists and belongs to user
    const existingLetter = await storage.getLetter(letterId);
    
    if (!existingLetter) {
      return res.status(404).json({ error: "Letter not found" });
    }
    
    if (existingLetter.userId !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }
    
    await storage.deleteLetter(letterId);
    return res.status(204).send();
  } catch (error) {
    console.error("Delete letter error:", error);
    return res.status(500).json({ error: "Failed to delete letter" });
  }
};