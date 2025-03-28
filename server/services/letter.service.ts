import { storage } from "../storage";
import type { InsertLetter, Letter, UpdateLetter } from "@shared/schema";

export const createLetter = async (letterData: InsertLetter): Promise<Letter> => {
  try {
    return await storage.createLetter(letterData);
  } catch (error) {
    console.error("Error creating letter:", error);
    throw error;
  }
};

export const updateLetter = async (
  id: number,
  updateData: UpdateLetter
): Promise<Letter> => {
  try {
    return await storage.updateLetter(id, updateData);
  } catch (error) {
    console.error("Error updating letter:", error);
    throw error;
  }
};

export const getLetter = async (id: number): Promise<Letter | undefined> => {
  try {
    return await storage.getLetter(id);
  } catch (error) {
    console.error("Error getting letter:", error);
    throw error;
  }
};

export const getLettersByUserId = async (userId: number): Promise<Letter[]> => {
  try {
    return await storage.getLettersByUserId(userId);
  } catch (error) {
    console.error("Error getting letters by user ID:", error);
    throw error;
  }
};

export const deleteLetter = async (id: number): Promise<void> => {
  try {
    await storage.deleteLetter(id);
  } catch (error) {
    console.error("Error deleting letter:", error);
    throw error;
  }
};
