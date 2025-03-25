import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { OrderStatus, insertOrderSchema, insertUserSchema } from "@shared/schema";
import { ZodError } from "zod";
import { z } from "zod";
import 'express-session';

// Extend the Express Request type to include session
declare module 'express-session' {
  interface SessionData {
    user?: {
      id: number;
      username: string;
      isAdmin: boolean;
    };
  }
}

// Authentication middleware
const requireAuth = (req: Request, res: Response, next: Function) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
};

// Admin authentication middleware
const requireAdmin = (req: Request, res: Response, next: Function) => {
  if (!req.session || !req.session.user || !req.session.user.isAdmin) {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize the database schema if not exists
  // This will be handled by Drizzle ORM automatically

  // Authentication routes
  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid username or password" });
      }
      
      // Set user in session
      req.session.user = {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin
      };
      
      res.json({ 
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }
      
      // Create new user
      const user = await storage.createUser(userData);
      
      // Set user in session
      req.session.user = {
        id: user.id,
        username: user.username,
        isAdmin: false
      };
      
      res.status(201).json({ 
        id: user.id,
        username: user.username,
        isAdmin: false
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      
      console.error("Registration error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post('/api/auth/logout', (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ error: "Failed to logout" });
      }
      
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get('/api/auth/me', (req: Request, res: Response) => {
    if (!req.session || !req.session.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    res.json(req.session.user);
  });

  // Order routes
  
  // Get current discount tier information
  app.get('/api/orders/discount-tier', async (req: Request, res: Response) => {
    try {
      const tierInfo = await storage.getCurrentDiscountTier();
      res.json(tierInfo);
    } catch (error) {
      console.error("Get discount tier error:", error);
      res.status(500).json({ error: "Failed to get discount tier information" });
    }
  });

  // Create a new order
  app.post('/api/orders', async (req: Request, res: Response) => {
    try {
      // Get current discount tier
      const { percentage } = await storage.getCurrentDiscountTier();
      
      // Validate order data
      const orderData = insertOrderSchema.parse(req.body);
      
      // Calculate subtotal and total
      const basePrice = 39.99; // Base price of the game
      const quantity = orderData.quantity || 1; // Default to 1 if not provided
      const subtotal = quantity * basePrice;
      const discount = subtotal * (percentage / 100);
      const total = subtotal - discount;
      
      // Create order with the current discount percentage
      const order = await storage.createOrder({
        ...orderData,
        discountPercentage: percentage,
        subtotal,
        total
      });
      
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      
      console.error("Create order error:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  // Admin routes - require authentication
  
  // Get all orders (admin only)
  app.get('/api/admin/orders', requireAdmin, async (req: Request, res: Response) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      console.error("Get orders error:", error);
      res.status(500).json({ error: "Failed to get orders" });
    }
  });
  
  // Get order by ID (admin only)
  app.get('/api/admin/orders/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
      const orderId = parseInt(req.params.id);
      
      if (isNaN(orderId)) {
        return res.status(400).json({ error: "Invalid order ID" });
      }
      
      const order = await storage.getOrderById(orderId);
      
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      console.error("Get order error:", error);
      res.status(500).json({ error: "Failed to get order" });
    }
  });
  
  // Update order status (admin only)
  app.patch('/api/admin/orders/:id/status', requireAdmin, async (req: Request, res: Response) => {
    try {
      const orderId = parseInt(req.params.id);
      
      if (isNaN(orderId)) {
        return res.status(400).json({ error: "Invalid order ID" });
      }
      
      const { status } = req.body;
      
      if (!status || !Object.values(OrderStatus).includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      
      const order = await storage.updateOrderStatus(orderId, status);
      
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      console.error("Update order status error:", error);
      res.status(500).json({ error: "Failed to update order status" });
    }
  });
  
  // Delete order (admin only)
  app.delete('/api/admin/orders/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
      const orderId = parseInt(req.params.id);
      
      if (isNaN(orderId)) {
        return res.status(400).json({ error: "Invalid order ID" });
      }
      
      const success = await storage.deleteOrder(orderId);
      
      if (!success) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Delete order error:", error);
      res.status(500).json({ error: "Failed to delete order" });
    }
  });

  // Get order statistics (admin only)
  app.get('/api/admin/stats', requireAdmin, async (req: Request, res: Response) => {
    try {
      const orders = await storage.getAllOrders();
      
      // Total number of orders
      const totalOrders = orders.length;
      
      // Total revenue
      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
      
      // Orders by status
      const ordersByStatus = Object.values(OrderStatus).reduce((acc, status) => {
        acc[status] = orders.filter(order => order.status === status).length;
        return acc;
      }, {} as Record<string, number>);
      
      // Orders by discount tier
      const tierCounts = await storage.countOrdersByDiscountTier();
      
      res.json({
        totalOrders,
        totalRevenue,
        ordersByStatus,
        tierCounts
      });
    } catch (error) {
      console.error("Get stats error:", error);
      res.status(500).json({ error: "Failed to get statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
