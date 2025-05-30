import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Eye, Laptop, Package, FileText, Wrench } from "lucide-react";
import type { Product } from "@shared/schema";

interface InventoryTableProps {
  products: Product[];
  isLoading: boolean;
  onEditStock: (product: Product) => void;
}

function getProductIcon(category: string) {
  switch (category.toLowerCase()) {
    case "electronics":
      return <Laptop className="h-5 w-5 text-slate-600" />;
    case "furniture":
      return <Package className="h-5 w-5 text-slate-600" />;
    case "office":
      return <FileText className="h-5 w-5 text-slate-600" />;
    case "tools":
      return <Wrench className="h-5 w-5 text-slate-600" />;
    default:
      return <Package className="h-5 w-5 text-slate-600" />;
  }
}

function getCategoryColor(category: string) {
  switch (category.toLowerCase()) {
    case "electronics":
      return "bg-blue-100 text-blue-800";
    case "furniture":
      return "bg-green-100 text-green-800";
    case "office":
      return "bg-purple-100 text-purple-800";
    case "tools":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getStockStatus(quantity: number) {
  if (quantity === 0) {
    return { label: "Out of Stock", color: "bg-red-500" };
  } else if (quantity <= 5) {
    return { label: "Low Stock", color: "bg-yellow-500" };
  } else {
    return { label: "In Stock", color: "bg-green-500" };
  }
}

function getQuantityColor(quantity: number) {
  if (quantity === 0) return "text-red-500";
  if (quantity <= 5) return "text-yellow-600";
  return "text-slate-900";
}

export default function InventoryTable({ products, isLoading, onEditStock }: InventoryTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-12 text-center">
          <Package className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No products found</h3>
          <p className="text-slate-600">Try adjusting your search or filter criteria.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left py-4 px-6 font-semibold text-slate-900">Product</th>
              <th className="text-left py-4 px-6 font-semibold text-slate-900">Category</th>
              <th className="text-left py-4 px-6 font-semibold text-slate-900">SKU</th>
              <th className="text-center py-4 px-6 font-semibold text-slate-900">Stock</th>
              <th className="text-center py-4 px-6 font-semibold text-slate-900">Status</th>
              <th className="text-center py-4 px-6 font-semibold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {products.map((product) => {
              const status = getStockStatus(product.quantity);
              return (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                        {getProductIcon(product.category)}
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-900">{product.name}</h3>
                        <p className="text-sm text-slate-600">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Badge className={`${getCategoryColor(product.category)} text-xs font-medium`}>
                      {product.category}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-slate-600 font-mono text-sm">{product.sku}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`text-lg font-semibold ${getQuantityColor(product.quantity)}`}>
                      {product.quantity}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <Badge className={`${status.color} text-white text-xs font-medium`}>
                      {status.label}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        size="sm"
                        onClick={() => onEditStock(product)}
                        className="bg-primary text-white hover:bg-blue-700"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-slate-500 text-white hover:bg-slate-600"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden">
        {products.map((product) => {
          const status = getStockStatus(product.quantity);
          return (
            <div key={product.id} className="p-4 border-b border-slate-200 last:border-b-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                    {getProductIcon(product.category)}
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">{product.name}</h3>
                    <p className="text-sm text-slate-600">{product.sku}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    onClick={() => onEditStock(product)}
                    className="bg-primary text-white hover:bg-blue-700"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-slate-500 text-white hover:bg-slate-600"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-3">{product.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Badge className={`${getCategoryColor(product.category)} text-xs font-medium`}>
                    {product.category}
                  </Badge>
                  <Badge className={`${status.color} text-white text-xs font-medium`}>
                    {status.label}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600">Stock</p>
                  <p className={`text-lg font-semibold ${getQuantityColor(product.quantity)}`}>
                    {product.quantity}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
