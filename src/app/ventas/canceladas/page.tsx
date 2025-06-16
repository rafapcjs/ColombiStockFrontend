 import { BoardSalesCanceled } from "@/components/sales/desactiveSales";
import Navbar from "@/components/ui/navbar";

 
export default function page() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-6">
        <h1 className="text-3xl font-bold mb-6">Ventas canceladas</h1>
        <BoardSalesCanceled />
      </main>
    </div>
  )
}
