"use client";

 import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UseDeleteProduct } from "@/hooks/product/useDeleteProduct";
import { ProductModeltDto } from "@/types/productModel";
import { Loader2 } from "lucide-react";
 
interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductModeltDto;
}

export default function DeleteProductModal({ isOpen, onClose, product }: DeleteProductModalProps) {
  const { DeleteProductMutation, isLoading } = UseDeleteProduct();

  const handleDelete = () => {
    DeleteProductMutation(product.code, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the product <strong>{product.name}</strong> with Code{" "}
            <strong>{product.code}</strong>. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
