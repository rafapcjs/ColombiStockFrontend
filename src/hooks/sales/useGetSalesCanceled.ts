import { GetSalesCanceled } from "@/services/sales";
import { useQuery } from "@tanstack/react-query";
 
export const useGetSalesCanceled = () => {
    const { data: salesCanceled, isLoading } = useQuery({
      queryKey: ["products"],
      queryFn: GetSalesCanceled,
    });
  
    return { salesCanceled, isLoading };
  };