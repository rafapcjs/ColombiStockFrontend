import { UpdateUserPasswordEasy } from "@/services/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ChangePasswordEasy } from "@/types/UserMode"; // Asegúrate de importar el tipo correcto

export const UseChangesPasswordEasy = () => {
  const queryClient = useQueryClient();
  const { mutate: changePasswordMutation, isPending } = useMutation({
    mutationFn: ({ dni, password_easy }: { dni: string; password_easy: ChangePasswordEasy }) =>
      UpdateUserPasswordEasy(dni, password_easy),

    onSuccess: () => {
      toast.success("Contraseña cambiada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: () => {
      toast.error("Error al cambiar la contraseña");
    },
  });

  return { changePasswordMutation, isPending };
};