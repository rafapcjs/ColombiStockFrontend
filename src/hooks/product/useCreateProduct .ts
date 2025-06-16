import { CreateProduct } from "@/services/product";
import { getErrorMessage } from "@/utilities/getServerErrorMessage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  const { mutate: createProductMutation, isPending } = useMutation({
    mutationFn: CreateProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["sumProductTotally"] });

      
      toast.success("Producto creado correctamente.");
    },

    onError: (error) => {
      // Manejo del error utilizando getErrorMessage
      toast.error(getErrorMessage(error));
    },
  });

  return { createProductMutation, isPending };
};
