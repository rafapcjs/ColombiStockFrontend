export interface ProductModel {
  name: string;
  description?: string;
  price: number;
  purchasePrice: number;
  stock: number;
  stockMin: number;
  unit?: string;
  code: string;
  codigoCategoria: string;
  dni_provedor: string;
  suppliersName: string;
}

export type ProductModeltDto = Omit<ProductModel, "id_">;
export type UpdateProductModel = Partial<ProductModel>;

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
