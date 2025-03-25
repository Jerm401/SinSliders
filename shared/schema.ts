import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Order status enum
export const OrderStatus = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export type OrderStatusType = typeof OrderStatus[keyof typeof OrderStatus];

// Orders table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerAddress: text("customer_address").notNull(),
  customerCity: text("customer_city").notNull(),
  customerState: text("customer_state").notNull(),
  customerZip: text("customer_zip").notNull(),
  customerCountry: text("customer_country").notNull(),
  quantity: integer("quantity").notNull().default(1),
  subtotal: doublePrecision("subtotal").notNull(),
  total: doublePrecision("total").notNull(),
  status: text("status", { enum: Object.values(OrderStatus) }).notNull().default(OrderStatus.PENDING),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertOrderSchema = createInsertSchema(orders)
  .omit({ 
    id: true, 
    status: true, 
    createdAt: true, 
    updatedAt: true 
  });

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
