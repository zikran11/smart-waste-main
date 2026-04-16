'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { gsap } from 'gsap'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Loader2, ImageIcon } from 'lucide-react'
import { createPost } from '@/lib/blog-store'
import { useAuth } from '@/contexts/auth-context'
import { toast } from 'sonner'

const categories = [
  'Daur Ulang',
  'Edukasi',
  'Komunitas',
  'Tips & Trik',
  'Lingkungan',
  'Teknologi'
]

const coverImages = [
  'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800',
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
  'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800'
]

export default function CreateBlogPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [coverImage, setCoverImage] = useState(coverImages[0])
  const pageRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      )
    }, pageRef)

    return () => ctx.revert()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !excerpt || !content || !category) {
      toast.error('Mohon lengkapi semua field')
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      createPost({
        title,
        excerpt,
        content,
        category,
        coverImage,
        author: {
          name: user?.email?.split('@')[0] || 'Anonymous',
          email: user?.email || 'anonymous@example.com'
        }
      })

      toast.success('Artikel berhasil dipublikasikan!')
      router.push('/blog')
    } catch (error) {
      toast.error('Gagal mempublikasikan artikel')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-8">
      <div className="container px-4 mx-auto max-w-3xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => router.push('/blog')}
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Button>

        <Card ref={formRef}>
          <CardHeader>
            <CardTitle>Tulis Artikel Baru</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Judul Artikel</Label>
                <Input
                  id="title"
                  placeholder="Masukkan judul artikel..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              {/* Excerpt */}
              <div className="space-y-2">
                <Label htmlFor="excerpt">Ringkasan</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Tulis ringkasan singkat artikel (1-2 kalimat)..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={2}
                  disabled={isSubmitting}
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <Select value={category} onValueChange={setCategory} disabled={isSubmitting}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Cover Image */}
              <div className="space-y-2">
                <Label>Gambar Cover</Label>
                <div className="grid grid-cols-5 gap-2">
                  {coverImages.map((img, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCoverImage(img)}
                      disabled={isSubmitting}
                      className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                        coverImage === img
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Cover ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Konten Artikel</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Gunakan # untuk heading, ## untuk subheading, - untuk list
                </p>
                <Textarea
                  id="content"
                  placeholder="Tulis konten artikel Anda di sini..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={15}
                  disabled={isSubmitting}
                  className="font-mono text-sm"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/blog')}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Batal
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Mempublikasikan...
                    </>
                  ) : (
                    'Publikasikan'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
