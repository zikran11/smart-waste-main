'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, Loader2, ArrowLeft } from 'lucide-react'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/lib/firebase' // sesuaikan path kamu
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (!email) {
    toast.error('Email wajib diisi')
    return
  }

  setIsLoading(true)

  // simulasi loading
  setTimeout(() => {
    toast.success('Link reset password telah dikirim ke email Anda')
    setIsLoading(false)
    setEmail('')
  }, 1500)
}
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-background to-secondary/20">
      <div className="w-full max-w-md">

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Lupa Password?</CardTitle>
            <CardDescription>
              Masukkan email Anda untuk menerima link reset password
            </CardDescription>
          </CardHeader>

          <CardContent>
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

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  'Kirim Link Reset'
                )}
              </Button>

            </form>

            <div className="mt-6 text-center text-sm">
              <Link href="/login" className="text-primary hover:underline flex items-center justify-center gap-1">
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Login
              </Link>
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  )
}