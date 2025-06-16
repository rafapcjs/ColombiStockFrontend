import { GetAllShopkeepers } from "@/services/auth"
import { useQuery } from "@tanstack/react-query"


export const UseGetUserShopKeeper =()=>{
    const { data, isLoading } = useQuery({
queryKey: ["user", "shopkeeper"],
queryFn: GetAllShopkeepers
    })
    return { data, isLoading }
}