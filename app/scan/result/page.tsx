'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Camera,
  TreePine,
  Zap,
  Droplets,
  Leaf,
  Recycle,
  MapPin,
  ArrowLeft,
  Share2,
  CheckCircle2
} from 'lucide-react'
import { WasteAnalysisResult, formatCurrency, getCategoryColor } from '@/lib/mock-ai-data'
import { cn } from '@/lib/utils'

export default function ResultPage() {
  const router = useRouter()
  const [result, setResult] = useState<WasteAnalysisResult | null>(null)
  const pageRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const impactRef = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<HTMLDivElement>(null)
  const actionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load result from session storage
    const storedResult = sessionStorage.getItem('lastScanResult')
    if (storedResult) {
      setResult(JSON.parse(storedResult))
    } else {
      router.push('/scan')
    }
  }, [router])

  useEffect(() => {
    if (!result) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo(
        headerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6 }
      )
        .fromTo(
          mainRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.3'
        )

      if (impactRef.current) {
        tl.fromTo(
          impactRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.3'
        )
      }

      if (stepsRef.current) {
        tl.fromTo(
          stepsRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.3'
        )
      }

      if (actionsRef.current) {
        tl.fromTo(
          actionsRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.3'
        )
      }

      // Impact cards animation
      if (impactRef.current) {
        gsap.fromTo(
          '.impact-card',
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            scrollTrigger: {
              trigger: impactRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      }

      // Steps animation
      if (stepsRef.current) {
        gsap.fromTo(
          '.step-item',
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.1,
            scrollTrigger: {
              trigger: stepsRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      }
    }, pageRef)

    return () => ctx.revert()
  }, [result])

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  const confidencePercentage = Math.round(result.confidenceScore)
  const isAiQuotaReached = result.limitReached || result.wasteType === 'Limit AI tercapai'
  const isInvalid = result.validationStatus === 'not_trash'
  const invalidLabel = result.isHumanOrAnimal
    ? 'Terdeteksi manusia/hewan'
    : 'Objek Tidak Valid'

  if (isAiQuotaReached) {
    return (
      <div ref={pageRef} className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-8">
        <div className="container px-4 mx-auto max-w-5xl">
          <div ref={headerRef} className="text-center mb-8 space-y-2">
            <Badge variant="outline" className="mb-2 bg-primary/10 text-primary border-primary/20">
              Limit AI tercapai
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Batas penggunaan AI sudah tercapai
            </h1>
            <p className="text-muted-foreground">
              Data tidak dapat ditampilkan untuk saat ini. Silakan coba lagi nanti atau scan ulang.
            </p>
          </div>

          <Card ref={mainRef} className="mb-6 overflow-hidden">
            <CardContent className="p-6 flex flex-col items-center justify-center space-y-6">
              <p className="text-lg text-muted-foreground text-center">
                Limit AI telah tercapai. Hanya opsi scan ulang yang tersedia.
              </p>
              <Button className="w-full md:w-auto" onClick={() => router.push('/scan')}>
                Scan Ulang
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-8">
      <div className="container px-4 mx-auto max-w-5xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => router.push('/scan')}
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Button>

        {/* Header */}
        <div ref={headerRef} className="text-center mb-8 space-y-2">
          <Badge variant="outline" className="mb-2 bg-primary/10 text-primary border-primary/20">
            Analisis Selesai
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Hasil Identifikasi Limbah
          </h1>
        </div>

        {/* Main Result Card */}
        {isInvalid ? (
          <Card ref={mainRef} className="mb-6 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="aspect-square md:aspect-auto relative bg-muted">
                <img
                  src={result.imageUrl}
                  alt="Limbah yang dianalisis"
                  className="w-full h-full object-cover"
                />
                <Badge className={cn('absolute top-4 left-4', getCategoryColor(result.category))}>
                  {result.category.charAt(0).toUpperCase() + result.category.slice(1)}
                </Badge>
              </div>

              <CardContent className="p-6 flex flex-col justify-center space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Validasi</p>
                  <h2 className="text-2xl font-bold text-foreground">{invalidLabel}</h2>
                  <p className="text-muted-foreground mt-2">
                    {result.validationReason || 'Objek bukan sampah, jadi tidak ditampilkan data daur ulang.'}
                  </p>
                </div>

                <Button className="w-full md:w-auto" onClick={() => router.push('/scan')}>
                  Scan Ulang
                </Button>
              </CardContent>
            </div>
          </Card>
        ) : (
          <Card ref={mainRef} className="mb-6 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Image */}
              <div className="aspect-square md:aspect-auto relative bg-muted">
                <img
                  src={result.imageUrl}
                  alt="Limbah yang dianalisis"
                  className="w-full h-full object-cover"
                />
                <Badge className={cn('absolute top-4 left-4', getCategoryColor(result.category))}>
                  {result.category.charAt(0).toUpperCase() + result.category.slice(1)}
                </Badge>
              </div>

              {/* Info */}
              <CardContent className="p-6 flex flex-col justify-center space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Jenis Limbah</p>
                  <h2 className="text-2xl font-bold text-foreground">{result.wasteType}</h2>
                  <p className="text-muted-foreground">{result.wasteTypeEn}</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Confidence Score</span>
                    <span className="font-semibold text-primary">{confidencePercentage}%</span>
                  </div>
                  <Progress value={confidencePercentage} className="h-3" />
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Estimasi Harga</p>
                    <p className="text-xl font-bold text-foreground">
                      {formatCurrency(result.pricePerKg)}
                      <span className="text-sm font-normal text-muted-foreground">/kg</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <Badge variant={result.recyclable ? 'default' : 'secondary'}>
                      {result.recyclable ? 'Dapat Didaur Ulang' : 'Tidak Dapat Didaur Ulang'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        )}

        {isInvalid ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Objek Tidak Valid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-2xl bg-red-50 border border-red-200 p-4">
                  <p className="font-semibold text-red-700">{invalidLabel}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {result.validationReason || 'Objek bukan sampah, jadi tidak ditampilkan data daur ulang.'}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold text-foreground mb-3">Tips Deteksi</p>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                    <li>Pastikan hanya objek sampah yang difoto.</li>
                    <li>Hindari memfoto wajah manusia atau hewan.</li>
                    <li>Dekatkan kamera ke objek agar latar belakang tidak terdeteksi.</li>
                  </ul>
                </div>

                <Button className="w-full" onClick={() => router.push('/scan')}>
                  Scan Ulang
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Validasi Keamanan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50">
                    <p className="text-sm text-muted-foreground">Status Validasi</p>
                    <p className="mt-2 font-semibold text-foreground">
                      {result.validationStatus === 'not_trash'
                        ? 'Bukan Sampah'
                        : result.validationStatus === 'trash'
                        ? 'Sampah'
                        : 'Tidak Pasti'}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50">
                    <p className="text-sm text-muted-foreground">Alasan</p>
                    <p className="mt-2 text-foreground">{result.validationReason || '-'}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50">
                    <p className="text-sm text-muted-foreground">Rekomendasi</p>
                    <p className="mt-2 text-foreground">{result.recommendation || '-'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Environmental Impact */}
          </>
        )}
        {!isInvalid && (
          <>
            <div ref={impactRef} className="mb-6">
              <h3 className="text-xl font-semibold mb-4 text-foreground">Dampak Lingkungan</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="impact-card">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
                      <Leaf className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {result.environmentalImpact.co2Reduction} kg
                    </p>
                    <p className="text-sm text-muted-foreground">CO2 Reduction</p>
                  </CardContent>
                </Card>

                <Card className="impact-card">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mx-auto mb-3">
                      <Zap className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {result.environmentalImpact.energySaving} kWh
                    </p>
                    <p className="text-sm text-muted-foreground">Energy Saving</p>
                  </CardContent>
                </Card>

                <Card className="impact-card">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-3">
                      <Droplets className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {result.environmentalImpact.waterSaving} L
                    </p>
                    <p className="text-sm text-muted-foreground">Water Saving</p>
                  </CardContent>
                </Card>

                <Card className="impact-card">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-3">
                      <TreePine className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {result.environmentalImpact.treeEquivalent}
                    </p>
                    <p className="text-sm text-muted-foreground">Setara Pohon</p>
                  </CardContent>
                </Card>
              </div>

              {/* Tree equivalent visualization */}
              <Card className="mt-4">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <TreePine className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-muted-foreground">
                    Dengan mendaur ulang limbah ini, kontribusi Anda setara dengan menanam{' '}
                    <span className="font-semibold text-foreground">
                      {result.environmentalImpact.treeEquivalent} pohon
                    </span>{' '}
                    untuk menyerap karbon.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* AI Explanation */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Recycle className="w-4 h-4 text-primary" />
                  </span>
                  Penjelasan AI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {result.aiExplanation}
                </p>
              </CardContent>
            </Card>

            {/* Recycling Steps */}
            <Card ref={stepsRef} className="mb-6">
              <CardHeader>
                <CardTitle>Cara Daur Ulang</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{result.recycleInfo}</p>
                <div className="space-y-3">
                  {result.recycleSteps.map((step, index) => (
                    <div key={index} className="step-item flex items-start gap-3">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center">
                        {index + 1}
                      </span>
                      <p className="text-foreground pt-0.5">{step}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div ref={actionsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button variant="outline" className="gap-2" asChild>
                <Link href="/blog">
                  <Recycle className="w-4 h-4" />
                  Pelajari Cara Daur Ulang
                </Link>
              </Button>
              <Button variant="outline" className="gap-2" asChild>
                <a
                  href="https://maps.google.com/maps?q=bank+sampah+terdekat"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapPin className="w-4 h-4" />
                  Lihat Lokasi Bank Sampah
                </a>
              </Button>
              <Button className="gap-2" asChild>
                <Link href="/scan">
                  <Camera className="w-4 h-4" />
                  Scan Lagi
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
