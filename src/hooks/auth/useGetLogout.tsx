import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { closeSession } from "@/services/auth";

/**
 * Hook de cierre de sesión usando TanStack Query v5.
 * 1. Dispara manualmente la petición GET /auth/logout.
 * 2. Borra el JWT del cliente (lo hace closeSession).
 * 3. Limpia la caché de React-Query cuando llega la respuesta.
 */
export const useGetLogout = () => {
  const queryClient = useQueryClient();

  const {
    refetch: logout,      // función que dispara el GET
    isFetching: isLoading,
    data,                 // cambia de undefined → respuesta cuando llega
  } = useQuery({
    queryKey: ["user"],
    queryFn: closeSession, // llama al endpoint y quita el token local
    enabled: false,        // ejecución manual
    staleTime: 0,          // no cacheamos un logout
  });

  // Efecto secundario: al recibir la respuesta, vacía la caché global
  useEffect(() => {
    if (data !== undefined) {
      queryClient.clear();
    }
  }, [data, queryClient]);

  return { logout, isLoading };
};
