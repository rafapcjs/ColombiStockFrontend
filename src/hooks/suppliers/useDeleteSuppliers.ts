import { DeleteSuppliersByDni } from "@/services/suppliers";
import { getErrorMessage } from "@/utilities/getServerErrorMessage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const UseDeleteSuppliers = () => {
  const queryClient = useQueryClient();

  const { mutate: DeleteSuppliersMutation, isPending } = useMutation({
    mutationFn: DeleteSuppliersByDni,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Supplier deleted successfully");
    },
    
    onError: (error) => {
      console.log("Error recibido:", error); // Depuración
      const status = (error as any)?.response?.status;
      if (status === 409) {
        toast.error(
          "No puedes eliminar este proveedor porque está en uso. Verifica y vuelve a intentarlo."
        );
      } else {
        toast.error(getErrorMessage(error));
      }
    },
    
    
  });

  return { DeleteSuppliersMutation, isPending };
};