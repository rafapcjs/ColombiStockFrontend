import { getMostProductWithSales } from "@/services/sales";
import { useQuery } from "@tanstack/react-query";

 
 
 
export const UseGetProductMostSales = () => {
    const { data, isLoading } = useQuery({
      queryKey: ["productss"],
      queryFn: getMostProductWithSales,
    });
  
    return { data, isLoading };
  };