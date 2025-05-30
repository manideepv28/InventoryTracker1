import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, updateStockSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const { search, category } = req.query;
      
      let products;
      if (search) {
        products = await storage.searchProducts(search as string);
      } else if (category) {
        products = await storage.getProductsByCategory(category as string);
      } else {
        products = await storage.getProducts();
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Get single product
  app.get("/api/products/:id", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Create new product
  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create product" });
      }
    }
  });

  // Update product stock
  app.patch("/api/products/:id/stock", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const validatedData = updateStockSchema.parse(req.body);
      
      const product = await storage.updateProductStock(productId, validatedData.quantity);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to update product stock" });
      }
    }
  });

  // Get inventory statistics
  app.get("/api/inventory/stats", async (req, res) => {
    try {
      const products = await storage.getProducts();
      const totalProducts = products.length;
      const lowStockCount = products.filter(p => p.quantity <= 5 && p.quantity > 0).length;
      const outOfStockCount = products.filter(p => p.quantity === 0).length;
      
      res.json({
        totalProducts,
        lowStockCount,
        outOfStockCount,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inventory statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
