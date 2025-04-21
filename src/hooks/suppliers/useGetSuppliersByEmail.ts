import { GetSuppliersByEmail } from "@/services/suppliers";
import { useQuery } from "@tanstack/react-query";
 
export const UseGetSuppliersByEmail = (email: string) => {
  const { data: suppliersByEmail, isLoading } = useQuery({
    queryKey: ["suppliers", email],
    queryFn: () => GetSuppliersByEmail(email),
  });

  return { suppliersByEmail, isLoading };
};