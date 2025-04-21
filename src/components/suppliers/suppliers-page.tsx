"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
  import DeleteConfirmationModal from "./delete-confirmationsuppliers-modal";
 import type { SuppliersModel } from "@/types/SuppliersModel";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { UseGetAllSuppliers } from "@/hooks/suppliers/useGetAllSuppliers";
import SupplierModal from "./suppliers-modal";
import SuppliersTable from "./suppliers-table";

function SuppliersPage() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sortBy, setSortBy] = useState("name");
  const [direction, setDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<SuppliersModel | null>(null);

  const { suppliers, isLoading } = UseGetAllSuppliers(page, size, sortBy, direction);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredSuppliers = suppliers?.content?.filter((supplier) =>
    [supplier.name, supplier.lastName, supplier.dni, supplier.phone, supplier.email]
      .some((field) => field.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
  ) || [];

  const handleEdit = (supplier: SuppliersModel) => {
    setSelectedSupplier(supplier);
    setIsEditModalOpen(true);
  };

  const handleDelete = (supplier: SuppliersModel) => {
    setSelectedSupplier(supplier);
    setIsDeleteModalOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSize(Number.parseInt(e.target.value));
    setPage(0);
  };

  const totalPages = suppliers?.totalPages || 1;
  const currentPage = suppliers?.number || 0;
  const isFirstPage = suppliers?.first || true;
  const isLastPage = suppliers?.last || true;

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
      if (i < uniquePageNumbers.length - 1 && uniquePageNumbers[i + 1] - uniquePageNumbers[i] > 1) {
        result.push(-1);
      }
    }
    return result;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Suppliers</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Supplier
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search suppliers..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <SuppliersTable
        suppliers={filteredSuppliers}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {!isLoading && suppliers && suppliers.totalElements > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {suppliers.numberOfElements} of {suppliers.totalElements} suppliers
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
                    onClick={() => !isFirstPage && handlePageChange(currentPage - 1)}
                    className={isFirstPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
                    onClick={() => !isLastPage && handlePageChange(currentPage + 1)}
                    className={isLastPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}

      {/* Create Modal */}
      <SupplierModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        supplier={null}
        mode="create"
      />

      {/* Edit Modal */}
      {selectedSupplier && (
        <SupplierModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          supplier={selectedSupplier}
          mode="edit"
        />
      )}

      {/* Delete Modal */}
      {selectedSupplier && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          supplier={selectedSupplier}
        />
      )}
    </div>
  );
}

export default SuppliersPage;
