import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

interface EditStockModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditStockModal({ product, isOpen, onClose }: EditStockModalProps) {
  const [newStock, setNewStock] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (product) {
      setNewStock(product.quantity.toString());
    }
  }, [product]);

  const updateStockMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      const response = await apiRequest("PATCH", `/api/products/${id}/stock`, { quantity });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory/stats"] });
      toast({
        title: "Stock updated successfully!",
        description: `${product?.name} stock has been updated.`,
      });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update stock",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product) return;
    
    const quantity = parseInt(newStock);
    if (isNaN(quantity) || quantity < 0) {
      toast({
        title: "Invalid quantity",
        description: "Please enter a valid stock quantity (0 or greater).",
        variant: "destructive",
      });
      return;
    }

    updateStockMutation.mutate({ id: product.id, quantity });
  };

  const handleClose = () => {
    setNewStock("");
    onClose();
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Stock</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="text-sm font-medium text-slate-700">Product</Label>
            <p className="text-slate-900 font-medium">{product.name}</p>
            <p className="text-sm text-slate-600">{product.sku}</p>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-slate-700">Current Stock</Label>
            <p className="text-2xl font-bold text-slate-900">{product.quantity}</p>
          </div>
          
          <div>
            <Label htmlFor="newStock" className="text-sm font-medium text-slate-700">
              New Stock Quantity
            </Label>
            <Input
              id="newStock"
              type="number"
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
              placeholder="Enter new quantity"
              min="0"
              className="mt-2"
            />
            <p className="text-sm text-slate-500 mt-1">
              Enter the new stock quantity for this product
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              type="submit"
              disabled={updateStockMutation.isPending}
              className="flex-1 bg-primary text-white hover:bg-blue-700"
            >
              {updateStockMutation.isPending ? "Updating..." : "Update Stock"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
