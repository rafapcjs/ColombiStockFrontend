import { login } from "@/services/auth";
import { getErrorMessage } from "@/utilities/getServerErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useLogin = () => {
  const { mutate: loginMutation, isPending } = useMutation({
    mutationKey: ["user"],
    mutationFn: login,

    onSuccess: (data) => {
      toast.success("¡Inicio de sesión exitoso!");
      console.log(data);
    },

    onError: (error) => {
      toast.error("por favor verifique sus credenciales su usuario o contraseña son incorrectos");
    },
  });
  return { login: loginMutation, isPending };
};
