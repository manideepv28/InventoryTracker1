import { useState } from "react";
import InventoryHeader from "@/components/inventory-header";
import InventoryTable from "@/components/inventory-table";
import EditStockModal from "@/components/edit-stock-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInventory } from "@/hooks/use-inventory";
import { Plus, RotateCcw, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const { toast } = useToast();
  const { data: products, isLoading, refetch } = useInventory(searchQuery, filterCategory);

  const handleEditStock = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Inventory refreshed!",
      description: "Product data has been updated.",
    });
  };

  const categories = ["Electronics", "Furniture", "Office", "Tools"];

  return (
    <div className="min-h-screen bg-slate-50">
      <InventoryHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls Section */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <Button className="bg-primary text-white hover:bg-blue-700 flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Product</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              className="flex items-center space-x-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            </div>
            <Select value={filterCategory || "all"} onValueChange={(value) => setFilterCategory(value === "all" ? "" : value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <InventoryTable 
          products={products || []}
          isLoading={isLoading}
          onEditStock={handleEditStock}
        />

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Showing <span className="font-medium">1</span> to{" "}
            <span className="font-medium">{products?.length || 0}</span> of{" "}
            <span className="font-medium">{products?.length || 0}</span> results
          </p>
        </div>
      </main>

      <EditStockModal
        product={selectedProduct}
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
