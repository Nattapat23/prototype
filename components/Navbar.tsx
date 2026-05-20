'use client'

// Navbar — shared top navigation, client component for active link highlight
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CURRENT_USER } from '@/lib/mockData'

export default function Navbar() {
  const pathname = usePathname()

  // Helper: return active style when path matches
  const isActive = (href: string) =>
    pathname === href
      ? 'text-white font-semibold border-b-2 border-white pb-0.5'
      : 'text-emerald-100 hover:text-white transition-colors'

  return (
    <header className="bg-primary shadow-md sticky top-0 z-50">
      <nav className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🏟️</span>
          <span className="text-white font-bold text-lg tracking-tight">CMU Sport</span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-6">
          <Link href="/" className={isActive('/')}>หน้าแรก</Link>
          <Link href="/create" className={isActive('/create')}>สร้าง session</Link>
          {/* Admin link — prototype only, no auth gate */}
          <Link href="/admin" className={isActive('/admin')}>Admin</Link>
          {/* Avatar — mock user, no auth in prototype */}
          <div className="w-8 h-8 rounded-full bg-emerald-200 text-emerald-800 font-bold text-sm flex items-center justify-center cursor-pointer hover:bg-emerald-100 transition-colors">
            {CURRENT_USER.avatar}
          </div>
        </div>
      </nav>
    </header>
  )
}
