import { CountProductWithLowStock } from "@/services/product"
import { useQuery } from "@tanstack/react-query"

export const UseCountProductLowStock = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["products", "low_stock"],

        queryFn: CountProductWithLowStock

    })

    return { data, isLoading };

}