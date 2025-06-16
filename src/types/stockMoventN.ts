export interface StockMovementModel {
    code: number;
    nameProduct:string
    productCode: string;
    name :string
    quantity: number;
    movementType: 'STOCK_IN' | 'STOCK_OUT'; // Assuming these are the only possible values
    movementDate: string; // You can use Date if you prefer
    description: string;
    updateDate: string; // You can use Date if you prefer
    statusEntity: 'ACTIVE' | 'INACTIVE'; // Assuming these are the only possible values
  }
  
  export type  StockMovementModelDto = Omit< StockMovementModel,"Id_">;