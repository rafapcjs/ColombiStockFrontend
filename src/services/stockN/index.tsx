import { colombiStockApi } from "@/api";
import { PaginatedResponse } from "@/types/PaginatedResponse";
import { StockMovementModelDto } from "@/types/stockMoventN";

export const GetTodayStockMovements = async (
  page: number = 0,
  size: number = 10,
  sortBy: string = "createDate",
  direction: string = "asc"
) => {
  const url = `/stock_movement/today?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`;

  const { data } = await colombiStockApi.get(url);

  return data as PaginatedResponse<StockMovementModelDto>;
};

export const GetStockMovements = async (
  page: number = 0,
  size: number = 10,
  sortBy: string = "updateDate",
  direction: string = "asc",
  statusEntity: string = "ACTIVE"
) => {
  const url = `/stock_movement?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}&statusEntity=${statusEntity}`;

  const { data } = await colombiStockApi.get(url);

  return data as PaginatedResponse<StockMovementModelDto>;
};

export const GetStockMovementsForTransation = async (
  page: number = 0,
  size: number = 10,
  sortBy: string = "updateDate",
  direction: string = "asc",
  statusEntity: string = "ACTIVE",
  movementType: "STOCK_IN" | "STOCK_OUT"
) => {
  const url = `/stock_movement/movement?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}&statusEntity=${statusEntity}&movementType=${movementType}`;

  const { data } = await colombiStockApi.get(url);

  return data as PaginatedResponse<StockMovementModelDto>;
};
