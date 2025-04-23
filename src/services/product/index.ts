import { colombiStockApi } from "@/api";
import { PaginatedResponse } from "@/types/PaginatedResponse";
import { CategoryProductCount, ProductCosts, ProductModel, ProductModeltDto } from "@/types/ProductModel";

 

export const DeleteProductByCode = async (code: string) => {
  const { data } = await colombiStockApi.delete(`/products/${code}`);
  return data;
};

 

export const GetProductByCodeLowStock = async (
  page: number = 0,
  size: number = 10,
  sortBy: string = "name",
  direction: string = "asc"
) => {
  const url = `/products/search/low-stock?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`;

  const { data } = await colombiStockApi.get(url);

  return data as PaginatedResponse<ProductModeltDto>;
};

export const FindProductsByPriceBetween = async () => {
  const { data } = await colombiStockApi.get(
    "/products/findProductsByPriceBetween"
  );

  return data as PaginatedResponse<ProductCosts>;
};

export const CountProductsByCategory = async (): Promise<
  CategoryProductCount[]
> => {
  const { data } = await colombiStockApi.get("/products/countProductsByCategory");
  return data as CategoryProductCount[];
};

export const GetProductByCode = async (code: string) => {
  const { data } = await colombiStockApi.get(`/products/${code}`);
  return data as ProductModeltDto;
};

export const UpdateProductByCode = async (
  code: string,
  product: ProductModeltDto
) => {
  const { data } = await colombiStockApi.put(`/products/${code}`, product);
  return data as ProductModeltDto;
};

export const GetAllProducts = async (
  page: number = 0,
  size: number = 10,
  sortBy: string = "name",
  direction: string = "asc"
) => {
  const url = `/products?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`;

  const { data } = await colombiStockApi.get(url);

  return data as PaginatedResponse<ProductModeltDto>;
};

export const CreateProduct = async (product: ProductModel) => {
  const { data } = await colombiStockApi.post("/products", product);
  return data as ProductModel;
};
 