"use client"

import type { CategoryModel } from "@/types/categoryModel"
 
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2 } from "lucide-react"
import { useDeleteCategory } from "@/hooks/category/useDeleteCategory"

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  category: CategoryModel
}

export default function DeleteConfirmationModal({ isOpen, onClose, category }: DeleteConfirmationModalProps) {
  const { deleteCategoryMutation, isLoading } = useDeleteCategory()

  const handleDelete = () => {
    deleteCategoryMutation(category.code, {
      onSuccess: () => {
        onClose()
      },
    })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the category <strong>{category.name}</strong> with code{" "}
            <strong>{category.code}</strong>. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleDelete()
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
  )
}
