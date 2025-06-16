// app/facturas/page.tsx
"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useGetAllFacturas } from "@/hooks/facturas/useGetAllFacturas";
import { useCreateFactura } from "@/hooks/facturas/useCreateFactures";
import { useUpdateFactura } from "@/hooks/facturas/useUpdateFactura";
import { UseGetAllSuppliers } from "@/hooks/suppliers/useGetAllSuppliers";
import { useGetAllProducts } from "@/hooks/product/useGetAllProducts";
import {
  DetalleProductoPayload,
  FacturaCompraDto,
  FacturaCompraPayload,
} from "@/types/facturaMode";
import { SuppliersModelDto } from "@/types/SuppliersModel";
import { ProductModeltDto } from "@/types/products";
import { PaginatedResponse } from "@/types/PaginatedResponse";
import Navbar from "@/components/ui/navbar";
import { toast } from "react-toastify";

export default function FacturasPage() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [sortBy, setSortBy] = useState("fechaCompra");
  const [direction, setDirection] = useState<"asc" | "desc">("desc");

  const {
    facturas: data,
    isLoading: loadingFacturas,
  } = useGetAllFacturas(page, size, sortBy, direction);

  const {
    suppliers,
    isLoading: loadingSuppliers,
  } = UseGetAllSuppliers(0, 100, "name", "asc");

  const {
    products,
    isLoading: loadingProducts,
  } = useGetAllProducts(0, 100, "name", "asc");

  const [isEditing, setIsEditing] = useState(false);
  const [editNumero, setEditNumero] = useState<string | null>(null);

  const emptyDetalle: DetalleProductoPayload = {
    productCode: "",
    cantidad: 1,
    precioUnitario: 0,
  };

  const [formData, setFormData] = useState<FacturaCompraPayload>({
    numeroFactura: "",
    fechaCompra: "",
    proveedorDni: "",
    productos: [{ ...emptyDetalle }],
  });

  const { createFacturaMutation, isLoading: creating } = useCreateFactura();
  const { updateFacturaMutation, isLoading: updating } = useUpdateFactura();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProveedorChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      proveedorDni: e.target.value,
    }));
  };

  const handleDetalleProductChange = (
    index: number,
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = e.target;
    setFormData((prev) => {
      const nuevos = prev.productos.map((detalle, idx) =>
        idx === index ? { ...detalle, productCode: value } : detalle
      );
      return { ...prev, productos: nuevos };
    });
  };

  const handleDetalleChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const nuevos = prev.productos.map((detalle, idx) =>
        idx === index
          ? {
              ...detalle,
              [name]:
                name === "cantidad" || name === "precioUnitario"
                  ? Number(value)
                  : value,
            }
          : detalle
      );
      return { ...prev, productos: nuevos };
    });
  };

  const addDetalle = () => {
    setFormData((prev) => ({
      ...prev,
      productos: [...prev.productos, { ...emptyDetalle }],
    }));
  };

  const removeDetalle = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      productos: prev.productos.filter((_, idx) => idx !== index),
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (
      !formData.numeroFactura.trim() ||
      !formData.fechaCompra.trim() ||
      !formData.proveedorDni.trim()
    ) {
      toast.error("Número, fecha y proveedor son obligatorios.");
      return;
    }
    const anyInvalid = formData.productos.some((d) => d.productCode === "");
    if (anyInvalid) {
      toast.error("Cada línea de producto debe tener un código seleccionado.");
      return;
    }

    if (isEditing && editNumero) {
      updateFacturaMutation({
        numeroFactura: editNumero,
        factura: formData,
      });
    } else {
      createFacturaMutation(formData);
    }
    setFormData({
      numeroFactura: "",
      fechaCompra: "",
      proveedorDni: "",
      productos: [{ ...emptyDetalle }],
    });
    setIsEditing(false);
    setEditNumero(null);
  };

  const handleEditClick = (factura: FacturaCompraDto) => {
  setIsEditing(true);
  setEditNumero(factura.numeroFactura);
  setFormData({
    numeroFactura: factura.numeroFactura,
    fechaCompra: factura.fechaCompra,
    proveedorDni: factura.proveedorDni, // Asegúrate de que esto se pase correctamente
    productos: factura.productos.map((p) => ({
      productCode: p.productCode, // Asigna el productCode aquí, no el nombre del producto
      cantidad: p.cantidad,
      precioUnitario: p.precioUnitario,
    })),
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
};


  return (
    <>
      <Navbar />

      <main className="container mx-auto py-10 px-4 space-y-8">
        <h1 className="text-3xl font-bold">
          {isEditing ? "✏️ Editar Factura" : "🆕 Crear Nueva Factura"}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow"
        >
          <div>
            <label className="block text-sm font-medium">Número de Factura</label>
            <input
              name="numeroFactura"
              value={formData.numeroFactura}
              onChange={handleChange}
              required
              disabled={isEditing}
              placeholder="Ingrese número único"
              className="mt-1 w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Fecha de Compra</label>
            <input
              name="fechaCompra"
              type="date"
              value={formData.fechaCompra}
              onChange={handleChange}
              required
              className="mt-1 w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-medium">Proveedor</label>
            {loadingSuppliers ? (
              <p className="mt-1 text-sm text-gray-500">Cargando proveedores...</p>
            ) : (
              <select
  name="proveedorDni"
  value={formData.proveedorDni}  // Asegúrate de que el valor esté correctamente asignado
  onChange={handleProveedorChange}
  required
  className="mt-1 w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring"
>
  <option value="">— Seleccione proveedor —</option>
  {suppliers?.content.map((sup: SuppliersModelDto) => (
    <option key={sup.dni} value={sup.dni}>
      {sup.name} ({sup.dni})
    </option>
  ))}
</select>

            )}
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-lg font-medium mt-4">Productos</h2>
            {formData.productos.map((detalle, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-end gap-4 mt-2">
                {loadingProducts ? (
                  <p className="text-sm text-gray-500">Cargando productos...</p>
                ) : (
                  <div className="w-full sm:w-2/5 flex flex-col">
                    <label className="text-sm font-medium mb-1">Producto</label>
                    <select
                      name="productCode"
                      value={detalle.productCode}
                      onChange={(e) => handleDetalleProductChange(idx, e)}
                      required
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring"
                    >
                      <option value="">— Seleccione producto —</option>
                      {products?.content.map((prod: ProductModeltDto) => (
                        <option key={prod.code} value={prod.code}>
                          {prod.name} ({prod.code})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="w-full sm:w-1/6 flex flex-col">
                  <label className="text-sm font-medium mb-1">Cantidad</label>
                  <input
                    name="cantidad"
                    type="number"
                    value={detalle.cantidad}
                    onChange={(e) => handleDetalleChange(idx, e)}
                    min={1}
                    required
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring"
                  />
                </div>

                <div className="w-full sm:w-1/4 flex flex-col">
                  <label className="text-sm font-medium mb-1">Precio Unitario</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-600">
                      $
                    </span>
                    <input
                      name="precioUnitario"
                      type="number"
                      step="0.01"
                      value={detalle.precioUnitario}
                      onChange={(e) => handleDetalleChange(idx, e)}
                      min={0}
                      required
                      placeholder="0.00"
                      className="w-full pl-8 border rounded px-3 py-2 text-sm focus:outline-none focus:ring"
                    />
                  </div>
                </div>

                {formData.productos.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDetalle(idx)}
                    className="mt-6 sm:mt-0 w-full sm:w-10 h-10 flex-shrink-0 bg-red-500 text-white rounded-md transition hover:bg-red-600"
                  >
                    
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addDetalle}
              className="mt-4 inline-block px-4 py-2 bg-green-600 text-white rounded-md text-sm transition hover:bg-green-700"
            >
              + Agregar Producto
            </button>
          </div>

          <div className="lg:col-span-2 text-right">
            <button
              type="submit"
              disabled={creating || updating}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md text-sm transition hover:bg-blue-700 disabled:opacity-50"
            >
              {isEditing
                ? updating
                  ? "Actualizando..."
                  : "Actualizar Factura"
                : creating
                ? "Creando..."
                : "Crear Factura"}
            </button>
          </div>
        </form>

        <hr className="border-gray-300" />

        <h2 className="text-3xl font-bold mt-8">Listado de Facturas</h2>
        {loadingFacturas ? (
          <p className="text-sm text-gray-500">Cargando facturas...</p>
        ) : (
          <PaginatedFacturasTable
            facturasData={data}
            isLoading={loadingFacturas}
            currentPage={page}
            pageSize={size}
            sortBy={sortBy}
            direction={direction}
            onPageChange={setPage}
            onPageSizeChange={setSize}
            onDirectionChange={setDirection}
            onEdit={handleEditClick}
          />
        )}
      </main>
    </>
  );
}

interface PaginatedFacturasTableProps {
  facturasData: PaginatedResponse<FacturaCompraDto> | undefined;
  isLoading: boolean;
  currentPage: number;
  pageSize: number;
  sortBy: string;
  direction: "asc" | "desc";
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newSize: number) => void;
  onDirectionChange: (newDirection: "asc" | "desc") => void;
  onEdit?: (factura: FacturaCompraDto) => void;
}

function PaginatedFacturasTable({
  facturasData,
  isLoading,
  currentPage,
  pageSize,
  sortBy,
  direction,
  onPageChange,
  onPageSizeChange,
  onDirectionChange,
  onEdit,
}: PaginatedFacturasTableProps) {
  if (!facturasData || isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <table className="w-full border-collapse bg-white rounded-lg shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-3 py-2 text-left text-sm">Número</th>
            <th className="border px-3 py-2 text-left text-sm">Proveedor</th>
            <th className="border px-3 py-2 text-left text-sm">Fecha</th>
            <th className="border px-3 py-2 text-left text-sm">Detallado de producto</th>
            <th className="border px-3 py-2 text-left text-sm">Total</th> {/* Columna de total por factura */}
            <th className="border px-3 py-2 text-center text-sm">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {facturasData.content.map((factura) => (
            <tr key={factura.numeroFactura} className="hover:bg-gray-50">
              <td className="border px-3 py-2 text-sm">{factura.numeroFactura}</td>
              <td className="border px-3 py-2 text-sm">{factura.proveedorNombre}</td>
              <td className="border px-3 py-2 text-sm">{factura.fechaCompra}</td>
     
  <td className="border px-3 py-2 text-sm">
  {factura.productos.map((p, idx) => (
    <div key={`${factura.numeroFactura}-${idx}`} className="flex justify-between">
      <span>{p.nombreProducto}</span>
      <span className="font-medium">x{p.cantidad}</span>
      {/* Mostrar Precio Unitario */}
      <span className="font-medium text-gray-600">{`$${p.precioUnitario.toFixed(2)}`}</span>
      {/* Calcular y mostrar el Total por Producto */}
     </div>
  ))}
</td>


              <td className="border px-3 py-2 text-sm font-medium">
                {/* Total de la factura */}
                {factura.totalFactura.toFixed(2)}
              </td>
              <td className="border px-3 py-2 text-center">
                {onEdit && (
                  <button
                    onClick={() => onEdit(factura)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded-md text-sm transition hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between pt-2">
        <span className="text-sm text-gray-600">
          Página {facturasData.number + 1} de {facturasData.totalPages}
        </span>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 0))}
            disabled={currentPage === 0}
            className="px-3 py-1 bg-gray-200 rounded text-sm disabled:opacity-50"
          >
            Anterior
          </button>

          <button
            onClick={() => {
              if (currentPage < facturasData.totalPages - 1)
                onPageChange(currentPage + 1);
            }}
            disabled={currentPage >= facturasData.totalPages - 1}
            className="px-3 py-1 bg-gray-200 rounded text-sm disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
