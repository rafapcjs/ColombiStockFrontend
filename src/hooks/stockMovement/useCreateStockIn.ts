import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SaveInStockMovement } from "../../services/stockMovement";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/utilities/getServerErrorMessage";
  
export const UseCreateStockIn = () => {
  const queryClient = useQueryClient();

  const { mutate: createStockInMutation, isPending } = useMutation({
    mutationFn: SaveInStockMovement,

    onSuccess: () => {
      // Invalidar la caché de movimientos de stock y mostrar el mensaje de éxito
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Movimiento de stock ingresado exitosamente!");
    },

    onError: (error) => {
      // Manejo del error utilizando getErrorMessage
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    },
  });

  return { createStockInMutation, isPending };
};