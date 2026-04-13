"use client";

import { useMemo, useState } from "react";
import {
  CloudRain,
  Sun,
  Clock,
  Droplets,
  AlertCircle,
  Zap,
  ChevronDown,
} from "lucide-react";

interface SeaPoint {
  nama: string;
  suhu: number;
  kondisi: string;
  potensi: string;
  prediksi: {
    jam: string;
    kondisi: string;
    intensitas: string;
    bahaya: string;
  } | null;
}

export default function SeaWeatherHeader({
  points = [],
}: {
  points: SeaPoint[];
}) {
  // State untuk kontrol visibilitas bagian
  const [showSection2, setShowSection2] = useState(false);
  const [showSection3, setShowSection3] = useState(false);

  const seaStats = useMemo(() => {
    if (!points || points.length === 0) return null;
    const avgTemp = points.reduce((acc, curr) => acc + (curr.suhu || 0), 0) / points.length;
    const indices = [0, 5, 10, 15, 19];
    const chartData = indices
      .map((index) => points[index])
      .filter(Boolean)
      .map((p) => ({
        name: p.nama || "Lokasi",
        val: p.suhu || 0,
      }));
    const sample = points[0];
    return { avgTemp, chartData, sample };
  }, [points]);

  if (!seaStats || !seaStats.sample) return null;

const { avgTemp, chartData, sample } = seaStats;
// --- LOGIKA KONVERSI KE WITA ---
  const displayTime = useMemo(() => {
    if (!sample?.prediksi?.jam) return "--:--";
    
    try {
      // Menambahkan " UTC" agar JavaScript tahu ini waktu asal UTC
      const date = new Date(sample.prediksi.jam + " UTC");
      return date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Makassar', 
        hour12: false
      });
    } catch (e) {
      console.error("Format jam tidak valid:", e);
      return "--:--";
    }
  }, [sample?.prediksi?.jam]);


  return (
   <div className="w-full max-w-sm pointer-events-auto ">
          <div className="bg-[#0d1117]/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.9)] pointer-events-auto transition-all duration-500">
        
        {/* SECTION 1: HEADER (Main Trigger) */}
        <div 
          onClick={() => {
            setShowSection2(!showSection2);
            if (showSection2) setShowSection3(false); 
          }}
          className="p-6 cursor-pointer hover:bg-white/5 transition-colors flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400">
              {(sample?.kondisi?.toLowerCase() || "").includes("hujan") ? (
                <CloudRain size={24} />
              ) : (
                <Sun size={24} />
              )}
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Rata-rata Suhu</p>
              <h2 className="text-2xl font-black text-white">{avgTemp.toFixed(1)}°C</h2>
            </div>
          </div>
          <ChevronDown className={`text-slate-500 transition-transform duration-300 ${showSection2 ? 'rotate-180' : ''}`} size={20} />
        </div>

        {/* SECTION 2: CHART (Expands when Section 1 clicked) */}
        <div className={`grid transition-all duration-300 ease-in-out ${showSection2 ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
          <div className="overflow-hidden">
            <div 
              onClick={() => setShowSection3(!showSection3)}
              className="px-6 pb-6 pt-2 border-t border-white/5 cursor-pointer hover:bg-white/5 transition-colors"
            >
              <div className="flex justify-between items-center mb-4">
                <p className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-2">
                  <ActivityIcon size={12} /> Perbandingan Wilayah
                </p>
                <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-lg">
                  <Clock size={10} className="text-indigo-400" />
                  <span className="text-[9px] text-slate-300 font-medium">{displayTime}</span>
                </div>
              </div>

              <div className="flex items-end justify-between gap-2 h-16 w-full">
                {chartData.map((data, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full group">
                    <div className="relative w-full bg-white/10 rounded-t-sm h-full flex items-end">
                      <div
                        className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-sm transition-all duration-1000"
                        style={{ height: `${Math.max(((data.val || 0) / 40) * 100, 10)}%` }}
                      />
                    </div>
                    <span className="text-[6px] text-slate-500 font-bold truncate w-full text-center uppercase">
                      {data.name.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: DETAILS (Expands when Section 2 clicked) */}
        <div className={`grid transition-all duration-300 ease-in-out ${showSection3 ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
          <div className="overflow-hidden">
            <div className="px-6 pb-6 pt-4 border-t border-white/5 bg-white/[0.02]">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 text-amber-400 mb-1">
                    <Droplets size={12} />
                    <span className="text-[8px] font-black uppercase">Intensitas</span>
                  </div>
                  <p className="text-white font-bold text-xs">{sample?.prediksi?.intensitas || "0mm"}</p>
                </div>

                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 text-emerald-400 mb-1">
                    <Zap size={12} />
                    <span className="text-[8px] font-black uppercase">Potensi</span>
                  </div>
                  <p className="text-white font-bold text-xs truncate">{sample?.potensi || "N/A"}</p>
                </div>

                <div className="col-span-2 bg-red-500/10 p-3 rounded-xl border border-red-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertCircle size={12} />
                    <span className="text-[8px] font-black uppercase">Status Bahaya</span>
                  </div>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                    (sample?.prediksi?.bahaya || "Aman") === "Aman" 
                    ? "bg-emerald-500/20 text-emerald-400" 
                    : "bg-red-500 text-white animate-pulse"
                  }`}>
                    {sample?.prediksi?.bahaya || "Aman"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function ActivityIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}