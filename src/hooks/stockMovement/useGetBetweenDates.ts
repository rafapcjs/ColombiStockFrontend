import { useQuery } from "@tanstack/react-query";

 
import { GetStockMovementsByDateRange } from "../../services/stockMovement";
import { PaginatedResponse } from "@/types/PaginatedResponse";
import { StockMovementModelDto } from "@/types/stockMoventN";


export const useGetStockMovementsByDateRange = (
  page: number = 0,
  size: number = 10,
  sortBy: string = "movementDate",
  direction: string = "asc",
  statusEntity: 'ACTIVE' | 'INACTIVE',
  startDate: string,
  endDate: string
) => {
  const { data: stockMovements, isLoading } = useQuery<PaginatedResponse<StockMovementModelDto>>({
    queryKey: ["products", page, size, sortBy, direction, statusEntity, startDate, endDate],
    queryFn: () => GetStockMovementsByDateRange(page, size, sortBy, direction, statusEntity, startDate, endDate),
  });

  return { stockMovements, isLoading };
};