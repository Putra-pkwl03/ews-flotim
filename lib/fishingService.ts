// src/lib/fishingService.ts

const API_KEY = process.env.NEXT_PUBLIC_STORMGLASS_API_KEY;

/**
 * Mengambil data suhu permukaan laut (SST) dari StormGlass API
 */
export async function getSeaTemperature(lat: number, lng: number) {
  const params = 'waterTemperature';
  const now = new Date();
  const start = now.toISOString().split('.')[0] + 'Z'; 

  try {
    // Jika API KEY tidak ada, langsung return null tanpa fetch
    if (!API_KEY) return null;

    const response = await fetch(
      `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${params}&start=${start}&end=${start}`,
      {
        headers: {
          'Authorization': API_KEY
        },
        next: { revalidate: 3600 } 
      }
    );

    // PERBAIKAN: Jangan throw error. Cukup log dan return null.
    if (!response.ok) {
      console.warn(`StormGlass Error (${response.status}): ${response.statusText} untuk titik ${lat},${lng}`);
      return null; 
    }

    const result = await response.json();
    
    // Ambil data (beberapa sumber sebagai fallback)
    const data = result.hours?.[0]?.waterTemperature;
    const temp = data?.noaa || data?.meto || data?.sg;
    
    return temp || null;
  } catch (error) {
    // PERBAIKAN: Catch semua error (network, parse json, dll) agar tidak menghentikan script utama
    console.error("Gagal mengambil data suhu laut (Network/Internal):", error);
    return null;
  }
}

/**
 * Menganalisis potensi keberadaan ikan berdasarkan suhu air
 */
export function analyzeFishingPotency(temp: number) {
  // Jika suhu tidak tersedia (null), berikan status default
  if (!temp) {
    return {
      status: "Data Terbatas",
      pesan: "Informasi suhu laut tidak tersedia untuk analisis.",
      level: 0,
      warna: "text-slate-400"
    };
  }

  if (temp >= 28.5 && temp <= 30.8) {
    return {
      status: "Sangat Tinggi",
      pesan: "Suhu air sangat ideal. Ikan cenderung berkumpul di permukaan.",
      level: 3,
      warna: "text-emerald-500"
    };
  } else if (temp >= 27.0 && temp < 28.5) {
    return {
      status: "Potensi Sedang",
      pesan: "Suhu air cukup baik, namun ikan mungkin berada di kedalaman lebih rendah.",
      level: 2,
      warna: "text-amber-500"
    };
  } else {
    return {
      status: "Potensi Rendah",
      pesan: "Suhu air kurang stabil. Ikan cenderung bermigrasi ke wilayah lain.",
      level: 1,
      warna: "text-slate-400"
    };
  }
}