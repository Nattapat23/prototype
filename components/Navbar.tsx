'use client'

// Navbar — sticky top nav with responsive hamburger menu on mobile
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CURRENT_USER } from '@/lib/mockData'

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  // Active link classes — desktop
  const isActive = (href: string) =>
    pathname === href
      ? 'text-white font-semibold border-b-2 border-white pb-0.5'
      : 'text-violet-100 hover:text-white transition-colors'

  // Active link classes — mobile drawer
  const isMobileActive = (href: string) =>
    pathname === href
      ? 'bg-primary text-white font-semibold'
      : 'text-gray-700 hover:bg-gray-100'

  const NAV_LINKS = [
    { href: '/',       label: 'หน้าแรก' },
    { href: '/create', label: 'สร้าง session' },
    { href: '/admin',  label: 'Admin' },
  ]

  return (
    <>
      <header className="bg-primary shadow-md sticky top-0 z-50">
        <nav className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🏟️</span>
            <span className="text-white font-bold text-lg tracking-tight">CMU Sport</span>
          </Link>

          {/* Desktop nav links — hidden on mobile */}
          <div className="hidden sm:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={isActive(link.href)}>
                {link.label}
              </Link>
            ))}
            {/* Avatar — mock user */}
            <div className="w-8 h-8 rounded-full bg-violet-200 text-violet-800 font-bold text-sm flex items-center justify-center cursor-pointer hover:bg-violet-100 transition-colors">
              {CURRENT_USER.avatar}
            </div>
          </div>

          {/* Mobile: avatar + hamburger */}
          <div className="flex sm:hidden items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-violet-200 text-violet-800 font-bold text-sm flex items-center justify-center">
              {CURRENT_USER.avatar}
            </div>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="เปิด/ปิดเมนู"
            >
              {/* Hamburger / close icon */}
              {menuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="sm:hidden bg-white border-b border-gray-100 shadow-md sticky top-14 z-40">
          <nav className="max-w-5xl mx-auto px-4 py-2 flex flex-col">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isMobileActive(link.href)}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}
