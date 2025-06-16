import { createUserShopkeeper } from "@/services/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify";



export const UseCreateUser =()=>{

const queryClient= useQueryClient();
const {mutate: useCreateMutation , isPending }= useMutation({
mutationFn : createUserShopkeeper,

onSuccess: ()=>{

    toast.success("Usuario creado correctamente.");
queryClient.invalidateQueries({ queryKey: ["user"] });
}
,onError: (error) => {
    toast.error("Error al crear el usuario: " + error.message);
},

})

return { useCreateMutation, isPending };


}