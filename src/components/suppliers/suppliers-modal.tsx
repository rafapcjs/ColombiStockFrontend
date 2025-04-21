 "use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

import { SuppliersModel } from "@/types/SuppliersModel";
import { UseCreateSuppliers } from "@/hooks/suppliers/useCreateSuppliers";
import { useUpdateSuppliersByDni } from "@/hooks/suppliers/useUpdateSuppliersByDni";

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: SuppliersModel | null;
  mode: "create" | "edit";
}

function SupplierModal({ isOpen, onClose, supplier, mode }: SupplierModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Partial<SuppliersModel>>();

  const { CreateSuppliersMutation } = UseCreateSuppliers();
  const { updateSuppliersByDniMutation } = useUpdateSuppliersByDni();

  useEffect(() => {
    if (supplier && mode === "edit") {
      setValue("name", supplier.name);
      setValue("lastName", supplier.lastName);
      setValue("dni", supplier.dni);
      setValue("phone", supplier.phone);
      setValue("email", supplier.email);
    } else {
      reset();
    }
  }, [supplier, mode, setValue, reset]);

  const onSubmit = (data: Partial<SuppliersModel>) => {
    const handleError = (error: any) => {
      const message = error.response?.data?.message || "An error occurred";
      if (message.includes("dni")) {
        setError("dni", { message });
      }
      if (message.includes("email")) {
        setError("email", { message });
      }
    };

    if (mode === "create") {
      CreateSuppliersMutation(data as SuppliersModel, {
        onSuccess: () => {
          onClose();
          reset();
        },
        onError: handleError,
      });
    } else if (mode === "edit" && supplier) {
      updateSuppliersByDniMutation(
        {
          dni: supplier.dni,
          suppliers: data as SuppliersModel,
        },
        {
          onSuccess: onClose,
          onError: handleError,
        }
      );
    }
  };

  const title = mode === "create" ? "Create Supplier" : "Edit Supplier";
  const buttonText = mode === "create" ? "Create" : "Update";
  const isLoading = isSubmitting;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          
          {/* Nombre */}
          <div className="grid gap-2">
            <Label htmlFor="name">First Name</Label>
            <Input
              id="name"
              {...register("name", {
                required: "El nombre no puede estar vacío.",
                maxLength: { value: 100, message: "El nombre no puede exceder los 100 caracteres." },
              })}
              placeholder="First name"
              disabled={isLoading}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          {/* Apellido */}
          <div className="grid gap-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              {...register("lastName", {
                required: "El apellido no puede estar vacío.",
                maxLength: { value: 100, message: "El apellido no puede exceder los 100 caracteres." },
              })}
              placeholder="Last name"
              disabled={isLoading}
            />
            {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
          </div>

          {/* DNI */}
          <div className="grid gap-2">
            <Label htmlFor="dni">DNI</Label>
            <Input
              id="dni"
              {...register("dni", {
                required: mode === "create" ? "El DNI no puede estar vacío." : false,
                maxLength: { value: 20, message: "El DNI no puede exceder los 20 caracteres." },
              })}
              placeholder="DNI"
              disabled={isLoading || mode === "edit"}
            />
            {errors.dni && <p className="text-sm text-destructive">{errors.dni.message}</p>}
            {mode === "edit" && <p className="text-xs text-muted-foreground">DNI cannot be changed after creation</p>}
          </div>

          {/* Teléfono */}
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              {...register("phone", {
                required: "El número de contacto no puede estar vacío.",
                maxLength: { value: 15, message: "El número de contacto no puede exceder los 15 caracteres." },
              })}
              placeholder="Phone number"
              disabled={isLoading}
            />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
          </div>

          {/* Email */}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email", {
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "El formato del correo electrónico no es válido.",
                },
                maxLength: { value: 100, message: "El correo electrónico no puede exceder los 100 caracteres." },
              })}
              placeholder="Email address"
              disabled={isLoading}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {buttonText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default SupplierModal;
