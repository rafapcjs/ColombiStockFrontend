import { UpdateCategory } from "@/services/category";
import { CategoryModel } from "@/types/CategoryModel";
import { getErrorMessage } from "@/utilities/getServerErrorMessage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
  import { toast } from "react-toastify";
  
export const useUpdateCategoryByCode = () => {
  const queryClient = useQueryClient();

  const { mutate: updateCategoryByCodeMutation, isPending } = useMutation({
    mutationFn: ({
      code,
      category,
    }: {
      code: string;
      category: CategoryModel;
    }) => UpdateCategory(code, category),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoría actualizada correctamente.");
    },

    onError: (error) => {
      // Manejo del error utilizando getErrorMessage
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    },
  });

  return { updateCategoryByCodeMutation, isPending };
};