'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Card, CardContent } from '@/components/ui/card'
import { Scan, Brain, TrendingUp, Recycle, MapPin, History } from 'lucide-react'

const features = [
  {
    icon: Scan,
    title: 'Scan Limbah dengan AI',
    description: 'Ambil foto atau upload limbah dan dapatkan identifikasi instan secara cepat dan akurat.',
    highlight: true
  },
  {
    icon: Brain,
    title: 'Analisis Cerdas',
    description: 'AI menganalisis jenis limbah dan memberikan insight lengkap dalam hitungan detik.'
  },
  {
    icon: TrendingUp,
    title: 'Estimasi Nilai Jual',
    description: 'Ketahui harga limbah per kilogram dan peluang menghasilkan dari sampah.'
  },
  {
    icon: Recycle,
    title: 'Panduan Daur Ulang',
    description: 'Pelajari cara mengolah limbah dengan benar untuk mengurangi dampak lingkungan.'
  },
  {
    icon: MapPin,
    title: 'Bank Sampah Terdekat',
    description: 'Temukan lokasi bank sampah di sekitarmu untuk menyalurkan limbah dengan mudah.'
  },
  {
    icon: History,
    title: 'Tracking Dampak',
    description: 'Pantau kontribusimu dalam mengurangi limbah dan emisi CO₂ secara real-time.'
  }
]

export function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // Cards stagger animation
      gsap.fromTo(
        '.feature-card',
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 bg-background">
      <div className="container px-4 mx-auto max-w-7xl">
        
        {/* Title */}
        <div ref={titleRef} className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
            Fitur Cerdas untuk Mengelola Limbah
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg text-pretty">
            Smart Waste membantu kamu mengenali, mengelola, dan mengubah limbah menjadi nilai ekonomi dengan teknologi AI.
          </p>
        </div>

        {/* Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`feature-card group hover:shadow-lg transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm ${
                feature.highlight ? 'ring-2 ring-primary scale-105' : ''
              }`}
            >
              <CardContent className="p-6">
                
                {/* Icon */}
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <feature.icon className="w-6 h-6" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Closing Text */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground text-lg">
            Didukung oleh teknologi AI untuk solusi lingkungan yang lebih cerdas 🌱
          </p>
        </div>

      </div>
    </section>
  )
}