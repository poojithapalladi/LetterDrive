import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  picture: text("picture"),
  googleId: text("google_id").notNull().unique(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
});

export const letters = pgTable("letters", {
  id: serial("id").primaryKey(),
  title: text("title").notNull().default("Untitled Letter"),
  content: text("content").notNull(),
  userId: integer("user_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  googleDriveId: text("google_drive_id"),
  googleDriveUrl: text("google_drive_url"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertLetterSchema = createInsertSchema(letters).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Create a simpler schema for letter update
export const updateLetterSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  googleDriveId: z.string().optional(),
  googleDriveUrl: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertLetter = z.infer<typeof insertLetterSchema>;
export type Letter = typeof letters.$inferSelect;
export type UpdateLetter = z.infer<typeof updateLetterSchema>;
