'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { gsap } from 'gsap'
import { Button } from '@/components/ui/button'
import { Camera, Upload, ArrowRight } from 'lucide-react'

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(textRef.current, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 1 })
      gsap.fromTo(imageRef.current, { opacity: 0, x: 50, scale: 0.9 }, { opacity: 1, x: 0, scale: 1, duration: 1 })

      gsap.to('.leaf-asset', {
        y: -15,
        rotation: 3,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        stagger: { amount: 1.5 }
      })
    }, heroRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden bg-[#F0FDF4]">
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        
        <div className="absolute -bottom-20 -left-20 w-[350px] md:w-[500px] leaf-asset z-0 opacity-80">
          <img src="/leaf.png" alt="leaf" className="w-full h-auto rotate-12" />
        </div>

        <div className="absolute -bottom-32 -right-20 w-[200px] md:w-[450px] leaf-asset z-30 opacity-90">
          <img src="/palm.png" alt="leaf" className="w-full h-auto -rotate-12" />
        </div>


<div className="absolute top-20 left-[10%] w-24 h-24 leaf-asset z-0 opacity-30 blur-[1px]">
  <svg 
    viewBox="0 0 100 100" 
    className="w-full h-auto rotate-[140deg]" 
    fill="#86EFAC" // green-300
  >
    <path d="M50 10C30 30 20 60 50 90C80 60 70 30 50 10Z" />
    <path d="M50 10V90" stroke="#166534" strokeWidth="2" opacity="0.3" />
  </svg>
</div>

<div className="absolute top-10 right-[15%] w-32 h-32 leaf-asset z-0 opacity-20">
  <svg 
    viewBox="0 0 100 100" 
    className="w-full h-auto -rotate-45" 
    fill="#4ADE80" // green-400
  >
    <path d="M50 10C30 30 20 60 50 90C80 60 70 30 50 10Z" />
    <path d="M50 10V90" stroke="#052E16" strokeWidth="2" opacity="0.3" />
  </svg>
</div>

<div className="absolute top-1/4 left-1/3 w-3 h-5 bg-green-500/20 rounded-full blur-[2px] leaf-asset z-0 rotate-12"></div>
<div className="absolute bottom-1/3 right-1/4 w-4 h-6 bg-green-300/10 rounded-full blur-[1px] leaf-asset z-0 -rotate-45"></div>

      </div>

      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        
        <div ref={textRef} className="space-y-8">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight text-slate-900">
            Ubah Limbah Menjadi
            <span className="block text-green-600">Nilai Ekonomi</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-xl bg-white/30 backdrop-blur-sm p-2 rounded-lg">
            Smart Waste Scanner menggunakan AI untuk mengenali jenis limbah dan memberikan estimasi nilai ekonomi serta panduan daur ulang yang tepat.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="gap-2 px-8 bg-green-600 hover:bg-green-700 relative z-30">
              <Link href="/scan" className="flex items-center gap-2">
                <Camera size={18} /> Scan Sekarang <ArrowRight size={16} />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="gap-2 px-8 bg-white/80 backdrop-blur-md relative z-30">
              <Link href="/scan" className="flex items-center gap-2">
                <Upload size={18} /> Upload Gambar
              </Link>
            </Button>
          </div>
        </div>

        <div ref={imageRef} className="relative flex justify-center">
          <div className="absolute w-80 h-80 bg-green-400 blur-[120px] rounded-full opacity-30"></div>
          <div className="relative bg-white p-4 rounded-[2.5rem] shadow-2xl border border-green-50 z-10">
            <Image src="/waste-scan.jpg" alt="Waste Scanner" width={480} height={480} className="rounded-[2rem]" />
          </div>
        </div>

      </div>
    </section>
  )
}