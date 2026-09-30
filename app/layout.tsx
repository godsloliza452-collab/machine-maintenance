import type { Metadata } from 'next'
import { Noto_Sans_Thai } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const font = Noto_Sans_Thai({ subsets: ['thai', 'latin'] })

export const metadata: Metadata = {
  title: 'Machine Maintenance',
  description: 'ระบบจัดการเครื่องจักรและงานซ่อมบำรุง',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className={`${font.className} min-h-screen antialiased`}>
        <Navbar />
        <div className="mx-auto max-w-6xl">{children}</div>
      </body>
    </html>
  )
}