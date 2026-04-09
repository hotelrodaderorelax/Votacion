import type { Metadata, Viewport } from 'next'
import { Poppins, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins"
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair"
});

export const metadata: Metadata = {
  title: 'Hotel Rodadero Relax | Vota por el Empleado del Mes',
  description: 'Califica tu experiencia y vota por el empleado del mes en Hotel Rodadero Relax. Tu opinión nos ayuda a mejorar.',
  generator: 'v0.app',
  // --- SECCIÓN ACTUALIZADA ---
  icons: {
    icon: '/Logo.ico', // Apunta directamente a tu archivo en la carpeta public
    apple: '/Logo.ico', // Opcional: usa el mismo para dispositivos Apple si no tienes un .png
  },
}

export const viewport: Viewport = {
  themeColor: '#0891b2',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${poppins.variable} ${playfair.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
