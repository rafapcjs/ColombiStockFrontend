import { colombiStockApi } from "@/api";
import { FacturaCompraDto, FacturaCompraPayload } from "@/types/facturaMode";
import { PaginatedResponse } from "@/types/PaginatedResponse";


export const CreateFactura = async (
    factura: FacturaCompraPayload
): Promise<string> => {
    const { data } = await colombiStockApi.post<string>(
        "/facturas-compra",
        factura
    );
    return data;
};

export const UpdateFactura = async (
  numeroFactura: string,
  factura: FacturaCompraPayload
): Promise<string> => {
  const encodedNumero = encodeURIComponent(numeroFactura);
  const { data } = await colombiStockApi.put<string>(
    `/facturas-compra/${encodedNumero}`,
    factura
  );
  return data;
};

 
export const GetAllFacturas = async (
  page = 0,
  size = 10,
  sortBy = "fechaCompra",
  direction: "asc" | "desc" = "desc"
): Promise<PaginatedResponse<FacturaCompraDto>> => {
  const url = `/facturas-compra?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`;
  const { data } = await colombiStockApi.get<PaginatedResponse<FacturaCompraDto>>(url);
  return data;
};