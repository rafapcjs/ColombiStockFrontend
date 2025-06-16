 import { BoardActiveSales } from "@/components/sales/activesSales";
import Navbar from "@/components/ui/navbar";

 
export default function ActiveSalesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-6">
        <h1 className="text-3xl font-bold mb-6">Ventas Activas</h1>
        <BoardActiveSales />
      </main>
    </div>
  )
}
