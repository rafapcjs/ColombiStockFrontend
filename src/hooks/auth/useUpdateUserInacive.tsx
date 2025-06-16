 import { useMutation, useQueryClient } from "@tanstack/react-query";
 import { UpdateStateDesactive } from "@/services/auth";
import { toast } from "react-toastify";

export const UseUpdateUserInactive = () => {
  const queryClient = useQueryClient();

  const { mutate: updateUserStatesInactive, isPending } = useMutation({
    mutationFn: ({ dni }: { dni: string }) => UpdateStateDesactive(dni),
    onSuccess: () => {
          toast.success("Usuario desactivado correctamente.");

      // Puedes invalidar queries aquí si es necesario
      queryClient.invalidateQueries({ queryKey: ["user"] });
    
    },
  });

  return { updateUserStatesInactive, isPending };
};