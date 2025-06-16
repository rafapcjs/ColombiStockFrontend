"use client"

import { useState, useEffect } from "react"
import { type SubmitHandler, useForm } from "react-hook-form"
import { Check, FileText, Loader2, MinusCircle, Package, Plus, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useCreateSales } from "@/hooks/sales/useCreateSales"
import { useGetAllProducts } from "@/hooks/product/useGetAllProducts"
import { ProductModeltDto } from "@/types/products"
import { SalesCreate } from "@/types/salesModel"

export default function RegisterSale() {
  // Hooks originales
  const { createSalesMutation: create, isPending } = useCreateSales()
  const { products, isLoading } = useGetAllProducts()

  // Estados
  const [selectedProducts, setSelectedProducts] = useState<ProductModeltDto[]>([])
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({})
  const [selectedProduct, setSelectedProduct] = useState<ProductModeltDto | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("") // Estado para el término de búsqueda
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("") // Estado para el término de búsqueda con debounce

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SalesCreate>()

  // Debounce para búsqueda
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300) // Espera 300ms después de que el usuario deje de escribir

    return () => clearTimeout(timeoutId) // Limpiar el timeout si el usuario escribe más rápido
  }, [searchTerm])

  // Filtrar productos por nombre o código
  const filteredProducts = products?.content.filter((product) =>
    product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    product.code.includes(debouncedSearchTerm)
  )

  // Manejadores de eventos
  const handleProductChange = (code: string) => {
    const product = filteredProducts?.find((p) => p.code === code) || null
    setSelectedProduct(product)
  }

  const handleQuantityChange = (value: string) => {
    if (!selectedProduct) return

    const numValue = Number(value)
    if (numValue >= 0 && numValue <= selectedProduct.stock) {
      setQuantities({
        ...quantities,
        [selectedProduct.code]: numValue,
      })
    }
  }

  const handleAddProduct = () => {
    if (
      selectedProduct &&
      quantities[selectedProduct.code] &&
      quantities[selectedProduct.code] <= selectedProduct.stock
    ) {
      // Verificar si el producto ya está en la lista
      if (!selectedProducts.some((p) => p.code === selectedProduct.code)) {
        setSelectedProducts([...selectedProducts, selectedProduct])
        setSelectedProduct(null)
      } else {
        setErrorMessage("Este producto ya ha sido agregado a la lista.")
        setTimeout(() => setErrorMessage(null), 3000)
      }
    } else {
      setErrorMessage("Por favor ingrese una cantidad válida.")
      setTimeout(() => setErrorMessage(null), 3000)
    }
  }

  const handleRemoveProduct = (code: string) => {
    setSelectedProducts(selectedProducts.filter((product) => product.code !== code))
    const updatedQuantities = { ...quantities }
    delete updatedQuantities[code]
    setQuantities(updatedQuantities)
  }

  const createSales: SubmitHandler<SalesCreate> = async () => {
    if (selectedProducts.length === 0) {
      setErrorMessage("Debe agregar al menos un producto antes de confirmar la venta.")
      setTimeout(() => setErrorMessage(null), 3000)
      return
    }

    const salesData: SalesCreate[] = selectedProducts.map((product) => ({
      codeProduct: product.code,
      quantity: quantities[product.code].toString(),
    }))

    create(salesData, {
      onSuccess: (blob) => {
        if (blob instanceof Blob) {
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = "factura.pdf"
          document.body.appendChild(a)
          a.click()
          a.remove()
          window.URL.revokeObjectURL(url)
        }

        setSelectedProducts([]) 
        setQuantities({})
        setSelectedProduct(null)
        reset()
        setSuccessMessage("¡Venta registrada exitosamente!")
        setTimeout(() => setSuccessMessage(null), 5000)
      },
      onError: () => {
        setErrorMessage("Hubo un problema al registrar la venta. Intente nuevamente.")
        setTimeout(() => setErrorMessage(null), 5000)
      },
    })
  }

  // Calcular total de la venta
  const calculateTotal = () => {
    return selectedProducts.reduce((total, product) => {
      return total + product.price * (quantities[product.code] || 0)
    }, 0)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Registrar Venta</h1>
          <p className="text-muted-foreground">Seleccione productos y cantidades para generar una venta</p>
        </div>
        <ShoppingCart className="h-10 w-10 text-primary" />
      </div>

      {successMessage && (
        <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
          <Check className="h-4 w-4" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Filtro de productos */}
      <div className="mb-4">
        <label className="text-sm font-medium">Buscar Producto</label>
        <Input
          type="text"
          placeholder="Escribe nombre o código"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <form onSubmit={handleSubmit(createSales)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sección de selección de productos */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Selección de Productos
              </CardTitle>
              <CardDescription>Seleccione un producto y especifique la cantidad</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Producto</label>
                    <Select
                      disabled={isLoading}
                      onValueChange={handleProductChange}
                      value={selectedProduct?.code || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar producto" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredProducts?.map((product) => (
                          <SelectItem key={product.code} value={product.code}>
                            {product.name} - Stock: {product.stock}
                          </SelectItem>
                        )) || []}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedProduct && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Cantidad</label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Cantidad"
                          value={quantities[selectedProduct.code] || ""}
                          onChange={(e) => handleQuantityChange(e.target.value)}
                          min={1}
                          max={selectedProduct.stock}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={handleAddProduct}
                          disabled={
                            !quantities[selectedProduct.code] ||
                            quantities[selectedProduct.code] > selectedProduct.stock
                          }
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar
                        </Button>
                      </div>
                      {quantities[selectedProduct.code] > selectedProduct.stock && (
                        <p className="text-sm text-destructive">Cantidad excede el stock disponible</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resumen de la venta */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Resumen de Venta
              </CardTitle>
              <CardDescription>Total: ${calculateTotal().toFixed(2)}</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedProducts.length > 0 ? (
                <div className="space-y-4">
                  {selectedProducts.map((product) => (
                    <div key={product.code} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>
                            {quantities[product.code]} x ${product.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">${(product.price * quantities[product.code]).toFixed(2)}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveProduct(product.code)}
                        >
                          <MinusCircle className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mb-2 opacity-20" />
                  <p>No hay productos seleccionados</p>
                  <p className="text-sm">Seleccione productos para agregar a la venta</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Separator />
              <div className="flex justify-between w-full text-lg font-semibold">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <Button className="w-full" size="lg" type="submit" disabled={selectedProducts.length === 0 || isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Confirmar Venta
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Tabla de productos seleccionados */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Productos Seleccionados</CardTitle>
              <CardDescription>
                {selectedProducts.length} {selectedProducts.length === 1 ? "producto" : "productos"} en la venta actual
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedProducts.length > 0 ? (
                <ScrollArea className="h-[300px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead>Código</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Subtotal</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedProducts.map((product) => (
                        <TableRow key={product.code}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.code}</TableCell>
                          <TableCell>${product.price.toFixed(2)}</TableCell>
                          <TableCell>{quantities[product.code]}</TableCell>
                          <TableCell>${(product.price * quantities[product.code]).toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveProduct(product.code)}
                            >
                              <MinusCircle className="h-4 w-4 mr-2" />
                              Quitar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No hay productos seleccionados para esta venta.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}
