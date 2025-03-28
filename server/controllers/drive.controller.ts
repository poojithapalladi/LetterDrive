import { Request, Response } from "express";
import { storage } from "../storage";
import { z } from "zod";

// Basic validation schema for Google Drive save request
const saveToDriveSchema = z.object({
  letterId: z.string().min(1, "Letter ID is required"),
  title: z.string().min(1, "Title is required"),
  content: z.string(),
  fileName: z.string().min(1, "File name is required"),
  convertToGoogleDocs: z.boolean().default(false)
});

// Save letter to Google Drive
export const saveToDrive = async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    // Validate request body
    const { letterId, title, content, fileName, convertToGoogleDocs } = saveToDriveSchema.parse(req.body);
    
    // Get the user to retrieve access token
    const user = await storage.getUser(userId);
    
    if (!user || !user.accessToken) {
      return res.status(400).json({ error: "User has no valid Google Drive access" });
    }
    
    // This is where we would call a Google Drive API service
    // For now, let's mock a successful response
    const mockResponse = {
      success: true,
      fileId: `file_${Math.floor(Math.random() * 1000000)}`,
      fileUrl: `https://docs.google.com/document/d/${Math.floor(Math.random() * 1000000)}`,
      message: "Letter saved to Google Drive successfully"
    };
    
    // Update the letter with Google Drive info
    if (parseInt(letterId)) {
      await storage.updateLetter(parseInt(letterId), {
        googleDriveId: mockResponse.fileId,
        googleDriveUrl: mockResponse.fileUrl
      });
    }
    
    return res.status(200).json(mockResponse);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    
    console.error("Save to Drive error:", error);
    return res.status(500).json({ error: "Failed to save to Google Drive" });
  }
};

// Get files from Google Drive
export const getFiles = async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    // Get the user to retrieve access token
    const user = await storage.getUser(userId);
    
    if (!user || !user.accessToken) {
      return res.status(400).json({ error: "User has no valid Google Drive access" });
    }
    
    // Here we would call a Google Drive API service to get files
    // For now, let's return the user's letters that have been saved to drive
    const letters = await storage.getLettersByUserId(userId);
    const driveLetters = letters.filter(letter => letter.googleDriveId);
    
    return res.status(200).json(driveLetters);
  } catch (error) {
    console.error("Get Drive files error:", error);
    return res.status(500).json({ error: "Failed to get Google Drive files" });
  }
};