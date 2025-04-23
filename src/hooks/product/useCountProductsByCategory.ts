import { CountProductsByCategory } from "@/services/product";
import { CategoryProductCount } from "@/types/ProductModel";
import { useQuery } from "@tanstack/react-query";
 

export const useCountProductsByCategory = () => {
    const { data: categoryCounts, isLoading } = useQuery<CategoryProductCount[]>({
      queryKey: ["categoryCounts"],
      queryFn: CountProductsByCategory,
    });
  
    return { categoryCounts, isLoading };
  };