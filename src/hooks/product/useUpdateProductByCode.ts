import { UpdateProductByCode } from "@/services/product";
import { ProductModeltDto } from "@/types/productModel";
import { getErrorMessage } from "@/utilities/getServerErrorMessage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
 import { toast } from "react-toastify";

export const useUpdateProductByCode = () => {
  const queryClient = useQueryClient();

  const { mutate: updateProductByCodeMutation, isPending } = useMutation({
    mutationFn: ({
      code,
      product,
    }: {
      code: string;
      product: ProductModeltDto;
    }) => UpdateProductByCode(code, product),

    onSuccess: () => {
      // Invalidar las consultas de productos para asegurarse de que los datos se actualicen
      queryClient.invalidateQueries({ queryKey: ["products"] });

      // Mostrar un mensaje de éxito cuando el producto se actualice correctamente
      toast.success("Producto actualizado exitosamente.");
    },

    onError: (error) => {
      // Manejo de errores utilizando getErrorMessage
      toast.error(getErrorMessage(error));
    },
  });

  return { updateProductByCodeMutation, isPending };
};
