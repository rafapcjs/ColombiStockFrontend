// src/types/factura.ts

export interface DetalleProductoDto {
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
}

export interface FacturaCompraDto {
  numeroFactura: string;
  proveedorNombre: string;
  fechaCompra: string; // formato "YYYY-MM-DD"
  productos: DetalleProductoDto[];
}

// Payload para crear/editar factura
export interface DetalleProductoPayload {
  productCode: string;
  cantidad: number;
  precioUnitario: number;
}

export interface FacturaCompraPayload {
  numeroFactura: string;
  fechaCompra: string; // formato "YYYY-MM-DD"
  proveedorDni: string;
  productos: DetalleProductoPayload[];
}
