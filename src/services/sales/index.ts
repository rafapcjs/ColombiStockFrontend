import { colombiStockApi } from "@/api";
import { MostSoldProduct } from "@/types/products";
import { ProfitReportDTO, Sales, SalesCreate } from "@/types/salesModel";

 

export const CreateSales = async (sales: SalesCreate[]) => {
  const { data } = await colombiStockApi.post("/sales/create",sales,{responseType: 'blob',});
  return data;
};
 
export const GetSalesCanceled = async (): Promise<Sales[]> => {
  const { data } = await colombiStockApi.get("/sales/listCanceledSales");
  return data as Sales[];
};

export const GetSalesActive = async (): Promise<Sales[]> => {
  const { data } = await colombiStockApi.get("/sales/active");
  return data as Sales[];
};

export const DeleteSales = async (uuid: string): Promise<void> => {
  await colombiStockApi.delete(`/sales/canceled/${uuid}`);
};
export const getDailyProfit = async (date: string): Promise<ProfitReportDTO> => {
  const { data } = await colombiStockApi.get('/sales/daily', {
    params: { date },
  });
  return data as ProfitReportDTO;
};

// Obtener ganancias semanales
export const getWeeklyProfit = async (date: string): Promise<ProfitReportDTO> => {
  const { data } = await colombiStockApi.get('/sales/weekly', {
    params: { date },
  });
  return data as ProfitReportDTO;
};

// Obtener ganancias mensuales
export const getMonthlyProfit = async (year: number, month: number): Promise<ProfitReportDTO> => {
  try {
    // Realiza la solicitud GET pasando los parámetros correctamente
    const response = await colombiStockApi.get('/sales/monthly', {
      params: { year, month },
    });

    // Verificamos si la respuesta es exitosa y retorna los datos
    if (response.status === 200) {
      return response.data as ProfitReportDTO; // Asegúrate de que la respuesta esté en el formato esperado
    } else {
      throw new Error("Error en la respuesta de la API: " + response.statusText);
    }
  } catch (error) {
    // Manejo de errores, aquí podrías mejorar el manejo dependiendo de tu lógica
    console.error("Error al obtener las ganancias mensuales:", error);
    throw new Error("No se pudo obtener el reporte mensual.");
  }
};


export const getMostProductWithSales = async()=> {

const {data}= await colombiStockApi.get('/sales/most-sold-products');

return data as MostSoldProduct

}

 