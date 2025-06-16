// src/hooks/useGetAllFacturas.ts

import { GetAllFacturas } from "@/services/factures";
import { useQuery } from "@tanstack/react-query";
  

export const useGetAllFacturas = (
  page: number = 0,
  size: number = 10,
  sortBy: string = "fechaCompra",
  direction: "asc" | "desc" = "desc"
) => {
  const { data: facturas, isLoading } = useQuery({
    queryKey: ["facturas", page, size, sortBy, direction],
    queryFn: () => GetAllFacturas(page, size, sortBy, direction),
  });

  return { facturas, isLoading };
};
