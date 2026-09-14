import express from 'react'; // Wait, let's use standard imports.
import express, { Request, Response } from 'express';
import cors from 'cors';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq } from 'drizzle-orm';
import * as schema from './db/schema.js';
import 'dotenv/config';

// Initialize Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://clothy_admin:clothy_secret_password@localhost:5432/clothy_db",
});
const db = drizzle(pool, { schema });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Multi-Tenant Middleware: Enforce Store ID on all catalog requests
const requireStoreId = (req: Request, res: Response, next: Function) => {
  const storeId = req.headers['x-store-id'];
  if (!storeId || typeof storeId !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid x-store-id header' });
  }
  // In a real app, you would validate this against the authenticated user's permissions
  req.storeId = storeId; 
  next();
};

// --- ROUTES ---

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Clothy API V1' });
});

// Get Active Products for a Store
app.get('/api/products', requireStoreId, async (req: Request, res: Response) => {
  try {
    const storeProducts = await db.query.products.findMany({
      where: eq(schema.products.storeId, req.storeId),
      orderBy: (products, { desc }) => [desc(products.createdAt)],
    });
    
    res.json({ data: storeProducts });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Clothy API running on http://localhost:${PORT}`);
});