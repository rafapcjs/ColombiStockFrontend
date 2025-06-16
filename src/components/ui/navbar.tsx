"use client" // Esto asegura que el componente se ejecute en el cliente.

import { useState, useRef } from "react"
import { useRouter } from "next/navigation" // ⬅️ NUEVO
import Link from "next/link"
import { BarChart3, Box, ChevronDown, LayoutDashboard, Menu, ShoppingBag, Tag, Truck, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ChangePasswordModal from "../auth/changePassword"
import ProfileModal from "../auth/profileModal"
import { useGetLogout } from "@/hooks/auth/useGetLogout" // ⬅️ NUEVO

/* -------------------------------------------------------------------------- */
/*                                   DATA                                     */
/* -------------------------------------------------------------------------- */

const menuItems = [
  { title: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, href: "/dashboardAdmin" },
  {
    title: "Catálogo",
    icon: <Tag className="h-5 w-5" />,
    submenu: [
      { title: "Categorías", href: "/category" },
      { title: "Productos", href: "/product/products" },
      { title: "Productos bajo stock", href: "/product/lowtStock" },
      { title: "Productos Más vendidos del mes", href: "/product/mostSales" },
    ],
  },
  {
    title: "Factura de compras",
    icon: <Tag className="h-5 w-5" />,
    submenu: [{ title: "Administrar facturas", href: "/facturas" }],
  },
  {
    title: "Proveedores",
    icon: <Truck className="h-5 w-5" />,
    submenu: [{ title: "Lista de Proveedores", href: "/suppliers" }],
  },
  {
    title: "Ver mis ganancias",
    icon: <Tag className="h-5 w-5" />,
    submenu: [
      { title: "Ganancias de hoy y la semana", href: "/profit" },
      { title: "Ganacia del mes", href: "/gananciaMensual" },
    ],
  },
  {
    title: "Ventas",
    icon: <ShoppingBag className="h-5 w-5" />,
    submenu: [
      { title: "Registro de ventas", href: "/ventas/registrar" },
      { title: "Ventas canceladas", href: "/ventas/canceladas" },
      { title: "Ver todas las ventas activas", href: "/ventas/activas" },
      { title: "Cancelar ventas", href: "/ventas/activas" },
    ],
  },
 {
    title: "Cuentas",
    icon: <Tag className="h-5 w-5" />,
    submenu: [
      { title: "Administar cuentas", href: "/shopKeeper" },
     ],
  },

 
]

/* -------------------------------------------------------------------------- */
/*                                  COMPONENT                                 */
/* -------------------------------------------------------------------------- */

export default function Navbar() {
  /* ---------- Hooks ---------- */
  const router = useRouter() // ⬅️ NUEVO
  const { logout, isLoading } = useGetLogout() // ⬅️ NUEVO

  const [openItem, setOpenItem] = useState<string | null>(null)
  const closeTimeout = useRef<number | null>(null)

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false)

  /* ---------- Estado Modal Confirmación de Cerrar Sesión ---------- */
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false) // Controlar apertura del modal de salir

  /* ---------- Handlers ---------- */
  const handleMouseEnter = (title: string) => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current)
      closeTimeout.current = null
    }
    setOpenItem(title)
  }

  const handleMouseLeave = () => {
    closeTimeout.current = window.setTimeout(() => {
      setOpenItem(null)
      closeTimeout.current = null
    }, 300)
  }

  // Función para abrir el modal de logout
  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true)
  }

  // Confirmación de logout
  const handleConfirmLogout = () => {
    logout().then(() => router.push("/auth/login"))
    setIsLogoutModalOpen(false) // Cerrar el modal después de cerrar sesión
  }

  // Cancelar logout
  const handleCancelLogout = () => {
    setIsLogoutModalOpen(false) // Solo cierra el modal
  }

  /* ---------------------------------------------------------------------- */

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
          {/* ----------------اريات Logo escritorio ----------------------- */}
          <div className="mr-4 hidden md:flex items-center gap-4">
            <Link href="/" className="flex items-center space-x-2">
              <Box className="h-6 w-6" />
              <span className="font-bold text-xl">ColombiStock</span>
            </Link>
          </div>

          {/* ------------------------- Menú móvil ------------------------- */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px]">
              <nav className="grid gap-6 text-lg font-medium">
                <Link href="/" className="flex items-center gap-2 text-lg font-bold">
                  <Box className="h-6 w-6" />
                  <span>AdminTienda</span>
                </Link>
                <div className="grid gap-3">
                  {menuItems.map((item) => (
                    <div key={item.title} className="grid gap-3 pl-3">
                      {item.submenu ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {item.icon}
                                <span>{item.title}</span>
                              </div>
                              <ChevronDown className="h-4 w-4" />
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-48">
                            {item.submenu.map((subItem) => (
                              <DropdownMenuItem key={subItem.title} asChild>
                                <Link href={subItem.href}>{subItem.title}</Link>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <Link href={item.href || "#"} className="flex items-center gap-2">
                          {item.icon}
                          <span>{item.title}</span>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          {/* ------------------------- Logo móvil ------------------------- */}
          <div className="mr-auto flex items-center gap-4 md:hidden">
            <Link href="/" className="flex items-center">
              <Box className="h-6 w-6 mr-2" />
              <span className="font-bold">ColombiStock</span>
            </Link>
          </div>

          {/* ---------------------- Menú escritorio ----------------------- */}
          <nav className="hidden md:flex items-center space-x-6 mx-6">
            {menuItems.map((item) => (
              <div
                key={item.title}
                className="relative"
                onMouseEnter={() => item.submenu && handleMouseEnter(item.title)}
                onMouseLeave={() => item.submenu && handleMouseLeave()}
              >
                {item.submenu ? (
                  <div
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => setOpenItem(openItem === item.title ? null : item.title)}
                  >
                    <span className="text-sm font-medium hover:text-primary">{item.title}</span>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                ) : (
                  <Link href={item.href || "#"} className="text-sm font-medium hover:text-primary">
                    {item.title}
                  </Link>
                )}

                {item.submenu && openItem === item.title && (
                  <div className="absolute left-0 top-full mt-2 w-48 rounded-md border bg-background shadow-md">
                    <div className="grid gap-1 p-2">
                      {item.submenu.map((sub) => (
                        <Link
                          key={sub.title}
                          href={sub.href}
                          className="block px-3 py-2 text-sm rounded-md hover:bg-accent"
                        >
                          {sub.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* ---------------------- Perfil de usuario ---------------------- */}
          <div className="flex items-center gap-4">
            <Button variant="destructive" size="sm" onClick={handleLogoutClick} disabled={isLoading}>
              {isLoading ? "Cerrando..." : "Salir"}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsProfileModalOpen(true)}>Mi Perfil</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsChangePasswordModalOpen(true)}>
                  Cambiar Contraseña
                </DropdownMenuItem>
                <DropdownMenuItem asChild></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* ----------------------------- Modal Confirmación Logout ----------------------------- */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-400/20 z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <h2 className="text-lg font-semibold mb-4">¿Estás seguro que deseas cerrar sesión?</h2>
            <div className="flex gap-4">
              <Button variant="destructive" onClick={handleConfirmLogout} disabled={isLoading}>
                {isLoading ? "Cerrando..." : "Aceptar"}
              </Button>
              <Button variant="outline" onClick={handleCancelLogout}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------- Modales ----------------------------- */}
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
      <ChangePasswordModal isOpen={isChangePasswordModalOpen} onClose={() => setIsChangePasswordModalOpen(false)} />
    </>
  )
}
