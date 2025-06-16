// hooks/auth/useUpdateUserInSession.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserInSession } from "@/services/auth";
import { UpdatePasswordUserInSessionModel } from "@/types/UserMode";
import { toast } from "react-toastify";

export const useUpdateUserInSession = () => {
  const queryClient = useQueryClient();

  const { mutate: updateUserMutation, isLoading } = useMutation({
    mutationFn: (data: UpdatePasswordUserInSessionModel) =>
      updateUserInSession(data),
    onSuccess: () => {
      // Invalida la caché para actualizar los datos del usuario en sesión
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Usuario actualizado correctamente.");
    },
    onError: (error: any) => {
      // Extrae mensaje del backend o usa uno genérico
      const backendMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Error al actualizar el usuario.";
      toast.error(backendMsg);
    },
  });

  return { updateUserMutation, isLoading };
};
