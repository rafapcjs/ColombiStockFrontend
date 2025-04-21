import { DeleteProductByCode } from "@/services/product";
import { getErrorMessage } from "@/utilities/getServerErrorMessage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
 import { toast } from "react-toastify";

export const UseDeleteProduct = () => {
  const queryClient = useQueryClient();

  const { isPending, mutate: DeleteProductMutation } = useMutation({
    mutationFn: DeleteProductByCode,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Producto eliminado correctamente.");
    },

    onError: (error) => {
      // Manejo del error utilizando getErrorMessage

      toast.error(getErrorMessage(error));
    },
  });

  return { DeleteProductMutation, isPending };
};
