'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Leaf, Recycle, TreePine, Users } from 'lucide-react'

const impacts = [
  {
    icon: Recycle,
    number: 85,
    suffix: 'kg',
    label: 'Limbah Didaur Ulang',
    desc: 'Total limbah yang berhasil diproses menjadi nilai ekonomi'
  },
  {
    icon: Leaf,
    number: 120,
    suffix: 'kg',
    label: 'CO₂ Dikurangi',
    desc: 'Estimasi emisi karbon yang berhasil ditekan'
  },
  {
    icon: TreePine,
    number: 10,
    suffix: '',
    label: 'Setara Pohon',
    desc: 'Dampak positif setara penanaman pohon'
  },
  {
    icon: Users,
    number: 300,
    suffix: '+',
    label: 'Pengguna Aktif',
    desc: 'Pengguna yang berkontribusi pada sistem'
  }
]

export function CircularEconomySection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const titleRef = useRef<HTMLDivElement | null>(null)
  const cardsRef = useRef<HTMLDivElement | null>(null)

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
          }
        }
      )

      // Cards animation
      gsap.fromTo(
        '.impact-card',
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reset',
          }
        }
      )

const counters = sectionRef.current?.querySelectorAll('.counter')

counters?.forEach((counter, index) => {
  const target = impacts[index].number
  let tween: gsap.core.Tween | null = null

  ScrollTrigger.create({
    trigger: sectionRef.current,
    start: 'top 80%',
    end: 'bottom top',

    onEnter: () => {
      let obj = { val: 0 }

      tween = gsap.to(obj, {
        val: target,
        duration: 2,
        delay: index * 0.2,
        ease: 'power2.out',
        onUpdate: () => {
          counter.textContent = Math.floor(obj.val).toLocaleString()
        }
      })
    },

    onLeaveBack: () => {
      if (tween) {
        tween.kill()
      }
      counter.textContent = '0'
    }
  })
})

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 bg-primary/5">
      <div className="container px-4 mx-auto max-w-6xl">

        {/* Title */}
        <div ref={titleRef} className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">
            Dampak Nyata untuk Lingkungan 🌍
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            Setiap limbah yang kamu scan berkontribusi langsung terhadap pengurangan limbah dan emisi.
          </p>
        </div>

        {/* Cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {impacts.map((item, index) => (
            <div
              key={index}
              className="impact-card bg-card border rounded-2xl p-6 text-center hover:shadow-lg hover:border-primary/50 transition"
            >
              {/* Icon */}
              <div className="mb-4 flex justify-center">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
              </div>

              {/* Number */}
              <h3 className="text-2xl font-bold text-primary mb-1">
                <span className="counter">0</span>
                {item.suffix}
              </h3>

              {/* Label */}
              <p className="font-semibold mb-2">
                {item.label}
              </p>

              {/* Description */}
              <p className="text-sm text-muted-foreground">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}