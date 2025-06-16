 "use client"

import { useState } from "react"
import { ArrowUpDown, AlertTriangle, Package, Search, RefreshCcw, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UseGetProductByCodeLowStock } from "@/hooks/product/useGetProductByCodeLowStock"
 
export default function LowStockTable() {
  // Estados para paginación y ordenación
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [sortBy, setSortBy] = useState("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [searchTerm, setSearchTerm] = useState("")

  // Obtener datos de productos con bajo stock
  const { product, isLoading } = UseGetProductByCodeLowStock()

  // Función para cambiar la ordenación
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortDirection("asc")
    }
  }

  // Filtrar productos por término de búsqueda
  const filteredProducts = product?.content
    ? product.content.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.nameCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.nameSuppliers.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : []

  // Calcular el nivel de stock (crítico, bajo, normal)
  const getStockLevel = (stock: number, stockMin: number) => {
    if (stock === 0) return "critical"
    if (stock <= stockMin) return "low"
    return "normal"
  }

  // Obtener color del badge según nivel de stock
  const getStockBadgeVariant = (level: string) => {
    switch (level) {
      case "critical":
        return "destructive"
      case "low":
        return "warning"
      default:
        return "outline"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
              Productos con Bajo Stock
            </CardTitle>
            <CardDescription>Lista de productos que requieren reabastecimiento inmediato</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full md:w-auto"
            onClick={() => {
              // Refrescar datos manualmente
              window.location.reload()
            }}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Actualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filtros y controles */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex items-center relative w-full md:w-auto">
            <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar productos..."
              className="pl-8 w-full md:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Mostrar:</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPageSize(Number.parseInt(value))
                setCurrentPage(0)
              }}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabla de productos */}
        {isLoading ? (
          <div className="flex justify-center items-center h-80">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="rounded-md border">
            <ScrollArea className="h-[calc(100vh-350px)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Código</TableHead>
                    <TableHead>
                      <div className="flex items-center cursor-pointer" onClick={() => handleSort("name")}>
                        Producto
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-center">Categoría</TableHead>
                    <TableHead className="text-center">Proveedor</TableHead>
                    <TableHead className="text-right">
                      <div className="flex items-center justify-end cursor-pointer" onClick={() => handleSort("price")}>
                        Precio
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-center">
                      <div
                        className="flex items-center justify-center cursor-pointer"
                        onClick={() => handleSort("stock")}
                      >
                        Stock Actual
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-center">Stock Mínimo</TableHead>
                    <TableHead className="text-center">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => {
                      const stockLevel = getStockLevel(product.stock, product.stockMin)
                      return (
                        <TableRow key={product.code}>
                          <TableCell className="font-medium">{product.code}</TableCell>
                          <TableCell>
                            <div className="font-medium">{product.name}</div>
                            {product.description && (
                              <div className="text-xs text-muted-foreground line-clamp-1">{product.description}</div>
                            )}
                          </TableCell>
                          <TableCell className="text-center">{product.nameCategory}</TableCell>
                          <TableCell className="text-center">{product.nameSuppliers}</TableCell>
                          <TableCell className="text-right">
                            <div>${product.price.toFixed(2)}</div>
                            <div className="text-xs text-muted-foreground">
                              Compra: ${product.purchasePrice.toFixed(2)}
                            </div>
                          </TableCell>
                          <TableCell className="text-center font-medium">
                            <span
                              className={
                                stockLevel === "critical"
                                  ? "text-red-500"
                                  : stockLevel === "low"
                                    ? "text-amber-500"
                                    : ""
                              }
                            >
                              {product.stock}
                            </span>
                           </TableCell>
                          <TableCell className="text-center">{product.stockMin}</TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant={
                                getStockBadgeVariant(stockLevel) as "default" | "secondary" | "destructive" | "outline"
                              }
                            >
                              {stockLevel === "critical" ? "Sin Stock" : stockLevel === "low" ? "Bajo Stock" : "Normal"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        {searchTerm ? (
                          <div>
                            <Package className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            No se encontraron productos que coincidan con "{searchTerm}"
                          </div>
                        ) : (
                          <div>
                            <Package className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            No hay productos con bajo stock
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        )}

        {/* Paginación */}
        {product && product.totalPages > 1 && (
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Mostrando {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, product.totalElements)} de{" "}
              {product.totalElements} productos
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(product.totalPages - 1, prev + 1))}
                disabled={currentPage === product.totalPages - 1}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}

        {/* Leyenda */}
        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          <div className="flex items-center">
            <Badge variant="destructive" className="mr-2">
              Sin Stock
            </Badge>
            <span>Requiere atención inmediata</span>
          </div>
          <div className="flex items-center">
            <Badge variant="warning" className="mr-2">
              Bajo Stock
            </Badge>
            <span>Por debajo del mínimo requerido</span>
          </div>
          <div className="flex items-center">
            <Badge variant="outline" className="mr-2">
              Normal
            </Badge>
            <span>Stock adecuado</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
