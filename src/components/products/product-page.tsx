"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import ProductModal from "./product-modal";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { ProductModeltDto } from "@/types/products";
import { useGetAllProducts } from "@/hooks/product/useGetAllProducts";
import DeleteProductModal from "./delete-confirmationproducts-modal";
import ProductsTable from "./product-table";

function ProductsPage() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sortBy, setSortBy] = useState("name");
  const [direction, setDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductModeltDto | null>(null);

  const { products, isLoading } = useGetAllProducts(
    page,
    size,
    sortBy,
    direction
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredProducts =
    products?.content?.filter((product) =>
      [
        product.name,
        product.code,
        product.description,
        product.suppliersName,
      ].some((field) =>
        field?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      )
    ) || [];

  const handleEdit = (product: ProductModeltDto) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDelete = (product: ProductModeltDto) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSize(Number.parseInt(e.target.value));
    setPage(0);
  };

  const totalPages = products?.totalPages || 1;
  const currentPage = products?.number || 0;
  const isFirstPage = products?.first || true;
  const isLastPage = products?.last || true;

  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i);
    const pageNumbers = [0, totalPages - 1];
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages - 2, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

    const uniquePageNumbers = [...new Set(pageNumbers)].sort((a, b) => a - b);

    const result = [];
    for (let i = 0; i < uniquePageNumbers.length; i++) {
      result.push(uniquePageNumbers[i]);
      if (
        i < uniquePageNumbers.length - 1 &&
        uniquePageNumbers[i + 1] - uniquePageNumbers[i] > 1
      ) {
        result.push(-1);
      }
    }
    return result;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <ProductsTable
        products={filteredProducts}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {!isLoading && products && products.totalElements > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {products.numberOfElements} of {products.totalElements}{" "}
            products
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Rows per page</span>
              <select
                value={size}
                onChange={handleSizeChange}
                className="h-8 w-[70px] rounded-md border border-input bg-background px-2 py-1 text-sm"
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
      <ProductModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        product={null}
        mode="create"
      />

      {/* Edit Modal */}
      {selectedProduct && (
        <ProductModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          product={selectedProduct}
          mode="edit"
        />
      )}

      {/* Delete Modal */}
      {selectedProduct && (
        <DeleteProductModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          product={selectedProduct}
        />
      )}
    </div>
  );
}

export default ProductsPage;
