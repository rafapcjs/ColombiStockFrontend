export interface StockMovement {
    quantity: string;
    description: string;
    productCode: string;
  }
  
  export type StockMovementDto = Omit<StockMovement, "id_">;
  
  export type UpdateStockMovement = Partial<StockMovement>;