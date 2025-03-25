import { 
  users, type User, type InsertUser,
  orders, type Order, type InsertOrder, type OrderStatusType,
  DISCOUNT_TIERS
} from "@shared/schema";
import { drizzle } from "drizzle-orm/neon-serverless";
import { eq, desc, sql, and, count, lt } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";

// Initialize the database connection - using async query function for Neon
const sql_url = process.env.DATABASE_URL!;
// Use the string connection URL directly to avoid type issues with recent Neon version
const db = drizzle(neon(sql_url));

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
  countOrdersByDiscountTier(): Promise<{ tier: number, count: number }[]>;
  getCurrentDiscountTier(): Promise<{ percentage: number, remaining: number, nextTier: { percentage: number } | null }>;
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
  
  async countOrdersByDiscountTier(): Promise<{ tier: number, count: number }[]> {
    const results = await db
      .select({ 
        discountPercentage: orders.discountPercentage,
        count: count(orders.id)
      })
      .from(orders)
      .groupBy(orders.discountPercentage);
    
    return results.map(r => ({ 
      tier: r.discountPercentage,
      count: Number(r.count)
    }));
  }
  
  async getCurrentDiscountTier(): Promise<{ percentage: number, remaining: number, nextTier: { percentage: number } | null }> {
    // Get counts by discount tier
    const tierCounts = await this.countOrdersByDiscountTier();
    
    // Calculate total orders
    const totalOrders = tierCounts.reduce((sum, item) => sum + item.count, 0);
    
    // Determine current tier
    let currentTierIndex = 0;
    let currentTierOrdersCount = 0;
    let cumulativeOrders = 0;
    
    for (let i = 0; i < DISCOUNT_TIERS.length; i++) {
      const tierLimit = DISCOUNT_TIERS[i].limit;
      
      // If the total is still within this tier's limit, this is our current tier
      if (cumulativeOrders + tierLimit > totalOrders || i === DISCOUNT_TIERS.length - 1) {
        currentTierIndex = i;
        currentTierOrdersCount = totalOrders - cumulativeOrders;
        break;
      }
      
      cumulativeOrders += tierLimit;
    }
    
    const currentTier = DISCOUNT_TIERS[currentTierIndex];
    const nextTier = currentTierIndex < DISCOUNT_TIERS.length - 1 
      ? { percentage: DISCOUNT_TIERS[currentTierIndex + 1].percentage } 
      : null;
    
    const remaining = currentTier.limit === Infinity 
      ? Infinity 
      : currentTier.limit - currentTierOrdersCount;
    
    return {
      percentage: currentTier.percentage,
      remaining,
      nextTier
    };
  }
}

// Export an instance of the storage class
export const storage = new DatabaseStorage();
