import { UpdateSuppliers } from "@/services/suppliers";
import { SuppliersModel } from "@/types/SuppliersModel";
import { getErrorMessage } from "@/utilities/getServerErrorMessage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useUpdateSuppliersByDni = () => {
  const queryClient = useQueryClient();

  const { mutate: updateSuppliersByDniMutation, isLoading: isPending } =
    useMutation({
      mutationFn: ({
        dni,
        suppliers,
      }: {
        dni: string;
        suppliers: SuppliersModel;
      }) => UpdateSuppliers(dni, suppliers),

      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["suppliers"] });

        // Mostrar mensaje de éxito cuando el proveedor se actualice correctamente
        toast.success("Proveedor actualizado exitosamente.");
      },

      onError: (error) => {
        // Manejo del error utilizando getErrorMessage
        toast.error(getErrorMessage(error));
      },
    });

  return { updateSuppliersByDniMutation, isPending };
};
