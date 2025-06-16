"use client";
import React, { useState, useEffect } from "react";
import { useGetDailyProfit, useGetWeeklyProfit } from "@/hooks/sales/useProfits";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import Navbar from "@/components/ui/navbar";

const ProfitReport: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [reportType, setReportType] = useState("daily"); // daily, weekly

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(0); // Página actual
  const [pageSize, setPageSize] = useState(10); // Número de elementos por página

  // Calcular la fecha de inicio de la semana (lunes)
  const getStartOfWeek = (date: Date) => {
    const startDate = new Date(date);
    startDate.setDate(startDate.getDate() - startDate.getDay() + 1); // Restar para obtener el lunes
    return formatDate(startDate);
  };

  // Función para formatear la fecha correctamente (sin convertir a UTC)
  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`; // Formato YYYY-MM-DD
  };

  // Consumiendo los hooks correspondientes según el tipo de reporte
  const { dailyProfit, isLoading: dailyLoading } = useGetDailyProfit(
    selectedDate ? formatDate(selectedDate) : ""
  );
  const { weeklyProfit, isLoading: weeklyLoading } = useGetWeeklyProfit(
    getStartOfWeek(selectedDate || new Date())
  );

  // Cambiar la fecha automáticamente cuando seleccionan "Diario"
  const handleDailyReport = () => {
    setReportType("daily");
    const today = new Date(); // Tomar la fecha actual
    today.setHours(0, 0, 0, 0); // Asegurarse de que la hora sea 00:00:00
    setSelectedDate(today); // Establecer la fecha seleccionada como hoy
  };

  const handleSearch = () => {
    if (!selectedDate) {
      toast.error("Por favor, seleccione una fecha para ver el reporte.");
    }
  };

  // Manejo de la paginación de los detalles
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(0); // Resetear a la primera página cuando cambiamos el tamaño de página
  };

  // Función para obtener los datos paginados de las ventas
  const getPaginatedSales = (sales: any[], page: number, pageSize: number) => {
    const start = page * pageSize;
    const end = start + pageSize;
    return sales.slice(start, end); // Devuelve los elementos correspondientes a la página actual
  };

  return (
    <>
      <Navbar />
      <main className="container mx-auto py-40 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Reporte de Ganancias</h1>
          <p className="text-lg text-gray-600">Consulta las ganancias de ventas para la fecha seleccionada.</p>
        </div>

        {/* Selector de Reporte */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={handleDailyReport} // Cuando presionas "Diario", se obtiene la fecha actual y los datos
            className={`px-8 py-3 ${reportType === "daily" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"} rounded-lg text-lg transition-all hover:bg-blue-700`}
          >
            Diario
          </button>
          <button
            onClick={() => setReportType("weekly")}
            className={`px-8 py-3 ${reportType === "weekly" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"} rounded-lg text-lg transition-all hover:bg-green-700`}
          >
            Semanal
          </button>
        </div>

        {/* Para reporte diario o semanal, mostrar selector de fecha */}
        {(reportType === "daily" || reportType === "weekly") && (
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Selecciona una fecha para el reporte:</h3>
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => setSelectedDate(date)}
              dateFormat="yyyy-MM-dd"
              isClearable
              className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Botón de búsqueda */}
        <div className="flex justify-center mt-4">
          <button
            onClick={handleSearch}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg text-lg transition-all hover:bg-blue-700"
          >
            Ver Reporte
          </button>
        </div>

        {/* Cargar reporte */}
        {reportType === "daily" && dailyLoading && (
          <div className="text-center mt-6 text-gray-500">Cargando reporte diario...</div>
        )}
        {reportType === "weekly" && weeklyLoading && (
          <div className="text-center mt-6 text-gray-500">Cargando reporte semanal...</div>
        )}

        {/* Reporte Diario */}
        {reportType === "daily" && dailyProfit && !dailyLoading && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
              Ganancias del {dailyProfit?.periodLabel}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h3 className="text-xl font-semibold text-gray-700">Total Ingresos</h3>
                <p className="text-2xl font-bold text-blue-600">${dailyProfit.totalRevenue}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h3 className="text-xl font-semibold text-gray-700">Total Costos</h3>
                <p className="text-2xl font-bold text-red-600">${dailyProfit.totalCost}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h3 className="text-xl font-semibold text-gray-700">Total Ganancia</h3>
                <p className="text-2xl font-bold text-green-600">${dailyProfit.totalProfit}</p>
              </div>
            </div>

            {/* Detalles de Productos con Paginación */}
            <div className="mt-6">
              <h4 className="text-xl font-semibold text-gray-800">Detalle de Ventas</h4>
              {/* Datos paginados */}
              {getPaginatedSales(dailyProfit.details, currentPage, pageSize).map((sale) => (
                <div key={sale.saleId} className="mt-4 bg-white p-6 rounded-lg shadow-md">
                  <h5 className="text-md font-medium text-gray-800">
                    Venta ID: {sale.saleId} - Fecha: {sale.saleDate}
                  </h5>
                  <table className="min-w-full mt-2">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border px-3 py-2 text-sm">Producto</th>
                        <th className="border px-3 py-2 text-sm">Cantidad</th>
                        <th className="border px-3 py-2 text-sm">Precio Unitario</th>
                        <th className="border px-3 py-2 text-sm">Ingreso</th>
                        <th className="border px-3 py-2 text-sm">Costo</th>
                        <th className="border px-3 py-2 text-sm">Ganancia</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sale.lines.map((line, index) => (
                        <tr key={index}>
                          <td className="border px-3 py-2 text-sm">{line.productName}</td>
                          <td className="border px-3 py-2 text-sm">{line.quantity}</td>
                          <td className="border px-3 py-2 text-sm">${line.unitPrice}</td>
                          <td className="border px-3 py-2 text-sm">${line.revenueLine}</td>
                          <td className="border px-3 py-2 text-sm">${line.costLine}</td>
                          <td className="border px-3 py-2 text-sm">${line.profitLine}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>

            {/* Paginación */}
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
              >
                Anterior
              </button>
              <span>Página {currentPage + 1}</span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={dailyProfit.details.length <= (currentPage + 1) * pageSize}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* Reporte Semanal */}
        {reportType === "weekly" && weeklyProfit && !weeklyLoading && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
              Ganancias de la Semana
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h3 className="text-xl font-semibold text-gray-700">Total Ingresos</h3>
                <p className="text-2xl font-bold text-blue-600">${weeklyProfit.totalRevenue}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h3 className="text-xl font-semibold text-gray-700">Total Costos</h3>
                <p className="text-2xl font-bold text-red-600">${weeklyProfit.totalCost}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h3 className="text-xl font-semibold text-gray-700">Total Ganancia</h3>
                <p className="text-2xl font-bold text-green-600">${weeklyProfit.totalProfit}</p>
              </div>
            </div>

            {/* Detalles de Productos con Paginación */}
            <div className="mt-6">
              <h4 className="text-xl font-semibold text-gray-800">Detalle de Ventas</h4>
              {/* Datos paginados */}
              {getPaginatedSales(weeklyProfit.details, currentPage, pageSize).map((sale) => (
                <div key={sale.saleId} className="mt-4 bg-white p-6 rounded-lg shadow-md">
                  <h5 className="text-md font-medium text-gray-800">
                    Venta ID: {sale.saleId} - Fecha: {sale.saleDate}
                  </h5>
                  <table className="min-w-full mt-2">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border px-3 py-2 text-sm">Producto</th>
                        <th className="border px-3 py-2 text-sm">Cantidad</th>
                        <th className="border px-3 py-2 text-sm">Precio Unitario</th>
                        <th className="border px-3 py-2 text-sm">Ingreso</th>
                        <th className="border px-3 py-2 text-sm">Costo</th>
                        <th className="border px-3 py-2 text-sm">Ganancia</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sale.lines.map((line, index) => (
                        <tr key={index}>
                          <td className="border px-3 py-2 text-sm">{line.productName}</td>
                          <td className="border px-3 py-2 text-sm">{line.quantity}</td>
                          <td className="border px-3 py-2 text-sm">${line.unitPrice}</td>
                          <td className="border px-3 py-2 text-sm">${line.revenueLine}</td>
                          <td className="border px-3 py-2 text-sm">${line.costLine}</td>
                          <td className="border px-3 py-2 text-sm">${line.profitLine}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>

            {/* Paginación */}
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
              >
                Anterior
              </button>
              <span>Página {currentPage + 1}</span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={weeklyProfit.details.length <= (currentPage + 1) * pageSize}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default ProfitReport;
