import { UpdateStateActive } from "@/services/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const UseUpdateUserActivate =()=>{


    const queryClient = useQueryClient();

    const{ mutate:UpdateUserActivateMutation , isPending }= useMutation({

mutationFn: ({dni} :{dni: string}) => UpdateStateActive(dni),
onSuccess:()=>{

    queryClient.invalidateQueries({ queryKey: ["user"] });
    toast.success("Usuario activado correctamente.");
},
onError: (error) => {

    toast.error("No se pudo activar.");
}



    })
  return { UpdateUserActivateMutation, isPending };

}