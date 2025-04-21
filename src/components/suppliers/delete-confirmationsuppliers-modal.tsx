 "use client";

import type { SuppliersModel } from "@/types/SuppliersModel";

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
import { Loader2 } from "lucide-react";
import { UseDeleteSuppliers } from "@/hooks/suppliers/useDeleteSuppliers";
 
interface DeleteSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: SuppliersModel;
}

export default function DeleteSupplierModal({ isOpen, onClose, supplier }: DeleteSupplierModalProps) {
  const { DeleteSuppliersMutation, isLoading } = UseDeleteSuppliers();

  const handleDelete = () => {
    DeleteSuppliersMutation(supplier.dni, {
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
            This will permanently delete the supplier <strong>{supplier.name} {supplier.lastName}</strong> with DNI{" "}
            <strong>{supplier.dni}</strong>. This action cannot be undone.
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
