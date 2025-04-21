import { CreateSuppliers } from "@/services/suppliers";
import { getErrorMessage } from "@/utilities/getServerErrorMessage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const UseCreateSuppliers = () => {
  const queryClient = useQueryClient();

  const { mutate: CreateSuppliersMutation, isPending } = useMutation({
    mutationFn: CreateSuppliers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Supplier created successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return { CreateSuppliersMutation, isPending };
};