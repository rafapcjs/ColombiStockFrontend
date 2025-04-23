import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Ignora errores ESLint en build de producción
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
