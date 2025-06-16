import { UpdatePassword } from "@/services/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useChangesPassword = () => {
  const queryClient = useQueryClient();

  const { mutate: changePasswordMutation, isPending } = useMutation({
    mutationFn: UpdatePassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Contraseña actualizada correctamente.");
    },
    onError: () => {
      toast.error("Error al actualizar la contraseña.");
    },
  });
  return { changePasswordMutation, isPending };
};
