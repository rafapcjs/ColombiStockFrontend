import { getDailyProfit, getMonthlyProfit, getWeeklyProfit } from "@/services/sales";
import { ProfitReportDTO } from "@/types/salesModel";
import { useQuery } from "@tanstack/react-query";
 
// Hook para obtener las ganancias diarias
export const useGetDailyProfit = (date: string) => {
  const { data: dailyProfit, isLoading } = useQuery<ProfitReportDTO>({
    queryKey: ["dailyProfit", date],
    queryFn: () => getDailyProfit(date),
  });

  return { dailyProfit, isLoading };
};

// Hook para obtener las ganancias semanales
export const useGetWeeklyProfit = (date: string) => {
  const { data: weeklyProfit, isLoading } = useQuery<ProfitReportDTO>({
    queryKey: ["weeklyProfit", date],
    queryFn: () => getWeeklyProfit(date),
  });

  return { weeklyProfit, isLoading };
};

// Hook para obtener las ganancias mensuales
export const useGetMonthlyProfit = (year: number, month: number) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["monthlyProfit", year, month],
    queryFn: () => getMonthlyProfit(year, month),
    enabled: !!year && !!month,  // Solo ejecuta si year y month están definidos
  });

  return { monthlyProfit: data, isLoading, error };
};