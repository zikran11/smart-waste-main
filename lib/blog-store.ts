export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  category: string
  author: {
    name: string
    email: string
  }
  createdAt: Date
  updatedAt: Date
}

// In-memory store for demo (will be replaced with Firestore)
let blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Panduan Lengkap Daur Ulang Plastik di Rumah',
    excerpt: 'Pelajari cara mendaur ulang berbagai jenis plastik dan mengurangi sampah plastik di rumah Anda.',
    content: `
# Panduan Lengkap Daur Ulang Plastik di Rumah

Plastik adalah salah satu material paling umum yang kita gunakan sehari-hari, namun sayangnya juga menjadi salah satu penyumbang limbah terbesar. Dengan memahami cara mendaur ulang plastik dengan benar, kita dapat berkontribusi untuk mengurangi dampak lingkungan.

## Jenis-Jenis Plastik

### 1. PET (Polyethylene Terephthalate)
- Biasa digunakan untuk: botol minuman, wadah makanan
- Dapat didaur ulang menjadi: serat tekstil, karpet, wadah baru

### 2. HDPE (High-Density Polyethylene)
- Biasa digunakan untuk: botol susu, wadah deterjen
- Dapat didaur ulang menjadi: pipa, mainan, furniture outdoor

### 3. PVC (Polyvinyl Chloride)
- Biasa digunakan untuk: pipa, bingkai jendela
- Sulit didaur ulang, sebaiknya dihindari

## Langkah-Langkah Daur Ulang Plastik

1. **Identifikasi jenis plastik** - Cari simbol segitiga dengan nomor di dalamnya
2. **Bersihkan plastik** - Bilas wadah plastik dari sisa makanan
3. **Keringkan** - Pastikan plastik dalam kondisi kering
4. **Pisahkan berdasarkan jenis** - Kelompokkan plastik sesuai jenisnya
5. **Serahkan ke pengepul atau bank sampah** - Cari lokasi terdekat

## Tips Mengurangi Penggunaan Plastik

- Gunakan tas belanja yang dapat digunakan ulang
- Bawa botol minum sendiri
- Hindari produk dengan kemasan plastik berlebihan
- Pilih produk dengan kemasan yang dapat didaur ulang

Dengan konsisten menerapkan langkah-langkah ini, Anda dapat membantu mengurangi limbah plastik dan berkontribusi untuk lingkungan yang lebih bersih.
    `,
    coverImage: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800',
    category: 'Daur Ulang',
    author: {
      name: 'Admin Smart Waste',
      email: 'admin@smartwaste.id'
    },
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-15')
  },
  {
    id: '2',
    title: 'Ekonomi Sirkular: Masa Depan Pengelolaan Sumber Daya',
    excerpt: 'Memahami konsep ekonomi sirkular dan bagaimana penerapannya dapat mengubah cara kita memandang limbah.',
    content: `
# Ekonomi Sirkular: Masa Depan Pengelolaan Sumber Daya

Ekonomi sirkular adalah model ekonomi yang bertujuan untuk menghilangkan limbah dan penggunaan sumber daya secara terus-menerus. Berbeda dengan model ekonomi linier tradisional yang mengikuti pola "ambil-buat-buang", ekonomi sirkular menekankan pada penggunaan kembali, perbaikan, dan daur ulang material.

## Prinsip Dasar Ekonomi Sirkular

### 1. Desain Tanpa Limbah
Produk dirancang sejak awal untuk dapat digunakan kembali, diperbaiki, atau didaur ulang di akhir masa pakainya.

### 2. Menjaga Material dalam Siklus
Material terus digunakan selama mungkin melalui berbagai strategi seperti penggunaan ulang, perbaikan, remanufaktur, dan daur ulang.

### 3. Regenerasi Sistem Alam
Model ini mendukung proses alami dan mengurangi dampak negatif terhadap lingkungan.

## Manfaat Ekonomi Sirkular

- **Pengurangan limbah** - Mengurangi jumlah sampah yang berakhir di TPA
- **Efisiensi sumber daya** - Memaksimalkan nilai dari material yang ada
- **Peluang ekonomi baru** - Menciptakan bisnis dan pekerjaan di sektor daur ulang
- **Ketahanan rantai pasokan** - Mengurangi ketergantungan pada bahan baku baru

## Contoh Penerapan

1. **Fashion berkelanjutan** - Brand yang menerima pakaian bekas untuk didaur ulang
2. **Program refurbishment elektronik** - Perusahaan yang memperbaiki dan menjual kembali gadget bekas
3. **Sistem deposit botol** - Konsumen mengembalikan botol kosong untuk digunakan kembali

Dengan mengadopsi prinsip ekonomi sirkular, kita dapat menciptakan sistem yang lebih berkelanjutan dan ramah lingkungan.
    `,
    coverImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
    category: 'Edukasi',
    author: {
      name: 'Admin Smart Waste',
      email: 'admin@smartwaste.id'
    },
    createdAt: new Date('2026-01-10'),
    updatedAt: new Date('2026-01-10')
  },
  {
    id: '3',
    title: 'Bank Sampah: Solusi Pengelolaan Limbah Berbasis Komunitas',
    excerpt: 'Mengenal lebih dekat tentang bank sampah dan bagaimana menjadi bagian dari gerakan ini.',
    content: `
# Bank Sampah: Solusi Pengelolaan Limbah Berbasis Komunitas

Bank sampah adalah fasilitas pengelolaan sampah yang dikelola oleh masyarakat dengan sistem tabungan. Nasabah membawa sampah yang sudah dipilah, kemudian ditimbang dan dicatat dalam buku tabungan.

## Cara Kerja Bank Sampah

1. **Pendaftaran** - Masyarakat mendaftar sebagai nasabah bank sampah
2. **Pemilahan** - Nasabah memilah sampah di rumah sesuai jenisnya
3. **Penyetoran** - Sampah dibawa ke bank sampah secara berkala
4. **Penimbangan** - Sampah ditimbang dan dicatat nilainya
5. **Tabungan** - Nilai sampah dikreditkan ke rekening nasabah

## Jenis Sampah yang Diterima

- **Plastik** - Botol, kemasan, kantong plastik
- **Kertas** - Koran, kardus, majalah, buku bekas
- **Logam** - Kaleng, aluminium, besi
- **Kaca** - Botol kaca, gelas pecah

## Manfaat Bank Sampah

### Bagi Lingkungan
- Mengurangi volume sampah ke TPA
- Meningkatkan tingkat daur ulang
- Mencegah pencemaran lingkungan

### Bagi Masyarakat
- Mengubah sampah menjadi uang
- Meningkatkan kesadaran lingkungan
- Membangun kebersamaan komunitas

## Cara Memulai Bank Sampah

1. Bentuk kelompok pengelola
2. Siapkan tempat dan peralatan
3. Sosialisasi ke masyarakat
4. Jalin kerjasama dengan pengepul
5. Mulai operasional

Bergabunglah dengan bank sampah terdekat atau inisiasi pembentukan bank sampah di lingkungan Anda!
    `,
    coverImage: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800',
    category: 'Komunitas',
    author: {
      name: 'Admin Smart Waste',
      email: 'admin@smartwaste.id'
    },
    createdAt: new Date('2026-01-05'),
    updatedAt: new Date('2026-01-05')
  },
  {
  id: '4',
  title: 'Cara Membuat Kompos dari Sampah Organik di Rumah',
  excerpt: 'Ubah sampah dapur menjadi kompos yang bermanfaat untuk tanaman dengan langkah mudah.',
  content: `
# Cara Membuat Kompos dari Sampah Organik di Rumah

Sampah organik seperti sisa makanan dan daun kering dapat diolah menjadi kompos yang bermanfaat untuk tanaman.

## Bahan yang Dibutuhkan
- Sisa sayuran & buah
- Daun kering
- Tanah
- Air

## Langkah-Langkah
1. Siapkan wadah atau lubang tanah
2. Masukkan sampah organik
3. Tambahkan tanah secukupnya
4. Siram sedikit air
5. Aduk setiap beberapa hari

## Tips
- Hindari daging & minyak
- Jaga kelembaban
- Pastikan ada sirkulasi udara

Dalam 3-4 minggu, kompos sudah bisa digunakan.
  `,
coverImage: 'https://images.unsplash.com/photo-1516711345667-ebafb3ebea12?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  category: 'Daur Ulang',
  author: {
    name: 'Admin Smart Waste',
    email: 'admin@smartwaste.id'
  },
  createdAt: new Date('2026-01-20'),
  updatedAt: new Date('2026-01-20')
},
{
  id: '5',
  title: 'Bahaya Sampah Plastik bagi Lingkungan dan Kesehatan',
  excerpt: 'Ketahui dampak buruk sampah plastik terhadap alam dan kesehatan manusia.',
  content: `
# Bahaya Sampah Plastik bagi Lingkungan dan Kesehatan

Plastik membutuhkan ratusan tahun untuk terurai dan dapat mencemari lingkungan.

## Dampak bagi Lingkungan
- Mencemari laut dan tanah
- Membahayakan hewan
- Menyumbat saluran air

## Dampak bagi Kesehatan
- Mikroplastik masuk ke tubuh manusia
- Mengganggu sistem hormon
- Berpotensi menyebabkan penyakit

## Cara Mengurangi
- Kurangi penggunaan plastik sekali pakai
- Gunakan produk reusable
- Daur ulang dengan benar

Kesadaran kecil bisa berdampak besar bagi bumi kita.
  `,
coverImage: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800',
  category: 'Edukasi',
  author: {
    name: 'Admin Smart Waste',
    email: 'admin@smartwaste.id'
  },
  createdAt: new Date('2026-01-18'),
  updatedAt: new Date('2026-01-18')
},
{
  id: '6',
  title: '5 Ide Kreatif Kerajinan dari Barang Bekas',
  excerpt: 'Inspirasi membuat kerajinan unik dari barang bekas yang mudah dan bernilai guna.',
  content: `
# 5 Ide Kreatif Kerajinan dari Barang Bekas

Barang bekas bisa diubah menjadi sesuatu yang bernilai dan estetik.

## Ide Kerajinan
1. Pot tanaman dari botol plastik
2. Tempat pensil dari kaleng
3. Lampu hias dari sendok plastik
4. Rak dari kardus bekas
5. Tas dari bungkus kopi

## Manfaat
- Mengurangi sampah
- Menghemat biaya
- Melatih kreativitas

Mulai dari hal kecil, kamu bisa membuat perubahan besar!
  `,
  coverImage: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800',
  category: 'Komunitas',
  author: {
    name: 'Admin Smart Waste',
    email: 'admin@smartwaste.id'
  },
  createdAt: new Date('2026-01-17'),
  updatedAt: new Date('2026-01-17')
}
  
]

export function getAllPosts(): BlogPost[] {
  return blogPosts.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export function getPostById(id: string): BlogPost | undefined {
  return blogPosts.find(post => post.id === id)
}

export function getPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter(post => post.category === category)
}

export function createPost(post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): BlogPost {
  const newPost: BlogPost = {
    ...post,
    id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  blogPosts = [newPost, ...blogPosts]
  return newPost
}

export function deletePost(id: string): boolean {
  const initialLength = blogPosts.length
  blogPosts = blogPosts.filter(post => post.id !== id)
  return blogPosts.length < initialLength
}

export function getCategories(): string[] {
  const categories = new Set(blogPosts.map(post => post.category))
  return Array.from(categories)
}
