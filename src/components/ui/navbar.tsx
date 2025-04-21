 "use client"

import { useState } from "react"
import Link from "next/link"
import {
  BarChart3,
  Box,
  ChevronDown,
  LayoutDashboard,
  Menu,
  Settings,
  ShoppingBag,
  Tag,
  Truck,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Menú principal
const menuItems = [
  { title: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, href: "/dashboard" },
  {
    title: "Catálogo",
    icon: <Tag className="h-5 w-5" />,
    submenu: [
      { title: "Categorías", href: "/category" },
      { title: "Productos", href: "/product" },
      { title: "Inventario", href: "/inventario" },
    ],
  },
  {
    title: "Proveedores",
    icon: <Truck className="h-5 w-5" />,
    submenu: [
      { title: "Lista de Proveedores", href: "/suppliers" },
      { title: "Pedidos a Proveedores", href: "/pedidos-proveedores" },
      { title: "Facturas", href: "/facturas-proveedores" },
    ],
  },
  {
    title: "Ventas",
    icon: <ShoppingBag className="h-5 w-5" />,
    submenu: [
      { title: "Pedidos", href: "/pedidos" },
      { title: "Facturas", href: "/facturas" },
      { title: "Devoluciones", href: "/devoluciones" },
    ],
  },
  { title: "Clientes", icon: <Users className="h-5 w-5" />, href: "/clientes" },
  { title: "Informes", icon: <BarChart3 className="h-5 w-5" />, href: "/informes" },
  { title: "Configuración", icon: <Settings className="h-5 w-5" />, href: "/configuracion" },
]

export default function Navbar() {
  const [openItem, setOpenItem] = useState<string | null>(null)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const toggleSubmenu = (title: string) => {
    setOpenItem(openItem === title ? null : title)
  }

  const handleMouseEnter = (title: string) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }
    setOpenItem(title)
  }

  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      setOpenItem(null)
    }, 400) // 400ms de delay al salir
    setTimeoutId(id)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Box className="h-6 w-6" />
            <span className="font-bold text-xl">ColombiStock</span>
          </Link>
        </div>

        {/* Logo móvil */}
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
                          <div className="flex items-center justify-between cursor-pointer">
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

        <Link href="/" className="mr-auto flex items-center md:hidden">
          <Box className="h-6 w-6 mr-2" />
          <span className="font-bold">AdminTienda</span>
        </Link>

        {/* Menú escritorio */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 mx-6">
          {menuItems.map((item) => (
            <div
              key={item.title}
              className="relative"
              onMouseEnter={() => handleMouseEnter(item.title)}
              onMouseLeave={handleMouseLeave}
            >
              {item.submenu ? (
                <div className="flex items-center gap-1 cursor-pointer">
                  <span className="text-sm font-medium transition-colors hover:text-primary">{item.title}</span>
                  <ChevronDown className="h-4 w-4" />
                  {openItem === item.title && (
                    <div className="absolute left-0 top-full mt-2 w-48 rounded-md border bg-background shadow-md transition-opacity duration-300">
                      <div className="grid gap-1 p-2">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.title}
                            href={subItem.href}
                            className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link href={item.href || "#"} className="text-sm font-medium transition-colors hover:text-primary">
                  {item.title}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Avatar */}
        <div className="flex items-center gap-4">
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
              <DropdownMenuItem>Mi Perfil</DropdownMenuItem>
              <DropdownMenuItem>Configuración</DropdownMenuItem>
              <DropdownMenuItem>Cerrar Sesión</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
