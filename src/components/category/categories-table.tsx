"use client";

import type { CategoryModel } from "@/types/CategoryModel";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoriesTableProps {
  categories: CategoryModel[];
  isLoading: boolean;
  onEdit: (category: CategoryModel) => void;
  onDelete: (category: CategoryModel) => void;
}

function CategoriesTable({ categories, isLoading, onEdit, onDelete }: CategoriesTableProps) {
  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-4 py-3">Name</TableHead>
            <TableHead className="px-4 py-3">Description</TableHead>
            <TableHead className="px-4 py-3">Code</TableHead>
            <TableHead className="w-[100px] px-4 py-3">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                No categories found
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow key={category.code}>
                <TableCell className="px-4 py-3 font-medium">{category.name}</TableCell>
                <TableCell className="px-4 py-3">{category.description || "-"}</TableCell>
                <TableCell className="px-4 py-3">{category.code}</TableCell>
                <TableCell className="px-4 py-3">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(category)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(category)}>
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
            <TableHead className="px-4 py-3">Name</TableHead>
            <TableHead className="px-4 py-3">Description</TableHead>
            <TableHead className="px-4 py-3">Code</TableHead>
            <TableHead className="w-[100px] px-4 py-3">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell className="px-4 py-3">
                <Skeleton className="h-5 w-[120px]" />
              </TableCell>
              <TableCell className="px-4 py-3">
                <Skeleton className="h-5 w-[200px]" />
              </TableCell>
              <TableCell className="px-4 py-3">
                <Skeleton className="h-5 w-[80px]" />
              </TableCell>
              <TableCell className="px-4 py-3">
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

export default CategoriesTable;
