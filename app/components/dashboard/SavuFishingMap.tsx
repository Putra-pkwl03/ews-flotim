"use client";

import {
  MapContainer as LeafletMap,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { motion, AnimatePresence } from 'framer-motion';
import L from "leaflet";
import { useEffect, useState } from "react";
import { Zap, Activity, Waves, MapPin, List, CloudSun, Info as LegendIcon, X } from "lucide-react";
import FishingDataSidebar from "./FishingDataSidebar";
import SeaWeatherHeader from "../../components/map/SeaWeatherHeader";
import { analyzeFishingPotency } from "@/lib/fishingService";

// Fix Icon Default Leaflet
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

const createRadarIcon = (color: string) =>
  L.divIcon({
    className: "radar-icon",
    html: `
    <div class="relative flex items-center justify-center">
      <div class="absolute w-8 h-8 rounded-full animate-ping opacity-40" style="background-color: ${color}"></div>
      <div class="relative w-3 h-3 rounded-full border-2 border-white shadow-lg" style="background-color: ${color}"></div>
    </div>
  `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 8, { animate: true });
  }, [center, map]);
  return null;
}

export default function SavuFishingMap({ points = [] }: { points: any[] }) {
  const [mounted, setMounted] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-9.15, 122.5]);
  const [activePanel, setActivePanel] = useState<'list' | 'weather' | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="bg-[#0b0e14] h-screen w-full flex items-center justify-center">...</div>;

  const getStatusColor = (potensi: string) => {
    if (potensi === "Sangat Tinggi") return "#10b981";
    if (potensi === "Potensi Sedang") return "#f59e0b";
    return "#64748b";
  };

  return (
    <div className="relative w-full h-screen flex overflow-hidden bg-slate-950">
      
      {/* 1. MOBILE NAVIGATION DOCK (PINDAH KE TENGAH ATAS) */}
      <div className="md:hidden fixed top-20 left-1/2 -translate-x-1/2 z-[10001] flex items-center gap-3 bg-[#0d1117]/70 backdrop-blur-2xl p-2 rounded-full border border-white/10 shadow-2xl">
        <NavButton 
          active={activePanel === 'list'} 
          onClick={() => setActivePanel(activePanel === 'list' ? null : 'list')}
          icon={<List size={20} />}
          label="Points"
        />
        <NavButton 
          active={activePanel === 'weather'} 
          onClick={() => setActivePanel(activePanel === 'weather' ? null : 'weather')}
          icon={<CloudSun size={20} />}
          label="Weather"
        />
      </div>

      {/* AREA MAP */}
      <div className="flex-1 relative h-full">
        <LeafletMap center={mapCenter} zoom={8} style={{ height: "100%", width: "100%" }} zoomControl={false}>
          <TileLayer url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}" attribution="&copy; Google Maps" />
          <MapController center={mapCenter} />
          
          {points.map((p, index) => {
            const lat = p.lat ?? p.latitude;
            const lon = p.lon ?? p.longitude;
            if (typeof lat !== "number" || typeof lon !== "number") return null;
            const analisis = analyzeFishingPotency(p.suhu);
            return (
              <Marker key={`marker-${p.id || index}`} position={[lat, lon]} icon={createRadarIcon(getStatusColor(analisis.status))}>
                <Popup className="custom-weather-popup">
                   <div className="p-2 text-white text-[10px]">Node: {p.nama}</div>
                </Popup>
              </Marker>
            );
          })}
        </LeafletMap>
      </div>

      {/* 2. RESPONSIVE PANELS */}
      <AnimatePresence>
        {/* SIDEBAR PANEL (Muncul dari atas kalau mobile) */}
        {(activePanel === 'list' || (mounted && window.innerWidth >= 768)) && (
          <motion.div
            initial={{ y: -50, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: -50, opacity: 0 }}
            className="fixed md:absolute left-4 top-38 md:left-8 md:top-auto md:bottom-26 w-[calc(100%-2rem)] md:w-[320px] h-[60vh] md:h-[82vh] 
                       bg-[#0d1117]/50 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-2xl z-[10000] pointer-events-auto overflow-hidden flex flex-col"
          >
            <FishingDataSidebar points={points} onSelect={(p: any) => {
              setMapCenter([p.lat ?? p.latitude, p.lon ?? p.longitude]);
              if(window.innerWidth < 768) setActivePanel(null);
            }} />
          </motion.div>
        )}

        {/* WEATHER PANEL */}
        {(activePanel === 'weather' || (mounted && window.innerWidth >= 768)) && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: -50, opacity: 0 }}
            className="fixed md:absolute right-4 top-38 md:right-8 md:top-[370px] md:bottom-[230px] w-[calc(100%-2rem)] md:w-[320px] z-[10000] pointer-events-auto"
          >
            <SeaWeatherHeader points={points} />
          </motion.div>
        )}

        {/* LEGEND PANEL (TETAP DI BAWAH) */}
        <motion.div 
          className="absolute right-4 bottom-16 md:right-8 md:bottom-26 
                     bg-[#0d1117]/50 backdrop-blur-3xl px-4 py-4 md:px-7 md:py-8 
                     rounded-[1.5rem] md:rounded-[2.5rem] border border-white/10 shadow-2xl z-[10000] 
                     pointer-events-auto flex flex-col items-center gap-3 md:gap-6"
        >
          <span className="text-white font-black text-[8px] md:text-[12px] uppercase tracking-[0.2em] opacity-60">Legend</span>
          <div className="flex flex-row items-center gap-4 md:gap-8">
            <LegendItem icon={<Zap size={16} />} color="emerald" label="Tinggi" count={points.filter(p => p.potensi === "Sangat Tinggi").length} />
            <LegendItem icon={<Activity size={16} />} color="amber" label="Sedang" count={points.filter(p => p.potensi === "Potensi Sedang").length} />
            <LegendItem icon={<Waves size={16} />} color="slate" label="Rendah" count={points.filter(p => p.potensi !== "Sangat Tinggi" && p.potensi !== "Potensi Sedang").length} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Sub-components NavButton & LegendItem tetap sama, LegendItem menggunakan size prop jika perlu
function LegendItem({ icon, color, label, count }: any) {
  const colors: any = {
    emerald: "border-emerald-500/70 bg-emerald-500/10 text-emerald-500",
    amber: "border-amber-500/70 bg-amber-500/10 text-amber-500",
    slate: "border-slate-500/70 bg-slate-500/10 text-slate-300"
  };
  return (
    <div className="flex flex-col items-center gap-1 md:gap-3">
      {/* Ukuran lingkaran mengecil di mobile (w-8 h-8 vs w-12 h-12) */}
      <div className={`w-8 h-8 md:w-12 md:h-12 rounded-full border md:border-2 flex items-center justify-center ${colors[color]}`}>
        {icon}
      </div>
      <span className={`${colors[color].split(' ')[2]} text-[7px] md:text-[10px] font-bold uppercase tracking-tighter md:tracking-widest`}>
        {label} ({count})
      </span>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
    return (
      <button 
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all active:scale-95 ${
          active ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'text-slate-400 hover:text-white'
        }`}
      >
        {icon}
        {active && <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>}
      </button>
    );
}