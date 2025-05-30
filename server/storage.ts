import { products, type Product, type InsertProduct } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: any): Promise<any>;
  
  // Product operations
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProductStock(id: number, quantity: number): Promise<Product | undefined>;
  searchProducts(query: string): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, any>;
  private products: Map<number, Product>;
  private currentUserId: number;
  private currentProductId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.currentUserId = 1;
    this.currentProductId = 1;
    
    // Initialize with some sample products
    this.initializeProducts();
  }

  private initializeProducts() {
    const sampleProducts: InsertProduct[] = [
      {
        name: "MacBook Pro 14\"",
        description: "Apple M2 chip, 16GB RAM, 512GB SSD",
        category: "Electronics",
        sku: "MBP-14-M2-512",
        quantity: 15,
      },
      {
        name: "Office Chair Deluxe",
        description: "Ergonomic design with lumbar support",
        category: "Furniture",
        sku: "CHAIR-DLX-001",
        quantity: 8,
      },
      {
        name: "A4 Copy Paper",
        description: "White, 80gsm, 500 sheets per pack",
        category: "Office",
        sku: "PAPER-A4-500",
        quantity: 3,
      },
      {
        name: "Cordless Drill Set",
        description: "18V Li-ion with 20-piece bit set",
        category: "Tools",
        sku: "DRILL-18V-SET",
        quantity: 0,
      },
      {
        name: "Wireless Mouse",
        description: "Bluetooth 5.0, ergonomic design",
        category: "Electronics",
        sku: "MOUSE-BT-001",
        quantity: 25,
      },
      {
        name: "Standing Desk",
        description: "Height adjustable, 48\" width",
        category: "Furniture",
        sku: "DESK-STD-48",
        quantity: 5,
      },
    ];

    sampleProducts.forEach(product => {
      this.createProduct(product);
    });
  }

  async getUser(id: number): Promise<any | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: any): Promise<any> {
    const id = this.currentUserId++;
    const user: any = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { 
      ...insertProduct, 
      id,
      quantity: insertProduct.quantity ?? 0
    };
    this.products.set(id, product);
    return product;
  }

  async updateProductStock(id: number, quantity: number): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (product) {
      const updatedProduct = { ...product, quantity };
      this.products.set(id, updatedProduct);
      return updatedProduct;
    }
    return undefined;
  }

  async searchProducts(query: string): Promise<Product[]> {
    const products = Array.from(this.products.values());
    if (!query) return products;
    
    const lowerQuery = query.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.sku.toLowerCase().includes(lowerQuery)
    );
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    const products = Array.from(this.products.values());
    if (!category) return products;
    
    return products.filter(product =>
      product.category.toLowerCase() === category.toLowerCase()
    );
  }
}

export const storage = new MemStorage();
