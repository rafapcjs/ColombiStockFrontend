import { GetSalesActive } from "@/services/sales";
import { useQuery } from "@tanstack/react-query";
 
export const useGetSalesActive = () => {
    const { data: salesActive, isLoading } = useQuery({
      queryKey: ["products"],
      queryFn: GetSalesActive,
    });
  
    return { salesActive, isLoading };
  };