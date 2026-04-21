import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  Timestamp,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from '@/lib/firebase'
import type { BlogPost } from '@/lib/blog-store'

type BlogDocument = {
  id: string
  authorId: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  category: string
  author: {
    name: string
    email: string
  }
  createdAt: Timestamp
  updatedAt: Timestamp
}

const BLOGS_COLLECTION = 'blogs'

function ensureFirestore() {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase belum terkonfigurasi untuk Firestore')
  }
  return db
}

function mapBlogDocument(data: BlogDocument): BlogPost {
  return {
    id: data.id,
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    coverImage: data.coverImage,
    category: data.category,
    author: data.author,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
  }
}

export async function getAllPostsFirestore(): Promise<BlogPost[]> {
  const firestore = ensureFirestore()
  const blogsQuery = query(
    collection(firestore, BLOGS_COLLECTION),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(blogsQuery)

  return snapshot.docs.map((docSnap) => mapBlogDocument(docSnap.data() as BlogDocument))
}

export async function getPostByIdFirestore(id: string): Promise<BlogPost | null> {
  const firestore = ensureFirestore()
  const snapshot = await getDoc(doc(firestore, BLOGS_COLLECTION, id))

  if (!snapshot.exists()) return null

  return mapBlogDocument(snapshot.data() as BlogDocument)
}

export async function createPostFirestore(
  post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>,
  authorId: string
): Promise<BlogPost> {
  const firestore = ensureFirestore()
  const postRef = doc(collection(firestore, BLOGS_COLLECTION))
  const now = Timestamp.now()
  const payload: BlogDocument = {
    ...post,
    id: postRef.id,
    authorId,
    createdAt: now,
    updatedAt: now,
  }

  await setDoc(postRef, payload)
  return mapBlogDocument(payload)
}

export async function deletePostFirestore(id: string): Promise<void> {
  const firestore = ensureFirestore()
  await deleteDoc(doc(firestore, BLOGS_COLLECTION, id))
}

export function getCategoriesFromPosts(posts: BlogPost[]): string[] {
  return Array.from(new Set(posts.map((post) => post.category)))
}

export function getFirestoreErrorMessage(error: unknown, fallbackMessage: string): string {
  const code = typeof error === 'object' && error !== null && 'code' in error
    ? String((error as { code?: string }).code)
    : ''
  const message = error instanceof Error ? error.message : ''

  switch (code) {
    case 'permission-denied':
      return 'Akses ditolak. Cek Firestore Rules atau login akun yang tepat.'
    case 'unauthenticated':
      return 'Sesi login tidak valid. Silakan login ulang.'
    case 'unavailable':
      return 'Firestore sedang tidak tersedia. Cek koneksi internet lalu coba lagi.'
    case 'deadline-exceeded':
      return 'Permintaan ke Firestore timeout. Coba ulang beberapa saat lagi.'
    case 'not-found':
      return 'Data blog tidak ditemukan di Firestore.'
    default:
      if (message.includes('belum terkonfigurasi')) {
        return 'Konfigurasi Firebase belum lengkap. Periksa variabel environment Firebase di .env.'
      }
      return fallbackMessage
  }
}
