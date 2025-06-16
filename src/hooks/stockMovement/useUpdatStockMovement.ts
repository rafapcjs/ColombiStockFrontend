import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateStockMovement } from "../../services/stockMovement";
import { toast } from "react-toastify";
import { StockMovement } from "@/types/StockMovement ";
import { getErrorMessage } from "@/utilities/getServerErrorMessage";
 

export const useUpdateStockMovement = () => {
  const queryClient = useQueryClient();

  const { mutate: updateStockMovementMutation, isPending } = useMutation({
    mutationFn: ({
      stockMovement,
      code,
    }: {
      stockMovement: StockMovement;
      code: string;
    }) => UpdateStockMovement(stockMovement, code),

    onSuccess: () => {
      // Invalidar la caché y mostrar un mensaje de éxito
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Movimiento de stock actualizado exitosamente!");
    },

    onError: (error) => {
      // Manejo de errores utilizando getErrorMessage y mostrar mensaje de error
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    },
  });

  return { updateStockMovementMutation, isPending };
};