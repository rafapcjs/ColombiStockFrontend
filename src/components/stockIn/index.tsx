"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Loader2, PackagePlus, Check, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useGetAllProducts } from "@/hooks/product/useGetAllProducts";
import { UseCreateStockIn } from "@/hooks/stockMovement/useCreateStockIn";
import { StockMovementDto } from "@/types/StockMovement ";

export default function StockInFormImproved() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  // Hooks para obtener productos y crear movimientos de stock
  const { createStockInMutation, isPending } = UseCreateStockIn();
  const { isLoading: isLoadingProduct, products } = useGetAllProducts(
    0,
    10,
    "name",
    "asc"
  );

  // Configuración de react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<StockMovementDto>({
    defaultValues: {
      productCode: "",
      quantity: "1",
      description: "",
    },
  });

  // Valores actuales del formulario
  const watchQuantity = watch("quantity");
  const watchDescription = watch("description");

  // Manejador de envío del formulario
  const createStockInSuccess: SubmitHandler<StockMovementDto> = async (
    data
  ) => {
    try {
      createStockInMutation({
        ...data,
        productCode: data.productCode,
        quantity: data.quantity,
        description: data.description,
      });

      // Mostrar mensaje de éxito

      // Resetear formulario después de 2 segundos
      setTimeout(() => {
        reset();
        setSelectedProduct(null);
        setSuccessMessage(null);
      }, 2000);
    } catch (error) {
      console.error("Error al registrar entrada:", error);
      setErrorMessage(
        "Error al registrar la entrada de stock. Inténtelo de nuevo."
      );
      setSuccessMessage(null);
    }
  };

  // Manejador para el cambio de producto
  const handleProductChange = (value: string) => {
    setValue("productCode", value);
    setSelectedProduct(value);
  };

  // Encontrar el producto seleccionado
  const selectedProductDetails = products?.content.find(
    (product) => product.code === selectedProduct
  );

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PackagePlus className="h-5 w-5" />
          Registro de Entrada de Stock
        </CardTitle>
        <CardDescription>
          Complete el formulario para registrar una nueva entrada de productos
          al inventario
        </CardDescription>
      </CardHeader>
      <CardContent>
        {successMessage && (
          <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
            <Check className="h-4 w-4" />
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        {errorMessage && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <form
          id="stock-in-form"
          onSubmit={handleSubmit(createStockInSuccess)}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Selector de producto */}
            <div className="space-y-2">
              <Label htmlFor="productCode" className="text-base">
                Producto <span className="text-destructive">*</span>
              </Label>
              <Select
                disabled={isLoadingProduct || isPending}
                value={selectedProduct || ""}
                onValueChange={handleProductChange}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Seleccionar producto" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingProduct ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : products?.content && products.content.length > 0 ? (
                    products.content.map((product) => (
                      <SelectItem key={product.code} value={product.code}>
                        {product.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="py-6 text-center text-muted-foreground">
                      No hay productos disponibles
                    </div>
                  )}
                </SelectContent>
              </Select>
              <input
                type="hidden"
                {...register("productCode", {
                  required: "Debe seleccionar un producto",
                })}
              />
              {errors.productCode && (
                <p className="text-sm text-destructive mt-1">
                  {errors.productCode.message}
                </p>
              )}
            </div>

            {/* Campo de cantidad */}
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-base">
                Cantidad <span className="text-destructive">*</span>
              </Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                className="h-10"
                {...register("quantity", {
                  required: "La cantidad es obligatoria",
                  valueAsNumber: true,
                  min: {
                    value: 1,
                    message: "La cantidad debe ser mayor a 0",
                  },
                })}
                disabled={isPending}
              />
              {errors.quantity && (
                <p className="text-sm text-destructive mt-1">
                  {errors.quantity.message}
                </p>
              )}
            </div>
          </div>

          {/* Campo de descripción */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base">
              Descripción <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Ingrese una descripción para esta entrada de stock"
              className="min-h-[100px]"
              {...register("description", {
                required: "La descripción es obligatoria",
                minLength: {
                  value: 5,
                  message: "La descripción debe tener al menos 5 caracteres",
                },
              })}
              disabled={isPending}
            />
            {errors.description && (
              <p className="text-sm text-destructive mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Detalles del producto seleccionado */}
          {selectedProductDetails && (
            <div className="rounded-md border p-4 bg-muted/50">
              <h3 className="font-medium mb-2">
                Detalles del producto seleccionado:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p>
                    <span className="font-medium">Nombre:</span>{" "}
                    {selectedProductDetails.name}
                  </p>
                  <p>
                    <span className="font-medium">Código:</span>{" "}
                    {selectedProductDetails.code}
                  </p>
                  <p>
                    <span className="font-medium">Categoría:</span>{" "}
                    {selectedProductDetails.nameCategory}
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-medium">Stock actual:</span>{" "}
                    {selectedProductDetails.stock}
                  </p>
                  <p>
                    <span className="font-medium">Stock mínimo:</span>{" "}
                    {selectedProductDetails.stockMin}
                  </p>
                  <p>
                    <span className="font-medium">Precio:</span> $
                    {selectedProductDetails.price.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => {
            reset();
            setSelectedProduct(null);
            setSuccessMessage(null);
            setErrorMessage(null);
          }}
          disabled={isPending}
        >
          Limpiar formulario
        </Button>
        <Button
          type="submit"
          form="stock-in-form"
          className="w-full sm:w-auto"
          disabled={
            isPending || !selectedProduct || !watchQuantity || !watchDescription
          }
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registrando...
            </>
          ) : (
            "Registrar Entrada"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
