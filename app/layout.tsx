import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'CMU Sport Buddy',
  description: 'หาเพื่อนเล่นกีฬาใน CMU ได้ง่ายๆ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body className="min-h-screen bg-bg-main">
        {/* Sticky navbar on every page */}
        <Navbar />
        {/* Page content */}
        <main className="max-w-5xl mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  )
}
