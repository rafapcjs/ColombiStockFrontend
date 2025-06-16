 "use client";

import Link from "next/link";
import Navbar from "@/components/ui/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Tags,
  Truck,
  ShoppingCart,
  FileText,
  TrendingUp,
  AlertTriangle,
  Users,
  BarChart3,
  DollarSign,
} from "lucide-react";
import { UseCountProductLowStock } from "@/hooks/product/useCountProductLowStock";
import { useGetDailyProfit } from "@/hooks/sales/useProfits";
import { useState } from "react";
import { UseSumProductTotally } from "@/hooks/product/useSumProductTotally";

// Declarar la función formatDate antes de ser utilizada
const formatDate = (date: Date) => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${year}-${month}-${day}`; // Formato YYYY-MM-DD
};

const Dashboard = () => {
  const { data } = UseCountProductLowStock(); // Obtener productos con bajo stock
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const { sumTotally } = UseSumProductTotally(); // Obtener productos con bajo stock

  // Hook para obtener las ganancias diarias
  const { dailyProfit, isLoading: dailyLoading } = useGetDailyProfit(
    selectedDate ? formatDate(selectedDate) : ""
  );

  // Datos de ejemplo para las métricas rápidas
  const quickStats = [
    {
      title: "Ventas Hoy",
      value: dailyLoading ? "Cargando..." : dailyProfit?.totalRevenue ?? "Sin datos", // Si está cargando, muestra "Cargando..."
      change: "+12%",
      trend: "up" as const,
      icon: DollarSign,
    },
    {
      title: "Productos",
      value: sumTotally ?? "Cargando...", // Si los datos no están disponibles, muestra "Cargando..."
      change: "+3",
      trend: "up" as const,
      icon: Package,
    },
     
    {
      title: "Stock Bajo",
      value: data ?? "Cargando...", // Si los datos no están disponibles, muestra "Cargando..."
      trend: "down" as const,
      icon: AlertTriangle,
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto py-8 px-4 space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              Dashboard de Administración
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Gestiona todos los aspectos de tu negocio desde un solo lugar
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickStats.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <div className="p-3 rounded-full bg-primary/10">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Gestión de Inventario */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold text-slate-800">Gestión de Inventario</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Administración de Productos */}
              <Link href="/product/products" className="group">
                <Card className="h-full hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] border-0 shadow-md">
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-lg" />
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
                        <Package className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Inventario
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                      Administración de Productos
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      Gestiona los productos de tu inventario
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>

              {/* Administración de Categorías */}
              <Link href="/category" className="group">
                <Card className="h-full hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] border-0 shadow-md">
                  <div className="h-2 bg-gradient-to-r from-green-500 to-teal-600 rounded-t-lg" />
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-teal-600 shadow-lg">
                        <Tags className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Organización
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                      Administración de Categorías
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      Administra las categorías de tus productos
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>

              {/* Administración de Proveedores */}
              <Link href="/suppliers" className="group">
                <Card className="h-full hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] border-0 shadow-md">
                  <div className="h-2 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-t-lg" />
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-600 shadow-lg">
                        <Truck className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Proveedores
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                      Administración de Proveedores
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      Gestiona tus proveedores y sus productos
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>

              {/* Productos en Bajo Stock */}
              <Link href="/admin/low-stock" className="group">
                <Card className="h-full hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] border-0 shadow-md">
                  <div className="h-2 bg-gradient-to-r from-red-400 to-yellow-500 rounded-t-lg" />
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="p-3 rounded-lg bg-gradient-to-r from-red-400 to-yellow-500 shadow-lg">
                        <AlertTriangle className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Urgente
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                      Productos que estan bajo Stock
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      Consulta los productos que están por agotarse
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          {/* Ventas y Facturación */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold text-slate-800">Ventas y Facturación</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Ver Ganancias */}
              <Link href="/profit" className="group">
                <Card className="h-full hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] border-0 shadow-md">
                  <div className="h-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-t-lg" />
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 shadow-lg">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Reportes
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                      Ver Ganancias
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      Consulta tus ganancias y estadísticas de ventas
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>

              {/* Facturas */}
              <Link href="/facturas" className="group">
                <Card className="h-full hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] border-0 shadow-md">
                  <div className="h-2 bg-gradient-to-r from-red-500 to-pink-600 rounded-t-lg" />
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="p-3 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 shadow-lg">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Documentos
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">Facturas</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      Genera y administra las facturas de ventas
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          {/* Recursos Humanos - Nueva Sección */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold text-slate-800">Recursos Humanos</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Administración de Empleados */}
              <Link href="/shopKeeper" className="group">
                <Card className="h-full hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] border-0 shadow-md">
                  <div className="h-2 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-t-lg" />
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="p-3 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-600 shadow-lg">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Empleados
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                      Administración de Empleados
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      Gestiona a tus empleados y sus roles
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

        </div>
      </main>
    </>
  );
};

export default Dashboard;
