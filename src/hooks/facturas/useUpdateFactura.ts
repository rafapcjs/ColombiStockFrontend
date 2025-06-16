 
import { UpdateFactura } from "@/services/factures";
import { FacturaCompraPayload } from "@/types/facturaMode";
import { getErrorMessage } from "@/utilities/getServerErrorMessage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useUpdateFactura = () => {
  const queryClient = useQueryClient();

  const { mutate: updateFacturaMutation, isLoading } = useMutation({
    mutationFn: ({
      numeroFactura,
      factura,
    }: {
      numeroFactura: string;
      factura: FacturaCompraPayload;
    }) => UpdateFactura(numeroFactura, factura),

    onSuccess: () => {
      // Invalidar cache de facturas para refetch
      queryClient.invalidateQueries({ queryKey: ["facturas"] });
      toast.success("Factura actualizada exitosamente.");
                  queryClient.invalidateQueries({ queryKey: ["sumProductTotally"] });

          queryClient.invalidateQueries({ queryKey: ["products"] });

    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return { updateFacturaMutation, isLoading };
};
