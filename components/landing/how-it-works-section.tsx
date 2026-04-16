'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Upload, Cpu, FileText, Coins } from 'lucide-react'

const steps = [
  {
    icon: Upload,
    step: '01',
    title: 'Scan / Upload Limbah',
    description: 'Ambil foto atau upload gambar limbah yang ingin kamu identifikasi secara instan.'
  },
  {
    icon: Cpu,
    step: '02',
    title: 'Analisis dengan AI',
    description: 'AI akan mengenali jenis limbah secara cepat dan akurat dalam hitungan detik.'
  },
  {
    icon: FileText,
    step: '03',
    title: 'Lihat Nilai & Dampak',
    description: 'Dapatkan informasi lengkap: harga limbah, potensi daur ulang, dan dampak lingkungan.'
  },
  {
    icon: Coins,
    step: '04',
    title: 'Salurkan / Daur Ulang',
    description: 'Bawa ke bank sampah terdekat atau kelola limbah untuk menghasilkan nilai ekonomi.'
  }
]

export function HowItWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 40 },
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

      gsap.fromTo(
        '.step-item',
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.2,
          scrollTrigger: {
            trigger: stepsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // Line animation
      gsap.fromTo(
        '.step-line',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.5,
          stagger: 0.2,
          scrollTrigger: {
            trigger: stepsRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 bg-background">
      <div className="container px-4 mx-auto max-w-6xl">
        <div ref={titleRef} className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
            Cara Kerja Smart Waste
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg text-pretty">
            Hanya dalam 4 langkah sederhana, kamu bisa mengubah limbah menjadi nilai ekonomi dan dampak nyata untuk lingkungan.
          </p>
        </div>

        <div ref={stepsRef} className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="step-item relative">
                <div className="flex flex-col items-center text-center">
                  {/* Step number */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <step.icon className="w-8 h-8 text-primary" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                      {step.step}
                    </span>
                  </div>

                  {/* Connecting line (hidden on mobile) */}
                  {index < steps.length - 1 && (
                    <div className="step-line hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-primary/30 origin-left" />
                  )}

                  <h3 className="text-xl font-semibold mb-2 text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
