import { GetProductByCodeLowStock } from "@/services/product";
import { useQuery } from "@tanstack/react-query";
 
export const UseGetProductByCodeLowStock = () => {
  const { data: product, isLoading } = useQuery({
    queryKey: ["products"],
    refetchInterval: 3000,
    queryFn: () => GetProductByCodeLowStock(),
  });

  return { product, isLoading };
};