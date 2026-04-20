'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Camera, Upload, X, ImageIcon } from 'lucide-react'
import { WasteAnalysisResult, getWasteCategoryData } from '@/lib/mock-ai-data'
import { normalizeWasteCategory } from '@/lib/waste-utils'
import { addScanToHistory } from '@/lib/waste-store'
import { saveUserScanResult } from '@/lib/user-scan-store'
import { useAuth } from '@/contexts/auth-context'
import { toast } from 'sonner'

export default function ScanPage() {
  const router = useRouter()
  const { user } = useAuth()

  const [image, setImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const pageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  /* ================= GSAP ================= */
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 }
      )
    }, pageRef)

    return () => {
      ctx.revert()
      stopCamera()
    }
  }, [])

  /* ================= CAMERA ================= */
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      streamRef.current = stream
      setIsCameraActive(true)
    } catch {
      alert('Tidak bisa akses kamera')
    }
  }

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(track => track.stop())
    if (videoRef.current) videoRef.current.srcObject = null
    setIsCameraActive(false)
  }

  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
      videoRef.current.play()
    }
  }, [isCameraActive])

  /* ================= ANALYZE ================= */
const analyzeImage = async (imageData: string) => {
  try {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      toast.error('Tidak ada koneksi internet. Silakan scan ulang lagi.')
      return
    }

    setIsAnalyzing(true)

    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageBase64: imageData.split(',')[1]
      })
    })

    if (!res.ok) {
      toast.error('Tidak ada koneksi internet. Silakan scan ulang lagi.')
      return
    }

    const ai = await res.json()
    const category = normalizeWasteCategory(ai.category, ai.item_name)
    const categoryDefaults = getWasteCategoryData(category)

    const result: WasteAnalysisResult = {
  id: crypto.randomUUID(), // ✅ WAJIB

  imageUrl: imageData,

  wasteType: ai.item_name || categoryDefaults.wasteType || "Tidak diketahui",
  wasteTypeEn: ai.item_name || categoryDefaults.wasteTypeEn || "Unknown",

  category,

  confidenceScore: Number(ai?.confidence_score ?? 0),

  pricePerKg: categoryDefaults.pricePerKg ?? 2000,
  currency: categoryDefaults.currency || "IDR", // ✅ WAJIB

  recyclable:
    typeof ai.recyclable === 'boolean'
      ? ai.recyclable
      : categoryDefaults.recyclable ?? false,

  recycleInfo: ai.disposal_advice || categoryDefaults.recycleInfo || "-",
  recycleSteps: categoryDefaults.recycleSteps || [
    "Pisahkan dari sampah lain",
    "Bersihkan sebelum didaur ulang",
    "Setorkan ke bank sampah"
  ],

  environmentalImpact: categoryDefaults.environmentalImpact || {
    co2Reduction: 2,
    energySaving: 5,
    waterSaving: 10,
    treeEquivalent: 1
  },

  aiExplanation: ai.fun_fact || "-",

  validationStatus: ai.validation_status ?? 'unknown',
  validationReason: ai.validation_reason || '-',
  recommendation: ai.recommendation || ai.disposal_advice || '-',
  isHumanOrAnimal: ai.is_human_or_animal ?? false,
  limitReached: ai.limit_reached ?? false,

  createdAt: new Date(), // ✅ WAJIB
}

    sessionStorage.setItem('lastScanResult', JSON.stringify(result))

    if (user) {
      saveUserScanResult(user.uid, result).catch((saveError) => {
        console.error('Gagal menyimpan hasil scan:', saveError)
        toast.error('Riwayat scan gagal disimpan. Hasil tetap ditampilkan.')
      })
    } else {
      addScanToHistory(result)
      toast('Login untuk menyimpan hasil scan ke dashboard')
    }

    router.push('/scan/result')

  } catch (err) {
    console.error(err)
    toast.error('Tidak ada koneksi internet. Silakan scan ulang lagi.')
  } finally {
    setIsAnalyzing(false)
  }
}

  /* ================= CAPTURE ================= */
const capturePhoto = async () => {
  if (!videoRef.current || !canvasRef.current) return

  const canvas = canvasRef.current
  canvas.width = videoRef.current.videoWidth
  canvas.height = videoRef.current.videoHeight

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.drawImage(videoRef.current, 0, 0)
  const imageData = canvas.toDataURL('image/jpeg', 0.8)

  // 🔥 cukup ini saja
  await analyzeImage(imageData)

  // 🔥 baru stop kamera
  stopCamera()
}
  /* ================= UPLOAD ================= */
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('File harus gambar')
      return
    }

    const reader = new FileReader()
    reader.onload = async (ev) => {
      const img = ev.target?.result as string
      await analyzeImage(img)
    }
    reader.readAsDataURL(file)
  }, [])

  /* ================= UI ================= */
  return (
    <div ref={pageRef} className="min-h-screen bg-gradient-to-br from-white to-green-50 py-10">
      <div ref={contentRef} className="container px-4 mx-auto max-w-5xl">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">Scan Limbah</h1>
          <p className="text-muted-foreground">
            Upload atau ambil foto untuk analisis AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT */}
          <Card className="rounded-2xl shadow-md relative">
            <CardContent className="p-6">

              {/* NOTE: selama analisis berlangsung, sembunyikan kontrol upload/scan */}
              {!isCameraActive && (
                isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-700 font-medium">
                      Menganalisis Limbah...
                    </p>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border border-green-200 rounded-2xl p-4 cursor-pointer"
                  >
                    <div className="border-2 border-dashed border-green-400 rounded-2xl px-6 py-12 flex flex-col items-center justify-center gap-4 text-center hover:shadow-md transition">

                      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-100">
                        <ImageIcon className="w-8 h-8 text-green-600" />
                      </div>

                      <div>
                        <p className="font-medium text-lg">
                          Upload Foto Sampah
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Tarik file ke sini atau pilih metode di bawah
                        </p>
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />

                      <div className="w-full flex gap-3 mt-4">
                        <Button
                          variant="outline"
                          className="flex-1 flex items-center justify-center gap-2"
                          onClick={(e) => {
                            e.stopPropagation()
                            fileInputRef.current?.click()
                          }}
                        >
                          <Upload className="w-4 h-4" />
                          Upload
                        </Button>

                        <Button
                          className="flex-1 flex items-center justify-center gap-2"
                          onClick={(e) => {
                            e.stopPropagation()
                            startCamera()
                          }}
                        >
                          <Camera className="w-4 h-4" />
                          Buka Kamera
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              )}

              {/* CAMERA */}
              {isCameraActive && (
                <div className="fixed inset-0 z-50 bg-black">

                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${isAnalyzing ? 'blur-sm brightness-75' : ''
                      }`}
                  />

                  <div className="absolute inset-0 bg-black/40"></div>

                  {/* SCAN BOX */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="relative w-[80%] max-w-md h-[50%] border-2 border-green-400 rounded-2xl shadow-[0_0_25px_rgba(34,197,94,0.7)] overflow-hidden">
                      <div className="absolute w-full h-[3px] bg-green-400 animate-scan"></div>
                    </div>
                  </div>

                  {/* LOADING CAMERA */}
                  {isAnalyzing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-50">
                      <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                      <p className="mt-5 text-lg font-semibold">
                        Menganalisis Limbah...
                      </p>
                    </div>
                  )}

                  {!isAnalyzing && (
                    <>
                      <Button
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 rounded-full w-20 h-20 bg-green-500"
                        onClick={capturePhoto}
                      >
                        <Camera />
                      </Button>

                      <Button
                        variant="secondary"
                        className="absolute top-4 right-4"
                        onClick={stopCamera}
                      >
                        <X />
                      </Button>
                    </>
                  )}
                </div>
              )}

              <canvas ref={canvasRef} className="hidden" />
            </CardContent>
          </Card>

          {/* RIGHT */}
          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-6 space-y-6">
              <h3 className="text-lg font-semibold">
                Tips untuk Hasil Terbaik
              </h3>

              <ul className="space-y-2 text-sm">
                <li>📸 Pastikan limbah terlihat jelas</li>
                <li>💡 Gunakan pencahayaan cukup</li>
                <li>🎯 Fokus pada satu objek</li>
                <li>🚫 Hindari blur atau gelap</li>
                <li>📍 Posisikan di tengah frame</li>
              </ul>

              <h3 className="font-semibold pt-4">Jenis Limbah</h3>

              <div className="flex flex-wrap gap-2">
                {['Plastik', 'Kertas', 'Logam', 'Kaca', 'Organik', 'Elektronik', 'Tekstil'].map(t => (
                  <span
                    key={t}
                    className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ANIMATION */}
      <style jsx>{`
        @keyframes scan {
          0% { top: 0% }
          100% { top: 100% }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  )
}