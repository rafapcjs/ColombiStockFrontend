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
      toast.error(getErrorMessage(error));
    },
  });

  return { DeleteSuppliersMutation, isPending };
};
