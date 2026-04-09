/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  optimizeFonts: false, // Añade esto para evitar el bucle de fuentes
}

export default nextConfig
