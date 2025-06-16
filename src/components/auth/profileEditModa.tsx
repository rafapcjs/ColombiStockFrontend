 "use client";

import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useUpdateUserInSession } from "@/hooks/auth/useUpdateUserInSession";
import { UpdatePasswordUserInSessionModel } from "@/types/UserMode";

interface ProfileData {
  username: string;
  email: string;
  name: string;
  lastName: string;
  dni: string;
  phone: string;
  roleRequest: {
    roleListName: string[];
  };
}

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: ProfileData;
  onSave: (updated: ProfileData) => void;
}

export default function ProfileEditModal({
  isOpen,
  onClose,
  profileData,
  onSave,
}: ProfileEditModalProps) {
  const router = useRouter();
  const { updateUserMutation, isPending } = useUpdateUserInSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileData>({
    defaultValues: profileData,
  });

  // Al enviar el formulario, lanzamos la mutación y en onSuccess cerramos modal y redirigimos
  const onSubmit = (data: UpdatePasswordUserInSessionModel) => {
    updateUserMutation(data, {
      onSuccess: () => {
        onSave(data as ProfileData);
        onClose();
       },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Editar Perfil</DialogTitle>
          <DialogDescription>
            Actualice su información personal. Haga clic en guardar cuando termine.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          {/* Usuario (solo lectura) */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Usuario
            </Label>
            <div className="col-span-3">
              <Input
                id="username"
                value={profileData.username}
                disabled
                className="bg-gray-100"
              />
              <p className="text-xs text-muted-foreground mt-1">
                El nombre de usuario no se puede cambiar
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <div className="col-span-3">
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: "El email es obligatorio",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Dirección de email inválida",
                  },
                })}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Nombre */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nombre
            </Label>
            <div className="col-span-3">
              <Input
                id="name"
                {...register("name", { required: "El nombre es obligatorio" })}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>

          {/* Apellido */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastName" className="text-right">
              Apellido
            </Label>
            <div className="col-span-3">
              <Input
                id="lastName"
                {...register("lastName", {
                  required: "El apellido es obligatorio",
                })}
              />
              {errors.lastName && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* DNI */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dni" className="text-right">
              DNI
            </Label>
            <div className="col-span-3">
              <Input
                id="dni"
                {...register("dni", { required: "El DNI es obligatorio" })}
              />
              {errors.dni && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.dni.message}
                </p>
              )}
            </div>
          </div>

          {/* Teléfono */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Teléfono
            </Label>
            <div className="col-span-3">
              <Input
                id="phone"
                {...register("phone", {
                  required: "El teléfono es obligatorio",
                })}
              />
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          {/* Roles (solo vista) */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Roles</Label>
            <div className="col-span-3 flex flex-wrap gap-2">
              {profileData.roleRequest.roleListName.map((role) => (
                <Badge key={role} variant="secondary">
                  {role}
                </Badge>
              ))}
              <p className="w-full text-xs text-muted-foreground mt-1">
                Los roles solo pueden ser modificados por un administrador
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
                </>
              ) : (
                "Guardar cambios"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
