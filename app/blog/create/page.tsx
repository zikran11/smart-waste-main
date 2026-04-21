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
import { ArrowLeft, Loader2 } from 'lucide-react'
import {
  createPostFirestore,
  getAllPostsFirestore,
  getCategoriesFromPosts,
  getFirestoreErrorMessage,
} from '@/lib/blog-firestore-store'
import { useAuth } from '@/contexts/auth-context'
import { toast } from 'sonner'

const defaultCategories = [
  'Daur Ulang',
  'Edukasi',
  'Komunitas',
  'Tips & Trik',
  'Lingkungan',
  'Teknologi'
]

export default function CreateBlogPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [categories, setCategories] = useState<string[]>(defaultCategories)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [coverImagePreview, setCoverImagePreview] = useState('')
  const pageRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const posts = await getAllPostsFirestore()
        const existingCategories = getCategoriesFromPosts(posts)
        if (existingCategories.length > 0) {
          setCategories(existingCategories)
        }
      } catch (error) {
        toast.error(getFirestoreErrorMessage(error, 'Gagal memuat kategori blog dari Firestore'))
        // Keep default categories when fetch fails.
      }
    }

    loadCategories()
  }, [])

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

  useEffect(() => {
    if (!coverImageFile) {
      setCoverImagePreview('')
      return
    }

    const objectUrl = URL.createObjectURL(coverImageFile)
    setCoverImagePreview(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [coverImageFile])

  const uploadImageToCloudinary = async (file: File) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

    if (!cloudName || !uploadPreset) {
      throw new Error('Cloudinary config is missing')
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', uploadPreset)
    formData.append('folder', 'smart-waste/blog')

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    )

    if (!response.ok) {
      throw new Error('Failed to upload image')
    }

    const result = await response.json()
    return result.secure_url as string
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !excerpt || !content || !category || !coverImageFile) {
      toast.error('Mohon lengkapi semua field termasuk gambar cover')
      return
    }

    setIsSubmitting(true)

    try {
      if (!user?.uid) {
        toast.error('Sesi login tidak valid. Silakan login ulang.')
        setIsSubmitting(false)
        return
      }

      const coverImageUrl = await uploadImageToCloudinary(coverImageFile)

      await createPostFirestore({
        title,
        excerpt,
        content,
        category,
        coverImage: coverImageUrl,
        author: {
          name: user?.email?.split('@')[0] || 'Anonymous',
          email: user?.email || 'anonymous@example.com'
        }
      }, user.uid)

      toast.success('Blog berhasil dipublikasikan!')
      router.push('/blog')
    } catch (error) {
      toast.error(getFirestoreErrorMessage(error, 'Gagal mempublikasikan blog'))
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
            <CardTitle>Tulis Blog Baru</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Judul Blog</Label>
                <Input
                  id="title"
                  placeholder="Masukkan judul blog..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              {/* Excerpt */}
              <div className="space-y-2">
                <Label htmlFor="excerpt">Deskripsi Singkat</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Tulis deskripsi singkat blog (1-2 kalimat)..."
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
                <Label htmlFor="cover-image">Gambar Cover</Label>
                <Input
                  id="cover-image"
                  type="file"
                  accept="image/*"
                  disabled={isSubmitting}
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null
                    setCoverImageFile(file)
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Gambar akan di-upload ke Cloudinary saat blog dipublikasikan.
                </p>
                {coverImagePreview && (
                  <div className="rounded-lg border overflow-hidden">
                    <img
                      src={coverImagePreview}
                      alt="Preview cover image"
                      className="w-full max-h-72 object-cover"
                    />
                  </div>
                )}
                {!coverImagePreview && (
                  <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                    Belum ada gambar dipilih
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Isi Blog</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Gunakan # untuk heading, ## untuk subheading, - untuk list
                </p>
                <Textarea
                  id="content"
                  placeholder="Tulis isi blog Anda di sini..."
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
