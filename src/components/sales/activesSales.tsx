"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteSales } from "@/hooks/sales/useDeleteSales";
import { useGetSalesActive } from "@/hooks/sales/useGetSalesActive";

interface SaleDetail {
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export const BoardActiveSales: React.FC = () => {
  const { salesActive, isLoading } = useGetSalesActive();
  const { deleteSalesMutation: deleteSales, isPending } = useDeleteSales();

  const handleDelete = (id: string) => {
    deleteSales(id);
  };

  // Contenedor principal con estilos propios
  const containerClasses = "mt-12 h-[80vh] w-full overflow-auto flex items-center justify-center";

  // Esqueleto de tabla mientras carga
  if (isLoading) {
    return (
      <div className={containerClasses}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>VENTA ID</TableHead>
              <TableHead>FECHA</TableHead>
              <TableHead>TOTAL</TableHead>
              <TableHead>DETALLES</TableHead>
              <TableHead>ACCIONES</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, idx) => (
              <TableRow key={idx}>
                <TableCell><Skeleton className="h-6 w-full" /></TableCell>
                <TableCell><Skeleton className="h-6 w-full" /></TableCell>
                <TableCell><Skeleton className="h-6 w-full" /></TableCell>
                <TableCell><Skeleton className="h-6 w-full" /></TableCell>
                <TableCell><Skeleton className="h-6 w-full" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  // Mensaje cuando no hay datos
  if (!salesActive || salesActive.length === 0) {
    return (
      <div className={containerClasses}>
        <p className="text-xl font-medium">No hay ventas activas</p>
      </div>
    );
  }

  // Tabla con datos
  return (
    <div className="mt-12 h-[80vh] w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>VENTA ID</TableHead>
            <TableHead>FECHA</TableHead>
            <TableHead>TOTAL</TableHead>
            <TableHead>DETALLES</TableHead>
            <TableHead>ACCIONES</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {salesActive.map((sale) => (
            <TableRow key={sale.saleId}>
              <TableCell>{sale.saleId}</TableCell>
              <TableCell>{new Date(sale.saleDate).toLocaleDateString()}</TableCell>
              <TableCell>{sale.totalAmount}</TableCell>
              <TableCell>
                {sale.details.map((d: SaleDetail, i: number) => (
                  <div key={i} className="mb-1">
                    <strong>{d.productName}</strong> x {d.quantity} @ {d.unitPrice} = {d.totalPrice}
                  </div>
                ))}
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => handleDelete(sale.saleId)}
                  disabled={isPending}
                  variant="ghost"
                  size="icon"
                >
                  <Trash2 />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

