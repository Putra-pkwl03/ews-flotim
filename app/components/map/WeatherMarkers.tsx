"use client";

import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Thermometer, Cloud, Info, MapPin, Clock } from "lucide-react";

const createWeatherIcon = (kondisi: string = "") => {
  const safeKondisi = kondisi || "";
  const isRain =
    safeKondisi.toLowerCase().includes("hujan") ||
    safeKondisi.toLowerCase().includes("rain");
  const isCloudy =
    safeKondisi.toLowerCase().includes("awan") ||
    safeKondisi.toLowerCase().includes("cloud");

  return L.divIcon({
    className: "custom-weather-icon",
    html: `
      <div class="relative flex items-center justify-center group">
        <div class="absolute inset-0 bg-blue-500/20 blur-xl rounded-full group-hover:bg-blue-500/40 transition-all duration-500"></div>
        <div class="relative bg-slate-600/80 backdrop-blur-md border border-white/20 p-2.5 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.3)] transform transition-all group-hover:scale-110 group-hover:-translate-y-1">
          <div class="flex flex-col items-center gap-1 text-[20px]">
            ${isRain ? "🌧️" : isCloudy ? "☁️" : "☀️"}
            <div class="w-1 h-1 rounded-full ${isRain ? "bg-blue-400 animate-bounce" : "bg-yellow-400"}"></div>
          </div>
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
};

export const WeatherMarkers = ({ points }: { points: any[] }) => {
  if (!points || !Array.isArray(points)) return null;

  return (
    <>
      {points.map((point, index) => {
        const currentLat = point.lat || point.latitude;
        const currentLon = point.lon || point.longitude;

        if (!currentLat || !currentLon) return null;

        // --- LOGIKA JAM WITA ---
        const displayTime = point.prediksi?.jam
          ? new Date(point.prediksi.jam + " UTC")
              .toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Asia/Makassar",
              })
              .replace(".", ":")
          : "--:--";

        return (
          <Marker
            key={point.id_titik || point.id || index}
            position={[currentLat, currentLon]}
            icon={createWeatherIcon(point.kondisi)}
          >
            <Popup className="custom-weather-popup">
              <div className="w-[230px] overflow-hidden rounded-2xl bg-[#0d1117]/60 backdrop-blur-xl border border-white/10 shadow-2xl">
                {/* Header Card */}
                <div className="bg-gradient-to-r from-blue-600/20 to-emerald-600/20 px-4 py-3 border-b border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={12} className="text-blue-300" />
                    <h3 className="font-black text-[11px] uppercase tracking-tighter text-white truncate">
                      {point.nama}
                    </h3>
                  </div>

                  {/* Kontainer Tipe & Jam (Bersebelahan) */}
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] bg-white/10 text-white/80 px-2 py-0.5 rounded-full uppercase font-bold tracking-widest border border-white/5">
                      {point.tipe || "Darat"}
                    </span>

                    <div className="flex items-center gap-1 bg-black/20 px-1.5 py-0.5 rounded-full border border-white/5">
                      <Clock size={8} className="text-blue-300" />
                      <span className="text-[9px] font-mono text-blue-200 font-bold">
                        {displayTime}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Thermometer size={14} />
                      <span className="text-[10px] font-medium uppercase tracking-tight">
                        Suhu
                      </span>
                    </div>
                    <span className="font-mono font-bold text-sm text-blue-400">
                      {point.suhu}°C
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Cloud size={14} />
                      <span className="text-[10px] font-medium uppercase tracking-tight">
                        Kondisi
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-white uppercase">
                      {point.kondisi}
                    </span>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-2" />

                  <div className="flex gap-2">
                    <Info
                      size={12}
                      className="text-slate-300 mt-0.5 shrink-0"
                    />
                    <p className="text-[9px] leading-relaxed text-slate-300 italic">
                      {point.pesan ||
                        "Sistem memantau kondisi cuaca darat secara real-time."}
                    </p>
                  </div>
                </div>

                {/* Footer / Prediction */}
                {point.prediksi && (
                  <div className="bg-white/5 px-4 py-2 border-t border-white/5 flex justify-between items-center">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                      Estimasi
                    </span>
                    <span className="text-[9px] text-emerald-400 font-bold capitalize">
                      {point.prediksi.kondisi}
                    </span>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};
