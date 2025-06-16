import RegisterSale from "@/components/sales/registerSales";
import Navbar from "@/components/ui/navbar";

 
export default function RegisterSalePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <RegisterSale />
      </main>
    </div>
  )
}
