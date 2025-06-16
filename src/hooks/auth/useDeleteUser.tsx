import { DeleteUsers } from "@/services/auth";
import { getErrorMessage } from "@/utilities/getServerErrorMessage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { use } from "react"
import { toast } from "react-toastify";


export const UseDeleteUser =()=>{
const queryClient = useQueryClient();
const {mutate: UseDeleteMutation, isPending}= useMutation({

    mutationFn: DeleteUsers,
    onSuccess:()=>{
        toast.success("Usuario eliminado correctamente.");
        queryClient.invalidateQueries({ queryKey: ["user"] });
    },

    onError: (error) => {
    const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    }


})


return{ UseDeleteMutation, isPending};



}