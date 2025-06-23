// File: D:/quick/components/common/Navbar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Store', href: '/store' },
  { label: 'Login', href: '/auth/login' },
  { label: 'About', href: '/about' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
  <nav className="w-full bg-transparent text-white py-5 px-8 flex justify-center items-center space-x-20">
  <div className="text-2xl font-bold tracking-wide">QUICK</div>
  <div className="flex space-x-8 text-sm font-medium">
    {navItems.map((item) => {
      const isActive = pathname === item.href
      return (
        <Link
          key={item.href}
          href={item.href}
          className={`transition-colors duration-200 ${
            isActive
              ? 'text-yellow-300'
              : 'text-white hover:text-yellow-200'
          }`}
        >
          {item.label}
        </Link>
      )
    })}
  </div>
</nav>

  )
}