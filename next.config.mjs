/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Mark leaflet packages as external for server components
  serverComponentsExternalPackages: ['leaflet', 'react-leaflet'],
}

export default nextConfig
