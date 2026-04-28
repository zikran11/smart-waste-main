'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Calendar, ExternalLink } from 'lucide-react'

type NewsPost = {
  id: string
  title: string
  excerpt: string
  sourceUrl: string
  coverImage: string
  sourceName: string
  publishedAt: string
}

export default function ArtikelPage() {
  const [posts, setPosts] = useState<NewsPost[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  // Define the fixed categories
  const fixedCategories = ['Lingkungan', 'Tips & Trick', 'Kreasi', 'Edukasi']

  const pageRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setCategories(fixedCategories)
    const loadNews = async () => {
      try {
        setIsLoading(true)
        setErrorMessage('')
        const response = await fetch('/api/news')
        const contentType = response.headers.get('content-type') ?? ''
        const isJson = contentType.includes('application/json')

        if (!response.ok) {
          if (isJson) {
            const data = (await response.json()) as { message?: string }
            throw new Error(data?.message ?? `Gagal memuat artikel. (${response.status})`)
          }

          const text = await response.text()
          throw new Error(
            `Gagal memuat artikel. (${response.status}) ${text?.slice(0, 120) ?? ''}`.trim()
          )
        }

        const data = (isJson ? await response.json() : null) as { articles?: NewsPost[] } | null
        setPosts(data?.articles ?? [])
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Gagal memuat artikel.'
        setErrorMessage(message)
      } finally {
        setIsLoading(false)
      }
    }

    loadNews()
  }, [])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const articleCards = document.querySelectorAll('.article-card')
    if (articleCards.length === 0) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      )

      gsap.fromTo(
        articleCards,
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
  }, [posts])

  const filteredPosts = posts.filter(post => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())

    const postText = `${post.title} ${post.excerpt}`.toLowerCase()
    const matchesCategory =
      !selectedCategory ||
      (selectedCategory === 'Lingkungan' &&
        /lingkungan|perubahan iklim|ekologi|hijau/.test(postText)) ||
      (selectedCategory === 'Tips & Trick' &&
        /tips|cara|panduan|langkah/.test(postText)) ||
      (selectedCategory === 'Kreasi' &&
        /kreasi|kerajinan|upcycle|daur ulang/.test(postText)) ||
      (selectedCategory === 'Edukasi' &&
        /edukasi|belajar|sekolah|pengetahuan/.test(postText))

    return matchesSearch && matchesCategory
  })

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-8">
      <div className="container px-4 mx-auto max-w-6xl">

        {/* Header */}
        <div ref={headerRef} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Jelajahi Dunia Daur Ulang
          </h1>
          <p className="text-muted-foreground mt-1">
            Temukan tips, panduan, dan insight untuk hidup lebih ramah lingkungan
          </p>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <div className="flex-1">
              <Input
                placeholder="Cari artikel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                Semua
              </Button>

              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="text-center py-16 text-muted-foreground">
            Memuat artikel terbaru...
          </div>
        ) : errorMessage ? (
          <div className="text-center py-16 text-muted-foreground space-y-3">
            <p>{errorMessage}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Coba Lagi
            </Button>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredPosts.map((post) => (
              <Card key={post.id} className="article-card overflow-hidden group hover:shadow-lg transition">

                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>

                <CardContent className="p-5">
                  <Badge className="mb-3" variant="secondary">{post.sourceName}</Badge>

                  <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary">
                    {post.title}
                  </h3>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.publishedAt)}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-5 pt-0">
                  <Button asChild variant="ghost" className="w-full gap-2">
                    <a href={post.sourceUrl} target="_blank" rel="noreferrer">
                      Baca di Sumber Asli
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </CardFooter>

              </Card>
            ))}

          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            Tidak ada artikel ditemukan
          </div>
        )}

      </div>
    </div>
  )
}