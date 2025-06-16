// src/hooks/useCreateFactura.ts
 ;
import { CreateFactura } from "@/services/factures";
import { FacturaCompraPayload } from "@/types/facturaMode";
import { getErrorMessage } from "@/utilities/getServerErrorMessage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
 

export const useCreateFactura = () => {
  const queryClient = useQueryClient();

  const { mutate: createFacturaMutation, isLoading } = useMutation({
    mutationFn: (payload: FacturaCompraPayload) => CreateFactura(payload),

    onSuccess: () => {
      // Invalida el cache de facturas para refetch
      queryClient.invalidateQueries({ queryKey: ["facturas"] });
                  queryClient.invalidateQueries({ queryKey: ["sumProductTotally"] });

      // Invalida el cache de facturas por proveedor para refetch
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Factura creada correctamente.");
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return { createFacturaMutation, isLoading };
};
