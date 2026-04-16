'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

export function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
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
      <div className="container px-4 mx-auto max-w-4xl">
        <div
          ref={contentRef}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/80 p-8 md:p-12 text-center"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Mulai Scan Sekarang
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white text-balance">
              Siap Mengubah Limbah Jadi Nilai?
            </h2>
            
            <p className="max-w-xl mx-auto text-white/90 text-lg text-pretty">
              Mulai scan limbah sekarang dan lihat nilai ekonominya sekaligus dampaknya untuk lingkungan.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 text-base px-8 h-12 bg-white text-primary hover:bg-white/90"
                asChild
              >
                <Link href="/scan">
                  Scan Limbah Sekarang
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 text-base px-8 h-12 border-white/30 text-white hover:bg-white/10 bg-transparent"
                asChild
              >
                <Link href="/register">
                  Daftar Gratis
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
