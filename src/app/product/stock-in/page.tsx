import StockInFormImproved from "@/components/stockIn";
import Navbar from "@/components/ui/navbar";

export default function StockInPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-10 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4">Registro de entradas</h1>
        <p className="text-muted-foreground mb-8 text-center">
          Registre nuevas entradas de productos al inventario
        </p>
        <StockInFormImproved />
      </main>
    </div>
  );
}
