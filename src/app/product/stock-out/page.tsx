import StockOutFormImproved from "@/components/stockOut";
import Navbar from "@/components/ui/navbar";

export default function StockOutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-10 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4">Registro de salidas</h1>
        <p className="text-muted-foreground mb-8 text-center">
          Registre nuevas salidas de productos al inventario
        </p>

        {/* tu formulario ya tiene max-width y mx-auto */}
        <StockOutFormImproved />
      </main>
    </div>
  );
}
