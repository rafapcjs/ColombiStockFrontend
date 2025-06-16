"use client";

import Navbar from '@/components/ui/navbar';
import { UseGetProductMostSales } from '@/hooks/sales/useGetProductMostSales';
import React from 'react';

const MostSoldProducts = () => {
  const { data, isLoading, error } = UseGetProductMostSales();

  // Obtener la fecha actual y formatearla
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = now.toLocaleDateString('es-ES', options);

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">
          Productos Más Vendidos del mes
        </h1>
        <div className="text-center text-gray-500 mb-6">{formattedDate}</div>

        {isLoading && (
          <div className="text-center text-blue-500">Cargando productos...</div>
        )}

        {error && (
          <div className="text-center text-red-500">Error al cargar los productos</div>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data && data.length > 0 ? (
              data.map((product: any, index: number) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow duration-300">
                  <h2 className="text-lg font-semibold text-gray-800">{product.productName}</h2>
                  <p className="text-sm text-gray-500">Código: {product.productCode}</p>
                  <p className="text-xl font-bold text-blue-600">Cantidad Vendida: {product.totalQuantity}</p>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">No hay productos disponibles</div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default MostSoldProducts;