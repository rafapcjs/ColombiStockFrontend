import { GetProductByCode } from "@/services/product";
import { useQuery } from "@tanstack/react-query";
 
export const UseFindProductByCode = (code: string) => {
  const { data: productByCode, isLoading } = useQuery({
    queryKey: ["product",code],
    queryFn: () => GetProductByCode(code),
  });

  return { productByCode, isLoading };
};