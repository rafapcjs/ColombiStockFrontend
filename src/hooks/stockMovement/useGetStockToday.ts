import { GetTodayStockMovements } from "@/services/stockN";
import { PaginatedResponse } from "@/types/PaginatedResponse";
import { StockMovementModelDto } from "@/types/stockMoventN";
import { useQuery } from "@tanstack/react-query";
 

export const useGetStockMovementsToday = (page:number=0,size:number=10,sortBy:string="createDate" ,direction:string="asc") => {
    const { data: stockMovements, isLoading } = useQuery<PaginatedResponse<StockMovementModelDto>>({
      queryKey: ["stockMovements", page, size, sortBy, direction],
      queryFn:() =>GetTodayStockMovements(page, size, sortBy, direction),
    });
  
    return { stockMovements, isLoading };
  };
