import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { message, contextData } = await req.json();

    const gempa = contextData?.gempa || "Tidak ada data";
    const titikIkan = contextData?.titikIkan || "Tidak ada data";

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", 
    });

    // Gunakan Template Literal yang bersih tanpa terlalu banyak nested object
    const systemInstruction = `Anda adalah DahaGoe AI.
Konteks saat ini:
- Gempa: ${JSON.stringify(gempa)}
- Cuaca/Titik Ikan: ${JSON.stringify(titikIkan)}

Aturan:
1. Jika user menyapa, balas sapaan dengan ramah.
2. Jawab pertanyaan user menggunakan data di atas ATAU pengetahuan umum Anda tentang laut/gempa jika data di atas tidak relevan.
3. JAWABAN HARUS UTUH, jangan terpotong. Maksimal 3 kalimat panjang.
4. Akhiri dengan 1 pertanyaan pancingan.`;

    const fullPrompt = `${systemInstruction}\n\nUser: ${message}\nAI:`;

    // Gunakan pemanggilan yang lebih sederhana untuk stabilitas
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("Empty response");
    }
    
    return NextResponse.json({ text: text });

  } catch (error: any) {
    console.error("Gemini Error:", error);
    return NextResponse.json({ text: "Maaf, koneksi saya terputus sebentar. Bisa ulangi pertanyaannya?" }, { status: 500 });
  }
}