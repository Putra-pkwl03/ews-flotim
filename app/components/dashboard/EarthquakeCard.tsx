'use client';

import { MapPin, Clock, AlertCircle, Globe } from "lucide-react";

export const EarthquakeCard = ({ data }: any) => {
  // 1. Ambil data langsung dari props 'data' (autogempa)
  // Tidak ada lagi filter NTT atau pengecekan ke riwayat
  const item = Array.isArray(data) ? data[0] : data;

  // 2. Fungsi Parsing Koordinat
  const getCoords = (target: any) => {
    if (!target) return { lat: "N/A", lon: "" };

    const rawLat = target.lintang || target.Lintang;
    const rawLon = target.bujur || target.Bujur;

    if (rawLat && rawLon) {
      return { lat: rawLat, lon: rawLon };
    }

    if (typeof target.koordinat === 'string' && target.koordinat.includes('POINT')) {
      const match = target.koordinat.match(/\((.*)\)/);
      if (match) {
        const parts = match[1].split(' ');
        return {
          lat: parts[1] ? `${parts[1]} LS` : "N/A",
          lon: parts[0] ? `${parts[0]} BT` : ""
        };
      }
    }
    return { lat: "N/A", lon: "" };
  };

  if (!item) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 flex items-center justify-center h-full text-slate-400 text-xs italic">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-5 h-5 border-2 border-slate-200 border-t-red-500 rounded-full animate-spin"></div>
          <p>Sinkronisasi data BMKG...</p>
        </div>
      </div>
    );
  }

  const coords = getCoords(item);
  const shakemapUrl = item.shakemap 
    ? (item.shakemap.includes('http') ? item.shakemap : `https://data.bmkg.go.id/DataMKG/TEWS/${item.shakemap}`)
    : null;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 flex flex-col h-full relative overflow-hidden">
      {/* Watermark Dekoratif */}
      <div className="absolute -right-4 -top-2 opacity-[0.03] pointer-events-none">
        <Globe size={120} />
      </div>

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Gempa Terkini (Real-time)</p>
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Info Gempa</h2>
        </div>
        <div className="bg-red-50 text-red-600 border border-red-100 rounded-xl px-3 py-1 text-center min-w-[60px]">
          <span className="text-lg font-black">{item.magnitude || item.Magnitude}</span>
          <span className="text-[10px] ml-1 font-bold">SR</span>
        </div>
      </div>

      <div className="flex gap-6 mb-6 relative z-10">
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[9px] text-slate-400 uppercase font-black tracking-tighter">Kedalaman</p>
              <p className="text-md font-bold text-slate-700">{item.kedalaman || item.Kedalaman}</p>
            </div>
            <div>
              <p className="text-[9px] text-slate-400 uppercase font-black tracking-tighter">Koordinat</p>
              <p className="text-[10px] font-bold text-slate-700 leading-tight">
                {coords.lat} <br/> {coords.lon}
              </p>
            </div>
          </div>

          <div>
            <p className="text-[9px] text-slate-400 uppercase font-black tracking-tighter flex items-center gap-1">
              <Clock size={10} /> Waktu Kejadian
            </p>
            <p className="text-xs font-bold text-slate-600 leading-tight">
              {item.tanggal || item.Tanggal} <br />
              <span className="text-slate-400 font-medium">{item.jam || item.Jam}</span>
            </p>
          </div>
        </div>

        {shakemapUrl && (
          <div className="flex flex-col items-center gap-2">
            <div className="relative group cursor-zoom-in">
              <img 
                src={shakemapUrl} 
                className="w-20 h-20 rounded-xl object-cover border-2 border-slate-50 shadow-md group-hover:scale-110 transition-transform" 
                alt="Shakemap"
                onError={(e: any) => { e.target.style.display = 'none'; }}
              />
            </div>
            <p className="text-[7px] text-slate-400 font-black uppercase text-center">Peta Guncangan</p>
          </div>
        )}
      </div>

      <div className="space-y-3 border-t border-slate-50 mb-4 pt-4 relative z-10">
        <div className="flex gap-3 items-start">
          <div className="p-1.5 bg-slate-50 rounded-lg shrink-0">
            <MapPin size={14} className="text-slate-400" />
          </div>
          <div>
            <p className="text-[9px] text-slate-400 uppercase font-black tracking-tighter">Lokasi Episenter</p>
            <p className="text-[11px] font-bold text-slate-600 leading-relaxed italic">
              {item.wilayah || item.Wilayah}
            </p>
          </div>
        </div>

        <div className="flex gap-3 items-start">
          <div className="p-1.5 bg-amber-50 rounded-lg shrink-0">
            <AlertCircle size={14} className="text-amber-500" />
          </div>
          <div>
            <p className="text-[9px] text-amber-500 uppercase font-black tracking-tighter">Potensi / Dampak</p>
            <p className="text-[11px] font-bold text-slate-600 leading-relaxed">
              {item.potensi || item.Potensi || "Cek rilis resmi BMKG"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-auto border-t border-slate-50 pt-3 flex justify-end relative z-10">
        <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-300">
          <span>SUMBER DATA NASIONAL BMKG</span>
        </div>
      </div>
    </div>
  );
};