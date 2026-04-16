'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Camera,
  Leaf,
  Zap,
  Droplets,
  TreePine,
  ArrowRight,
  Coins
} from 'lucide-react'
import { getScanHistory, getTotalStats } from '@/lib/waste-store'
import { formatCurrency, WasteAnalysisResult } from '@/lib/mock-ai-data'
import { useAuth } from '@/contexts/auth-context'

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  const [stats, setStats] = useState<any>(null)
  const [recentScans, setRecentScans] = useState<WasteAnalysisResult[]>([])

  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setStats(getTotalStats())
    setRecentScans(getScanHistory().slice(0, 3))
  }, [])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.from('.fade-up', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1
      })
    }, pageRef)

    return () => ctx.revert()
  }, [])

  if (!stats) return null

  // progress calc
  const scanTarget = 50
  const co2Target = 100
  const treeTarget = 5

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/30 py-10"
    >
      <div className="container mx-auto max-w-6xl px-4 space-y-10">

        {/* HERO */}
        <div className="text-center fade-up">
          <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">
            Dashboard
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight">
            Halo, {user?.email?.split('@')[0] || 'User'} 👋
          </h1>

          <p className="text-muted-foreground mt-2">
            Pantau kontribusi lingkungan & nilai ekonomi dari limbahmu
          </p>
        </div>

        {/* 🔥 HIGHLIGHT */}
        <div className="grid md:grid-cols-3 gap-6 fade-up">

          <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-0 space-y-2">
              <Camera className="w-6 h-6 text-primary" />
              <p className="text-sm text-muted-foreground">Total Scan</p>
              <p className="text-3xl font-bold">{stats.totalScans}</p>
            </CardContent>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-yellow-400/10 to-yellow-500/5 border-yellow-400/20">
            <CardContent className="p-0 space-y-2">
              <Coins className="w-6 h-6 text-yellow-500" />
              <p className="text-sm text-muted-foreground">Nilai Ekonomi</p>
              <p className="text-3xl font-bold">
                {formatCurrency(stats.totalEconomicValue)}
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-400/20">
            <CardContent className="p-0 space-y-2">
              <Leaf className="w-6 h-6 text-green-500" />
              <p className="text-sm text-muted-foreground">CO2 Reduction</p>
              <p className="text-3xl font-bold">
                {stats.totalCo2Reduction.toFixed(1)} kg
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 🔹 SECONDARY */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 fade-up">
          <Card className="p-4">
            <Zap className="w-5 h-5 text-yellow-500 mb-2" />
            <p className="text-sm text-muted-foreground">Energi</p>
            <p className="font-bold">{stats.totalEnergySaving.toFixed(1)} kWh</p>
          </Card>

          <Card className="p-4">
            <Droplets className="w-5 h-5 text-blue-500 mb-2" />
            <p className="text-sm text-muted-foreground">Air</p>
            <p className="font-bold">{stats.totalWaterSaving.toFixed(0)} L</p>
          </Card>

          <Card className="p-4">
            <TreePine className="w-5 h-5 text-emerald-500 mb-2" />
            <p className="text-sm text-muted-foreground">Pohon</p>
            <p className="font-bold">{stats.totalTreeEquivalent.toFixed(2)}</p>
          </Card>
        </div>

        {/* 🌱 PROGRESS */}
        <Card className="fade-up border-primary/20 bg-primary/5">
          <CardContent className="p-6 space-y-5">

            <div className="flex justify-between">
              <h3 className="font-semibold text-lg">
                🌱 Progress Dampak Kamu
              </h3>
              <span className="text-sm text-muted-foreground">
                Bulan ini
              </span>
            </div>

            {/* SCAN */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Scan</span>
                <span>{stats.totalScans}/{scanTarget}</span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${Math.min((stats.totalScans / scanTarget) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* CO2 */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>CO2</span>
                <span>{stats.totalCo2Reduction.toFixed(1)}/{co2Target}</span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${Math.min((stats.totalCo2Reduction / co2Target) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* TREE */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Pohon</span>
                <span>{stats.totalTreeEquivalent.toFixed(2)}/{treeTarget}</span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div
                  className="h-full bg-emerald-500"
                  style={{ width: `${Math.min((stats.totalTreeEquivalent / treeTarget) * 100, 100)}%` }}
                />
              </div>
            </div>

          </CardContent>
        </Card>

        {/* 📊 RECENT */}
        <Card className="fade-up">
          <CardContent className="p-6 space-y-4">

            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Scan Terbaru</h3>
              <Link href="/history" className="text-sm flex gap-1 text-primary">
                Lihat semua <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {recentScans.length > 0 ? (
              recentScans.map((scan, i) => (
                <div
                  key={i}
                  onClick={() => router.push('/scan/result')}
                  className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition"
                >
                  <img src={scan.imageUrl} className="w-14 h-14 rounded-md object-cover" />

                  <div className="flex-1">
                    <p className="font-medium">{scan.wasteType}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(scan.pricePerKg)}/kg
                    </p>
                  </div>

                  <div className="text-green-600 text-sm font-semibold">
                    -{scan.environmentalImpact.co2Reduction}kg
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <Camera className="mx-auto mb-2 opacity-50" />
                <p className="text-muted-foreground mb-3">
                  Belum ada scan
                </p>
                <Button asChild>
                  <Link href="/scan">Mulai Scan</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 🚀 CTA */}
        <Card className="fade-up bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl">
          <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-xl font-semibold">
                Yuk lanjutkan kontribusimu 🌱
              </h3>
              <p className="text-white/80 text-sm">
                Semakin banyak scan, semakin besar dampakmu
              </p>
            </div>

            <Button size="lg" variant="secondary" asChild>
              <Link href="/scan">
                <Camera className="mr-2 w-5 h-5" />
                Scan Sekarang
              </Link>
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}