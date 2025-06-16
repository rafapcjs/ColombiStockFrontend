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
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSalesCanceled } from "@/hooks/sales/useGetSalesCanceled";
 
interface SaleDetail {
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// Estilos base para contenedor
const containerClasses = "mt-12 h-[80vh] w-full overflow-auto flex items-center justify-center";

// Componente para ventas canceladas
export const BoardSalesCanceled: React.FC = () => {
  const { salesCanceled, isLoading } = useGetSalesCanceled();

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
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, idx) => (
              <TableRow key={idx}>
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

  if (!salesCanceled || salesCanceled.length === 0) {
    return (
      <div className={containerClasses}>
        <p className="text-xl font-medium">No hay ventas canceladas</p>
      </div>
    );
  }

  return (
    <div className="mt-12 h-[80vh] w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>VENTA ID</TableHead>
            <TableHead>FECHA</TableHead>
            <TableHead>TOTAL</TableHead>
            <TableHead>DETALLES</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {salesCanceled.map((sale) => (
            <TableRow key={sale.saleId}>
              <TableCell>{sale.saleId}</TableCell>
              <TableCell>{new Date(sale.saleDate).toLocaleDateString()}</TableCell>
              <TableCell>{sale.totalAmount}</TableCell>
              <TableCell>
                {sale.details.map((d: SaleDetail, i) => (
                  <div key={i} className="mb-1">
                    <strong>{d.productName}</strong> x {d.quantity} @ {d.unitPrice} = {d.totalPrice}
                  </div>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
