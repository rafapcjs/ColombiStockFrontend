import { CreateCategory } from "@/services/category";
import { useMutation, useQueryClient } from "@tanstack/react-query";
 import { toast } from "react-toastify";

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  const { mutate: createCategoryMutation, isLoading } = useMutation({
    mutationFn: CreateCategory,
    
    onSuccess: () => {
      // Invalidar la caché de las categorías para obtener los datos actualizados
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("¡Categoría creada exitosamente!");
    },
    
    onError: (error) => {
      // Manejo de errores y notificación
      const errorMessage = error instanceof Error
        ? error.message
        : "Ocurrió un error desconocido al crear la categoría.";
      toast.error(errorMessage);
    },
  });

  return { createCategoryMutation, isLoading };
};