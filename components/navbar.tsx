'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, Leaf, User, LogOut, History, LayoutDashboard, BookOpen } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export function Navbar() {
  const pathname = usePathname()
  const { user, logout, loading } = useAuth()
  const [open, setOpen] = useState(false)

  const navLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/scan', label: 'Scan Limbah' },
    { href: '/artikel', label: 'Artikel' },
    ...(user ? [
      { href: '/blog', label: 'Blog' },
      { href: '/dashboard', label: 'Dashboard' },
    ] : []),
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-7xl">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary overflow-hidden">
  <Image
    src="/daun.png"
    alt="Smart Waste Logo"
    width={60}
    height={60}
  />
</div>
          <span className="font-bold text-lg">Smart Waste</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === link.href ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden lg:flex items-center gap-2">
          {loading ? (
            <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="max-w-24 truncate">
                    {user.email?.split('@')[0]}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/blog">Blog</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Masuk</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Daftar</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile & Tablet Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="w-full max-w-[22rem] sm:max-w-sm md:max-w-md p-0">
            <div className="flex flex-col h-full">

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <div className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Smart Waste</span>
                </div>
              </div>

              {/* Menu */}
              <div className="flex-1 px-4 py-6 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition",
                      pathname === link.href
                        ? "bg-primary text-white"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {link.label === "Beranda" && <LayoutDashboard className="h-5 w-5" />}
                    {link.label === "Scan Limbah" && <Leaf className="h-5 w-5" />}
                    {link.label === "Riwayat" && <History className="h-5 w-5" />}
                    {link.label === "Blog" && <BookOpen className="h-5 w-5" />}
                    {link.label === "Dashboard" && <LayoutDashboard className="h-5 w-5" />}
                    {link.label === "Artikel" && <BookOpen className="h-5 w-5" />}

                    <span className="text-sm font-medium">{link.label}</span>
                  </Link>
                ))}
              </div>

              {/* Auth Bottom */}
              <div className="p-4 border-t">
                {user ? (
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground truncate">
                      {user.email}
                    </div>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => {
                        logout()
                        setOpen(false)
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Keluar
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button className="w-full" asChild onClick={() => setOpen(false)}>
                      <Link href="/login">Masuk</Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild onClick={() => setOpen(false)}>
                      <Link href="/register">Daftar</Link>
                    </Button>
                  </div>
                )}
              </div>

            </div>
          </SheetContent>
        </Sheet>

      </div>
    </header>
  )
}