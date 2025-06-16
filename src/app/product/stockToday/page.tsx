// app/stock-day/page.tsx

import StockTodayTable from "@/components/stock/stockToday";
import Navbar from "@/components/ui/navbar";

 

export default function StockDayPage() {
  return (
    <>
      <Navbar />

      <main className="p-8 mt-16">  {/* mt-16 deja espacio bajo la barra fija */}
        <h1 className="text-2xl font-bold mb-4">Movimientos de Stock – Hoy</h1>
        <StockTodayTable />
      </main>
    </>
  );
}
