import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';
import { getSeaTemperature, analyzeFishingPotency } from '../../../lib/fishingService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const weatherKey = process.env.OPENWEATHER_API_KEY;

  try {
    if (!weatherKey) throw new Error("API Key tidak ditemukan.");

    const titikMonitor = [
      // --- WILAYAH DARATAN ---
      { id: 101, nama: "Solor Barat (Ritawolo)", lat: -8.45, lon: 122.95, tipe: "darat" },
      { id: 102, nama: "Solor Timur (Lebaelen)", lat: -8.50, lon: 123.18, tipe: "darat" }, 
      { id: 103, nama: "Solor Selatan", lat: -8.53, lon: 123.05, tipe: "darat" },
      { id: 104, nama: "Adonara Barat (Waiwerang)", lat: -8.32, lon: 123.15, tipe: "darat" },
      { id: 105, nama: "Adonara Timur", lat: -8.28, lon: 123.25, tipe: "darat" },
      { id: 106, nama: "Lembata (Lewoleba)", lat: -8.37, lon: 123.41, tipe: "darat" },
      { id: 107, nama: "Larantuka", lat: -8.34, lon: 122.98, tipe: "darat" },
      { id: 108, nama: "Maumere", lat: -8.62, lon: 122.22, tipe: "darat" },
      { id: 109, nama: "Kupang", lat: -10.17, lon: 123.60, tipe: "darat" },
      // --- 20 TITIK LAUT SAWU ---
      { id: 1, nama: "Sawu Utara 1", lat: -8.80, lon: 122.00, tipe: "laut" },
      { id: 2, nama: "Sawu Utara 2", lat: -8.80, lon: 122.50, tipe: "laut" },
      { id: 3, nama: "Sawu Utara 3", lat: -8.80, lon: 123.00, tipe: "laut" },
      { id: 4, nama: "Sawu Utara 4", lat: -8.80, lon: 123.50, tipe: "laut" },
      { id: 5, nama: "Sawu Tengah 1", lat: -9.20, lon: 121.50, tipe: "laut" },
      { id: 6, nama: "Sawu Tengah 2", lat: -9.20, lon: 122.00, tipe: "laut" },
      { id: 7, nama: "Sawu Tengah 3", lat: -9.20, lon: 122.50, tipe: "laut" },
      { id: 8, nama: "Sawu Tengah 4", lat: -9.20, lon: 123.00, tipe: "laut" },
      { id: 9, nama: "Sawu Tengah 5", lat: -9.20, lon: 123.50, tipe: "laut" },
      { id: 10, nama: "Sawu Dalam 1", lat: -9.50, lon: 121.00, tipe: "laut" },
      { id: 11, nama: "Sawu Dalam 2", lat: -9.50, lon: 122.00, tipe: "laut" },
      { id: 12, nama: "Sawu Dalam 3", lat: -9.50, lon: 123.00, tipe: "laut" },
      { id: 13, nama: "Sawu Selatan 1", lat: -10.00, lon: 121.00, tipe: "laut" },
      { id: 14, nama: "Sawu Selatan 2", lat: -10.00, lon: 122.00, tipe: "laut" },
      { id: 15, nama: "Sawu Selatan 3", lat: -10.00, lon: 123.00, tipe: "laut" },
      { id: 16, nama: "Sawu Barat Daya", lat: -10.50, lon: 120.50, tipe: "laut" },
      { id: 17, nama: "Dekat Sabu Raijua", lat: -10.60, lon: 121.80, tipe: "laut" },
      { id: 18, nama: "Dekat Rote", lat: -10.80, lon: 123.00, tipe: "laut" },
      { id: 19, nama: "Palung Sawu", lat: -9.80, lon: 122.20, tipe: "laut" },
      { id: 20, nama: "Pusat Sawu", lat: -9.15, lon: 122.50, tipe: "laut" },
    ];

    const dataWilayah = await Promise.all(titikMonitor.map(async (pos) => {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${pos.lat}&lon=${pos.lon}&appid=${weatherKey}&units=metric&lang=id`,
        { cache: 'no-store' }
      );
      const forecastData = await res.json();
      const current = forecastData.list[0];
      const nextForecast = forecastData.list[1];
      let suhu = current.main.temp;
      
      if (pos.tipe === "laut") {
         const seaTemp = await getSeaTemperature(pos.lat, pos.lon);
         if (seaTemp) suhu = seaTemp; 
      }

      const analisis = pos.tipe === "laut" 
        ? analyzeFishingPotency(suhu) 
        : { status: "N/A", pesan: "Monitoring wilayah darat" };

      return {
        ...pos,
        suhu,
        kondisi: current.weather[0].description,
        kecepatan_angin: current.wind.speed,
        arah_angin: current.wind.deg,
        prediksi: {
          jam: nextForecast.dt_txt,
          kondisi: nextForecast.weather[0].description,
          intensitas: nextForecast.rain?.['3h'] ? `${nextForecast.rain['3h']}mm` : "0mm",
          bahaya: (nextForecast.rain?.['3h'] || 0) > 5 ? "Waspada Hujan" : "Aman"
        },
        potensi: analisis.status,
        pesan: analisis.pesan
      };
    }));

    // --- UPDATE DATABASE CUACA & TITIK IKAN ---
    const ringkasan = dataWilayah.find(d => d.nama === "Pusat Sawu") || dataWilayah[0];
    await supabase.from('cuaca_laut').upsert({
      lokasi: "Larantuka - Solor",
      nama_perairan: "Laut Sawu - Sektor NTT Selatan",
      kecepatan_angin: ringkasan.kecepatan_angin,
      arah_angin: ringkasan.arah_angin.toString(),
      suhu_laut: ringkasan.suhu,
      potensi_ikan: ringkasan.potensi,
      updated_at: new Date().toISOString()
    }, { onConflict: 'lokasi' });

    await Promise.all(dataWilayah.map(item => 
      supabase.from('titik_ikan').upsert({
        id_titik: item.id,
        nama: item.nama,
        latitude: item.lat,
        longitude: item.lon,
        suhu: item.suhu,
        potensi: item.potensi,
        tipe: item.tipe,
        kondisi: item.kondisi, 
        prediksi: item.prediksi, 
        updated_at: new Date().toISOString()
      }, { onConflict: 'id_titik' })
    ));

    // --- LOGIKA GEMPA TERKINI (M 5.0+) ---
    const resAutoGempa = await fetch('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json', { cache: 'no-store' });
    const autoGempaData = await resAutoGempa.json();
    const gempa = autoGempaData.Infogempa.gempa;
    const coords = gempa.Coordinates.split(',');

    await supabase.from('data_gempa').upsert({
      tanggal: gempa.Tanggal,
      jam: gempa.Jam,
      tanggal_jam_iso: gempa.DateTime,
      magnitude: parseFloat(gempa.Magnitude),
      kedalaman: gempa.Kedalaman,
      wilayah: gempa.Wilayah,
      potensi: gempa.Potensi,
      shakemap: gempa.Shakemap,
      lintang: gempa.Lintang,
      bujur: gempa.Bujur,
      koordinat: `POINT(${coords[1]} ${coords[0]})`
    }, { onConflict: 'tanggal, jam' });

    // --- LOGIKA RIWAYAT GEMPA (DIRASAKAN) ---
    try {
      const resRiwayat = await fetch('https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json', { cache: 'no-store' });
      const riwayatJson = await resRiwayat.json();
      const daftarGempa = riwayatJson.Infogempa.gempa;

      await Promise.all(daftarGempa.map((g) => {
        const c = g.Coordinates.split(',');
        return supabase.from('riwayat_gempa').upsert({
          datetime_id: g.DateTime,
          tanggal_jam: `${g.Tanggal} - ${g.Jam}`,
          magnitude: parseFloat(g.Magnitude),
          kedalaman: g.Kedalaman,
          wilayah: g.Wilayah,
          koordinat: `POINT(${c[1]} ${c[0]})`,
          dirasakan: g.Dirasakan,
        }, { onConflict: 'datetime_id' });
      }));
    } catch (err) {
      console.error("Gagal sinkronisasi riwayat:", err);
    }

    // --- AMBIL DATA RIWAYAT DARI DB UNTUK RESPONSE ---
    const { data: listRiwayat } = await supabase
      .from('riwayat_gempa')
      .select('*')
      .order('datetime_id', { ascending: false })
      .limit(20);

    return NextResponse.json({
      success: true,
      darat: dataWilayah.filter(item => item.tipe === "darat"),
      laut: dataWilayah.filter(item => item.tipe === "laut"),
      gempa: gempa,
      riwayat_gempa: listRiwayat
    });

  } catch (err) {
    console.error("Sync Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}