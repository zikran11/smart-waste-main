export interface WasteAnalysisResult {
  id: string
  imageUrl: string
  wasteType: string
  wasteTypeEn: string
  category: 'organic' | 'plastic' | 'metal' | 'paper' | 'glass' | 'electronic' | 'textile' | 'hazardous' | 'unknown'
  confidenceScore: number
  pricePerKg: number
  currency: string
  recyclable: boolean
  recycleInfo: string
  recycleSteps: string[]
  environmentalImpact: {
    co2Reduction: number // kg
    energySaving: number // kWh
    waterSaving: number // liters
    treeEquivalent: number
  }
  aiExplanation: string
  validationStatus?: 'trash' | 'not_trash' | 'unknown'
  validationReason?: string
  recommendation?: string
  isHumanOrAnimal?: boolean
  limitReached?: boolean
  createdAt: Date
  userId?: string
}

export const wasteCategories: Record<string, Partial<WasteAnalysisResult>> = {
  plastic_bottle: {
    wasteType: 'Botol Plastik PET',
    wasteTypeEn: 'PET Plastic Bottle',
    category: 'plastic',
    pricePerKg: 3500,
    currency: 'IDR',
    recyclable: true,
    recycleInfo: 'Botol plastik PET dapat didaur ulang menjadi serat tekstil, wadah baru, atau bahan konstruksi.',
    recycleSteps: [
      'Kosongkan dan bilas botol',
      'Lepaskan tutup dan label jika memungkinkan',
      'Tekan botol untuk menghemat ruang',
      'Kumpulkan di tempat sampah plastik',
      'Serahkan ke bank sampah atau pengepul'
    ],
    environmentalImpact: {
      co2Reduction: 1.5,
      energySaving: 5.2,
      waterSaving: 100,
      treeEquivalent: 0.08
    },
    aiExplanation: 'Analisis menunjukkan bahwa limbah ini adalah botol plastik PET (Polyethylene Terephthalate), yang merupakan jenis plastik paling umum untuk kemasan minuman. PET sangat bernilai dalam industri daur ulang karena dapat diproses menjadi serat polyester untuk pakaian, karpet, dan berbagai produk lainnya. Dengan mendaur ulang satu botol PET, Anda membantu mengurangi emisi karbon dan menghemat sumber daya alam yang signifikan.'
  },
  cardboard: {
    wasteType: 'Kardus/Karton',
    wasteTypeEn: 'Cardboard',
    category: 'paper',
    pricePerKg: 2000,
    currency: 'IDR',
    recyclable: true,
    recycleInfo: 'Kardus dapat didaur ulang hingga 7 kali menjadi produk kertas baru.',
    recycleSteps: [
      'Ratakan kardus dan lipat',
      'Pisahkan dari plastik atau selotip',
      'Pastikan kardus dalam kondisi kering',
      'Ikat atau kumpulkan kardus',
      'Serahkan ke bank sampah'
    ],
    environmentalImpact: {
      co2Reduction: 0.9,
      energySaving: 4.0,
      waterSaving: 50,
      treeEquivalent: 0.17
    },
    aiExplanation: 'Limbah ini teridentifikasi sebagai kardus atau karton yang terbuat dari serat kayu. Kardus merupakan salah satu material yang paling mudah didaur ulang dan memiliki tingkat daur ulang tertinggi di dunia. Dengan mendaur ulang kardus, kita dapat mengurangi penebangan pohon dan mengurangi limbah di tempat pembuangan sampah. Serat kardus dapat digunakan kembali hingga 7 kali sebelum menjadi terlalu pendek untuk digunakan.'
  },
  aluminum_can: {
    wasteType: 'Kaleng Aluminium',
    wasteTypeEn: 'Aluminum Can',
    category: 'metal',
    pricePerKg: 15000,
    currency: 'IDR',
    recyclable: true,
    recycleInfo: 'Aluminium dapat didaur ulang tanpa batas tanpa kehilangan kualitas.',
    recycleSteps: [
      'Kosongkan dan bilas kaleng',
      'Tekan kaleng untuk menghemat ruang',
      'Kumpulkan kaleng terpisah dari sampah lain',
      'Jangan campurkan dengan kaleng besi',
      'Serahkan ke bank sampah atau pengepul logam'
    ],
    environmentalImpact: {
      co2Reduction: 9.0,
      energySaving: 14.0,
      waterSaving: 40,
      treeEquivalent: 0.5
    },
    aiExplanation: 'Analisis mengidentifikasi limbah ini sebagai kaleng aluminium, yang merupakan salah satu material paling berharga untuk didaur ulang. Mendaur ulang aluminium menghemat 95% energi dibandingkan memproduksi aluminium baru dari bauksit. Kaleng aluminium dapat didaur ulang tanpa batas tanpa kehilangan kualitas, menjadikannya contoh sempurna dari ekonomi sirkular.'
  },
  glass_bottle: {
    wasteType: 'Botol Kaca',
    wasteTypeEn: 'Glass Bottle',
    category: 'glass',
    pricePerKg: 500,
    currency: 'IDR',
    recyclable: true,
    recycleInfo: 'Kaca dapat didaur ulang tanpa batas menjadi produk kaca baru.',
    recycleSteps: [
      'Kosongkan dan bilas botol',
      'Lepaskan tutup logam atau plastik',
      'Pisahkan berdasarkan warna kaca',
      'Hindari kaca yang pecah',
      'Serahkan ke bank sampah'
    ],
    environmentalImpact: {
      co2Reduction: 0.3,
      energySaving: 0.7,
      waterSaving: 10,
      treeEquivalent: 0.02
    },
    aiExplanation: 'Limbah ini adalah botol kaca yang dapat didaur ulang sepenuhnya. Kaca terbuat dari pasir silika, soda ash, dan batu kapur, dan dapat didaur ulang berulang kali tanpa kehilangan kemurnian atau kualitas. Mendaur ulang kaca mengurangi kebutuhan bahan baku dan energi yang diperlukan untuk membuat kaca baru.'
  },
  organic_waste: {
    wasteType: 'Sampah Organik',
    wasteTypeEn: 'Organic Waste',
    category: 'organic',
    pricePerKg: 500,
    currency: 'IDR',
    recyclable: true,
    recycleInfo: 'Sampah organik dapat diolah menjadi kompos atau biogas.',
    recycleSteps: [
      'Pisahkan dari sampah anorganik',
      'Potong menjadi bagian kecil',
      'Masukkan ke dalam komposter',
      'Aduk secara berkala',
      'Gunakan kompos untuk tanaman'
    ],
    environmentalImpact: {
      co2Reduction: 0.5,
      energySaving: 1.0,
      waterSaving: 20,
      treeEquivalent: 0.03
    },
    aiExplanation: 'Limbah ini teridentifikasi sebagai sampah organik yang berasal dari sisa makanan atau material biologis. Sampah organik memiliki potensi besar untuk diolah menjadi kompos berkualitas tinggi atau biogas sebagai sumber energi terbarukan. Dengan mengompos sampah organik, kita dapat mengurangi metana yang dihasilkan di TPA dan menghasilkan nutrisi kaya untuk tanah.'
  },
  electronic_waste: {
    wasteType: 'Sampah Elektronik',
    wasteTypeEn: 'Electronic Waste',
    category: 'electronic',
    pricePerKg: 25000,
    currency: 'IDR',
    recyclable: true,
    recycleInfo: 'E-waste mengandung logam berharga yang dapat direcovery seperti emas, perak, dan tembaga.',
    recycleSteps: [
      'Hapus data pribadi dari perangkat',
      'Lepaskan baterai jika memungkinkan',
      'Jangan buang di tempat sampah biasa',
      'Cari drop point e-waste terdekat',
      'Serahkan ke recycler bersertifikat'
    ],
    environmentalImpact: {
      co2Reduction: 5.0,
      energySaving: 20.0,
      waterSaving: 200,
      treeEquivalent: 0.3
    },
    aiExplanation: 'Analisis mendeteksi limbah elektronik (e-waste) yang merupakan salah satu jenis sampah dengan pertumbuhan tercepat di dunia. E-waste mengandung material berharga seperti emas, perak, tembaga, dan logam tanah jarang, tetapi juga mengandung zat berbahaya seperti timbal dan merkuri. Penanganan yang tepat sangat penting untuk memulihkan material berharga dan mencegah kontaminasi lingkungan.'
  },
  textile: {
    wasteType: 'Limbah Tekstil',
    wasteTypeEn: 'Textile Waste',
    category: 'textile',
    pricePerKg: 1500,
    currency: 'IDR',
    recyclable: true,
    recycleInfo: 'Tekstil dapat didonasikan, diupcycle, atau didaur ulang menjadi serat baru.',
    recycleSteps: [
      'Cuci dan keringkan pakaian',
      'Pisahkan berdasarkan kondisi',
      'Donasikan yang masih layak pakai',
      'Potong yang rusak untuk kain lap',
      'Serahkan ke bank tekstil'
    ],
    environmentalImpact: {
      co2Reduction: 3.0,
      energySaving: 6.0,
      waterSaving: 3000,
      treeEquivalent: 0.2
    },
    aiExplanation: 'Limbah ini adalah tekstil atau kain yang merupakan salah satu penyumbang limbah terbesar di industri fashion. Industri tekstil menggunakan air dan energi dalam jumlah besar, sehingga mendaur ulang atau menggunakan kembali tekstil dapat memberikan dampak lingkungan yang signifikan. Tekstil bekas dapat didonasikan, diupcycle menjadi produk baru, atau didaur ulang menjadi serat untuk isolasi atau kain baru.'
  },
  newspaper: {
    wasteType: 'Kertas Koran',
    wasteTypeEn: 'Newspaper',
    category: 'paper',
    pricePerKg: 1800,
    currency: 'IDR',
    recyclable: true,
    recycleInfo: 'Kertas koran dapat didaur ulang menjadi kertas daur ulang, karton, atau isolasi.',
    recycleSteps: [
      'Kumpulkan koran bekas',
      'Pastikan tidak basah atau kotor',
      'Ikat rapi dalam bundel',
      'Pisahkan dari sampah lain',
      'Serahkan ke bank sampah'
    ],
    environmentalImpact: {
      co2Reduction: 0.7,
      energySaving: 3.0,
      waterSaving: 30,
      treeEquivalent: 0.12
    },
    aiExplanation: 'Limbah ini teridentifikasi sebagai kertas koran yang terbuat dari pulp kayu. Mendaur ulang kertas koran membantu mengurangi penebangan pohon dan mengurangi konsumsi air serta energi dalam produksi kertas. Serat kertas koran dapat didaur ulang menjadi berbagai produk termasuk kertas daur ulang, tissue, dan bahan isolasi.'
  }
}

export function analyzeWaste(imageType?: string): WasteAnalysisResult {
  const wasteTypes = Object.keys(wasteCategories)
  const randomType = imageType || wasteTypes[Math.floor(Math.random() * wasteTypes.length)]
  const wasteData = wasteCategories[randomType] || wasteCategories.plastic_bottle
  
  const confidenceScore = 85 + Math.random() * 14 // 85-99%
  
  return {
    id: `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    imageUrl: '',
    confidenceScore: Math.round(confidenceScore * 10) / 10,
    createdAt: new Date(),
    ...wasteData
  } as WasteAnalysisResult
}

export function formatCurrency(amount: number, currency: string = 'IDR'): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export function getCategoryColor(category: WasteAnalysisResult['category']): string {
  const colors: Record<WasteAnalysisResult['category'], string> = {
    organic: 'bg-green-500',
    plastic: 'bg-blue-500',
    metal: 'bg-gray-500',
    paper: 'bg-yellow-500',
    glass: 'bg-cyan-500',
    electronic: 'bg-purple-500',
    textile: 'bg-pink-500',
    hazardous: 'bg-red-500',
    unknown: 'bg-slate-500'
  }
  return colors[category]
}

export function getCategoryIcon(category: WasteAnalysisResult['category']): string {
  const icons: Record<WasteAnalysisResult['category'], string> = {
    organic: '🌱',
    plastic: '♻️',
    metal: '🔩',
    paper: '📄',
    glass: '🍾',
    electronic: '📱',
    textile: '👕',
    hazardous: '⚠️',
    unknown: '❓'
  }
  return icons[category]
}

export function getWasteCategoryData(category: WasteAnalysisResult['category']): Partial<WasteAnalysisResult> {
  switch (category) {
    case 'plastic':
      return wasteCategories.plastic_bottle
    case 'paper':
      return wasteCategories.cardboard
    case 'metal':
      return wasteCategories.aluminum_can
    case 'glass':
      return wasteCategories.glass_bottle
    case 'organic':
      return wasteCategories.organic_waste
    case 'electronic':
      return wasteCategories.electronic_waste
    case 'textile':
      return wasteCategories.textile
    case 'hazardous':
      return wasteCategories.plastic_bottle
    default:
      return wasteCategories.plastic_bottle
  }
}
