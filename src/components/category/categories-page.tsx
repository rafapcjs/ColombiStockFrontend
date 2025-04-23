"use client";

import { useState, useEffect } from "react";
import CategoriesTable from "./categories-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import CategoryModal from "./category-modal";
import type { CategoryModel } from "@/types/CategoryModel";
import DeleteConfirmationModal from "./delete-confirmation-modal";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useGetAllCategories } from "@/hooks/category/useGetAllCategory";

function CategoriesPage() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sortBy, setSortBy] = useState("name");
  const [direction, setDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryModel | null>(null);

  const { categories, isLoading } = useGetAllCategories(
    page,
    size,
    sortBy,
    direction,
    debouncedSearchTerm
  );

  // Debounce effect for search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // Adjust debounce time as needed

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter categories based on debounced search term
  const filteredCategories =
    categories?.content?.filter(
      (category) =>
        category.name
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()) ||
        category.description
          ?.toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()) ||
        category.code.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    ) || [];

  const handleEdit = (category: CategoryModel) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleDelete = (category: CategoryModel) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSize(Number.parseInt(e.target.value));
    setPage(0); // Reset to first page when changing page size
  };

  // Calculate pagination values
  const totalPages = categories?.totalPages || 1;
  const currentPage = categories?.number || 0;
  const isFirstPage = categories?.first || true;
  const isLastPage = categories?.last || true;

  // Function to generate page numbers with ellipsis for large page counts
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      // If we have 7 or fewer pages, show all page numbers
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    // Always include first and last page
    const pageNumbers = [0, totalPages - 1];

    // Always include current page and one page on each side if possible
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages - 2, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Sort and remove duplicates
    const uniquePageNumbers = [...new Set(pageNumbers)].sort((a, b) => a - b);

    // Add ellipsis indicators
    const result = [];
    for (let i = 0; i < uniquePageNumbers.length; i++) {
      result.push(uniquePageNumbers[i]);

      // Add ellipsis if there's a gap
      if (
        i < uniquePageNumbers.length - 1 &&
        uniquePageNumbers[i + 1] - uniquePageNumbers[i] > 1
      ) {
        result.push(-1); // -1 represents ellipsis
      }
    }

    return result;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Debug info - remove in production */}
      {debouncedSearchTerm && (
        <div className="text-sm text-muted-foreground">
          Searching for:{" "}
          <span className="font-medium">{debouncedSearchTerm}</span>
        </div>
      )}

      <CategoriesTable
        categories={filteredCategories}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      {!isLoading && categories && categories.totalElements > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {categories.numberOfElements} of {categories.totalElements}{" "}
            categories
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Rows per page</span>
              <select
                value={size}
                onChange={handleSizeChange}
                className="h-8 w-[70px] rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      !isFirstPage && handlePageChange(currentPage - 1)
                    }
                    className={
                      isFirstPage
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {/* Generate page numbers with ellipsis */}
                {getPageNumbers().map((pageNum, index) =>
                  pageNum === -1 ? (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => handlePageChange(pageNum)}
                        isActive={currentPage === pageNum}
                        className="cursor-pointer"
                      >
                        {pageNum + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      !isLastPage && handlePageChange(currentPage + 1)
                    }
                    className={
                      isLastPage
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}

      {/* Create Modal */}
      <CategoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        category={null}
        mode="create"
      />

      {/* Edit Modal */}
      {selectedCategory && (
        <CategoryModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          category={selectedCategory}
          mode="edit"
        />
      )}

      {/* Delete Confirmation Modal */}
      {selectedCategory && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          category={selectedCategory}
        />
      )}
    </div>
  );
}
export default CategoriesPage;
