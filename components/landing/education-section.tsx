'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, ArrowRight } from 'lucide-react'
import { getAllPosts, BlogPost } from '@/lib/blog-store'

export function EducationSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const cardsRef = useRef<HTMLDivElement | null>(null)
  const [posts, setPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    const allPosts = getAllPosts()

    const latestPosts = allPosts
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3)

    setPosts(latestPosts)
  }, [])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const cards = cardsRef.current?.querySelectorAll('.edu-card') ?? []

gsap.fromTo(
  cards,
  { opacity: 0, y: 40 },
  {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: sectionRef.current,
      start: 'top 80%',

      toggleActions: 'play none none reset',

      invalidateOnRefresh: true,
    }
  }
)
  }, [posts])

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <section ref={sectionRef} className="py-24 bg-green-50">
      <div className="container px-4 mx-auto max-w-7xl">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Edukasi & Tips Daur Ulang
          </h2>
          <p className="text-muted-foreground">
            Pelajari cara mengelola limbah dengan lebih bijak dan berkelanjutan
          </p>
        </div>

        {/* Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card key={post.id} className="edu-card group hover:shadow-lg transition">

              {/* Image */}
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
              </div>

              <CardContent className="p-5">
                <Badge variant="secondary" className="mb-2">
                  {post.category}
                </Badge>

                <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition">
                  {post.title}
                </h3>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{post.author.name}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(post.createdAt)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Button asChild>
            <Link href="/blog">
              Lihat Semua Artikel
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

      </div>
    </section>
  )
}