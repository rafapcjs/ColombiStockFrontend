import { GetCategoryByCode } from "@/services/category";
import { useQuery } from "@tanstack/react-query";
 
export const useGetByCodeCategory = (code: string) => {
  const { data: category, error, isLoading } = useQuery({
    queryKey: ["category", code],
    queryFn: () => GetCategoryByCode(code),
  });

  return { category, error, isLoading };
};