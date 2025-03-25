import { 
  users, type User, type InsertUser,
  orders, type Order, type InsertOrder, type OrderStatusType,
  OrderStatus
} from "@shared/schema";
import { drizzle } from "drizzle-orm/neon-serverless";
import { eq, desc, sql, and, count, lt } from "drizzle-orm";
import { neon, NeonQueryFunction } from "@neondatabase/serverless";

// Initialize the database connection with proper typing
// Using the latest version of @neondatabase/serverless
const dbUrl = process.env.DATABASE_URL!;
const client = neon(dbUrl);
// Fix the typing issue with drizzle and neon
const db = drizzle(client as any);

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Order methods
  createOrder(order: InsertOrder): Promise<Order>;
  getOrderById(id: number): Promise<Order | undefined>;
  getAllOrders(): Promise<Order[]>;
  updateOrderStatus(id: number, status: OrderStatusType): Promise<Order | undefined>;
  deleteOrder(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.id, id));
    return results[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.username, username));
    return results[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const results = await db.insert(users).values(insertUser).returning();
    return results[0];
  }

  // Order methods
  async createOrder(order: InsertOrder): Promise<Order> {
    const now = new Date();
    const results = await db.insert(orders).values({
      ...order,
      status: OrderStatus.PENDING as string,
      createdAt: now,
      updatedAt: now
    }).returning();
    return results[0];
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    const results = await db.select().from(orders).where(eq(orders.id, id));
    return results[0];
  }

  async getAllOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async updateOrderStatus(id: number, status: OrderStatusType): Promise<Order | undefined> {
    const now = new Date();
    const results = await db
      .update(orders)
      .set({ 
        status, 
        updatedAt: now 
      })
      .where(eq(orders.id, id))
      .returning();
    return results[0];
  }

  async deleteOrder(id: number): Promise<boolean> {
    const results = await db
      .delete(orders)
      .where(eq(orders.id, id))
      .returning({ id: orders.id });
    return results.length > 0;
  }
}

// Export an instance of the storage class
export const storage = new DatabaseStorage();