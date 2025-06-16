import ProductsPage from "@/components/products/product-page";
 import Navbar from "@/components/ui/navbar";
import React from "react";

const index = () => {
  return (
    <>
      <Navbar />
      <main className="container mx-auto py-40 px-4">
        <ProductsPage />
      </main>
    </>
  );
};

export default index;
