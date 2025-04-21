import { GetAllProducts } from "@/services/product";
import { useQuery } from "@tanstack/react-query";
 
export const useGetAllProducts = (
  page: number = 0,
  size: number = 10,
  sortBy: string = "name",
  direction: string = "asc"
) => {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products", page, size, sortBy, direction],
    queryFn: () => GetAllProducts(page, size, sortBy, direction),
  });

  return { products, isLoading };
};