import { users, letters, type User, type InsertUser, type Letter, type InsertLetter, type UpdateLetter } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserTokens(userId: number, accessToken: string, refreshToken?: string): Promise<void>;
  
  // Letter methods
  getLetter(id: number): Promise<Letter | undefined>;
  getLettersByUserId(userId: number): Promise<Letter[]>;
  createLetter(letter: InsertLetter): Promise<Letter>;
  updateLetter(id: number, updateData: UpdateLetter): Promise<Letter>;
  deleteLetter(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private letters: Map<number, Letter>;
  currentUserId: number;
  currentLetterId: number;

  constructor() {
    this.users = new Map();
    this.letters = new Map();
    this.currentUserId = 1;
    this.currentLetterId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }
  
  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.googleId === googleId,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      picture: insertUser.picture || null,
      accessToken: insertUser.accessToken || null,
      refreshToken: insertUser.refreshToken || null
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUserTokens(userId: number, accessToken: string, refreshToken?: string): Promise<void> {
    const user = await this.getUser(userId);
    if (user) {
      user.accessToken = accessToken;
      if (refreshToken) {
        user.refreshToken = refreshToken;
      }
      this.users.set(userId, user);
    }
  }
  
  // Letter methods
  async getLetter(id: number): Promise<Letter | undefined> {
    return this.letters.get(id);
  }
  
  async getLettersByUserId(userId: number): Promise<Letter[]> {
    return Array.from(this.letters.values()).filter(
      (letter) => letter.userId === userId,
    );
  }
  
  async createLetter(insertLetter: InsertLetter): Promise<Letter> {
    const id = this.currentLetterId++;
    const letter: Letter = {
      ...insertLetter,
      id,
      title: insertLetter.title || "Untitled Letter",
      createdAt: new Date(),
      updatedAt: new Date(),
      googleDriveId: null,
      googleDriveUrl: null
    };
    this.letters.set(id, letter);
    return letter;
  }
  
  async updateLetter(id: number, updateData: UpdateLetter): Promise<Letter> {
    const existingLetter = await this.getLetter(id);
    if (!existingLetter) {
      throw new Error(`Letter with ID ${id} not found`);
    }
    
    const updatedLetter: Letter = {
      ...existingLetter,
      ...updateData,
      updatedAt: new Date()
    };
    
    this.letters.set(id, updatedLetter);
    return updatedLetter;
  }
  
  async deleteLetter(id: number): Promise<void> {
    this.letters.delete(id);
  }
}

export const storage = new MemStorage();
