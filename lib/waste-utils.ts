export type WasteCategory =
  | 'organic'
  | 'plastic'
  | 'metal'
  | 'paper'
  | 'glass'
  | 'electronic'
  | 'textile'
  | 'hazardous'
  | 'unknown'

const categoryGroups: Array<{
  value: WasteCategory
  keywords: string[]
}> = [
  {
    value: 'plastic',
    keywords: [
      'plastik',
      'plastic',
      'botol',
      'bottle',
      'kresek',
      'plastik sekali pakai',
      'rongsokan plastik',
      'plastic bottle',
      'plastic bag',
      'plastic cup'
    ]
  },
  {
    value: 'paper',
    keywords: [
      'kardus',
      'cardboard',
      'kertas',
      'paper',
      'karton',
      'koran',
      'majalah',
      'envelope',
      'paperboard',
      'box'
    ]
  },
  {
    value: 'metal',
    keywords: [
      'kaleng',
      'logam',
      'metal',
      'aluminium',
      'aluminum',
      'tin',
      'can',
      'besi',
      'stainless'
    ]
  },
  {
    value: 'glass',
    keywords: [
      'kaca',
      'glass',
      'botol kaca',
      'jar',
      'gelas',
      'termometer',
      'botol wine'
    ]
  },
  {
    value: 'organic',
    keywords: [
      'makanan',
      'sayur',
      'daun',
      'organic',
      'organik',
      'sisa makanan',
      'buah',
      'sayuran',
      'daging',
      'kulit'
    ]
  },
  {
    value: 'electronic',
    keywords: [
      'elektronik',
      'electronic',
      'e-waste',
      'handphone',
      'hp',
      'televisi',
      'laptop',
      'charger',
      'perangkat elektronik',
      'komputer'
    ]
  },
  {
    value: 'hazardous',
    keywords: [
      'baterai',
      'battery',
      'b3',
      'limbah berbahaya',
      'cat',
      'obat',
      'merkuri',
      'bahan berbahaya',
      'lampu neon',
      'lampu' 
    ]
  },
  {
    value: 'textile',
    keywords: [
      'baju',
      'pakaian',
      'tekstil',
      'textile',
      'kain',
      'cloth',
      't-shirt',
      'jeans',
      'sandal',
      'sepatu'
    ]
  }
]

const UNKNOWN_KEYWORDS = [
  'unknown',
  'tidak dikenal',
  'tidak diketahui',
  'tidak jelas',
  'samar',
  'uncertain',
  'tidak yakin',
  'lainnya'
]

const normalizeText = (value: unknown) =>
  String(value ?? '').trim().toLowerCase()

const containsAny = (text: string, keywords: string[]) =>
  keywords.some(keyword => text.includes(keyword))

export function normalizeWasteCategory(
  category: unknown,
  itemName: unknown
): WasteCategory {
  const rawCategory = normalizeText(category)
  const rawItem = normalizeText(itemName)

  if (containsAny(rawCategory, UNKNOWN_KEYWORDS) || containsAny(rawItem, UNKNOWN_KEYWORDS)) {
    return 'unknown'
  }

  for (const group of categoryGroups) {
    if (containsAny(rawItem, group.keywords) || containsAny(rawCategory, group.keywords)) {
      return group.value
    }
  }

  return 'unknown'
}
