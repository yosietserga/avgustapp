import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from "./Providers";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Avgust - Soluciones Agrícolas',
  description: 'Soluciones innovadoras para la agricultura moderna',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}