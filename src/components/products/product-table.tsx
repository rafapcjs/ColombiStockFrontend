import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductModel } from "@/types/ProductModel";

interface ProductTableProps {
  products: ProductModel[];
  isLoading: boolean;
  onEdit: (product: ProductModel) => void;
  onDelete: (product: ProductModel) => void;
}

function ProductTable({
  products,
  isLoading,
  onEdit,
  onDelete,
}: ProductTableProps) {
  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-4 py-2">Name</TableHead>
            <TableHead className="px-4 py-2">Description</TableHead>
            <TableHead className="px-4 py-2">Price</TableHead>
            <TableHead className="px-4 py-2">Purchase Price</TableHead>
            <TableHead className="px-4 py-2">Stock</TableHead>
            <TableHead className="px-4 py-2">Stock Min</TableHead>
            <TableHead className="px-4 py-2">Unit</TableHead>
            <TableHead className="px-4 py-2">Code</TableHead>
            <TableHead className="px-4 py-2">Category</TableHead>
            <TableHead className="px-4 py-2">Supplier Name</TableHead>
            <TableHead className="px-4 py-2 w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={12}
                className="text-center py-6 text-muted-foreground"
              >
                No products found
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.code}>
                <TableCell className="px-4 py-2 font-medium">{product.name}</TableCell>
                <TableCell className="px-4 py-2">{product.description || "-"}</TableCell>
                <TableCell className="px-4 py-2">{product.price}</TableCell>
                <TableCell className="px-4 py-2">{product.purchasePrice}</TableCell>
                <TableCell className="px-4 py-2">{product.stock}</TableCell>
                <TableCell className="px-4 py-2">{product.stockMin}</TableCell>
                <TableCell className="px-4 py-2">{product.unit || "-"}</TableCell>
                <TableCell className="px-4 py-2">{product.code}</TableCell>
                <TableCell className="px-4 py-2">{product.nameCategory}</TableCell>
                <TableCell className="px-4 py-2">{product.suppliersName}</TableCell>
                <TableCell className="px-4 py-2">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(product)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(product)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-4 py-2">Name</TableHead>
            <TableHead className="px-4 py-2">Description</TableHead>
            <TableHead className="px-4 py-2">Price</TableHead>
            <TableHead className="px-4 py-2">Purchase Price</TableHead>
            <TableHead className="px-4 py-2">Stock</TableHead>
            <TableHead className="px-4 py-2">Stock Min</TableHead>
            <TableHead className="px-4 py-2">Unit</TableHead>
            <TableHead className="px-4 py-2">Code</TableHead>
            <TableHead className="px-4 py-2">Category Code</TableHead>
            <TableHead className="px-4 py-2">Supplier DNI</TableHead>
            <TableHead className="px-4 py-2">Supplier Name</TableHead>
            <TableHead className="px-4 py-2 w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell className="px-4 py-2"><Skeleton className="h-5 w-[120px]" /></TableCell>
              <TableCell className="px-4 py-2"><Skeleton className="h-5 w-[180px]" /></TableCell>
              <TableCell className="px-4 py-2"><Skeleton className="h-5 w-[80px]" /></TableCell>
              <TableCell className="px-4 py-2"><Skeleton className="h-5 w-[100px]" /></TableCell>
              <TableCell className="px-4 py-2"><Skeleton className="h-5 w-[80px]" /></TableCell>
              <TableCell className="px-4 py-2"><Skeleton className="h-5 w-[80px]" /></TableCell>
              <TableCell className="px-4 py-2"><Skeleton className="h-5 w-[60px]" /></TableCell>
              <TableCell className="px-4 py-2"><Skeleton className="h-5 w-[100px]" /></TableCell>
              <TableCell className="px-4 py-2"><Skeleton className="h-5 w-[100px]" /></TableCell>
              <TableCell className="px-4 py-2"><Skeleton className="h-5 w-[120px]" /></TableCell>
              <TableCell className="px-4 py-2"><Skeleton className="h-5 w-[120px]" /></TableCell>
              <TableCell className="px-4 py-2">
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default ProductTable;
