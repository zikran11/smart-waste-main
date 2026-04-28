import { NextResponse } from 'next/server'

type GNewsArticle = {
  title: string
  description: string | null
  url: string
  image: string | null
  publishedAt: string
  source?: {
    name?: string
  }
}

const PRIMARY_QUERY = 'sampah OR "daur ulang" OR lingkungan OR "bank sampah" OR upcycle'
const FALLBACK_QUERY = 'sampah'

async function fetchGNews(apiKey: string, query: string, withCountry: boolean) {
  const url = new URL('https://gnews.io/api/v4/search')
  url.searchParams.set('q', query)
  url.searchParams.set('lang', 'id')
  if (withCountry) url.searchParams.set('country', 'id')
  url.searchParams.set('max', '15')
  // GNews API expects `token` (not `apikey`) for authentication.
  url.searchParams.set('token', apiKey)

  const response = await fetch(url.toString(), { next: { revalidate: 60 * 30 } })
  return response
}

export async function GET() {
  try {
    const apiKey = process.env.NEWS_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { message: 'NEWS_API_KEY belum diatur di environment.' },
        { status: 500 }
      )
    }

    const response = await fetchGNews(apiKey, PRIMARY_QUERY, true)

    if (!response.ok) {
      const providerBody = await response.text().catch(() => '')
      return NextResponse.json(
        {
          message: 'Gagal mengambil artikel dari penyedia berita.',
          providerStatus: response.status,
          providerBody: providerBody.slice(0, 300)
        },
        { status: response.status }
      )
    }

    const data = (await response.json()) as { articles?: GNewsArticle[] }
    let rawArticles = data.articles ?? []

    if (rawArticles.length === 0) {
      // Broaden query if the Indonesian+country constrained search returns nothing.
      const fallbackResponse = await fetchGNews(apiKey, FALLBACK_QUERY, false)
      if (fallbackResponse.ok) {
        const fallbackData = (await fallbackResponse.json()) as { articles?: GNewsArticle[] }
        rawArticles = fallbackData.articles ?? []
      }
    }

    const articles = rawArticles.map((article, index) => ({
      id: `${index}-${article.publishedAt}`,
      title: article.title,
      excerpt: article.description ?? 'Baca artikel selengkapnya di sumber berita.',
      sourceUrl: article.url,
      coverImage: article.image ?? '/placeholder.jpg',
      sourceName: article.source?.name ?? 'Sumber berita',
      publishedAt: article.publishedAt
    }))

    return NextResponse.json({ articles })
  } catch {
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat memuat berita.' },
      { status: 500 }
    )
  }
}
