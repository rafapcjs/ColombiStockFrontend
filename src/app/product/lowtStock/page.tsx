import LowStockTable from "@/components/stock/lowStock";
import Navbar from "@/components/ui/navbar";

 
export default function LowStockPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-6">
        <LowStockTable />
      </main>
    </div>
  )
}
