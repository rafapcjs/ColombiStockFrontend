import { GetAllCategories } from "@/services/category"
import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import type { CategoryModel } from "@/types/CategoryModel"
import { PaginatedResponse } from "@/types/PaginatedResponse"
 
export const useGetAllCategories = (page = 0, size = 10, sortBy = "name", direction = "asc", searchTerm = "") => {
  const {
    data: categories,
    isLoading,
    isSuccess,
    isError,
    error,
  }: UseQueryResult<PaginatedResponse<CategoryModel>, Error> = useQuery({
    queryKey: ["categories", page, size, sortBy, direction, searchTerm],
    queryFn: () => GetAllCategories(page, size, sortBy, direction, searchTerm),
  })

  return { categories, isLoading, isSuccess, isError, error }
}
