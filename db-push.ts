import { drizzle } from "drizzle-orm/neon-serverless";
import { neon } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";
import { users, orders } from "./shared/schema";

// Initialize the database connection
const sql_url = process.env.DATABASE_URL!;
const db = drizzle(neon(sql_url));

// Run migrations
async function runMigrations() {
  console.log("Running migrations...");
  
  try {
    // Create tables based on schema if they don't exist already
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        is_admin BOOLEAN NOT NULL DEFAULT false
      );
    `);
    
    await db.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        customer_address TEXT NOT NULL,
        customer_city TEXT NOT NULL,
        customer_state TEXT NOT NULL,
        customer_zip TEXT NOT NULL,
        customer_country TEXT NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        discount_percentage INTEGER NOT NULL,
        subtotal DOUBLE PRECISION NOT NULL,
        total DOUBLE PRECISION NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `);

    // Create an admin user if none exists
    const adminExists = await db.execute(sql`SELECT * FROM users WHERE username = 'admin'`);
    
    if (adminExists.rows.length === 0) {
      console.log("Creating admin user");
      await db.execute(sql`
        INSERT INTO users (username, password, is_admin) 
        VALUES ('admin', 'admin123', true)
      `);
    }
    
    console.log("Migrations completed successfully!");
  } catch (error) {
    console.error("Error running migrations:", error);
    process.exit(1);
  }
}

runMigrations();