// hooks/auth/useUserInSession.ts
import { useQuery } from "@tanstack/react-query";
import { getUserInSession } from "@/services/auth";
import { toast } from "react-toastify";

export const useUserInSession = () => {
  const {
    data: user,
    isLoading,
    error,
    refetch: fetchUser,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getUserInSession,
    onSuccess: () => {
      toast.success("Usuario en sesión obtenido", {
        position: "top-right",
        autoClose: 2000,
      });
    },
    onError: () => {
      toast.error("Error al obtener el usuario en sesión", {
        position: "top-right",
        autoClose: 2000,
      });
    },
    // opcional: controla por cuánto tiempo los datos se consideran “frescos”
    // staleTime: 1000 * 60 * 5, // 5 minutos
  });

  return { user, isLoading, error, fetchUser };
};
