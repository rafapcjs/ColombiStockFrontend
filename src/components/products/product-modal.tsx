import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

import { ProductModeltDto } from "@/types/productModel";
 
import { UseGetAllSuppliers } from "@/hooks/suppliers/useGetAllSuppliers";
import { useCreateProduct } from "@/hooks/product/useCreateProduct ";
import { useUpdateProductByCode } from "@/hooks/product/useUpdateProductByCode";
import { useGetAllCategories } from "@/hooks/category/useGetAllCategory";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductModeltDto | null;
  mode: "create" | "edit";
}

function ProductModal({ isOpen, onClose, product, mode }: ProductModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductModeltDto>();

  const { createProductMutation } = useCreateProduct();
  const { updateProductByCodeMutation } = useUpdateProductByCode();
  const { categories } = useGetAllCategories(0, 100, "name", "asc");
  const { suppliers } = UseGetAllSuppliers(0, 100, "name", "asc");

  useEffect(() => {
    if (product && mode === "edit") {
      setValue("name", product.name);
      setValue("description", product.description);
      setValue("price", product.price);
      setValue("purchasePrice", product.purchasePrice);
      setValue("stock", product.stock);
      setValue("stockMin", product.stockMin);
      setValue("unit", product.unit);
      setValue("code", product.code);
      setValue("codigoCategoria", product.codigoCategoria);
      setValue("dni_provedor", product.dni_provedor);
    } else {
      reset();
    }
  }, [product, mode, setValue, reset]);

  const onSubmit = async (data: ProductModeltDto) => {
    if (mode === "create") {
        createProductMutation(data);
    } else if (mode === "edit" && product) {
       updateProductByCodeMutation({
        code: product.code,
        product: data,
      });
    }
    onClose();
    reset();
  };

  const title = mode === "create" ? "Crear Producto" : "Editar Producto";
  const buttonText = mode === "create" ? "Crear" : "Actualizar";
  const isLoading = isSubmitting;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">

          {/* Name */}
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" {...register("name", { required: "Nombre requerido" })} disabled={isLoading} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="description">Descripción</Label>
            <Input id="description" {...register("description", { required: "Descripción requerida" })} disabled={isLoading} />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          {/* Price */}
          <div className="grid gap-2">
            <Label htmlFor="price">Precio</Label>
            <Input type="number" id="price" {...register("price", { required: "Precio requerido" })} disabled={isLoading} />
            {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
          </div>

          {/* Purchase Price */}
          <div className="grid gap-2">
            <Label htmlFor="purchasePrice">Precio de Compra</Label>
            <Input type="number" id="purchasePrice" {...register("purchasePrice", { required: "Precio de compra requerido" })} disabled={isLoading} />
            {errors.purchasePrice && <p className="text-sm text-destructive">{errors.purchasePrice.message}</p>}
          </div>

          {/* Stock */}
          <div className="grid gap-2">
            <Label htmlFor="stock">Stock</Label>
            <Input type="number" id="stock" {...register("stock", { required: "Stock requerido" })} disabled={isLoading} />
            {errors.stock && <p className="text-sm text-destructive">{errors.stock.message}</p>}
          </div>

          {/* StockMin */}
          <div className="grid gap-2">
            <Label htmlFor="stockMin">Stock Mínimo</Label>
            <Input type="number" id="stockMin" {...register("stockMin", { required: "Stock mínimo requerido" })} disabled={isLoading} />
            {errors.stockMin && <p className="text-sm text-destructive">{errors.stockMin.message}</p>}
          </div>

          {/* Unit */}
          <div className="grid gap-2">
            <Label htmlFor="unit">Unidad</Label>
            <Input id="unit" {...register("unit", { required: "Unidad requerida" })} disabled={isLoading} />
            {errors.unit && <p className="text-sm text-destructive">{errors.unit.message}</p>}
          </div>

          {/* Code */}
          <div className="grid gap-2">
            <Label htmlFor="code">Código</Label>
            <Input id="code" {...register("code", { required: "Código requerido" })} disabled={isLoading || mode === "edit"} />
            {errors.code && <p className="text-sm text-destructive">{errors.code.message}</p>}
            {mode === "edit" && <p className="text-xs text-muted-foreground">El código no se puede editar</p>}
          </div>

          {/* Categoria */}
          <div className="grid gap-2">
            <Label htmlFor="codigoCategoria">Categoría</Label>
            <select id="codigoCategoria" {...register("codigoCategoria", { required: "Categoría requerida" })} disabled={isLoading} className="border rounded px-2 py-1">
              <option value="">Seleccionar</option>
              {categories?.content.map((cat) => (
                <option key={cat.code} value={cat.code}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.codigoCategoria && <p className="text-sm text-destructive">{errors.codigoCategoria.message}</p>}
          </div>

          {/* Proveedor */}
          <div className="grid gap-2">
            <Label htmlFor="dni_provedor">Proveedor</Label>
            <select id="dni_provedor" {...register("dni_provedor", { required: "Proveedor requerido" })} disabled={isLoading} className="border rounded px-2 py-1">
              <option value="">Seleccionar</option>
              {suppliers?.content.map((sup) => (
                <option key={sup.dni} value={sup.dni}>
                  {sup.name} {sup.lastName}
                </option>
              ))}
            </select>
            {errors.dni_provedor && <p className="text-sm text-destructive">{errors.dni_provedor.message}</p>}
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
              Cancelar
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

export default ProductModal;
