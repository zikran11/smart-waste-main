import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { normalizeWasteCategory } from "@/lib/waste-utils";

export async function POST(req: Request) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json(
        { error: "Gambar wajib dikirim" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    // 🔥 gunakan model yang tersedia untuk generateContent
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 🔥 prompt FIXED (forced choice)
    const prompt = `
Anda adalah AI klasifikasi sampah SUPER AKURAT.

TUGAS:
Identifikasi objek utama di tengah gambar.

ATURAN VALIDASI (SAFETY CHECKS):
1. TETAPKAN FOKUS PADA OBJEK UTAMA: jika ada manusia/hewan di latar belakang tetapi objek utama jelas merupakan sampah, jawab sebagai sampah.
2. MANUSIA/HEWAN: jika objek utama adalah manusia atau hewan hidup, jawab validation_status = "not_trash" dan is_human_or_animal = true.
3. BARANG LAYAK PAKAI: jika objek utama jelas bukan sampah dan masih layak digunakan, jawab validation_status = "not_trash".
4. SAMPAPH JELAS: jika objek utama adalah kemasan kosong, kardus, koran, botol plastik, gelas, kaleng, sampah organik, elektronik, tekstil, atau barang rusak/kotor, jawab validation_status = "trash".
5. JANGAN GUNAKAN validation_status = "not_trash" hanya karena ada orang/hewan di latar belakang.
6. JANGAN TULIS "not_trash" untuk benda yang merupakan sampah utama, termasuk kertas/koran, botol, kemasan, kulit pisang, dll.

ATURAN WAJIB:
- Fokus pada objek paling jelas
- Jangan menebak
- Jika ragu → confidence_score < 60 dan category = "unknown"
- Jawaban harus berupa JSON saja, tanpa penjelasan tambahan

KLASIFIKASI WAJIB:
- Botol plastik → plastic
- Kardus/karton → paper
- Kertas → paper
- Kaleng/logam → metal
- Kaca → glass
- Makanan/daun → organic
- Elektronik → electronic
- Baterai → hazardous
- Pakaian/tekstil → textile

JIKA BUKAN SAMPAH:
- Jika manusia/hewan terdeteksi, gunakan validation_status = "not_trash"
- Jika barang masih layak pakai, gunakan validation_status = "not_trash"
- Berikan rekomendasi penggunaan atau donasi ketika bukan sampah

JIKA TIDAK COCOK:
- Gunakan category = "unknown"
- Gunakan confidence_score < 60

FORMAT JSON:
{
  "item_name": string,
  "category": string,
  "confidence_score": number,
  "recyclable": boolean,
  "disposal_advice": string,
  "fun_fact": string,
  "validation_status": string,
  "validation_reason": string,
  "recommendation": string,
  "is_human_or_animal": boolean
}
`.trim();

    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: "image/jpeg",
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const text = result.response.text();

    const clean = text.replace(/```json|```/g, "").trim();

    let data;

    try {
      data = JSON.parse(clean);
    } catch {
      return NextResponse.json(
        { error: "AI response tidak valid" },
        { status: 500 }
      );
    }

    // 🔥 FILTER TAMBAHAN (SUPER PENTING)
    if (!data || typeof data !== "object") {
      return NextResponse.json(
        { error: "Data AI kosong" },
        { status: 500 }
      );
    }

    const rawItemName = String(data.item_name ?? '').trim()
    const rawCategoryText = String(data.category ?? '').trim()
    const category = normalizeWasteCategory(rawCategoryText, rawItemName)
    const rawValidationStatus = String(data.validation_status ?? '').trim().toLowerCase()
    const rawValidationReason = String(data.validation_reason ?? '').trim()
    const rawRecommendation = String(data.recommendation ?? data.disposal_advice ?? '').trim()
    const rawText = [rawItemName, rawCategoryText, rawValidationStatus, rawValidationReason, rawRecommendation].join(' ')

    const humanOrAnimalKeywords = /\b(manusia|orang|wajah|tubuh|hewan|anjing|kucing|ikan|burung|sapi|kuda|kelinci|ayam|human|face|body|animal|dog|cat|horse|bird|fish|person)\b/i
    const reusableKeywords = /\b(layak pakai|masih utuh|bagus|bersih|baru|berfungsi|menyala|dipakai|digunakan|usable|good condition|working|reusable|donasi|sumbang|disumbangkan|sumbangkan|tersisa|masih bagus)\b/i
    const trashKeywords = /\b(trash|sampah|limbah|buang|discard|dispose|daur ulang|didaur ulang|kertas|koran|botol|plastik|kaleng|kaca|elektronik|baterai|pakaian|tekstil|karton|kardus|kulit pisang|sisa makanan)\b/i

    const isHumanOrAnimal = humanOrAnimalKeywords.test(rawText)
    const isLikelyReusable = reusableKeywords.test(rawText)
    const hasNotTrashTag = /not_trash|not trash|bukan sampah/i.test(rawValidationStatus)
    const hasTrashTag = /trash|sampah|limbah/i.test(rawValidationStatus)

    let validationStatus: 'trash' | 'not_trash' | 'unknown' = 'unknown'

    if (isHumanOrAnimal) {
      validationStatus = 'not_trash'
    } else if (isLikelyReusable && hasNotTrashTag) {
      validationStatus = 'not_trash'
    } else if (category !== 'unknown') {
      validationStatus = 'trash'
    } else if (hasTrashTag) {
      validationStatus = 'trash'
    } else if (hasNotTrashTag && category === 'unknown') {
      validationStatus = 'not_trash'
    }

    let validationReason = rawValidationReason
    if (!validationReason) {
      if (validationStatus === 'not_trash' && isHumanOrAnimal) {
        validationReason = 'Gambar manusia atau hewan terdeteksi di objek utama. Ini bukan sampah.'
      } else if (validationStatus === 'not_trash' && isLikelyReusable) {
        validationReason = 'Objek utama terlihat masih layak pakai atau dapat digunakan kembali.'
      } else if (validationStatus === 'trash') {
        validationReason = 'Objek utama terdeteksi sebagai sampah sesuai klasifikasi material.'
      } else if (rawValidationStatus) {
        validationReason = rawValidationStatus
      } else {
        validationReason = 'Tidak ada keterangan validasi khusus.'
      }
    }

    const recommendation = rawRecommendation ||
      (validationStatus === 'not_trash'
        ? 'Pertimbangkan untuk menggunakan, menyumbangkan, atau menjual barang ini jika masih layak pakai.'
        : 'Pisahkan dan daur ulang sesuai jenis material.' )

    const safeData = {
      item_name: rawItemName || "Tidak diketahui",
      category,
      confidence_score: Number(data.confidence_score) || 0,
      recyclable:
        typeof data.recyclable === 'boolean'
          ? data.recyclable
          : category !== 'hazardous',
      disposal_advice: String(data.disposal_advice ?? "-"),
      fun_fact: String(data.fun_fact ?? "-"),
      validation_status: validationStatus,
      validation_reason: validationReason,
      recommendation,
      is_human_or_animal: isHumanOrAnimal,
    }

    if (safeData.confidence_score < 60) {
      safeData.item_name = "Tidak Dikenali"
      safeData.category = "unknown"
      safeData.recyclable = false
      safeData.validation_status = 'unknown'
      safeData.disposal_advice =
        "Objek tidak teridentifikasi dengan jelas. Silakan coba foto yang lebih terang dan fokus pada satu objek."
      safeData.recommendation =
        "Coba ulang dengan foto yang lebih jelas, terang, dan fokus pada satu objek utama."
    }

    return NextResponse.json(safeData);

  } catch (err: any) {
    console.error(err);

    // 🔥 HANDLE QUOTA ERROR
    if (err.message?.includes("429")) {
      return NextResponse.json({
        item_name: "Limit AI tercapai",
        category: "plastic",
        confidence_score: 0,
        recyclable: false,
        disposal_advice: "Coba lagi besok",
        fun_fact: "-",
        limit_reached: true
      });
    }

    return NextResponse.json(
      { error: "Gagal analyze" },
      { status: 500 }
    );
  }
}