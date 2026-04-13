'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MapWrapper from "./components/map/MapWrapper";
import FishingWrapper from "./components/map/FishingWrapper";
import { Navbar } from "./components/layout/Navbar";
import { EarthquakeCard } from "./components/dashboard/EarthquakeCard";
import { WeatherCard } from "./components/dashboard/WeatherCard";
import { AIChatCard } from "./components/dashboard/AIChatCard";
import { SeismicTable } from "./components/history/SeismicTable";

export default function DashboardClient({ gempa, history, cuaca, titikIkan, coords }: any) {
  const [activeMenu, setActiveMenu] = useState('gempa');

  // Logic filter titik darat dan laut
  const { dataDarat, dataLaut } = useMemo(() => {
    const allPoints = Array.isArray(titikIkan) ? titikIkan : [...(titikIkan?.darat || []), ...(titikIkan?.laut || [])];
    return {
      dataDarat: allPoints.filter((p: any) => p.tipe === 'darat'),
      dataLaut: allPoints.filter((p: any) => p.tipe === 'laut')
    };
  }, [titikIkan]);

  // --- LOGIKA: PARSING KOORDINAT GEMPA NASIONAL ---
  const earthquakeCoords = useMemo(() => {
    // 1. Prioritas: Ambil dari field lintang/bujur (Data Mentah API BMKG)
    const rawLat = gempa?.lintang || gempa?.Lintang;
    const rawLon = gempa?.bujur || gempa?.Bujur;

    if (rawLat && rawLon) {
      // Membersihkan string "LS" atau "BT" jika ada dan convert ke float
      return { 
        lat: parseFloat(rawLat.replace(/[^0-9.-]/g, '')), 
        lon: parseFloat(rawLon.replace(/[^0-9.-]/g, '')) 
      };
    }

    // 2. Cek format PostGIS POINT(lon lat) dari Supabase
    if (typeof gempa?.koordinat === 'string' && gempa.koordinat.includes('POINT')) {
      const match = gempa.koordinat.match(/\((.*)\)/);
      if (match) {
        const [lon, lat] = match[1].split(' ');
        return { lat: parseFloat(lat), lon: parseFloat(lon) };
      }
    }

    // 3. Fallback: Default ke koordinat Indonesia Tengah jika data tidak ada
    return { 
      lat: coords?.lat || -2.5489, // Default Tengah Indonesia
      lon: coords?.lon || 118.0149 
    };
  }, [gempa, coords]);

  const handleMenuClick = (id: string) => {
    if (id === "arsip") {
      setActiveMenu("gempa");
      setTimeout(() => {
        document.getElementById("arsip-section")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      setActiveMenu(id);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col overflow-hidden">
      <div className="fixed top-0 left-0 right-0 z-[100]">
        <Navbar activeMenu={activeMenu} setActiveMenu={handleMenuClick} />
      </div>

      <div className="pt-16 flex-grow flex flex-col relative min-h-[100vh]">
        <AnimatePresence mode="wait">
          
          {activeMenu === 'gempa' && (
            <motion.div 
              key="wrapper-monitoring"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.01 }} 
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full flex-grow flex flex-col"
            >
              <div className="relative w-full h-[80vh] overflow-hidden bg-slate-900 flex-shrink-0">
                {/* Peta sekarang fokus ke lokasi gempa terbaru dimanapun itu berada */}
               <MapWrapper 
  lat={earthquakeCoords.lat} 
  lon={earthquakeCoords.lon} 
  magnitude={parseFloat(gempa?.magnitude || "0")} 
  fishingPoints={dataDarat}
  history={history} // <-- Pastikan baris ini ada
/>
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-slate-50 z-10 pointer-events-none" />
              </div>

              <div className="max-w-7xl mx-auto px-8 relative z-20 -mt-64 w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <EarthquakeCard data={gempa} history={history} />
                  <WeatherCard data={cuaca} />
                  <AIChatCard dataKonteks={{ gempa, titikDarat: dataDarat, titikLaut: dataLaut }} />
                </div>

                <div id="arsip-section" className="pb-12 mt-12">
                  <SeismicTable history={history} />
                </div>
              </div>
            </motion.div>
          )}

          {activeMenu === 'ikan' && (
            <motion.div 
              key="wrapper-ikan"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="relative w-full h-[calc(100vh-64px)] bg-slate-950 overflow-hidden" 
            >
              <FishingWrapper points={dataLaut} />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-transparent to-slate-50 z-10 pointer-events-none" />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </main>
  );
}