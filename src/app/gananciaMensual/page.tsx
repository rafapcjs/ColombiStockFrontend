"use client";
import Navbar from '@/components/ui/navbar';
import { useGetMonthlyProfit } from '@/hooks/sales/useProfits';
import React, { useState } from 'react';

const ProfitReport: React.FC = () => {
  const [year, setYear] = useState<number>(2025); // Año predeterminado
  const [month, setMonth] = useState<number>(6); // Mes predeterminado (Junio)

  // Consume el hook de React Query
  const { monthlyProfit, isLoading, error } = useGetMonthlyProfit(year, month);

  // Función para cambiar el mes
  const handleMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedMonth = parseInt(event.target.value, 10);
    setMonth(selectedMonth);
  };

  // Función para cambiar el año
  const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedYear = parseInt(event.target.value, 10);
    setYear(selectedYear);
  };

  if (isLoading) {
    return <div className="text-center p-6">Cargando...</div>;
  }

  if (error instanceof Error) {
    return <div className="text-center p-6 text-red-500">{error.message}</div>;
  }

  if (!monthlyProfit) {
    return <div className="text-center p-6">No hay datos disponibles</div>;
  }

  return (<>  
  <Navbar />
      <main className="container mx-auto py-40 px-4">
   

    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center text-gray-800">Reporte de Ganancias para {monthlyProfit.periodLabel}</h1>

      <div className="flex justify-center space-x-6 mb-6">
        {/* Selección de Año */}
        <div className="flex items-center">
          <label className="text-lg font-medium">Año:</label>
          <input
            type="number"
            value={year}
            min="2000"
            max="2100"
            onChange={handleYearChange}
            className="ml-4 p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Selección de Mes */}
        <div className="flex items-center">
          <label className="text-lg font-medium">Mes:</label>
          <input
            type="number"
            value={month}
            min="1"
            max="12"
            onChange={handleMonthChange}
            className="ml-4 p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Totales del Periodo</h2>
        <div className="space-y-2">
          <p><span className="font-semibold">Total Ingresos:</span> ${monthlyProfit.totalRevenue}</p>
          <p><span className="font-semibold">Total Costos:</span> ${monthlyProfit.totalCost}</p>
          <p><span className="font-semibold">Total Ganancia:</span> ${monthlyProfit.totalProfit}</p>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800">Detalles de Ventas</h2>
        {monthlyProfit.details.map((saleDetail) => (
          <div key={saleDetail.saleId} className="bg-gray-100 p-4 rounded-lg shadow-sm mb-6">
            <h3 className="text-xl font-medium text-gray-800">Venta ID: {saleDetail.saleId}</h3>
            <p className="text-gray-600">Fecha: {saleDetail.saleDate}</p>

            <table className="min-w-full mt-4 table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2 text-sm font-medium text-gray-600">Producto</th>
                  <th className="border px-4 py-2 text-sm font-medium text-gray-600">Cantidad</th>
                  <th className="border px-4 py-2 text-sm font-medium text-gray-600">Precio Unitario</th>
                  <th className="border px-4 py-2 text-sm font-medium text-gray-600">Costo Unitario</th>
                  <th className="border px-4 py-2 text-sm font-medium text-gray-600">Ingresos</th>
                  <th className="border px-4 py-2 text-sm font-medium text-gray-600">Costos</th>
                  <th className="border px-4 py-2 text-sm font-medium text-gray-600">Ganancia</th>
                </tr>
              </thead>
              <tbody>
                {saleDetail.lines.map((line) => (
                  <tr key={line.productCode} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{line.productName}</td>
                    <td className="border px-4 py-2">{line.quantity}</td>
                    <td className="border px-4 py-2">{line.unitPrice}</td>
                    <td className="border px-4 py-2">{line.unitCost}</td>
                    <td className="border px-4 py-2">{line.revenueLine}</td>
                    <td className="border px-4 py-2">{line.costLine}</td>
                    <td className="border px-4 py-2">{line.profitLine}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    
    </div>
        </main>
  </>
  );
};

export default ProfitReport;
