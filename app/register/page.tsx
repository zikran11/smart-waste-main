'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { gsap } from 'gsap'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Leaf, Loader2, Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { toast } from 'sonner'

export default function RegisterPage() {
  const router = useRouter()
  const { user, signUp, signInWithGoogle, loading: authLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const pageRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' }
      )
    }, pageRef)

    return () => ctx.revert()
  }, [])

  const validatePassword = (pwd: string): string[] => {
    const errors: string[] = []
    if (pwd.length < 8) errors.push('Minimal 8 karakter')
    if (!/[A-Z]/.test(pwd)) errors.push('Minimal 1 huruf besar')
    if (!/[a-z]/.test(pwd)) errors.push('Minimal 1 huruf kecil')
    if (!/[0-9]/.test(pwd)) errors.push('Minimal 1 angka')
    return errors
  }

  const passwordErrors = password ? validatePassword(password) : []
  const isPasswordValid = passwordErrors.length === 0 && password.length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!agreeTerms) {
      setError('Anda harus menyetujui syarat dan ketentuan')
      return
    }

    if (password !== confirmPassword) {
      setError('Password tidak cocok')
      return
    }

    if (!isPasswordValid) {
      setError('Password tidak memenuhi kriteria')
      return
    }

    setIsLoading(true)

    try {
      await signUp(email, password)
      toast.success('Akun berhasil dibuat!')
      router.push('/dashboard')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal membuat akun'
      setError(errorMessage)
      toast.error('Gagal mendaftar')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setIsLoading(true)

    try {
      await signInWithGoogle()
      toast.success('Berhasil masuk dengan Google!')
      router.push('/dashboard')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal masuk dengan Google'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (user) {
    return null
  }

  return (
    <div ref={pageRef} className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-b from-background to-secondary/20">
      <div ref={cardRef} className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-2xl text-foreground">Smart Waste</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Buat Akun Baru</CardTitle>
            <CardDescription>
              Bergabung dan mulai berkontribusi untuk lingkungan
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Buat password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                    required
                  />
                </div>
                {/* Password requirements */}
                {password && (
                  <div className="space-y-1 pt-1">
                    {[
                      { label: 'Minimal 8 karakter', valid: password.length >= 8 },
                      { label: 'Minimal 1 huruf besar', valid: /[A-Z]/.test(password) },
                      { label: 'Minimal 1 huruf kecil', valid: /[a-z]/.test(password) },
                      { label: 'Minimal 1 angka', valid: /[0-9]/.test(password) }
                    ].map((req, index) => (
                      <div key={index} className={`flex items-center gap-2 text-xs ${req.valid ? 'text-primary' : 'text-muted-foreground'
                        }`}>
                        <CheckCircle2 className={`w-3 h-3 ${req.valid ? 'opacity-100' : 'opacity-30'}`} />
                        {req.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Konfirmasi password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                    required
                  />
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-destructive">Password tidak cocok</p>
                )}
              </div>

              <div className="flex gap-2">
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                  disabled={isLoading}
                  className="translate-y-[2px]"
                />
                <label htmlFor="terms" className="text-sm leading-snug cursor-pointer">
                  Saya menyetujui{' '}
                  <Link href="#" className="text-primary hover:underline">
                    Syarat & Ketentuan
                  </Link>{' '}
                  dan{' '}
                  <Link href="#" className="text-primary hover:underline">
                    Kebijakan Privasi
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !agreeTerms || !isPasswordValid}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  'Daftar'
                )}
              </Button>
            </form>

            <div className="relative my-6">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                atau
              </span>
            </div>


            <p className="mt-6 text-center text-sm text-muted-foreground">
              Sudah punya akun?{' '}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Masuk
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
