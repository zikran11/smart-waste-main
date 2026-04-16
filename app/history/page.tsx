'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Camera, Trash2, Clock, Leaf } from 'lucide-react'
import { getScanHistory, clearHistory } from '@/lib/waste-store'
import { WasteAnalysisResult, formatCurrency, getCategoryColor } from '@/lib/mock-ai-data'
import { cn } from '@/lib/utils'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export default function HistoryPage() {
  const [history, setHistory] = useState<WasteAnalysisResult[]>([])
  const pageRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setHistory(getScanHistory())
  }, [])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    // Wait for DOM to be ready with cards
    const historyCards = document.querySelectorAll('.history-card')
    if (historyCards.length === 0) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      )

      gsap.fromTo(
        historyCards,
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }, pageRef)

    return () => ctx.revert()
  }, [history])

  const handleClearHistory = () => {
    clearHistory()
    setHistory([])
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-8">
      <div className="container px-4 mx-auto max-w-5xl">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Riwayat Scan
            </h1>
            <p className="text-muted-foreground mt-1">
              {history.length > 0 
                ? `${history.length} limbah telah dianalisis`
                : 'Belum ada riwayat scan'}
            </p>
          </div>
          {history.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Trash2 className="w-4 h-4" />
                  Hapus Semua
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus Semua Riwayat?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tindakan ini tidak dapat dibatalkan. Semua riwayat scan akan dihapus secara permanen.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearHistory}>
                    Hapus
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {/* History List */}
        {history.length > 0 ? (
          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {history.map((item, index) => (
              <Card key={item.id || index} className="history-card overflow-hidden hover:shadow-lg transition-shadow">
                <div className="flex">
                  {/* Image */}
                  <div className="w-32 md:w-40 flex-shrink-0 relative">
                    <img
                      src={item.imageUrl || '/placeholder.jpg'}
                      alt={item.wasteType}
                      className="w-full h-full object-cover"
                    />
                    <Badge className={cn('absolute top-2 left-2 text-xs', getCategoryColor(item.category))}>
                      {item.category}
                    </Badge>
                  </div>

                  {/* Content */}
                  <CardContent className="flex-1 p-4">
                    <h3 className="font-semibold text-foreground mb-1">
                      {item.wasteType}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {item.wasteTypeEn}
                    </p>

                    <div className="flex flex-wrap gap-3 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {formatCurrency(item.pricePerKg)}
                        </span>
                        /kg
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Leaf className="w-3 h-3 text-primary" />
                        <span>{item.environmentalImpact.co2Reduction} kg CO2</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {formatDate(item.createdAt)}
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="py-16">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Camera className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Belum Ada Riwayat
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Mulai scan limbah pertama Anda untuk melihat riwayat analisis dan kontribusi lingkungan Anda.
              </p>
              <Button asChild>
                <Link href="/scan">
                  <Camera className="w-4 h-4 mr-2" />
                  Mulai Scan
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
