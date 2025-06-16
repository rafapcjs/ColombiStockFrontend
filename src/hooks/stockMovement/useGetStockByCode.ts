import { useQuery } from "@tanstack/react-query";
import { GetStockMovementByCode } from "../../services/stockMovement";


export const useGetStockMovementByCode = (code: string, status: 'ACTIVE' | 'INACTIVE') => {
  const { data: stockMovement, error, isLoading } = useQuery({
    queryKey: ["products", code, status],
    queryFn: () => GetStockMovementByCode(code, status),
  });

  return { stockMovement, error, isLoading };
};