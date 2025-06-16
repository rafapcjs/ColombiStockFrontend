"use client"
import type React from "react"
import { useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UserPlus, Users, Mail, Phone, CreditCard, User, Shield, CheckCircle, XCircle, Trash2, Loader2, Search, Key } from "lucide-react"

import type { ChangePasswordEasy, UserModel } from "@/types/UserMode"
import { UseGetUserShopKeeper } from "@/hooks/auth/useGetUserShopKeeper"
import { UseCreateUser } from "@/hooks/auth/useCreateUser"
import { UseDeleteUser } from "@/hooks/auth/useDeleteUser"
import { UseUpdateUserInactive } from "@/hooks/auth/useUpdateUserInacive"
import { UseUpdateUserActivate } from "@/hooks/auth/useUpdateUserActivate"
import { UseChangesPasswordEasy } from "@/hooks/auth/useChangesPasswordEasy"
import { Separator } from "@radix-ui/react-dropdown-menu"
import Navbar from "@/components/ui/navbar"

export const ShopkeeperManager: React.FC = () => {
  // Hooks de datos y mutaciones
  const { data: users, isLoading: loadingUsers } = UseGetUserShopKeeper()
  const { useCreateMutation, isPending: creating } = UseCreateUser()
  const { UpdateUserActivateMutation, isPending: activating } = UseUpdateUserActivate()
  const { updateUserStatesInactive, isPending: deactivating } = UseUpdateUserInactive()
  const { UseDeleteMutation, isPending: deleting } = UseDeleteUser()
  const { changePasswordMutation, isPending: changingPassword } = UseChangesPasswordEasy()

  // Estado local
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [selectedUserDni, setSelectedUserDni] = useState<string>("")

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserModel>()

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<ChangePasswordEasy>()

  const onSubmit = useCallback(
    async (data: UserModel) => {
      await useCreateMutation(data)
      reset()
      setShowForm(false)
    },
    [useCreateMutation, reset, setShowForm],
  )

  const onPasswordSubmit = useCallback(
    async (data: ChangePasswordEasy) => {
      await changePasswordMutation({ dni: selectedUserDni, password_easy: data })
      resetPassword()
      setShowPasswordForm(false)
      setSelectedUserDni("")
    },
    [changePasswordMutation, resetPassword, setShowPasswordForm, setSelectedUserDni, selectedUserDni],
  )

  const handleChangePassword = (dni: string) => {
    setSelectedUserDni(dni)
    setShowPasswordForm(true)
  }

  const filteredUsers = users?.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.dni.includes(searchTerm),
  )

  return (
    <>

      <Navbar />
          <main className="container mx-auto py-40 px-4"> 
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Shopkeepers</h1>
        </div>
        <p className="text-muted-foreground">Administra las cuentas de usuarios shopkeepers del sistema</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{users?.filter((u) => u.enabled).length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Inactivos</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{users?.filter((u) => !u.enabled).length || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por username, email o DNI..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Nuevo Shopkeeper
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Crear Nuevo Shopkeeper
                  </DialogTitle>
                  <DialogDescription>
                    Completa la información para crear una nueva cuenta de shopkeeper
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <ScrollArea className="max-h-[400px] pr-4">
                    <div className="space-y-4">
                      {/* Información de Acceso */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          <h4 className="font-medium">Información de Acceso</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                              id="username"
                              {...register("username", { required: "Username es requerido" })}
                              placeholder="Ingresa username"
                            />
                            {errors.username && <p className="text-sm text-red-600">{errors.username.message}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input
                              id="password"
                              type="password"
                              {...register("password", { required: "Contraseña es requerida" })}
                              placeholder="Ingresa contraseña"
                            />
                            {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Información Personal */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <h4 className="font-medium">Información Personal</h4>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="email"
                                type="email"
                                {...register("email", { required: "Email es requerido" })}
                                placeholder="correo@ejemplo.com"
                                className="pl-10"
                              />
                            </div>
                            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Nombre</Label>
                              <Input
                                id="name"
                                {...register("name", { required: "Nombre es requerido" })}
                                placeholder="Nombre"
                              />
                              {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="lastName">Apellido</Label>
                              <Input
                                id="lastName"
                                {...register("lastName", { required: "Apellido es requerido" })}
                                placeholder="Apellido"
                              />
                              {errors.lastName && <p className="text-sm text-red-600">{errors.lastName.message}</p>}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="dni">DNI</Label>
                              <div className="relative">
                                <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  id="dni"
                                  {...register("dni", { required: "DNI es requerido" })}
                                  placeholder="12345678"
                                  className="pl-10"
                                />
                              </div>
                              {errors.dni && <p className="text-sm text-red-600">{errors.dni.message}</p>}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="phone">Teléfono</Label>
                              <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  id="phone"
                                  {...register("phone", { required: "Teléfono es requerido" })}
                                  placeholder="+1234567890"
                                  className="pl-10"
                                />
                              </div>
                              {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Roles */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          <h4 className="font-medium">Roles</h4>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="roles">Roles (separados por coma)</Label>
                          <Input
                            id="roles"
                            {...register("roleRequest.roleListName", {
                              setValueAs: (v) => v.split(",").map((s: string) => s.trim()),
                            })}
                            placeholder="ADMIN, USER, SHOPKEEPER"
                          />
                          <p className="text-sm text-muted-foreground">Ejemplo: ADMIN, USER, SHOPKEEPER</p>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={creating}>
                      {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {creating ? "Creando..." : "Crear Shopkeeper"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lista de Shopkeepers
          </CardTitle>
          <CardDescription>{filteredUsers?.length || 0} usuario(s) encontrado(s)</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingUsers ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Cargando usuarios...</span>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Información Personal</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers?.map((user) => (
                    <TableRow key={user.dni}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{user.username}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <CreditCard className="h-3 w-3" />
                            {user.dni}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">
                            {user.lastName} {user.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          {user.phone}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.enabled ? "default" : "secondary"}>
                          {user.enabled ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                              Activo <span className="ml-1 text-xs text-green-700 font-mono"></span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-1 text-red-600" />
                              Inactivo <span className="ml-1 text-xs text-red-700 font-mono"></span>
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleChangePassword(user.dni)}
                            className="gap-1"
                          >
                            <Key className="h-3 w-3" />
                            Contraseña
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => UpdateUserActivateMutation({ dni: user.dni })}
                            disabled={activating}
                            className="gap-1"
                          >
                            {activating ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <CheckCircle className="h-3 w-3" />
                            )}
                            Activar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateUserStatesInactive({ dni: user.dni })}
                            disabled={deactivating}
                            className="gap-1"
                          >
                            {deactivating ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <XCircle className="h-3 w-3" />
                            )}
                            Desactivar
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive" disabled={deleting} className="gap-1">
                                {deleting ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Trash2 className="h-3 w-3" />
                                )}
                                Eliminar
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Se eliminará permanentemente la cuenta de{" "}
                                  {user.username}.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => UseDeleteMutation(user.dni)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredUsers?.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No se encontraron usuarios que coincidan con la búsqueda
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para cambio de contraseña */}
      <Dialog open={showPasswordForm} onOpenChange={setShowPasswordForm}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Cambiar Contraseña
            </DialogTitle>
            <DialogDescription>
              Ingresa la nueva contraseña para el usuario con DNI: {selectedUserDni}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nueva Contraseña</Label>
              <div className="relative">
                <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="newPassword"
                  type="password"
                  {...registerPassword("newPassword", {
                    required: "La contraseña es requerida",
                    minLength: { value: 6, message: "La contraseña debe tener al menos 6 caracteres" },
                  })}
                  placeholder="Ingresa la nueva contraseña"
                  className="pl-10"
                />
              </div>
              {passwordErrors.newPassword && <p className="text-sm text-red-600">{passwordErrors.newPassword.message}</p>}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowPasswordForm(false)
                  setSelectedUserDni("")
                  resetPassword()
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={changingPassword}>
                {changingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {changingPassword ? "Cambiando..." : "Cambiar Contraseña"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
</main>
</>
  )
}

export default ShopkeeperManager