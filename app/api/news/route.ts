import { NextResponse } from 'next/server'

type GNewsArticle = {
  title: string
  description: string | null
  url: string
  image: string | null
  publishedAt: string
  source?: { name?: string }
}

// 🔥 diperbanyak keyword biar hasil lebih banyak
const QUERIES = [
  'sampah Indonesia',
  'daur ulang Indonesia',
  'bank sampah Indonesia',
  'lingkungan Indonesia',
  'plastik Indonesia',
  'pengelolaan sampah',
  'waste Indonesia',
  'recycling Indonesia'
]

async function fetchNews(apiKey: string, query: string) {
  const url = new URL('https://gnews.io/api/v4/search')

  url.searchParams.set('q', query)
  url.searchParams.set('lang', 'id')
  url.searchParams.set('max', '20') // 🔥 naikkan limit
  url.searchParams.set('token', apiKey)

  return fetch(url.toString(), {
    next: { revalidate: 1800 }
  })
}

export async function GET() {
  try {
    const apiKey = process.env.NEWS_API_KEY

    if (!apiKey) {
      return NextResponse.json({ message: 'API key belum di-set' }, { status: 500 })
    }

    let all: GNewsArticle[] = []

    // 🔥 ambil dari semua query (bukan berhenti di 1 hasil)
    for (const q of QUERIES) {
      const res = await fetchNews(apiKey, q)

      if (res.ok) {
        const data = await res.json()
        if (data.articles?.length) {
          all = [...all, ...data.articles]
        }
      }
    }

    // 🔥 hapus duplikat URL
    const unique = Array.from(
      new Map(all.map((a) => [a.url, a])).values()
    )

    return NextResponse.json({
      articles: unique.map((a, i) => ({
        id: `${i}-${a.publishedAt}`,
        title: a.title,
        excerpt: a.description ?? 'Baca selengkapnya...',
        sourceUrl: a.url,
        coverImage: a.image ?? '/placeholder.jpg',
        sourceName: a.source?.name ?? 'Media Indonesia',
        publishedAt: a.publishedAt
      }))
    })
  } catch (err) {
    return NextResponse.json(
      { message: 'Server error', err },
      { status: 500 }
    )
  }
}