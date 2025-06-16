
export interface SalesCreate{
    codeProduct: string,
    quantity: string,
}
export type SaletDto = Omit<SalesCreate,"id_">;
export type UpdateSale= Partial<SalesCreate>;

export type Sales ={
    saleId: string;
    saleDate: string;
    totalAmount: number;
    details: {
      productName: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }[];
}


// DTO para el detalle de una línea de venta
export interface SaleProductLineDetailDTO {
  productCode: string;    // Código del producto
  productName: string;    // Nombre del producto
  quantity: number;       // Cantidad vendida
  unitPrice: number;      // Precio unitario de venta
  unitCost: number;       // Precio de compra unitario
  revenueLine: number;    // Ingresos por línea de producto
  costLine: number;       // Costo por línea de producto
  profitLine: number;     // Ganancia por línea de producto
}

// DTO para los detalles de la venta
export interface SaleProfitDetailDTO {
  saleId: string;                // ID de la venta
  saleDate: string;              // Fecha de la venta
  lines: SaleProductLineDetailDTO[];  // Detalles de las líneas de productos
  totalRevenue: number;          // Total de ingresos por la venta
  totalCost: number;             // Total de costos por la venta
  totalProfit: number;           // Ganancia total de la venta
}

// DTO para el reporte de ganancias (diario)
export interface ProfitReportDTO {
  periodLabel: string;            // Etiqueta para el periodo (ej. "2025-06-04")
  details: SaleProfitDetailDTO[]; // Detalles de las ventas para ese periodo
  totalRevenue: number;           // Total de ingresos para el periodo
  totalCost: number;              // Total de costos para el periodo
  totalProfit: number;            // Ganancia total para el periodo
}
