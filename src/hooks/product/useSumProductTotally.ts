import { SumTotallyStock } from "@/services/product"
import { useQuery } from "@tanstack/react-query"


export const UseSumProductTotally = () => {

    const { data, isLoading } = useQuery({
        queryKey: ["sumProductTotally"],
        queryFn: SumTotallyStock
    })

    return { sumTotally: data, isLoading }
}