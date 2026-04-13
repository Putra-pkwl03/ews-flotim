"use client";

import {
  MapContainer as LeafletMap,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { motion, AnimatePresence } from "framer-motion";
import L from "leaflet";
import { useEffect, useState, useMemo } from "react";
import {
  Zap,
  Activity,
  Waves,
  MapPin,
  List,
  CloudSun,
  X,
  Thermometer,
  Anchor,
  Cloud,
  Info,
} from "lucide-react";
import FishingDataSidebar from "./FishingDataSidebar";
import SeaWeatherHeader from "../../components/map/SeaWeatherHeader";
import { analyzeFishingPotency } from "@/lib/fishingService";

// --- Leaflet Icon Fix ---
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
    </div>`,
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
  const [activePanel, setActivePanel] = useState<"list" | "weather" | null>(
    null,
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const getStatusColor = (potensi: string) => {
    if (potensi === "Sangat Tinggi") return "#10b981";
    if (potensi === "Potensi Sedang") return "#f59e0b";
    return "#64748b";
  };

  if (!mounted)
    return (
      <div className="bg-[#0b0e14] h-screen w-full flex items-center justify-center text-white/50 font-mono text-xs">
        INITIALIZING EWS FLOTIM...
      </div>
    );

  return (
    <div className="relative w-full h-screen flex overflow-hidden bg-slate-950">
      {/* 1. MOBILE NAVIGATION DOCK */}
      <div className="md:hidden fixed top-20 left-1/2 -translate-x-1/2 z-[10001] flex items-center gap-3 bg-[#0d1117]/70 backdrop-blur-2xl p-2 rounded-full border border-white/10 shadow-2xl">
        <NavButton
          active={activePanel === "list"}
          onClick={() => setActivePanel(activePanel === "list" ? null : "list")}
          icon={<List size={20} />}
          label="Points"
        />
        <NavButton
          active={activePanel === "weather"}
          onClick={() =>
            setActivePanel(activePanel === "weather" ? null : "weather")
          }
          icon={<CloudSun size={20} />}
          label="Weather"
        />
      </div>

      {/* AREA MAP */}
      <div className="flex-1 relative h-full">
        <LeafletMap
          center={mapCenter}
          zoom={8}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
            attribution="&copy; Google Maps"
          />
          <MapController center={mapCenter} />

          {points.map((p, index) => {
            const lat = p.lat ?? p.latitude;
            const lon = p.lon ?? p.longitude;
            if (typeof lat !== "number" || typeof lon !== "number") return null;

            const analisis = analyzeFishingPotency(p.suhu);

            // Safe JSON Parse Prediksi
            let dataPrediksi = {
              jam: "",
              bahaya: "Aman",
              kondisi: "",
              intensitas: "0mm",
            };
            try {
              dataPrediksi =
                typeof p.prediksi === "string"
                  ? JSON.parse(p.prediksi)
                  : p.prediksi;
            } catch (e) {
              console.error(e);
            }

            const displayTime = dataPrediksi?.jam
              ? new Date(dataPrediksi.jam + " UTC").toLocaleTimeString(
                  "id-ID",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Asia/Makassar",
                  },
                )
              : "--:--";

            return (
              <Marker
                key={`marker-${p.id_titik ?? p.id ?? index}`}
                position={[lat, lon]}
                icon={createRadarIcon(getStatusColor(analisis.status))}
              >
                <Popup className="custom-weather-popup">
                  <div className="w-[260px] overflow-hidden rounded-2xl bg-[#0d1117]/60 backdrop-blur-xl border border-white/10 shadow-2xl text-white">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600/20 to-emerald-600/20 px-4 py-3 border-b border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 max-w-[60%]">
                          <MapPin
                            size={12}
                            className="text-blue-400 shrink-0"
                          />
                          <h3 className="font-black text-[11px] uppercase tracking-tighter truncate">
                            {p.nama}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded border border-white/5">
                          <span className="text-[7px] text-slate-500 font-bold">
                            WITA
                          </span>
                          <span className="text-[10px] text-blue-400 font-mono font-bold">
                            {displayTime}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full uppercase font-black tracking-widest border bg-black/20 ${analisis.warna || "text-slate-400 border-white/10"}`}
                      >
                        {analisis.status}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="p-4 space-y-2.5">
                      <PopupStat
                        icon={
                          <Thermometer size={14} className="text-orange-400" />
                        }
                        label="Suhu Air"
                        value={`${p.suhu}°C`}
                        color="text-blue-400"
                      />

                      <PopupStat
                        icon={<Cloud size={14} className="text-blue-300" />}
                        label="Kondisi"
                        value={p.kondisi || "Cerah"}
                        color="text-white"
                        isUpper
                      />

                      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-1" />

                      <div className="bg-blue-500/5 p-2.5 rounded-xl border border-white/5">
                        <div className="flex gap-2">
                          <Info
                            size={12}
                            className="text-blue-400 mt-0.5 shrink-0"
                          />
                          <p className="text-[10px] leading-relaxed text-slate-300 italic font-medium">
                            {analisis.pesan}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </LeafletMap>
      </div>

      {/* 2. RESPONSIVE PANELS */}
      <AnimatePresence>
        {/* SIDEBAR PANEL */}
        {(activePanel === "list" || (mounted && window.innerWidth >= 768)) && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="fixed md:absolute left-4 top-38 md:left-8 md:top-auto md:bottom-26 w-[calc(100%-2rem)] md:w-[320px] h-[60vh] md:h-[82vh] 
                       bg-[#0d1117]/60 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-2xl z-[10000] overflow-hidden flex flex-col"
          >
            <FishingDataSidebar
              points={points}
              onSelect={(p: any) => {
                setMapCenter([p.lat ?? p.latitude, p.lon ?? p.longitude]);
                if (window.innerWidth < 768) setActivePanel(null);
              }}
            />
          </motion.div>
        )}

        {/* WEATHER PANEL */}
        {(activePanel === "weather" ||
          (mounted && window.innerWidth >= 768)) && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="fixed md:absolute right-4 top-38 md:right-8 md:top-[370px] w-[calc(100%-2rem)] md:w-[310px] z-[10000]"
          >
            <SeaWeatherHeader points={points} />
          </motion.div>
        )}

        {/* LEGEND PANEL */}
        <motion.div
          className="absolute right-4 bottom-28 md:right-8 md:bottom-26 
                     bg-[#0d1117]/60 backdrop-blur-3xl px-5 py-4 md:px-7 md:py-8 
                     rounded-[2rem] md:rounded-[2.5rem] border border-white/10 shadow-2xl z-[10000] 
                     flex flex-col items-center gap-3 md:gap-6"
        >
          <span className="text-white/60 font-black text-[8px] md:text-[11px] uppercase tracking-[0.3em]">
            Legend
          </span>
          <div className="flex items-center gap-5 md:gap-8">
            <LegendItem
              icon={<Zap size={16} />}
              color="emerald"
              label="Tinggi"
              count={points.filter((p) => p.potensi === "Sangat Tinggi").length}
            />
            <LegendItem
              icon={<Activity size={16} />}
              color="amber"
              label="Sedang"
              count={
                points.filter((p) => p.potensi === "Potensi Sedang").length
              }
            />
            <LegendItem
              icon={<Waves size={16} />}
              color="slate"
              label="Rendah"
              count={
                points.filter(
                  (p) =>
                    p.potensi !== "Sangat Tinggi" &&
                    p.potensi !== "Potensi Sedang",
                ).length
              }
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// --- Helper Components ---

function PopupStat({ icon, label, value, color, isUpper = false }: any) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}
        <span className="text-[10px] font-medium uppercase tracking-tight">
          {label}
        </span>
      </div>
      <span
        className={`font-mono font-bold text-[11px] ${color} ${isUpper ? "uppercase" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

function LegendItem({ icon, color, label, count }: any) {
  const colors: any = {
    emerald: "border-emerald-500/50 bg-emerald-500/10 text-emerald-500",
    amber: "border-amber-500/50 bg-amber-500/10 text-amber-500",
    slate: "border-slate-500/50 bg-slate-500/10 text-slate-400",
  };
  return (
    <div className="flex flex-col items-center gap-1.5 md:gap-3">
      <div
        className={`w-9 h-9 md:w-12 md:h-12 rounded-full border flex items-center justify-center ${colors[color]}`}
      >
        {icon}
      </div>
      <span
        className={`${colors[color].split(" ")[2]} text-[7px] md:text-[10px] font-black uppercase tracking-tighter`}
      >
        {label} ({count})
      </span>
    </div>
  );
}

function NavButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: any;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all active:scale-95 ${
        active
          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
          : "text-slate-400 hover:text-white hover:bg-white/5"
      }`}
    >
      {icon}
      {active && (
        <span className="text-[10px] font-black uppercase tracking-widest">
          {label}
        </span>
      )}
    </button>
  );
}
