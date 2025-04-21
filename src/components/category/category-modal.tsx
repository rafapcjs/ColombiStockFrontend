"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import type { CategoryModel } from "@/types/categoryModel"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { useCreateCategory } from "@/hooks/category/useCreateCategory"
import { useUpdateCategoryByCode } from "@/hooks/category/useUpdateCategory"

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  category: CategoryModel | null
  mode: "create" | "edit"
}

function CategoryModal({ isOpen, onClose, category, mode }: CategoryModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Partial<CategoryModel>>()

  const { createCategoryMutation } = useCreateCategory()
  const { updateCategoryByCodeMutation } = useUpdateCategoryByCode()

  useEffect(() => {
    if (category && mode === "edit") {
      setValue("name", category.name)
      setValue("description", category.description)
      setValue("code", category.code)
    } else {
      reset()
    }
  }, [category, mode, setValue, reset])

  const onSubmit = (data: Partial<CategoryModel>) => {
    const handleError = (error: any) => {
      const message = error.response?.data?.message || ""
      if (message.includes("name")) {
        setError("name", { message })
      }
      if (message.includes("code")) {
        setError("code", { message })
      }
    }
  
    if (mode === "create") {
      createCategoryMutation(data as CategoryModel, {
        onSuccess: () => {
          onClose()
          reset() // Limpia los campos después de crear
        },
        onError: handleError,
      })
    } else if (mode === "edit" && category) {
      updateCategoryByCodeMutation(
        {
          code: category.code,
          category: data as CategoryModel,
        },
        {
          onSuccess: () => {
            onClose()
            reset() // Limpia los campos después de editar
          },
          onError: handleError,
        },
      )
    }
  }
  const title = mode === "create" ? "Create Category" : "Edit Category"
  const buttonText = mode === "create" ? "Create" : "Update"
  const isLoading = isSubmitting

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register("name", { required: "Name is required" })}
              placeholder="Category name"
              disabled={isLoading}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Category description"
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              {...register("code", {
                required: mode === "create" ? "Code is required" : false,
                minLength: {
                  value: 4,
                  message: "Code must be at least 4 characters",
                },
              })}
              placeholder="Category code"
              disabled={isLoading || mode === "edit"}
            />
            {errors.code && <p className="text-sm text-destructive">{errors.code.message}</p>}
            {mode === "edit" && <p className="text-xs text-muted-foreground">Code cannot be changed after creation</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {buttonText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CategoryModal
