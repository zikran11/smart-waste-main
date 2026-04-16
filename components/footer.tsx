import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'
import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container px-4 py-12 mx-auto max-w-7xl">
        
        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center justify-center md:justify-start gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Image
                  src="/daun.png"
                  alt="Smart Waste Logo"
                  width={24}
                  height={24}
                />
              </div>
              <span className="font-bold text-lg">Smart Waste</span>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed text-center md:text-left">
              Membantu mengidentifikasi limbah dan mengubahnya menjadi nilai ekonomi melalui teknologi AI.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Tautan Cepat</h3>
            <ul className="space-y-2 flex flex-col items-center md:items-start">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/scan" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Scan Limbah
                </Link>
              </li>
              <li>
                <Link href="/history" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Riwayat
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Kontak</h3>
            <ul className="space-y-3 flex flex-col items-center md:items-start">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                info@smartwaste.id
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                +62 812 3456 7890
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>Jakarta, Indonesia</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-border mt-8 pt-6 flex flex-col items-center gap-2 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Tim Hello World.
          </p>
        </div>

      </div>
    </footer>
  )
}