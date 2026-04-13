// src/app/page.tsx
import { supabase } from "../lib/supabaseClient";
import DashboardClient from "./DashboardClient";
import { Footer } from "./components/layout/Footer"; // Import footer di sini

export default async function HomePage() {
  const { data: gempa } = await supabase.from('data_gempa').select('*').order('created_at', { ascending: false }).limit(1).single();
  const { data: history } = await supabase.from('riwayat_gempa').select('*').order('tanggal_jam', { ascending: false }).limit(20);
  const { data: cuaca } = await supabase.from('cuaca_laut').select('*').eq('lokasi', 'Larantuka - Solor').single();
  const { data: titikIkan } = await supabase.from('titik_ikan').select('*').order('id_titik', { ascending: true });

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
    // Kita gunakan min-h-screen flex flex-col supaya layout utuh satu halaman
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {/* Konten Utama (Dashboard) */}
      <main className="flex-grow">
        <DashboardClient 
          gempa={gempa}
          history={history || []}
          cuaca={cuaca}
          titikIkan={titikIkan || []}
          coords={getCoords(gempa?.koordinat)}
        />
      </main>

      {/* Footer di bagian paling bawah */}
      <Footer />
      
    </div>
  );
}