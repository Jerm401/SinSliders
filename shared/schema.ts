import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Existing user schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Game related types
export enum GameStage {
  INITIAL = "INITIAL",
  ORDER_AND_REVEAL = "ORDER_AND_REVEAL",
  TOKEN_AWARDS = "TOKEN_AWARDS",
  BLESSING_CURSE = "BLESSING_CURSE",
}

export interface Card {
  id: string;
  frontImage: string;
  title: string;
  description: string;
  isRevealed: boolean;
  hasMercyToken?: boolean;
  hasMortalSinToken?: boolean;
  hasBlessing?: boolean;
  hasCurse?: boolean;
}

export interface GameState {
  stage: GameStage;
  cards: Card[];
  canShuffle: boolean;
  canProceed: boolean;
}

export const gameStageLabels: Record<GameStage, string> = {
  [GameStage.INITIAL]: "Place your cards",
  [GameStage.ORDER_AND_REVEAL]: "Order and reveal your sins",
  [GameStage.TOKEN_AWARDS]: "Receive judgment",
  [GameStage.BLESSING_CURSE]: "Final verdict",
};