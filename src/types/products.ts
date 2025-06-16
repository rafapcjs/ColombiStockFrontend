export interface ProductModel {
  name: string;
  description?: string;
  price: number;
  purchasePrice: number;
  stock: number;
  stockMin: number;
  unit?: string;
  code: string;
  nameCategory: string;
  nameSuppliers: string;
  // Agrega estos campos para el formulario
  codigoCategoria?: string;
  dni_provedor?: string;
}

export type ProductModeltDto = Omit<ProductModel, "id_">;
export type UpdateProductModel = Partial<ProductModel>;

// ...resto del archivo...
export type ProductCosts = {
  id: number;
  name: string;
  description?: string;
  price: number;
  purchasePrice: number;
  stock: number;
  stockMin: number;
  unit?: string;
  code: string;
  codigoCategoria: string;
};


export type CategoryProductCount = {
  categoryName: string;
  countProductsByCategory: number;
};
export interface MostSoldProduct {
  productName: string;
  productCode: string;
  totalQuantity: number;
}
