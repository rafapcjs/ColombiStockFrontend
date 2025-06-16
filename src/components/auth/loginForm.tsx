 // src/app/auth/login/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLogin } from '@/hooks/auth/useLogin';
import { useRecoverAccount } from '@/hooks/auth/useRecoverAccount';
import { AuthCredentials } from '@/types/UserMode';

type ResetFormInputs = {
  email: string;
};

export default function LoginForm() {
  const { login, isPending: isLoginPending } = useLogin();
  const { recover, isPending: isRecovering, isSuccess: isRecoverSuccess } = useRecoverAccount();
  const router = useRouter();
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Animación al montar
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timeoutId = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timeoutId);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors: loginErrors, isSubmitting: isLoggingIn },
  } = useForm<AuthCredentials>();

  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    formState: { errors: resetErrors },
    reset: resetForm,
  } = useForm<ResetFormInputs>();

  // Manejo de inicio de sesión
  const onLogin = async (data: AuthCredentials) => {
    setLoginError(null);
    try {
      await login(data);
      router.push('/dashboardAdmin'); // Redirigir al dashboard tras login exitoso
    } catch (error: any) {
      setLoginError(error.message || 'Error al iniciar sesión');
    }
  };

  // Manejo de recuperación de cuenta
  const onResetPassword = (data: ResetFormInputs) => {
    recover(data.email);
  };

  // Cerrar diálogo tras recuperación exitosa
  useEffect(() => {
    if (isRecoverSuccess) {
      setIsResetDialogOpen(false);
      resetForm();
    }
  }, [isRecoverSuccess, resetForm]);

  return (
    <div className="flex min-h-screen" suppressHydrationWarning>
      {/* Lado izquierdo con imagen */}
      <div className="hidden md:block md:w-2/3 bg-[#e8effa] relative">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <Image
            src="/img/fondoHome.png"
            alt="Imagen representativa"
            width={1200}
            height={700}
            className="object-cover rounded-2xl"
            priority
          />
        </div>
        <div className="absolute bottom-10 left-0 right-0 text-center text-white">
          <p className="mt-44 text-xl">Sistema de gestión para su negocio</p>
        </div>
      </div>

      {/* Lado derecho con formulario */}
      <div className="w-full md:w-1/3 flex flex-col justify-center items-center p-8">
        <div
          className={`w-full max-w-md transform transition-all duration-700 ease-out
            ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image
              src="/img/logoSinFondo.png"
              alt="Logo"
              width={140}
              height={60}
              priority
            />
          </div>

          {/* Título */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold">Hola, bienvenido a ColombiStock</h1>
            <p className="text-gray-600 mt-2">
              Ingrese sus datos para iniciar sesión en su cuenta
            </p>
          </div>

          {/* Error de inicio de sesión */}
          {loginError && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}

          {/* Formulario de login */}
          <form onSubmit={handleSubmit(onLogin)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Nombre de usuario</Label>
              <Input
                id="username"
                type="text"
                placeholder="Ingrese su nombre de usuario"
                className="h-12"
                {...register('username', { required: 'Este campo es obligatorio' })}
                disabled={isLoggingIn || isLoginPending}
              />
              {loginErrors.username && (
                <p className="text-sm text-red-600">{loginErrors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Ingrese su contraseña"
                  className="h-12 pr-10"
                  {...register('password', { required: 'Este campo es obligatorio' })}
                  disabled={isLoggingIn || isLoginPending}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {loginErrors.password && (
                <p className="text-sm text-red-600">{loginErrors.password.message}</p>
              )}
            </div>

            <div className="text-right">
              <button
                type="button"
                className="text-blue-600 text-sm hover:underline"
                onClick={() => setIsResetDialogOpen(true)}
              >
                ¿Olvidó su contraseña?
              </button>
            </div>

            <Button className="w-full h-12" type="submit" disabled={isLoggingIn || isLoginPending}>
              {isLoggingIn || isLoginPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Accediendo...</>
              ) : (
                'Acceder'
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Modal de recuperación de contraseña */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent
          className="fixed top-[52%] left-[84%] transform -translate-x-1/2 -translate-y-1/2 sm:max-w-[425px] w-full bg-white shadow-lg rounded-lg"
          suppressHydrationWarning
        >
          <DialogHeader>
            <DialogTitle>Recuperar contraseña</DialogTitle>
            <DialogDescription>
              Ingrese su correo electrónico y le enviaremos un correo con instrucciones.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitReset(onResetPassword)}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  placeholder="Ingrese su correo electrónico"
                  {...registerReset('email', { required: 'Este campo es obligatorio' })}
                  disabled={isRecovering}
                />
                {resetErrors.email && (
                  <p className="text-sm text-red-600">{resetErrors.email.message}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsResetDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isRecovering}>
                {isRecovering ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enviando...</>
                ) : (
                  'Enviar instrucciones'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}