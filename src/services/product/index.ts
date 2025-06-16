import { colombiStockApi } from "@/api";
import { PaginatedResponse } from "@/types/PaginatedResponse";
import {
  ProductModel,
  ProductModeltDto,
  ProductCosts,
  CategoryProductCount
} from "@/types/products";

// ========== CRUD ==========

export const CreateProduct = async (product: ProductModel): Promise<ProductModel> => {
  const { data } = await colombiStockApi.post("/products", product);
  return data;
};

export const GetAllProducts = async (
  page = 0,
  size = 10,
  sortBy = "name",
  direction = "asc"
): Promise<PaginatedResponse<ProductModeltDto>> => {
  const url = `/products?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`;
  const { data } = await colombiStockApi.get(url);
  return data;
};

export const GetProductByCode = async (code: string): Promise<ProductModeltDto> => {
  const { data } = await colombiStockApi.get(`/products/${code}`);
  return data;
};

export const UpdateProductByCode = async (
  code: string,
  product: ProductModeltDto
): Promise<ProductModeltDto> => {
  const { data } = await colombiStockApi.put(`/products/${code}`, product);
  return data;
};

export const DeleteProductByCode = async (code: string): Promise<void> => {
  await colombiStockApi.delete(`/products/${code}`);
};

// ========== CONSULTAS ESPECIALES ==========

export const GetProductByCodeLowStock = async (
  page = 0,
  size = 10,
  sortBy = "name",
  direction = "asc"
): Promise<PaginatedResponse<ProductModeltDto>> => {
  const url = `/products/low_stock?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`;
  const { data } = await colombiStockApi.get(url);
  return data;
};

export const FindProductsByPriceBetween = async (): Promise<PaginatedResponse<ProductCosts>> => {
  const { data } = await colombiStockApi.get("/products/findProductsByPriceBetween");
  return data;
};

// ========== ESTADÍSTICAS ==========

export const CountProductsByCategory = async (): Promise<CategoryProductCount[]> => {
  const { data } = await colombiStockApi.get("/products/countProductsByCategory");
  return data;
};




 export const CountProductWithLowStock= async()=>{

  const {data}= await colombiStockApi.get('/products/count-low-stock');
  return data as number;
 }


 export const SumTotallyStock = async () => {
const { data } = await colombiStockApi.get('/products/total-stock');

return data as number;

 }