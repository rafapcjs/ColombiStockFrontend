import { FindProductsByPriceBetween } from "@/services/product";
import { PaginatedResponse } from "@/types/PaginatedResponse";
import { ProductCosts } from "@/types/productModel";
import { useQuery } from "@tanstack/react-query";
 

export const useFindProductsByPriceBetween = (minPrice: number, maxPrice: number) => {
  const { data: products, isLoading } = useQuery<PaginatedResponse<ProductCosts>>({
    queryKey: ["productsByPrice", minPrice, maxPrice],
    queryFn: () => FindProductsByPriceBetween(minPrice, maxPrice),
  });

  return { products, isLoading };
};