"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { useChangesPassword } from "@/hooks/auth/useChangesPassword";
import type { ChangePasswordFormData } from "@/types/UserMode";   // { oldPassword; newPassword; confirmPassword }

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  /* toggles de visibilidad */
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* UX */
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* hook de cambio de contraseña */
  const { changePasswordMutation, isPending } = useChangesPassword();

  /* form */
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ChangePasswordFormData>();

  const newPassword = watch("newPassword");

  /* submit */
  const onSubmit = (data: ChangePasswordFormData) => {
    setError(null);
    setSuccess(false);

    changePasswordMutation(
      {
        /* 👇 mapeamos al DTO que el backend espera */
        currentPassword: data.oldPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: () => {
          setSuccess(true);
          reset();
          setTimeout(onClose, 2000);
        },
        onError: () => {
          setError("No se pudo cambiar la contraseña. Inténtalo de nuevo.");
        },
      },
    );
  };

  /* no renderizar si el modal está cerrado */
  if (!isOpen) return null;

  return (
    <>
      {/* overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-50"
        aria-hidden="true"
        onClick={() => !isPending && onClose()}
      />

      {/* modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
        <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md">

          {/* header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold">Cambiar Contraseña</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 focus:outline-none" disabled={isPending}>
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* content */}
          <div className="p-4">
            {success ? (
              <Alert className="bg-green-50 border-green-200 text-green-800 mb-4">
                <AlertDescription>¡Contraseña cambiada exitosamente!</AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* contraseña actual */}
                <div className="space-y-2">
                  <Label htmlFor="oldPassword">Contraseña actual</Label>
                  <div className="relative">
                    <Input
                      id="oldPassword"
                      type={showOldPassword ? "text" : "password"}
                      className="pr-10"
                      {...register("oldPassword", { required: "La contraseña actual es obligatoria" })}
                      disabled={isPending}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                    >
                      {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.oldPassword && <p className="text-sm text-red-500">{errors.oldPassword.message}</p>}
                </div>

                {/* nueva contraseña */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nueva contraseña</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      className="pr-10"
                      {...register("newPassword", {
                        required: "La nueva contraseña es obligatoria",
                        minLength: { value: 8, message: "Debe tener al menos 8 caracteres" },
                      })}
                      disabled={isPending}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.newPassword && <p className="text-sm text-red-500">{errors.newPassword.message}</p>}
                </div>

                {/* confirmar */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className="pr-10"
                      {...register("confirmPassword", {
                        required: "Debe confirmar la nueva contraseña",
                        validate: (value) => value === newPassword || "Las contraseñas no coinciden",
                      })}
                      disabled={isPending}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
                </div>

                {/* acciones */}
                <div className="pt-2 flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
                      </>
                    ) : (
                      "Cambiar Contraseña"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
