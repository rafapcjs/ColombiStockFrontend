import { useQuery } from "@tanstack/react-query";
 import { GetAllSuppliers } from "../../services/suppliers";
import { PaginatedResponse } from "@/types/PaginatedResponse";
import { SuppliersModelDto } from "@/types/SuppliersModel";

export const UseGetAllSuppliers = (
  page: number = 0,
  size: number = 10,
  sortBy: string = "name",
  direction: string = "asc"
) => {
  const { isLoading, data } = useQuery<PaginatedResponse<SuppliersModelDto>>({
    queryKey: ["suppliers", page, size, sortBy, direction],
    queryFn: () => GetAllSuppliers(page, size, sortBy, direction),
    staleTime: 5000, // Mantener datos frescos durante 5 segundos
  });

  return { isLoading, suppliers: data };
};