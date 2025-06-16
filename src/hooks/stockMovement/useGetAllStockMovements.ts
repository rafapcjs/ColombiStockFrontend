import { GetStockMovementsForTransation } from "@/services/stockN";
import { getErrorMessage } from "@/utilities/getServerErrorMessage";
import { useQuery } from "@tanstack/react-query";
 import { toast } from "react-toastify";
 
export const useGetAllStockMovements = (
  page: number = 0,
  size: number = 10,
  sortBy: string = "updateDate",
  direction: string = "asc",
  status: "ACTIVE",
  movementType: "STOCK_IN" | "STOCK_OUT"
) => {
  const {
    data: stockMovements,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "stockMovements",
      page,
      size,
      sortBy,
      direction,
      status,
      movementType,
    ],
    queryFn: () =>
      GetStockMovementsForTransation(
        page,
        size,
        sortBy,
        direction,
        status,
        movementType
      ),
    onError: (error) => {
      // Manejo del error utilizando getErrorMessage
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    },
    onSuccess: () => {
      // Mostrar un mensaje cuando los movimientos de stock son cargados exitosamente
      toast.success("Movimientos de stock cargados exitosamente!");

      // Verificar el tipo de movimiento para enviar alertas específicas
      if (movementType === "STOCK_IN") {
        toast.info("¡Stock ingresado correctamente!");
      } else if (movementType === "STOCK_OUT") {
        toast.warning("¡Stock retirado correctamente!");
      }
    },
  });

  return { stockMovements, isLoading };
};