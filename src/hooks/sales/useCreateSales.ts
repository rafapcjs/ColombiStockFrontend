import { CreateSales } from "@/services/sales";
import { getErrorMessage } from "@/utilities/getServerErrorMessage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useCreateSales = () => {
  const queryClient = useQueryClient();

  const { mutate: createSalesMutation, isPending } = useMutation({
    mutationFn: CreateSales,

    onSuccess: () => {
      // Invalidar la caché de las ventas y mostrar el mensaje de éxito
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["sumProductTotally"] });
queryClient.invalidateQueries({ queryKey: ["dailyProfit"] });
      queryClient.invalidateQueries({ queryKey: ["facturas"] });
      toast.success("Venta creada exitosamente!");
    },

    onError: (error) => {
      // Manejo del error utilizando getErrorMessage
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    },
  });

  return { createSalesMutation, isPending };
};