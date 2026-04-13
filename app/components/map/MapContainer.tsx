"use client";

import {
  MapContainer as LeafletMap,
  TileLayer,
  Marker,
  Circle,
  useMap,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { WeatherMarkers } from "./WeatherMarkers";
import L from "leaflet";
import { useEffect, useState, useMemo } from "react";

const isServer = typeof window === "undefined";

function ChangeView({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    if (map && center && !isNaN(center[0]) && !isNaN(center[1])) {
      // Menggunakan flyTo untuk efek melayang yang halus
      map.flyTo(center, zoom, {
        duration: 2, // Durasi 2 detik agar transisi terasa natural
        easeLinearity: 0.1, // Semakin kecil semakin halus tarikan animasinya
      });
    }
  }, [center, zoom, map]);
  return null;
}

export default function MapContainer({
  lat,
  lon,
  magnitude,
  titikIkan,
  history,
}: any) {
  const [mounted, setMounted] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [mapConfig, setMapConfig] = useState<{
    center: [number, number];
    zoom: number;
  }>({
    center: [-2.5489, 118.0149],
    zoom: 6,
  });

  useEffect(() => {
    setMounted(true);
    const initialLat = parseFloat(lat);
    const initialLon = parseFloat(lon);
    if (!isNaN(initialLat) && !isNaN(initialLon)) {
      setMapConfig({ center: [initialLat, initialLon], zoom: 7 });
    }
  }, [lat, lon]);

  const historyPoints = useMemo(() => {
    if (!history || !Array.isArray(history)) return [];
    return history
      .map((item: any) => {
        let hLat = 0;
        let hLon = 0;
        const rawLat = item.lintang || item.Lintang;
        const rawLon = item.bujur || item.Bujur;
        if (rawLat && rawLon) {
          hLat = parseFloat(rawLat.toString().replace(/[^0-9.-]/g, ""));
          hLon = parseFloat(rawLon.toString().replace(/[^0-9.-]/g, ""));
          if (rawLat.toString().toUpperCase().includes("LS") && hLat > 0)
            hLat *= -1;
        }
        return { ...item, position: [hLat, hLon] as [number, number] };
      })
      .filter((p) => !isNaN(p.position[0]) && p.position[0] !== 0);
  }, [history]);

  if (!mounted)
    return <div className="h-full w-full bg-slate-950 animate-pulse" />;

  return (
    <div className="w-full h-full relative flex overflow-hidden">
      {/* AREA PETA */}
      <div className="flex-grow relative z-0">
        <LeafletMap
          center={mapConfig.center}
          zoom={mapConfig.zoom}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
            attribution="&copy; Google Maps"
          />

          <ChangeView center={mapConfig.center} zoom={mapConfig.zoom} />

          {titikIkan && <WeatherMarkers points={titikIkan} />}

          {/* Markers Riwayat */}
          {historyPoints.map((h: any, idx: number) => {
            const mag = parseFloat(h.magnitude || "0");
            // Ukuran dinamis: gempa lebih besar = titik sedikit lebih besar
            const size = mag > 5 ? 12 : mag > 3 ? 10 : 8;
            const innerSize = mag > 5 ? "w-2.5 h-2.5" : "w-2 h-2";

            return (
              <Marker
                key={`m-hist-${idx}`}
                position={h.position}
                icon={L.divIcon({
                  className: "h-icon",
                  html: `
          <div class="relative flex items-center justify-center">
           
            <div class="absolute rounded-full bg-amber-500/40 blur-[2px]" style="width: ${size + 4}px; height: ${size + 4}px;"></div>
           
            <div class="${innerSize} bg-amber-400 rounded-full border border-white shadow-[0_0_8px_rgba(245,158,11,0.8)] transition-transform hover:scale-150"></div>
          </div>
        `,
                  iconSize: [size + 5, size + 5],
                  iconAnchor: [(size + 5) / 2, (size + 5) / 2],
                })}
              ></Marker>
            );
          })}
          {/* Marker Utama (Gempa Terkini) */}
          <Marker
            position={[parseFloat(lat), parseFloat(lon)]}
            icon={L.divIcon({
              className: "main-quake-icon",
              html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-16 h-16 bg-red-500 rounded-full animate-[ping_3s_linear_infinite] opacity-10"></div>
        
        <div class="absolute w-10 h-10 bg-red-500 rounded-full animate-ping opacity-30"></div>

        <div class="absolute w-6 h-6 bg-red-600 rounded-full blur-[6px] opacity-60"></div>

        <div class="relative w-4 h-4 bg-red-600 rounded-full border-[2.5px] border-white shadow-[0_0_15px_rgba(220,38,38,1)] z-10"></div>
      </div>
    `,
              iconSize: [64, 64],
              iconAnchor: [32, 32],
            })}
          />
        </LeafletMap>
{/* HUD Overlay Kiri (Legenda, Info & Layanan) - Responsive */}
        <div className="absolute top-4 left-3 sm:top-6 sm:left-4 z-[400] space-y-1.5 sm:space-y-2 max-w-[140px] sm:max-w-[180px]">
          
          {/* Bagian 1: Legenda (Indikator Warna) */}
          <div className="bg-[#0d1117]/70 backdrop-blur-xl px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl border border-white/10 shadow-2xl">
            <div className="flex flex-col gap-1.5 sm:gap-2">
              <div className="flex items-center gap-2">
                <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-red-600"></span>
                </span>
                <p className="text-[7px] sm:text-[9px] text-white font-black uppercase tracking-widest truncate">Gempa Terkini</p>
              </div>
              
              <div className="flex items-center gap-2 border-t border-white/5 pt-1 sm:pt-1.5">
                <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-amber-600 shadow-[0_0_5px_rgba(245,158,11,0.5)]"></span>
                <p className="text-[7px] sm:text-[9px] text-slate-100 font-bold uppercase tracking-widest truncate">Riwayat</p>
              </div>
            </div>
          </div>

          {/* Bagian 2: Status, Total & Info Layanan (Wilayah) */}
          <div className="bg-[#0d1117]/70 backdrop-blur-xl px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl border border-white/10 shadow-2xl">
             <div className="flex flex-col gap-1 sm:gap-1.5">
                {/* Status & Total */}
                <div className="hidden sm:flex items-center justify-between gap-4">
                  <p className="text-[8px] text-slate-400 font-medium uppercase tracking-tighter">Status:</p>
                  <p className="text-[8px] text-emerald-400 font-black uppercase tracking-widest">Live Sync</p>
                </div>
                
                <div className="flex items-center justify-between gap-2 sm:gap-4 sm:border-t sm:border-white/5 sm:pt-1.5">
                  <p className="text-[7px] sm:text-[8px] text-slate-400 font-medium uppercase tracking-tighter">Total:</p>
                  <p className="text-[7px] sm:text-[8px] text-white font-black uppercase tracking-widest">{historyPoints.length} Data</p>
                </div>

                {/* Info Layanan (Sekarang di Sini) */}
                <div className="mt-1 pt-1.5 border-t border-white/10">
                   <p className="text-[6px] sm:text-[7px] text-slate-400 font-bold uppercase tracking-widest mb-1 opacity-60">Cakupan Data Cuaca:</p>
                   <p className="text-[7px] sm:text-[8px] text-blue-300 leading-tight font-medium italic">
                      Tersedia untuk wilayah <span className="font-black underline underline-offset-2">Flores Timur</span> & sekitarnya.
                   </p>
                </div>

                {/* Source Branding */}
                <div className="mt-1 pt-1.5 border-t border-white/10 flex items-center gap-1.5 opacity-80 sm:opacity-60">
                   <div className="w-1 h-1 bg-blue-500 rounded-full shrink-0"></div>
                   <p className="text-[6px] sm:text-[7px] text-blue-100 font-black uppercase tracking-[0.2em]">Data: BMKG</p>
                </div>
             </div>
          </div>
        </div>
      </div>

     {/* TOMBOL TOGGLE & SIDEBAR RIWAYAT - Responsive */}
      <div className="absolute top-4 right-3 sm:top-6 sm:right-4 z-[400] flex flex-col items-end gap-2 max-w-[160px] sm:max-w-none">
        
        {/* Button Toggle List */}
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="bg-slate-900/90 backdrop-blur-md border border-white/10 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl text-white text-[8px] sm:text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl"
        >
          <span
            className={`w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full ${showHistory ? "bg-amber-500 animate-pulse" : "bg-slate-500"}`}
          ></span>
          {/* Teks lebih pendek di mobile */}
          <span className="sm:inline hidden">
            {showHistory ? "Tutup Riwayat" : "Buka Riwayat & Gulir"}
          </span>
          <span className="sm:hidden inline">
            {showHistory ? "Tutup" : "Riwayat"}
          </span>
        </button>


        {/* Panel Sidebar - Responsif */}
        {showHistory && (
          <div className="w-[180px] sm:w-60 max-h-[45vh] sm:max-h-[38vh] bg-[#0d1117]/80 backdrop-blur-xl border border-white/10 rounded-lg sm:rounded-xl flex flex-col shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="p-2 sm:p-3 border-b border-white/5 bg-slate-800/30">
              <h3 className="text-white text-[8px] sm:text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <span className="w-0.5 h-2 sm:w-1 sm:h-3 bg-amber-500 rounded-full"></span>
                Riwayat
              </h3>
            </div>

            <div className="flex-grow overflow-y-auto p-1.5 sm:p-2 space-y-1 sm:space-y-1.5 custom-scrollbar">
              {historyPoints.slice(0, 15).map((item: any, idx: number) => {
                const isLatest = idx === 0;
                const accentColor = isLatest ? "text-red-500" : "text-amber-500";
                const borderColor = isLatest ? "border-red-500/30" : "border-white/5";
                const bgColor = isLatest ? "bg-red-500/10" : "bg-white/5";

                return (
                  <button
                    key={`li-${idx}`}
                    onClick={() => setMapConfig({ center: item.position, zoom: 11 })}
                    className={`w-full text-left p-2 sm:p-2.5 rounded-md sm:rounded-lg ${bgColor} ${borderColor} border hover:bg-white/10 transition-all group relative overflow-hidden`}
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-0.5 sm:w-1 ${isLatest ? "bg-red-600" : "bg-transparent"}`}></div>

                    <div className="flex justify-between items-center mb-0.5 sm:mb-1">
                      <div className="flex items-center gap-1">
                        {isLatest && <span className="w-1 h-1 bg-red-500 rounded-full animate-ping"></span>}
                        <span className={`${accentColor} text-[8px] sm:text-[10px] font-black`}>M {item.magnitude}</span>
                      </div>
                      <span className="text-slate-500 text-[6px] sm:text-[8px] font-mono">{item.kedalaman}</span>
                    </div>

                    <p className="text-slate-300 text-[8px] sm:text-[10px] leading-tight line-clamp-2 group-hover:text-white transition-colors">
                      {item.wilayah}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #f59e0b;
        }
      `}</style>
    </div>
  );
}
