import { colombiStockApi } from "@/api";
import { CategoryModel, CategoryModelDto } from "@/types/categoryModel";
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
  page: number = 0,
  size: number = 10,
  sortBy: string = "name",
  direction: string = "asc",
  searchTerm: string = ""
): Promise<PaginatedResponse<CategoryModelDto>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sortBy,
    direction,
  });

  if (searchTerm.trim()) {
    params.append("name", searchTerm); // Cambia "name" según lo que tu API espere
  }

  const url = `/categories?${params.toString()}`;

  try {
    const { data } = await colombiStockApi.get(url);
    return data as PaginatedResponse<CategoryModelDto>;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Error al obtener las categorías";
    throw new Error(errorMessage);
  }
};

// Obtener categoría por código
export const GetCategoryByCode = async (code: string): Promise<CategoryModelDto> => {
  try {
    const { data } = await colombiStockApi.get(`/categories/${code}`);
    return data as CategoryModelDto;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Error al obtener la categoría por código";
    throw new Error(errorMessage);
  }
};
