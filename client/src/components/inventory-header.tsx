import { useQuery } from "@tanstack/react-query";
import { Package } from "lucide-react";

interface InventoryStats {
  totalProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export default function InventoryHeader() {
  const { data: stats } = useQuery<InventoryStats>({
    queryKey: ["/api/inventory/stats"],
  });

  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary rounded-lg p-2">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Inventory Management</h1>
              <p className="text-sm text-slate-600">Track and manage your product inventory</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-slate-600">Total Products</p>
              <p className="text-2xl font-bold text-slate-900">
                {stats?.totalProducts || 0}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Low Stock Alert</p>
              <p className="text-2xl font-bold text-warning">
                {stats?.lowStockCount || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
