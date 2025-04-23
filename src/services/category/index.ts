import { colombiStockApi } from "@/api";
import { CategoryModel, CategoryModelDto } from "@/types/CategoryModel";
import { PaginatedResponse } from "@/types/PaginatedResponse";

// Crear una categoría
export const CreateCategory = async (category: CategoryModelDto) => {
  const { data } = await colombiStockApi.post("/categories", category);
  return data as CategoryModel;
};

// Eliminar una categoría por código
export const DeleteCategoryByCode = async (code: string) => {
  const { data } = await colombiStockApi.delete(`/categories/${code}`);
  return data;
};

// Actualizar una categoría por código
export const UpdateCategory = async (code: string, category: CategoryModel) => {
  const { data } = await colombiStockApi.put(`/categories/${code}`, category);
  return data as CategoryModel;
};

// Obtener todas las categorías con paginación y búsqueda
export const GetAllCategories = async (
  page = 0,
  size = 10,
  sortBy = "name",
  direction = "asc",
  searchTerm = ""
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sortBy,
    direction,
    ...(searchTerm.trim() && { name: searchTerm }),
  });

  const { data } = await colombiStockApi.get(`/categories?${params}`);
  return data as PaginatedResponse<CategoryModelDto>;
};

// Obtener categoría por código
export const GetCategoryByCode = async (code: string) => {
  const { data } = await colombiStockApi.get(`/categories/${code}`);
  return data as CategoryModelDto;
};
