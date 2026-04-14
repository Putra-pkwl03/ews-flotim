// src/app/page.tsx
import { supabase } from "../lib/supabaseClient";
import DashboardClient from "./DashboardClient";
import { Footer } from "./components/layout/Footer";

// Paksa halaman agar selalu fetch data terbaru (Server-Side Rendering)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  /**
   * SILENT TRIGGER:
   * Menggunakan fetch tanpa 'await' (Fire and Forget).
   * Ini akan memicu API update-gempa di background tanpa menunggu prosesnya selesai,
   * sehingga loading halaman utama tetap cepat.
   */
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ews-flotim.vercel.app';
  fetch(`${baseUrl}/api/update-gempa`, { cache: 'no-store' }).catch((e) =>
    console.error("Silent trigger failed:", e)
  );

  // Ambil data dari Supabase
  const { data: gempa } = await supabase
    .from('data_gempa')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const { data: history } = await supabase
    .from('riwayat_gempa')
    .select('*')
    .order('datetime_id', { ascending: false }) // Pastikan kolom sorting sesuai database
    .limit(20);

  const { data: cuaca } = await supabase
    .from('cuaca_laut')
    .select('*')
    .eq('lokasi', 'Larantuka - Solor')
    .single();

  const { data: titikIkan } = await supabase
    .from('titik_ikan')
    .select('*')
    .order('id_titik', { ascending: true });

  const getCoords = (pointString: string) => {
    if (!pointString) return { lat: -8.34, lon: 122.98 };
    const match = pointString.match(/\(([^)]+)\)/);
    if (match) {
      const [lon, lat] = match[1].split(' ').map(Number);
      return { lat, lon };
    }
    return { lat: -8.34, lon: 122.98 };
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <main className="flex-grow">
        <DashboardClient 
          gempa={gempa}
          history={history || []}
          cuaca={cuaca}
          titikIkan={titikIkan || []}
          coords={getCoords(gempa?.koordinat)}
        />
      </main>
      <Footer />
    </div>
  );
}