import { colombiStockApi } from "@/api";
import { PaginatedResponse } from "@/types/PaginatedResponse";
import { SuppliersModel, SuppliersModelDto } from "@/types/SuppliersModel";

export const CreateSuppliers = async (suppliers: SuppliersModel) => {
  const { data } = await colombiStockApi.post("/suppliers", suppliers);

  return data as SuppliersModel;
};

export const DeleteSuppliersByDni = async (dni: string) => {
  const { data } = await colombiStockApi.delete(`/suppliers/${dni}`);
  return data;
};

export const UpdateSuppliers = async (
  dni: string,
  suppliers: SuppliersModel
) => {
  const { data } = await colombiStockApi.put(`/suppliers/${dni}`, suppliers);
  return data as SuppliersModelDto;
};
export const GetAllSuppliers = async (
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

  const { data } = await colombiStockApi.get(`/suppliers?${params}`);
  return data as PaginatedResponse<SuppliersModelDto>;
};

export const GetSuppliersByEmail = async (email: string) => {
  const { data } = await colombiStockApi.get(`/suppliers/${email}`);
  return data as SuppliersModelDto;
};
