import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";

export function useInventory(searchQuery: string = "", filterCategory: string = "") {
  const queryParams = new URLSearchParams();
  if (searchQuery) queryParams.append("search", searchQuery);
  if (filterCategory) queryParams.append("category", filterCategory);
  
  const queryString = queryParams.toString();
  const url = `/api/products${queryString ? `?${queryString}` : ""}`;

  return useQuery<Product[]>({
    queryKey: ["/api/products", searchQuery, filterCategory],
    queryFn: async () => {
      const response = await fetch(url, { credentials: "include" });
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      return response.json();
    },
  });
}
