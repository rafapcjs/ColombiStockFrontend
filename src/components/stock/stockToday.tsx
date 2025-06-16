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
import { useGetStockMovementsToday } from "@/hooks/stockMovement/useGetStockToday";
 
const StockTodayTable: React.FC = () => {
  const { stockMovements } = useGetStockMovementsToday(
    0,
    10,
    "createDate",
    "asc"
  );

  const rows =
    stockMovements?.content?.map((movement, index) => ({
      id: index,
      productCode: movement.productCode || "",
      productName: movement.name || "",

      quantity: movement.quantity || "",
      movementType: movement.movementType || "",
      createDate: movement.movementDate || "",
      statusEntity: movement.statusEntity || "",
    })) || [];

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-4 py-2">Codigo</TableHead>
            <TableHead className="px-4 py-2">Nombre</TableHead>

            <TableHead className="px-4 py-2">Cantidad</TableHead>
            <TableHead className="px-4 py-2">Tipo de Movimiento</TableHead>
            <TableHead className="px-4 py-2">Fecha de Creación</TableHead>
            <TableHead className="px-4 py-2">Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} hover>
              <TableCell className="px- 2 py-2 font-medium">{row.productCode}</TableCell>
              <TableCell className="px-2 py-2 font-medium">{row.productName}</TableCell>

              <TableCell className="px-2 py-2">{row.quantity}</TableCell>
              <TableCell className="px-2 py-2">{row.movementType}</TableCell>
              <TableCell className="px-2 py-2">{row.createDate}</TableCell>
              <TableCell className="px-2 py-2">{row.statusEntity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StockTodayTable;
