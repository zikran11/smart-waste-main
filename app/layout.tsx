import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/contexts/auth-context'
import { GSAPProvider } from '@/components/gsap-provider'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Smart Waste Scanner | Ubah Limbah Menjadi Nilai Ekonomi',
  description: 'Platform berbasis AI untuk mengidentifikasi limbah, memberikan estimasi nilai ekonomi, dan panduan daur ulang untuk masa depan yang lebih hijau.',
  keywords: ['smart waste', 'daur ulang', 'circular economy', 'AI scanner', 'limbah', 'recycle'],
  authors: [{ name: 'Smart Waste Team' }],
  icons: {
    icon: '/daunkamera.png',
    apple: '/daunkamera.png',
  },

}

export const viewport: Viewport = {
  themeColor: '#22c55e',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <AuthProvider>
          <GSAPProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <Toaster position="top-center" />
          </GSAPProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
